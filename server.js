const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const users = [];
const conections = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.sockets.on('connection', (socket) => {
  // connect
  conections.push(socket);
  console.log(`Connected :${conections.length} sockets connected`);

  //disconnect

  socket.on('disconnect', (data) => {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    conections.splice(conections.indexOf(socket), 1);
    console.log(`Disconnected :${conections.length} sockets connected`);
  });

  //message
  socket.on('send message', (data) => {
    console.log(data);
    io.sockets.emit('new message', { msg: data, user: socket.username });
  });

  //new user

  socket.on('new user', (data, callback) => {
    callback(true);
    console.log(data);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit('get users', users);
  }
});

const PORT = 3000;
server.listen(process.env.PORT || PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);
