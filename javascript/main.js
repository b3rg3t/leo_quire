// LANDING PAGE
// Show/not show landing page
let modal = document.getElementById("landing-page");

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Check local storage for previous visit
function cookieCheck() {
  if (localStorage.cookieCheck == null) {
    localStorage.cookieCheck = true;
    console.log("LocalStorage Cookie was set!");

    document.getElementById("landing-page").style.display = "block";
  } else {
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
  //Setting Event Listeners
  document.getElementById("search-bar").addEventListener("input", function () {
    updateView();
  })

  document.getElementById("tag-search").addEventListener("change", function () {
    this.checked ? document.getElementById("search-bar").placeholder = "Ex: work,-boring" : document.getElementById("search-bar").placeholder = "Search by title or content";
  });

  cookieCheck();
  updateView();

  if (loadNotes().length > 0) {
    loadToQuill(getActiveId());
  }
};



document.getElementById('checkStarred').addEventListener('click',


  function () {

    if (document.getElementById("checkStarred").checked) {

      (updateView((note) => (note.star == true)));
      console.log("Showing starred items");
      // note = true;
    } else {

      updateView();
      console.log("Hallå");
    }
  });


function setActiveId(id) {
  localStorage.activeId = id;
  console.log("Active set to " + localStorage.activeId);
}

function getActiveId() {
  return Number(localStorage.activeId);
}

// Loads a specific note from local storage to the editor
function loadToQuill(id) {
  let tempStorage = loadNotes();
  quill.setContents(tempStorage.find(loadNote => loadNote.id == id).content);
  setActiveId(id);
  document.getElementById("title").value = tempStorage.find(loadNote => loadNote.id == id).title;
  document.getElementById("tag-input").value = tempStorage.find(loadNote => loadNote.id == id).tagsPresplit;
}

function addNote() {
  let tempStorage = loadNotes(); // Loads array from loadNotes()
  let freeID = getAvailID(tempStorage);
  setActiveId(freeID);

  tempStorage.push(newNote(freeID)); // Adds a new note at the end of the array.
  saveNotes(tempStorage); // Overwrites localStorage with tempStorage content
  loadToQuill(getActiveId());
  quill.setContents("");
  document.getElementById("tag-input").value = "";

  saveNote();
  updateView();
  console.log(loadNotes());
}

function saveNote() {
  let tempStorage = loadNotes();

  if (loadNotes().length == 0) { //temp workaround for saving without adding a note todo: make simpler solution //jesper
    var tempTitle = document.getElementById("title").value;
    var tempContent = quill.getContents();
    var tempPreview = getPreview();
    var tempTitlePreview = getTitle();
    var tempTags = document.getElementById("tag-input").value;
    addNote();
  }

  let id = getActiveId(); //0
  console.log("templength: " + tempStorage.length);
  //If user tries to save note without having any notes
  if (tempStorage.length == 0) { //bypass addNote wipe (temp)
    tempStorage = loadNotes();
    //todo: don't need to use find every time //jesper
    tempStorage.find(loadNote => loadNote.id == id).title = tempTitle;
    tempStorage.find(loadNote => loadNote.id == id).content = tempContent;
    tempStorage.find(loadNote => loadNote.id == id).preview = tempPreview;
    tempStorage.find(loadNote => loadNote.id == id).titlePreview = tempTitlePreview;
    tempStorage.find(loadNote => loadNote.id == id).tagsPresplit = tempTags;
    tempStorage.find(loadNote => loadNote.id == id).tags = tempStorage.find(loadNote => loadNote.id == id).tagsPresplit.split(",");

  }
  //For all other cases when user is editing an existing note
  else {
    tempStorage.find(
      loadNote => loadNote.id == id
    ).title = document.getElementById("title").value;
    tempStorage.find(
      loadNote => loadNote.id == id
    ).content = quill.getContents();
    tempStorage.find(loadNote => loadNote.id == id).preview = getPreview();
    tempStorage.find(loadNote => loadNote.id == id).titlePreview = getTitle();
    tempStorage.find(loadNote => loadNote.id == id).tagsPresplit = document.getElementById("tag-input").value;
    tempStorage.find(loadNote => loadNote.id == id).tags = tempStorage.find(loadNote => loadNote.id == id).tagsPresplit.split(",");
  }

  tempStorage.find(loadNote => loadNote.id == id).date = yyyymmdd();

  saveNotes(tempStorage);
  loadToQuill(getActiveId());
  updateView();
}

// Converts JSON to string and saves to localStorage.
function saveNotes(notes) {
  localStorage.setItem("myNotes", JSON.stringify(notes));
}
// Checks if localStorage array exists and converts back to JSON. Else returns empty array.
function loadNotes() {
  return JSON.parse(
    localStorage.getItem("myNotes") ? localStorage.getItem("myNotes") : "[]"
  );
}

function deleteNote(id) {
  let notes = loadNotes(); // Loads all notes
  let newNotes = notes.filter(note => note.id != id);

  console.log(notes);
  let deletedIndex = notes.findIndex(note => note.id === id);
  console.log("Index of deleted: " + deletedIndex);
  console.log(notes[deletedIndex - 1]);

  //Find note to jump to if user deletes active note
  if (id == getActiveId() && notes[deletedIndex - 1] != undefined) {
    //If theres a previous element in array, go there
    setActiveId(deletedIndex - 1);
    loadToQuill(notes[deletedIndex - 1].id);
  } else if (id == getActiveId() && notes[deletedIndex + 1] != undefined) {
    //If there was no previous, go to element after
    setActiveId(deletedIndex + 1);
    loadToQuill(notes[deletedIndex + 1].id);
  }
  else if (notes[deletedIndex + 1] == undefined && notes[deletedIndex - 1] == undefined) { //If all notes were deleted
    quill.setContents("");
    document.getElementById("title").value = "";
  } else if (id != getActiveId()) {
    //If user wasn't standing on deleted note
  }
  saveNotes(newNotes);
  updateView();
}


function toggleStarred(id) {
  let notes = loadNotes();

  const objIndex = notes.findIndex(obj => obj.id == id);

  const updatedObj = { ...notes[objIndex], star: (notes[objIndex].star ? false : true) };

  const updatedNotes = [
    ...notes.slice(0, objIndex),
    updatedObj,
    ...notes.slice(objIndex + 1),
  ];
  saveNotes(updatedNotes);
  updateView();
}
function newNote(id) {
  let note = {};
  note.title = "Untitled " + (id + 1); // Writes note + id starting from 1 and adds +1 for every note.
  note.titlePreview = getTitle();
  note.content = quill.getContents();
  note.id = id;
  note.date = yyyymmdd();
  note.preview = getPreview();
  note.tagsPresplit = "";
  note.tags = [];
  return note;
}
// Adds and checks the length of an array. If the length is over 0 - find the highest id. Return id +1.   
const getAvailID = noteArray => noteArray.length > 0 ? Math.max(...noteArray.map(note => note.id), 0) + 1 : 0;


// function updateView(func = () => true) {
//   let notes = loadNotes();
//   document.getElementById("notes").innerHTML = '';


function updateView(func = () => true) {
  let searchBar = document.getElementById("search-bar").value;
  let notes = searchContent(searchBar);
  document.getElementById("notes").innerHTML = ""; //Empty base for created content
  // Generates content in saved notes area
  notes.filter((note) => func(note)).forEach((note) => {
    let newDiv = document.createElement("div");
    let pTitle = document.createElement("p");
    pTitle.setAttribute("class", "note-titel");
    let pDate = document.createElement("p");
    pDate.setAttribute("class", "note-date");
    let pPreview = document.createElement("p");
    pPreview.setAttribute("class", "note-preview");
    let newTitle = document.createTextNode(note.titlePreview);
    let newDate = document.createTextNode(note.date);
    let newPreview = document.createTextNode(note.preview);
    let starButton = document.createElement("button");
    let starButtonText = document.createTextNode((note.star ? "Un-star" : "Star"));

    let newButton = document.createElement("button");
    let newButtonText = document.createTextNode("X");
    newButton.setAttribute("onclick", "deleteNote(" + note.id + ");");
    starButton.setAttribute('onclick', 'toggleStarred(' + note.id + ');');
    newDiv.setAttribute("onclick", "loadToQuill(" + note.id + ");");
    pTitle.appendChild(newTitle);
    pDate.appendChild(newDate);
    pPreview.appendChild(newPreview);
    newButton.appendChild(newButtonText);
    starButton.appendChild(starButtonText);

    newDiv.appendChild(newButton);
    newDiv.appendChild(starButton);
    newDiv.appendChild(pTitle);
    newDiv.appendChild(pPreview);
    newDiv.appendChild(pDate);
    newButton.id = "btn" + note.id;
    newButton.title = "Delete note";

    let currentSection = document.getElementById("notes");
    currentSection.appendChild(newDiv);
  })

}

function newNote(id) {
  let newNote = {};
  newNote.title = "Untitled " + (id + 1); // Writes note + id starting from 1 and adds +1 for every note.
  newNote.titlePreview = getTitle();
  newNote.content = quill.getContents();
  newNote.id = id;
  newNote.date = yyyymmdd();
  newNote.preview = getPreview();
  newNote.star = false;
  return newNote;
}
function yyyymmdd() {
  var x = new Date();
  var y = x.getFullYear().toString();
  var m = (x.getMonth() + 1).toString();
  var d = x.getDate().toString();
  if (d.length == 1) {
    d = "0" + d;
  }
  if (m.length == 1) {
    m = "0" + m;
  }
  // (m.length == 1) && (m = '0' + m);
  var yyyymmdd = y + "-" + m + "-" + d;
  return yyyymmdd;
}

function getPreview() {
  let preview = quill.getContents().ops[0].insert;
  // preview = preview.toString();
  preview = preview.trim();
  let slice = preview.substring(0, 20) + "...";
  return slice;
}

function getTitle() {
  let title = document.getElementById("title").value;
  title = title.substring(0, 25);
  return title;
}

document.getElementById("doPrint").addEventListener("click", function () {
  var printContents = document.getElementById("editor").innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  updateView();
});
//LOAD DIFFERENT TEMPLATES
function loadTemplate1() {
  let content = quill.setContents({
    ops: [{ "attributes": { "bold": true }, "insert": "Hur man gör en schysst sallad!" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "attributes": { "italic": true }, "insert": "Recept:" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "attributes": { "italic": true }, "insert": "Gurka" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "attributes": { "italic": true }, "insert": "Tomat" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "attributes": { "italic": true }, "insert": "Sallad" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "attributes": { "italic": true }, "insert": "Paprika" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "attributes": { "header": 3 }, "insert": "\n" }, { "attributes": { "italic": true }, "insert": "Tillagning:" }, { "attributes": { "header": 3 }, "insert": "\n" }, { "insert": "Hacka grönsakerna" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Blanda ihop i skål" }, { "attributes": { "list": "ordered" }, "insert": "\n" }]
  });
  updateView()
  return;
}
function loadTemplate2() {
  let content = quill.setContents({
    ops: [{ "attributes": { "italic": true }, "insert": "JAAAAAAAAAAAA" }, { "attributes": { "header": 3 }, "insert": "\n" }, { "attributes": { "italic": true, "bold": true }, "insert": "Heter" }, { "insert": "\nDAVID BERG" }, { "attributes": { "header": 1 }, "insert": "\n" }]
  });
  updateView()
  return;
}
function loadTemplate3() {
  let content = quill.setContents({
    ops: [{ "insert": "Bästa filmtipsen:" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "Avatar" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Pearl Harbour" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Jurassic park" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Alien" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "\n\n\n" }, { "attributes": { "italic": true }, "insert": "Vem vet mest?" }, { "insert": "\n" }, { "attributes": { "bold": true }, "insert": "Albert Einstein" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "attributes": { "bold": true }, "insert": "David Berg" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "attributes": { "bold": true }, "insert": "Donald Trump" }, { "attributes": { "italic": true }, "insert": "\t" }, { "attributes": { "list": "ordered" }, "insert": "\n" }]
  });
  updateView()
  return;
}
//DELETE ALL NOTES
document.getElementById("nuke-all").addEventListener("click", function (id) {
  message = confirm("Are you sure you want to delete all notes?");
  if (message == true) {
    localStorage.removeItem("myNotes", JSON.stringify([]));
    console.log("Nuked all notes");
    updateView()
  } else {
    console.log("Cancel");
  }
});
// DROPDOWN FUNCTIONS
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}



function searchContent(searchTerm) {
  let searchList = loadNotes();
  let searchHits = [];

  if (searchTerm === undefined) {
    return searchList; //If seach is called with an empty search term
  }
  else {
    searchTerm = searchTerm.toLowerCase();

    for (let i = 0; i < searchList.length; i++) {
      //search in content and title
      for (let j = 0; j < searchList[i].content.ops.length; j++) {
        if (searchList[i].content.ops[j].insert.toLowerCase().includes(searchTerm)) {
          searchHits.push(searchList[i]);
          break;
        }
        
      }
      // if ((searchList[i].content.ops[0].insert).toLowerCase().includes(searchTerm) || searchList[i].title.toLowerCase().includes(searchTerm)) {
      //   searchHits.push(searchList[i]); //Add to array of hits
      // }
    }
    //console.log(searchHits);
    return searchHits;
  }
}

//Tagstring formatting:  -:exclude | Ex. Input: "todo,-css" Result: Display all notes tagged 'todo', excluding those tagged 'css'
//Char ',' is used for splitting and defining new tags
function searchTags(tagString) {
  let searchList = loadNotes();

  let inclusions = [];
  let exclusions = [];

  if (tagString === undefined) {
    return searchList; //If search is called with an empty search term
  }
  else {
    tagString = tagString.split(",");

    inclusions = tagString.filter(tag => !tag.startsWith("-"));
    exclusions = tagString.filter(tag => tag.startsWith("-"));



    console.log(allTags);
  }


}
