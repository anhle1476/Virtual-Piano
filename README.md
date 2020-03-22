# Virtual-Piano
A vanilla javascript piano with recording (local storage) and playback function

Javascript: 
//variable: 
  playStatus (boolean): playing status,
  recStatus (boolean): recording status,
  tempRec (Array): store the temporary record,
  playData (Array): store the data currently playing,

//piano functions:
piano = {
  playNote(): play the clicked note + recording to tempData,
  keyToPlay(): listen to keydown event -> convert to click,
}

//local storage data functions:
data = {
  getRecord(): get records from localStorage,
  setRecord(records): set records to localStorage,
  addRecord(name, data): add a new record to the current records list,
}

// record & play area 's event handler
handler = {
  record(): record button handler: switch recStatus,
  playBtn(): play buttons handler: switch playStatus, set playData, set time for the handler.playing() function;
  stop(): stop button handler,
  playing(): use the playData to play,
  saveBtn(): save button handler: open the new record save popup, temporary remove the piano's keydown listener,
  okBtn(): popup's ok buttons handler: use data.addRecord(), use handler.cancelBtn(),
  candelBtn(): close popup, re-add keydown listener
  deleteBtn(): delete button handler: delete the selected record from localStorage
}

//records list view handle
recordedView(): reset <select> -> data.getRecord() -> loop, appendChild to <select>

