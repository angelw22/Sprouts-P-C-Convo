var socket = io();
var adultReady = false;
var studentReady = false;
var interval = null;
var selected = null;
var numPhotos = 4 
var completed = 0;

socket.emit('login', 'student')

window.addEventListener('load', function(){
  // document.getElementById('sessionId').innerText = socket.id;
  document.getElementById('textField').addEventListener('input', (e) => {
    socket.emit('typing', e.target.value);
  });
  document.getElementById('textField').addEventListener('focusout', () => {
    socket.emit('typing', false)
  });
  for (let i = 0; i < completed; i++) {
    console.log('hello', i )
    document.getElementById('plant' + i).style.display = "block";
  }
})

socket.on('dc', function(msg) {
  adultReady = false;
  document.getElementById('textField').value = ""
  // studentReady = false;
  // document.getElementById('selection-page').style.display = "block";
  document.getElementById('ready-box').style.display = "block";
  // document.getElementById('instructions-page').style.display = "none";
  document.getElementById('timer-box').style.display = "none";
  document.getElementById('status').innerText = "❌ ready";
  document.getElementById('worksheet').style.display = "none";
  if (interval) {
    clearInterval(interval);
    interval = null
    document.getElementById('time').innerText = '03:00';
  }
  if (msg.completed.length === numPhotos) {
    document.getElementById('selection-page').style.display = 'none';
    document.getElementById('empty-page').style.display = 'block';
  } else if (msg.completed.length > 0) {
    completed = msg.completed.length
  }
})

socket.on('ready', function(msg) {
  if (msg) {
    document.getElementById('status').innerText = '✅ ready';
    adultReady = true;
    if (studentReady && adultReady) {
      startTimer();
    }
  } else {
    document.getElementById('status').innerText = '❌ ready';
    adultReady = false
  }
})

function selectThumb(e) {
  console.log('hello', e.children[0]); 
  document.getElementById('select').disabled = false;

  if (document.getElementsByClassName('selected').length > 0) { 
    document.getElementsByClassName('selected')[0].classList.remove('selected')
  }
  e.classList.add("selected")
}

function selectImg() {
  console.log('emitting', document.getElementsByClassName('selected')[0].id)
  socket.emit('selected', document.getElementsByClassName('selected')[0].id.toString());
  selected = document.getElementsByClassName('selected')[0].id

  document.getElementById('selected-img').src = "captures/" + document.getElementsByClassName('selected')[0].id + ".png";
  document.getElementById('selection-page').style.display = "none";
  document.getElementById('instructions-page').style.display = "block"
  document.getElementById('ready-box').style.display= "block";
}

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
  if (arr.length > 0) {
    arr.forEach((elem, i) => {
      if (document.getElementById(elem)) {
        document.getElementById(elem).remove();
      }
      document.getElementById('plant' + i).style.display = "block";
      console.log('arr enum', i)
    });
    completed = arr.length;
  }
  if (arr.length === numPhotos) {
    document.getElementById('selection-page').style.display = 'none';
    document.getElementById('empty-page').style.display = 'block';
  }
})

function ready(e) {
  if (e.classList.contains('not-ready')) {
    e.classList.remove('not-ready');
    e.innerText = "I am ✅ ready!";
    studentReady = true;
    socket.emit('ready', true);
    if (studentReady && adultReady) {
      startTimer();
    }
  }
  else {
    e.classList.add('not-ready');
    e.innerText = "I am ❌ ready!";
    console.log('##ready, i clicked not ready')
    studentReady = false;
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
  document.getElementById('selection-page').style.display = 'block';
}