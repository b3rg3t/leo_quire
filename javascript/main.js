let modal = document.getElementById("landingpage");

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  } else if (document.getElementsByClassName("show")) {
  }
};

var toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "-1" }],
  [{ direction: "rtl" }],
  [{ size: ["small", false, "large", "huge"] }],
  ["link", "image", "video", "formula"],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }]
];

var quill = new Quill("#editor", {
  modules: {
    toolbar: toolbarOptions
  },
  theme: "snow"
});

window.addEventListener("load", function() {
  cookieCheck();
});
window.onload = function() {
  updateView();
  document.getElementById("nukeNotes").addEventListener("click", function() {
    nukeNotes();
    updateView();
  });
};
function loadToQuill(id) {
  let tempStorage = loadNotes();
  quill.setContents(tempStorage.filter(note => note.id == id)[0].content);
}

function addNote() {
  let tempStorage = loadNotes();
  tempStorage.push(newNote(getAvailID(tempStorage)));
  saveNotes(tempStorage);
  updateView();
  console.log(loadNotes());
}

const getAvailID = noteArray => noteArray.length > 0 ? Math.max(...noteArray.map(note => note.id), 0) + 1 : 0;

function saveNotes(notes) {
  localStorage.setItem("myNotes", JSON.stringify(notes));
}

function loadNotes() {
  return JSON.parse(localStorage.getItem("myNotes") ? localStorage.getItem("myNotes") : "[]");
}
function deleteNote(id) {
  let notes = loadNotes();
  let newNotes = notes.filter(note => note.id != id);
  saveNotes(newNotes);
  updateView();
}

function newNote(id) {
  let note = {};
  note.title = "Note" + " " + (1 + id);
  note.content = quill.getContents();
  note.id = id;
  return note;
}
function nukeNotes() {
  localStorage.setItem("notes", JSON.stringify([]));
}
function updateView() {
  let notes = loadNotes();
  document.getElementById("notes").innerHTML = "";
  notes.forEach(r => {
    let newDiv = document.createElement("div");
    let newP = document.createElement("p");
    let newTitle = document.createTextNode(r.title);
    // let newCont = document.createTextNode(quill.getText());
    let newButton = document.createElement("button");
    let newButtonText = document.createTextNode("X");
    newButton.setAttribute("onclick", "deleteNote(" + r.id + ");");
    newDiv.setAttribute("onclick", "loadToQuill(" + r.id + ");");
    newDiv.setAttribute("data-id", r.id);
    newButton.appendChild(newButtonText);
    newP.appendChild(newTitle);
    newDiv.appendChild(newP);
    // newDiv.appendChild(newCont);
    newDiv.appendChild(newButton);
    let currentSection = document.getElementById("notes");
    currentSection.appendChild(newDiv);
    // console.log(quill.getText());
  });
}
function cookieCheck() {
  if (localStorage.cookieCheck == null) {
    localStorage.cookieCheck = true;
    console.log("localStorage Cookie was set!");

    document.getElementById("landingpage").style.display = "block";
  } else {
    console.log("LocalStorage Cookie exists, will not display landingpage!");
    return;
  }
}
