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
  [{ font: [] }],
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
// Loads a specific note from local storage to the editor 
function loadToQuill(id) {
  let tempStorage = loadNotes();
  quill.setContents(tempStorage.find(loadNote => loadNote.id == id).content);
}

function addNote() {
  let tempStorage = loadNotes(); // Loads array from loadNotes()
  tempStorage.push(newNote(getAvailID(tempStorage))); // Adds a new note at the end of the array. 
  saveNotes(tempStorage); // Overwrites localStorage with tempStorage content
  updateView();
  console.log(loadNotes());
}
// Adds and checks the length of an array. If the length is over 0 - find the highest id. Return id +1.   
const getAvailID = noteArray => noteArray.length > 0 ? Math.max(...noteArray.map(note => note.id), 0) + 1 : 0;

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
  note.title = "Note" + " " + (1 + id); // Writes note + id starting from 1 and adds +1 for every note.
  // note.content = " " + quill.getContents().ops[0].insert; TODO next sprint
  note.id = id;
  return note;
}

function updateView() {
  let notes = loadNotes();
  document.getElementById("notes").innerHTML = ""; //Empty base for created content
  // Generates content in saved notes area
  notes.forEach(note => {
    let newDiv = document.createElement("div");
    let newP = document.createElement("p");
    let newTitle = document.createTextNode(note.title);
    // let newContent = document.createTextNode(r.content); TODO next sprint
    let newButton = document.createElement("button");
    let newButtonText = document.createTextNode("X");
    newButton.setAttribute("onclick", "deleteNote(" + note.id + ");");
    newDiv.setAttribute("onclick", "loadToQuill(" + note.id + ");");
    newButton.appendChild(newButtonText);
    newP.appendChild(newTitle);
    // newP.appendChild(newContent); TODO next sprint
    newDiv.appendChild(newP);
    newDiv.appendChild(newButton);
    let currentSection = document.getElementById("notes");
    currentSection.appendChild(newDiv);
  });
}
