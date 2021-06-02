var socket = io();
var adultReady = false;
var studentReady = false;
var interval = null;
var selected = null;
var numPhotos = 4


socket.emit('login', 'adult')

window.addEventListener('load', function(){
  // document.getElementById('sessionId').innerText = socket.id;
  document.getElementById('textField').addEventListener('input', (e) => {
    socket.emit('typing', e.target.value);
  });
  document.getElementById('textField').addEventListener('focusout', () => {
    socket.emit('typing', false)
  });
})

socket.on('dc', function(msg) {
  studentReady = false
  document.getElementById('textField').value = ""
  document.getElementById('photo-page').style.display = "block";

  document.getElementById('ready-box').style.display = "block";
  document.getElementById('instructions-page').style.display = "none";
  document.getElementById('timer-box').style.display = "none";
  document.getElementById('status').innerText = "❌ ready";
  document.getElementById('worksheet').style.display = "none";

  selected = null;
  if (interval) {
    clearInterval(interval);
    interval = null
    document.getElementById('time').innerText = '03:00';
  }
  console.log('msg refersh is ', msg)
  if (msg.completed.length === numPhotos) {
    document.getElementById('photo-page').style.display = 'none';
    document.getElementById('empty-page').style.display = 'block';
  }
})

socket.on('ready', function(msg) {
  if (msg) {
    document.getElementById('status').innerText = '✅ ready';
    studentReady = true;
    if (studentReady && adultReady) {
      startTimer();
    }
  } else {
    document.getElementById('status').innerText = '❌ ready';
    studentReady = false
  }
})

socket.on('selected', function(msg) {
  console.log(msg);
  adultReady = false;
  if (interval) {
    clearInterval(interval);
    interval = null
  }
  if (msg) {
    document.getElementById('selected-img').src = 'captures/' + msg + '.png';
    document.getElementById('ready-box').style.display = "block"
    document.getElementById('photo-page').style.display = "none";
    document.getElementById('instructions-page').style.display = "block";
    selected = msg;
  }
});

socket.on('finished-convo', function() {
  startWorksheet();
})

socket.on('typing', (msg) => {
  if (msg === false) {
    document.getElementById('textField').disabled = false;
  } else {
    document.getElementById('textField').disabled = true;
    document.getElementById('textField').value = msg;
  }
})

socket.on('completeWorksheet', () => {
  reset();
})

socket.on('completed', (arr) => {
  if (arr) {
    arr.forEach(elem => {
      if (document.getElementById(elem)) {
        document.getElementById(elem).remove();
      }
    });
  }
  if (arr.length === numPhotos) {
    document.getElementById('photo-page').style.display = 'none';
    document.getElementById('empty-page').style.display = 'block';
  }
})

function ready(e) {
  if (e.classList.contains('not-ready')) {
    e.classList.remove('not-ready');
    e.innerText = "I am ✅ ready!";
    adultReady = true;
    socket.emit('ready', true);
    if (studentReady && adultReady) {
      startTimer();
    }
  }
  else {
    e.classList.add('not-ready');
    e.innerText = "I am ❌ ready!";
    adultReady = false;
    socket.emit('ready', false);
  }
}

function runTimer(duration, display) {
  var timer = duration, minutes, seconds;
  interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = duration;
      clearInterval(interval)
      interval = null
    }
  }, 1000);
}

var startTimer = function () {
  adultReady = false;
  studentReady = false;
  document.getElementById('status').innerText = '❌ ready';
  document.getElementById('ready-btn').classList.add('not-ready');
  document.getElementById('ready-btn').innerText = "I am ❌ ready!";
  socket.emit('reset-ready');
  document.getElementById('ready-box').style.display= "none";
  document.getElementById('timer-box').style.display = "block"
  var duration = 60 * 3,
  display = document.querySelector('#time');
  runTimer(duration, display);
};

function finishedConvo() {
  socket.emit('finished-convo', true);
}

function startWorksheet() {
  clearInterval(interval);

  document.getElementById('value').innerText = selected.slice(0, -1);
  document.getElementById('timer-box').style.display = 'none';
  document.getElementById('worksheet').style.display = 'block';
}

function submit() {
  socket.emit('completeWorksheet');
  reset();
}

function reset() {
  console.log('resetting');
  document.getElementById('worksheet').style.display = 'none';
  document.getElementById('textField').value = ""

  console.log('resetting, selected is', selected)
  if (document.getElementById(selected)) {document.getElementById(selected).remove()};

  selected = null;
  adultReady = false;
  document.getElementById('status').innerText = '❌ ready';
  studentReady = false;
  document.getElementById('ready-btn').classList.add('not-ready');
  document.getElementById('ready-btn').innerText = "I am ❌ ready!";
  socket.emit('reset-ready');
  document.getElementById('instructions-page').style.display = 'none';
  document.getElementById('photo-page').style.display = 'block';
}