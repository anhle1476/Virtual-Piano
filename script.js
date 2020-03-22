// keydown check array
const BLACK_KEY = ["1", "2", "4", "5", "6", "8", "9", "-", "=", "Backspace"];
const WHITE_KEY = ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"];
// DOM selector
// piano DOM
let key = document.querySelectorAll(".key");
let whiteKey = document.querySelectorAll(".white-key");
let blackKey = document.querySelectorAll(".black-key");
// recording DOM
let recordBtn = document.getElementById("record");
let stopBtn = document.getElementById("stop");
let playBtn = document.querySelectorAll(".play");
let input = document.getElementById("input");
let recordedList = document.getElementById("recorded-list");
// Temporary recording & recording status & playing status
let tempRec = [];
let playStatus = false;
let recStatus = false;
// playback data
let playData = [];

/*******************************************************************/
// PIANO PLAY HANDLER

let piano = {
  // play note function
  playNote: function(e) {
    let target = e.target;
    let note = document.getElementById(target.dataset.name);
    // reset note's sound
    note.currentTime = 0;
    // change clicked piano key's style
    target.classList.add("play");
    // play sound
    note.play();
    // reset piano key's style
    setTimeout(() => target.classList.remove("play"), 300);
    // recording
    if (recStatus) {
      // get current time value
      let d = new Date;
      let timeValue = d.valueOf();
      // store the initial timevalue in tempRec[0]
      if (tempRec.length == 0) {
        tempRec.push(timeValue)
      };
      // store keys and timevalues from tempRec[1] forward
      tempRec.push([target.dataset.name, (timeValue - tempRec[0]) ]);
      console.log(tempRec)
    }
  },
  //  keydown to play function
  keyToPlay: function(e) {
    // prevent Tab key's default
    e.preventDefault();
    // prevent presskey
    if (e.repeat) {return}
    // get key from event
    let key = e.key;
    // get key index from check array
    const playWhiteKey =  WHITE_KEY.indexOf(key)
    const playBlackKey =  BLACK_KEY.indexOf(key)
    // click the piano key
    if (playWhiteKey > -1) {whiteKey[playWhiteKey].click()}
    if (playBlackKey > -1) {blackKey[playBlackKey].click()}
  }
}


/*******************************************************************/
// LOCALSTORAGE RECORDING HANDLE
let data = {
  // get records from localStorage
  getRecord: function() {
    return JSON.parse(localStorage.getItem("records"))
  },
  // set records to localStorage
  setRecord: function(records) {
    localStorage.setItem("records", JSON.stringify(records))
  },
  // add newRecord
  addRecord: function(name, newData) {
    // get old records & set default value
    let records = this.getRecord();
    if (!records) {
      records = []
    };
    // name validation
    if (!(/\w/ig).test(name)) {
      alert("Name invalid!");
      return false;
    }
    if (records.some(n => n.name == name)) {
      alert("Already have this name!");
      return false;
    } else {
      // push new data
      records.push({name: name, data: newData});
      data.setRecord(records);
      // clear input area
      input.value = "";
      return true;
    }
  },
}

/*******************************************************************/
// RECORD & PLAY BUTTONS HANDLER
let handler = {
  record: function() {
    recStatus = !recStatus
    if (!recStatus) {
      // change btn style
      recordBtn.textContent = "Record"
      recordBtn.classList.remove("active")
      // reveal form, recored area
      if (tempRec.length != 0) {
        document.getElementById("form").style.display = "block";
      }
      document.getElementById("recored-display").style.display = "block";
      document.getElementById("save").style.display = "inline";
    } else {
      // reset temp record
      tempRec.length = 0;
      // change btn style
      recordBtn.textContent = "Stop Recording";
      recordBtn.classList.add("active")
      // hidden form, recored area
      document.getElementById("form").style.display = "none";
      document.getElementById("recored-display").style.display = "none";
    }
  },
  playBtn: function(e) {
    playStatus = true;
    // hide play, record & show stop
    document.getElementById("form").style.display = "none";
    document.getElementById("recored-display").style.display = "none";
    recordBtn.style.display = "none";

    document.getElementById("stop").style.display = "inline";
    // get rec data
    if (e.target.id === "play") {
      // case 1: from temp record
      playData = tempRec.slice(1)
    } else {
      // case 2: from localStorage
      let dataValue = recordedList.value;
      data.getRecord().map(item => {
        if (item.data[0] == dataValue) {
          playData = item.data.slice(1);
        }
      })
    };
    // loop data -> play
    let i=0;
    let l = playData.length;
    for (i; i<l; i++) {
      let [note, time] = playData[i]
      setTimeout(function() {
          handler.playing(document.getElementById(note));
          // hide stop & show play, record
          if (time == playData[l-1][1]) {handler.stop()}
      }, time)
    }
  },
  stop: function() {
    playStatus = false;
    playData.length = 0;
    document.getElementById("form").style.display = "block";
    document.getElementById("recored-display").style.display = "block";
    recordBtn.style.display = "inline";
    document.getElementById("stop").style.display = "none";
  },
  playing: function(target, i) {
    if (playStatus) {
      target.currentTime = 0;
      target.play()
    }
  },
  saveBtn: function()  {
    document.querySelector("#modal").style.display = "block";
    document.removeEventListener("keydown", piano.keyToPlay)
  },
  okBtn: function()  {
    if (data.addRecord(input.value, tempRec)) {
      document.getElementById("save").style.display = "none";
      recordedView();
      handler.cancelBtn()
    }
  },
  cancelBtn: function()  {
    document.querySelector("#modal").style.display = "none";
    document.addEventListener("keydown", piano.keyToPlay);
    input.value = "";
  },
  deleteBtn: function() {
    let value = recordedList.value;
    let records = data.getRecord();
    records.forEach((item, i) => {
      if (item.data[0] == value) {
        records.splice(i, 1);
        data.setRecord(records);
        recordedView();
        return;
      }
    });

  }
}
/*******************************************************************/
function recordedView() {
  // reset select options
  Array.from(recordedList.children).map((item, i) =>{
    if (i!=0) {
      recordedList.removeChild(item)
    }
  })
  // get data
  let recorded = data.getRecord();
  // loop -> create elements -> appendChild
  recorded.map(item => {
    let newOption = document.createElement('option');
    newOption.value = item.data[0];
    newOption.textContent = item.name;
    recordedList.appendChild(newOption);
  });
}



/*******************************************************************/
// EVENT LISTENER
// handle piano's play note event
key.forEach((item) => item.addEventListener("click", piano.playNote));
// handle keydown event
document.addEventListener("keydown", piano.keyToPlay)
// handle record button
recordBtn.addEventListener("click", handler.record)
// handle play
playBtn.forEach(item => {
  item.addEventListener("click", handler.playBtn)
});
// handle stop
document.getElementById("stop").addEventListener("click", handler.stop)

// handle save record
document.getElementById("save").addEventListener("click", handler.saveBtn)
document.getElementById("ok").addEventListener("click", handler.okBtn)
document.getElementById("cancel").addEventListener("click", handler.cancelBtn)
// handle delete record
document.getElementById("delete").addEventListener("click", handler.deleteBtn)
