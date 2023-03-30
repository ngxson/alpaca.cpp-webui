const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const { Server: ServerIO } = require("socket.io");

const { spawn } = require('node:child_process');
const proc = spawn('/bin/sh', [
  path.join(__dirname, '../bin/run-chat.sh')
]);

const app = express();
app.get('/', (req, res) => res.send(''));
const server = http.createServer(app);
let data = {
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
  socket.on('ask', ({ chatId, messageId, input }) => {
    console.log('user input: ', { chatId, messageId, input });
    ask({ chatId, messageId, input });
  });

  socket.on('action_stop', () => {
    // TODO
  });
});

server.listen(13030, () => {
  console.log('native bridge listening on *:13030');
});

