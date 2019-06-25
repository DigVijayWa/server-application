const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
  console.log("OPEN");
  ws.send('something');
});

ws.on('message', function incoming(data) {
  console.log(data);
});
