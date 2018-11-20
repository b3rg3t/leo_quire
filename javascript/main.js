// LANDING PAGE
// Show/not show landing page
let modal = document.getElementById("landing-page");

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  else if (document.getElementsByClassName("show")) {
  }
};

// Check local storage for previous visit
function cookieCheck() {
  if (localStorage.cookieCheck == null) {
    localStorage.cookieCheck = true;
    console.log("LocalStorage Cookie was set!");

    document.getElementById("landing-page").style.display = "block";
  }
  else {
    console.log("LocalStorage Cookie exists, will not display landingpage!");
    return;
  }
}

// QUILL OPTIONS
//rubriker, punktlistor, numrerade listor samt göra text kursiv eller fetstil.
var toolbarOptions = [
  ["bold", "italic"],
  [{ header: [1, 2, 3, false] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  [{ color: [] }, { background: [] }],
  [{ align: [] }]
];
// Loads and configures the Quill editor
var quill = new Quill("#editor", {
  modules: {
    toolbar: toolbarOptions
  },
  placeholder: "Write your text here...",
  theme: "snow"
});
// Loads content from the Quill editor
window.onload = function () {
  cookieCheck();
  updateView();
};

function setActiveId(id){
  sessionStorage.activeId = id;
  console.log("Active set to " + sessionStorage.activeId);
}

function getActiveId(){
  return Number(sessionStorage.activeId);
}

// Loads a specific note from local storage to the editor 
function loadToQuill(id) {
  let tempStorage = loadNotes();
  quill.setContents(tempStorage.find(loadNote => loadNote.id == id).content);
  setActiveId(id);
  document.getElementById("title").value = tempStorage.find(loadNote => loadNote.id == id).title;
}

function addNote() {
  let tempStorage = loadNotes(); // Loads array from loadNotes()
  let freeID = getAvailID(tempStorage);
  setActiveId(freeID);
  
  tempStorage.push(newNote(freeID)); // Adds a new note at the end of the array. 
  saveNotes(tempStorage); // Overwrites localStorage with tempStorage content
  loadToQuill(getActiveId());
  quill.setContents("");
  
  saveNote();
  updateView();
  console.log(loadNotes());
}
// Adds and checks the length of an array. If the length is over 0 - find the highest id. Return id +1.   
const getAvailID = noteArray => noteArray.length > 0 ? Math.max(...noteArray.map(note => note.id), 0) + 1 : 0;

function saveNote() {
  // console.log("saveNote was called.");
  let id = getActiveId();
  let tempStorage = loadNotes();
  tempStorage.find(loadNote => loadNote.id == id).content = quill.getContents();
  tempStorage.find(loadNote => loadNote.id == id).title = document.getElementById("title").value;
  tempStorage.find(loadNote => loadNote.id == id).date = yyyymmdd();
  tempStorage.find(loadNote => loadNote.id == id).preview = getPreview();
  saveNotes(tempStorage);
  updateView();
}

// Converts JSON to string and saves to localStorage.
function saveNotes(notes) {
  localStorage.setItem("myNotes", JSON.stringify(notes));
}
// Checks if localStorage array exists and converts back to JSON. Else returns empty array.
function loadNotes() {
  return JSON.parse(localStorage.getItem("myNotes") ? localStorage.getItem("myNotes") : "[]");
}

function deleteNote(id) {
  let notes = loadNotes(); // Loads all notes
  let newNotes = notes.filter(note => note.id != id); // newNotes = allNotes except those that match delete id.
  saveNotes(newNotes); // Save the new filtered list to localStorage
  updateView();
}

function newNote(id) {
  let note = {};
  note.title = "Untitled " + (id + 1); // Writes note + id starting from 1 and adds +1 for every note.
  note.content = quill.getContents();
  note.id = id;
  note.date = yyyymmdd();
  note.preview = getPreview();
  return note;
}

function updateView() {
  let notes = loadNotes();
  document.getElementById("notes").innerHTML = ""; //Empty base for created content
  // Generates content in saved notes area
  notes.forEach(note => {
    let newDiv = document.createElement("div");
    let pTitle = document.createElement("p");
    pTitle.setAttribute("class","note-titel");
    let pDate = document.createElement("p");
    pDate.setAttribute("class", "note-date");
    let pPreview = document.createElement("p");
    pPreview.setAttribute("class", "note-preview");
    let newTitle = document.createTextNode(note.title);
    let newDate = document.createTextNode(note.date);
    let newPreview = document.createTextNode(note.preview);

    let newButton = document.createElement("button");
    let newButtonText = document.createTextNode("X");
    newButton.setAttribute("onclick", "deleteNote(" + note.id + ");");
    newDiv.setAttribute("onclick", "loadToQuill(" + note.id + ");");
    pTitle.appendChild(newTitle);
    pDate.appendChild(newDate);
    pPreview.appendChild(newPreview);
    newButton.appendChild(newButtonText);

    newDiv.appendChild(newButton);
    newDiv.appendChild(pTitle);
    newDiv.appendChild(pPreview);
    newDiv.appendChild(pDate);

    
    
    let currentSection = document.getElementById("notes");
    currentSection.appendChild(newDiv);
    
  });
}

function yyyymmdd() {
  var x = new Date();
  var y = x.getFullYear().toString();
  var m = (x.getMonth() + 1).toString();
  var d = x.getDate().toString();
  if (d.length == 1) {
    (d = '0' + d);
  }
  if (m.length == 1){
    (m = '0' + m);
  }
  // (m.length == 1) && (m = '0' + m);
  var yyyymmdd = y + "-" + m + "-" + d;
  return yyyymmdd;
}

function getPreview(){
  let preview = quill.getContents().ops[0].insert;
  preview.toString();
  let slice = preview.substring(0, 10) + "...";
  return slice; 
}
