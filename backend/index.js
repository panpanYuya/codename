const { Socket } = require('dgram');
const app = require('express');
const { emit } = require('process');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  //originsはURLを指定して、メソッドを指定している
  //https://socket.io/docs/v3/handling-cors/
   cors: {
    origin: ["http://localhost:3000", "http://localhost:4200"],
    // origin: "*",
    // methods: ["GET", "POST"]
  },
  origins: ["*"]
});

const { createGame } = require('./util/words');

io.on('connection', (socket) => {
  console.log('A user connected!');

  socket.on('startGame', ({ gameId }) => {
    createGame().then(words => {
      io.to(gameId).emit('startGame', words);
      console.log("Someone is starting a game");
    })
  })

  // socket.on('gameUpdate', ({ gameId, words }) => {
  //   io.to(gameId).emit(gameId, words);
  // })

  socket.on('joinGame', ({gameId}) => {
    socket.join(gameId);
    console.log('A player joined the room ' + gameId);
    socket.to(gameId).emit('joinGame', 'A player joined the game!');
  })

  socket.emit('message', 'Hey I just connected!');

  socket.broadcast.emit('message', 'Hi this message is send to everyone except sender!');

  io.emit('This is send to everyone!');

  // socket.join('HERE IS A UNIQUE ID THE ROOM!');

  // socket.to('UNIQUE ID').emit('message', 'THIS MESSAGE WILL BE SIND TO EVERYONE IN THE ROOM EXCEPT THE SENDER!');

  // io.to('UNIQUE ID').emit('message', 'THIS MESSAGE WILL BE SIND TO EVERYONE IN THE ROOM EXCEPT THE SENDER!');
})

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log('Server is running on port ' + PORT));