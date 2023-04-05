const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const axios = require('axios').default;
const config = require('../bin/config');
const { Server: ServerIO } = require("socket.io");
var { parseArgsStringToArgv } = require('string-argv');

const { spawn } = require('node:child_process');
const pathExecAbs = path.join(__dirname, '../bin', config.EXECUTABLE_FILE);
const modelPathAbs = path.join(__dirname, '../bin', config.MODEL_FILE);
const userConfigPathAbs = path.join(__dirname, '../bin/config.user.json');

const getUserConfig = () => fs.existsSync(userConfigPathAbs)
  ? JSON.parse(fs.readFileSync(userConfigPathAbs).toString())
  : {};
let proc;

// arguments suggested by @AIbottesting
// https://github.com/antimatter15/alpaca.cpp/issues/171
const DEFAULT_ARGUMENTS = {
  'threads': '4',
  'seed': '42',
  'top_p': '2',
  'top_k': '160',
  'n_predict': '200',
  'temp': '0.50',
  'repeat_penalty': '1.1',
  'ctx_size': '2048',
  'repeat_last_n': '128',
  'prompt': '',
  'color': null,
  '__additional': '--interactive-start',
  '__context_memory': '0',
  '__context_memory_prompt': 'The following is a friendly conversation between human and AI called Alpaca. AI is talkative and provides details from its context.',
};

const getArguments = () => {
  const userConfig = getUserConfig();
  const mergedConfig = {...DEFAULT_ARGUMENTS, ...userConfig};
  const additionalArgs = mergedConfig['__additional'];

  /*
  if (mergedConfig['prompt'].length < 2) {
    // default prompt
    delete mergedConfig['prompt'];
  } else {
    // clean up and re-format
    mergedConfig['prompt'] = ` ${mergedConfig['prompt'].trim()}\n\n`;
  }
  */

  const args = [];
  for (const opt in mergedConfig) {
    if (opt.startsWith('__')) continue; // skip "__arg_name"
    args.push(`--${opt}`);
    if (mergedConfig[opt] !== null)
      args.push(mergedConfig[opt]);
  }

  parseArgsStringToArgv(additionalArgs).forEach(opt => args.push(opt));
  args.push('--model');
  args.push(modelPathAbs);
  return args;
};

const app = express();
app.get('/', (req, res) => res.send(''));
const server = http.createServer(app);
let data = {
  backend: `http://127.0.0.1:${process.env.PORT}`,
  isLoaded: false,
  isReady: false,
  current: {},
  io: new ServerIO(server, {
    cors: {
      origin: '*',
    }
  }),
  isErrorFileMissing: false,
  stdoutBuf: '',
};

const runProc = () => {
  console.log({ pathExecAbs, modelPathAbs });
  if (!fs.existsSync(pathExecAbs) || !fs.existsSync(modelPathAbs)) {
    console.error('Failed to find model or executable file');
    data.isErrorFileMissing = true;
    return;
  }

  if (process.platform === 'linux') {
    fs.chmodSync(pathExecAbs, 0o755);
  }

  const args = getArguments();
  console.log('Starting program with arguments', args.join(' '));
  proc = spawn(pathExecAbs, args);
  proc.stdout.on('data', (buf) => {
    if (!data.isLoaded) {
      process.stdout.write(buf);
    }

    const str = buf.toString();
    //console.log(JSON.stringify({str}))
    //if (str.match(/\u001b\[3[0-9]m[> \n]{0,3}$/)) { // detect change color
    data.stdoutBuf += str;

    if (data.stdoutBuf.match(/\u001b\[[0-9]+m\n> /)) { // detect change color
      console.log('native: ready');
      data.isLoaded = true;
      data.isReady = true;
      data.current = {};
      data.stdoutBuf = '';
      data.io.emit('update', { done: true });
    } else if (data.current.chatId) {
      data.current.output += str.replace(/\u001b\[[0-9]+m/g, ''); // terminal color
      data.io.emit('update', {
        chatId: data.current.chatId,
        messageId: data.current.messageId,
        output: data.current.output,
      });
      // save to backend
      axios.post(`${data.backend}/api/messages`, {
        id: data.current.messageId,
        chat_id: data.current.chatId,
        role: 'assistant',
        content: data.current.output,
      }).catch(e => console.error(e.message));
    }
  });
  
  proc.stderr.on('data', (buf) => {
    process.stderr.write(buf);
  });
  
  proc.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

runProc();


/////////////////////////

// const setIOServer = (io) => data.io = io;

const ask = async ({ chatId, messageId, input }) => {
  if (!proc) return;
  while (!data.isReady) { await delay(1000) } // spin lock
  data.current = {
    chatId, messageId, input,
    output: '',
  };
  console.log('native: ask', data.current);
  proc.stdin.write(
    input
      .trim()
      .replace(/\r/g, '')        // windows CR
      .replace(/\n/g, '\\\n')    // escape LF
    + '\n'
  );
};



/////////////////////////
data.io.on('connection', (socket) => {
  console.log('New connection');
  
  if (data.isErrorFileMissing) {
    socket.emit('error_missing_file', { pathExecAbs, modelPathAbs });
  }

  socket.emit('user_config', {...DEFAULT_ARGUMENTS, ...getUserConfig()});

  socket.on('ask', ({ chatId, messageId, input }) => {
    console.log('user input: ', { chatId, messageId, input });
    ask({ chatId, messageId, input });
  });

  socket.on('save_user_config', (userConfig) => {
    fs.writeFileSync(userConfigPathAbs, JSON.stringify(userConfig, null, 2));
    socket.emit('user_config', {...DEFAULT_ARGUMENTS, ...userConfig});
  });

  socket.on('action_stop', () => {
    if (!proc) return;
    if (data.current.chatId) {
      // if it is responding to a request, stop
      proc.kill('SIGINT');
    }
    // else, do nothing
  });
});

server.listen(process.env.WS_PORT, () => {
  console.log(`native bridge listening on *:${process.env.WS_PORT}`);
});

////////////////////////
// utils

const delay = ms => new Promise(r => setTimeout(r, ms));