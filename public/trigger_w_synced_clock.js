//#ef SOCKET IO
let ioConnection;

if (window.location.hostname == 'localhost') {
  ioConnection = io();
} else {
  ioConnection = io.connect(window.location.hostname);
}
const SOCKET = ioConnection;
//#endef > END SOCKET IO

//#ef TIMESYNC
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//#endef TIMESYNC

//#ef Some HTML DOM Objects for demo purposes
let tDiv = document.createElement("div");
tDiv.style.position = 'absolute';
tDiv.style.width = '350px';
tDiv.style.height = '130px';
tDiv.style.top = '20px';
tDiv.style.left = '20px';
tDiv.style.backgroundColor = 'yellow';
document.body.appendChild(tDiv);

let btn = document.createElement('button');
btn.style.position = 'absolute';
btn.style.width = '200px';
btn.style.height = '60px';
btn.style.top = '75px';
btn.style.left = '380px';
btn.style.backgroundColor = 'green';
btn.innerHTML = 'Press to Send Synced Msg'
document.body.appendChild(btn);
btn.onclick = function(){sendTimedMsg()}; //When the button is clicked, the sendTimedMsg() function will run (see below)

let tDiv2 = document.createElement("div");
tDiv2.style.position = 'absolute';
tDiv2.style.width = '350px';
tDiv2.style.height = '130px';
tDiv2.style.top = '20px';
tDiv2.style.left = '600px';
tDiv2.style.backgroundColor = 'orange';
document.body.appendChild(tDiv2);
//#endef Some HTML DOM Objects for demo purposes

//#ef Animation Engine

let framecount = 0; //to count frames
let lastFrameSyncedTime = 0; //so you can see how much time has elapsed ie framedur
let framedur = 0;

 //This function animationEngine() is a frame-loop based in reauestAnimationFrame a common method to create animation html
function animationEngine() {

//Time from the timeSync synced clock
  let ts_Date = new Date(TS.now());
  let tsTime = ts_Date.getTime();

  //Time from the local computer's clock
  let nonSyncedDate = new Date();
  let nonSyncedTime = nonSyncedDate.getTime();

  //Display timing
   if (framecount % 60 == 0) { //so it only updates the page about once a second or once every 60 frames
    tDiv.innerHTML = 'This is the synced time -----: ' + tsTime.toString() + "<br/>" + 'This is the non-synced time: ' + nonSyncedTime.toString() + "<br/>" + 'Frame duration: ' + framedur.toString();
  }

  //execute event at scheduled time
  if (timeOfNewEvent >= lastFrameSyncedTime && timeOfNewEvent < tsTime) {
    tDiv2.innerHTML = tDiv2.innerHTML + '<br/>' + 'Executing new event @: ' + tsTime.toString();
  }

  //Update:
  framedur = tsTime - lastFrameSyncedTime;
  lastFrameSyncedTime = tsTime;
  framecount++;

  requestAnimationFrame(animationEngine); //calls another animation frame, continuing the loop
}

requestAnimationFrame(animationEngine); //request and animation frame to start the loop

//#endef Animation Engine

//#ef SocketIO Function and Message

let timeOfNewEvent = 0; //will be used to hold the time of the new event set in the socket msg

//this function runs on the button press
function sendTimedMsg() {
  //Poll time from timeSync synced clock
  let ts_Date = new Date(TS.now());
  let timestamp = ts_Date.getTime();


  // Send msg to server to relay as broadcast to rest of players
  SOCKET.emit('syncGo', {
    timestamp: timestamp,
  });

}

// Receive broadcast message from server
SOCKET.on('syncGoBroadcast_fromServer', function(data) {

  let timestamp = data.timestamp; //this is the time the message was sent from originator
  let ts_Date = new Date(TS.now()); //this is the time msg received from server
  let currTime = ts_Date.getTime();

  tDiv2.innerHTML = 'This is sent time -----: ' + timestamp.toString() + "<br/>" + 'This is received time: ' + currTime.toString(); //Display

  //Start a new event 2 seconds from the time the event was originally sent
  timeOfNewEvent = timestamp + 2000;

}); // SOCKET.on('sf004_newStartTime_fromServer', function(data) END

//#endef SocketIO Function and Message
