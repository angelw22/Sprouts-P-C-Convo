const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.engine('html', require('ejs').renderFile);

var users = {}
var studentId = null;
var adultId = null;
var completed = [];
var photoSelected = null
var studentReady = false;
var adultReady = false;
const numPhotos = 4;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/adult', (req, res) => {
  res.sendFile(__dirname + '/adult.html');
});

app.get('/student', (req, res) => {
  res.sendFile(__dirname + '/student.html');
});

app.get('/admin', (req, res) => {
  res.render('admin.html',{users: users, studentId: studentId, adultId: adultId});
})

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    //if student disconnected, reset everything
    if (socket.id === studentId) {
      console.log('student left')
      photoSelected = null;
      studentReady = false;
      studentId = null
      // io.emit('student-disconnect', true);
      socket.broadcast.emit('dc', {'completed': completed, 'id':socket.id})
    }
    else {
      adultId = null;
      adultReady = false;
      io.emit('adult-disconnect', true)
      socket.broadcast.emit('dc', {'completed': completed, 'id':socket.id})
    }
  });
  socket.on('login', (msg) => {
    console.log(msg, 'connected')
    if (msg === 'adult') {
      adultId = socket.id;
      socket.emit('completed', completed);
      socket.emit('selected', photoSelected)
      socket.emit('ready', studentReady)
    } else if (msg === 'student') {
      studentId = socket.id
      socket.emit('completed', completed);
      socket.emit('ready', adultReady)
      console.log('student id is', studentId)
    }
    users[socket.id] = msg;
  });

  socket.on('selected', (msg) => {
    console.log('selected', msg)
    photoSelected = msg
    socket.broadcast.emit('selected', msg);
  })

  socket.on('ready', (msg) => {
    console.log('received ready');
    if (socket.id === adultId) {
      adultReady = msg;
    } else if (socket.id === studentId) {
      studentReady = msg;
    }
    socket.broadcast.emit('ready', msg);
  })

  socket.on('reset-ready', () => {
    studentReady = false;
    adultReady = false;
  })

  socket.on('finished-convo', () => {
    adultReady = false;
    studentReady = false;
    io.emit('finished-convo')
  })

  socket.on('typing', (msg) => {
    socket.broadcast.emit('typing', msg)
  })

  socket.on('completeWorksheet', () => {
    completed.push(photoSelected);
    if (completed.length === numPhotos) {
      io.emit('completed', completed);
    }
    photoSelected = null;
    studentReady = false;
    adultReady = false;
    socket.broadcast.emit('completeWorksheet')
  })
});

app.use(express.static('public'))

server.listen(3000, () => {
  console.log('listening on *:3000');
});