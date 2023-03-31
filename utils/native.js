const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const axios = require('axios').default;
const config = require('../bin/config');
const { Server: ServerIO } = require("socket.io");

const { spawn } = require('node:child_process');
const pathExecAbs = path.join(__dirname, '../bin', config.EXECUTABLE_FILE);
const modelPathAbs = path.join(__dirname, '../bin', config.MODEL_FILE);
const proc = spawn(pathExecAbs, config.ARGUMENTS({ modelPathAbs }));

const app = express();
app.get('/', (req, res) => res.send(''));
const server = http.createServer(app);
let data = {
  backend: 'localhost:3000',
  isReady: false,
  current: {},
  io: new ServerIO(server, {
    cors: {
      origin: '*',
    }
  }),
};

proc.stdout.on('data', (buf) => {
  // process.stdout.write(buf);
  const str = buf.toString();
  console.log(JSON.stringify({str}))
  if (str.match(/\u001b\[[0-9]+m\n>/)) { // change color and prompt character
    console.log('native: ready');
    data.isReady = true;
    data.current = {};
    data.io.emit('update', { done: true });
  } else if (data.current.chatId) {
    data.current.output += str.replace(/\u001b\[[0-9]+m/g, ''); // terminal color
    data.io.emit('update', data.current);
    // save to backend
    axios.post(`http://${data.backend}/api/messages`, {
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

const delay = ms => new Promise(r => setTimeout(r, ms));


/////////////////////////

// const setIOServer = (io) => data.io = io;

const ask = async ({ chatId, messageId, input }) => {
  while (!data.isReady) { await delay(1000) } // spin lock
  data.current = {
    chatId, messageId, input,
    output: '',
  };
  console.log('native: ask', data.current);
  proc.stdin.write(input + '\n');
};



/////////////////////////
data.io.on('connection', (socket) => {
  const fromHost = (socket.handshake.query || {}).from_host || 'localhost:3000';
  data.backend = fromHost;

  console.log('New connection from', fromHost);

  socket.on('ask', ({ chatId, messageId, input }) => {
    console.log('user input: ', { chatId, messageId, input });
    ask({ chatId, messageId, input });
  });

  socket.on('action_stop', () => {
    console.log('STOP')
    if (data.current.chatId) {
      // if it is responding to a request, stop
      console.log('SIGINT')
      proc.kill('SIGINT');
    }
    // else, do nothing
  });
});

server.listen(13030, () => {
  console.log('native bridge listening on *:13030');
});

