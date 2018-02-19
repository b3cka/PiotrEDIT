if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);



function handleCommand(d) {
  console.log(lastMsgEl);
  console.log("HEJ");

   // lastMsgEl.innerHTML =  ` <br />int: ${d.integer} <br />float: ${d.float}`;
//buttonStateEl.innerHTML =  `text: ${d.text} <br />int: ${d.integer} <br />float: ${d.float}`;

}

var d;

var beat = 0;

//global function, koppla d globalt, styr raten i globala functionen


function onDocumentReady() {


    var socket = new ReconnectingWebsocket("ws://" + location.host + "/serial");
    var sendFormEl = document.getElementById('sendForm');
    var lastMsg = null;
    var button = null;
    lastMsgEl = document.getElementById('lastMsg');








    socket.onmessage = function(evt) {
        // Debug: see raw received message
        //console.log(evt.data);

        // Parse message, assuming <Text,Int,Float>
        d = evt.data.trim();

        if (d < 5){
          beat = 0;
          console.log(beat);
        }

        if(d > 5){
          beat = 1;
          console.log(d);
        }


        if(beat === 1){
          console.log(beat);
          TapForBPM();
        }


        if (d.charAt(0) == '<' && d.charAt(d.length-1) == '>') {
            // Looks legit
            d = d.split(',');
            if (d.length == 3) { // Yes, it has three components as we hoped
                handleCommand({
                    text:d[0].substr(1),
                    integer: parseInt(d[1]),
                    float: parseFloat(d[2].substr(0,d.length-1))
                });
                return;
            }
        }

        // Doesn't seem to be formatted correctly, just display as-is
        if (evt.data != lastMsg) {
            // lastMsgEl.innerText =  evt.data;
            lastMsg = evt.data;
        }



    }
    socket.onopen = function(evt) {
        console.log("Socket opened");

    }
    //
    // sendFormEl.addEventListener('submit', function(evt) {
    //     evt.preventDefault();
    //     var send = document.getElementById('sendtoSerial').value;
    //     socket.send(send);
    // })
}






var count = 0;
var msecsFirst = 0;
var msecsPrevious = 0;
var secPassed;


function ResetCount()
  {
  count = 0;
  document.TAP_DISPLAY.T_AVG.value = "";
  document.TAP_DISPLAY.T_TAP.value = "";
  document.TAP_DISPLAY.T_RESET.blur();
  }

function TapForBPM(e)
  {

  document.TAP_DISPLAY.T_WAIT.blur();
  timeSeconds = new Date;


  msecs = timeSeconds.getTime();
  secPassed = msecs - msecsPrevious;


  if ((msecs - msecsPrevious) > 1000 * document.TAP_DISPLAY.T_WAIT.value)
    {
    count = 0;

    //console.log(msecs);
    //console.log(msecsPrevious);
    }

        //console.log(count);
// if(secPassed < timeSeconds && secPassed > 3000){
//   alert("Time passed!");
//
// }



  if (count === 0)
    {
    document.TAP_DISPLAY.T_AVG.value = "First Beat";
    document.TAP_DISPLAY.T_TAP.value = "First Beat";

    msecsFirst = msecs;
    count = 1;
    }
  else
    {
    bpmAvg = 60000 * count / (msecs - msecsFirst);
    document.TAP_DISPLAY.T_AVG.value = Math.round(bpmAvg * 100) / 100;

    document.TAP_DISPLAY.T_WHOLE.value = Math.round(bpmAvg);

    count++;
    document.TAP_DISPLAY.T_TAP.value = count;

    lastMsgEl.innerHTML = Math.round(bpmAvg * 100) / 100;

    currentBeat.innerHTML = count;
    }
  msecsPrevious = msecs;


  return true;
  }

document.onkeypress = TapForBPM;
