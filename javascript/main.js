// LANDING PAGE
// Show/not show landing page

let landingModal = document.getElementById("landing-page");

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

//Statistics modal page
// Get the modal
let statsModal = document.getElementById("stats-page");

// Get the button that opens the modal
let statsButton = document.getElementById("stats");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("stats-xMark")[0];

// When the user clicks the button, open the modal
statsButton.onclick = function() {
  // document.getElementById("notes-counter").innerHTML = loadNotes().length;
  statsModal.style.display = "block";

  animateValue("notes-counter", 0, loadNotes().length, 2000);
  animateValue("counter", 0, numberOfWords, 2000);
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  statsModal.style.display = "none";
};

document.onclick = function(event) {
  if (event.target == landingModal) {
    landingModal.style.display = "none";
  } else if (event.target == statsModal) {
    statsModal.style.display = "none";
  }
};


// QUILL OPTIONS
//rubriker, punktlistor, numrerade listor samt göra text kursiv eller fetstil.
var toolbarOptions = [
  ["bold", "italic"],
  [{ header: [1, 2, 3, false] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  [{ color: [] }, { background: [] }],
  // [{ 'font': [] }],
  [{ align: [] }]
];

// Loads content from the Quill editor
window.onload = function() {
  //Setting Event Listeners
  document.getElementById("search-bar").addEventListener("input", function() {
    updateView();
  });

  document.getElementById("tag-search").addEventListener("change", function() {
    this.checked
      ? (document.getElementById("search-bar").placeholder = "Ex: work,-boring")
      : (document.getElementById("search-bar").placeholder = "Search..");
  });

  cookieCheck();
  updateView();

  if (loadNotes().length > 0) {
    loadToQuill(getActiveId());
  }
};

document.getElementById("checkStarred").addEventListener("click", function() {
  if (document.getElementById("checkStarred").checked) {
    updateView(note => note.star == true);
    console.log("Showing starred items");
  } else {
    updateView();
  }
});
document.getElementById("checkStarred1").addEventListener("click", function() {
  if (document.getElementById("checkStarred1").checked) {
    updateView(note => note.star == true);
    console.log("Showing starred items");
  } else {
    updateView();
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
  document.getElementById("title").value = tempStorage.find(
    loadNote => loadNote.id == id
  ).title;
  document.getElementById("tag-input").value = tempStorage.find(
    loadNote => loadNote.id == id
  ).tagsPresplit;

  for (let i = 0; i < getTemplates().length; i++) {
    if (
      document
        .getElementsByClassName("ql-editor")[0]
        .classList.contains(getTemplates()[i])
    ) {
      document
        .getElementsByClassName("ql-editor")[0]
        .classList.remove(getTemplates()[i]);
    }
  }
  document
    .getElementsByClassName("ql-editor")[0]
    .classList.add(tempStorage.find(loadNote => loadNote.id == id).template);
  toggleDIV();
}


function addNote() {
  let tempStorage = loadNotes(); // Loads array from loadNotes()
  let freeID = getAvailID(tempStorage);
  setActiveId(freeID);

  tempStorage.push(newNote(freeID)); // Adds a new note at the end of the array.
  saveNotes(tempStorage); // Overwrites localStorage with tempStorage content
  loadToQuill(getActiveId());
  quill.setContents("");
  document.getElementById("tag-input").value = "untagged";

  toggleDIV();
  saveNote();
  updateView();
  console.log(loadNotes());
}
document
  .getElementsByClassName("save-note")[0]
  .addEventListener("click", function() {
    saveNote();
    toggleDIV();
  });
document
  .getElementsByClassName("save-note")[1]
  .addEventListener("click", function() {
    saveNote();
    toggleDIV();
  });
function saveNote(myTemplate) {
  let tempStorage = loadNotes();
  console.log("calld save note");
  if (loadNotes().length == 0) {
    //temp workaround for saving without adding a note todo: make simpler solution //jesper
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
  if (tempStorage.length == 0) {
    //bypass addNote wipe (temp)
    tempStorage = loadNotes();
    //todo: don't need to use find every time //jesper
    tempStorage.find(loadNote => loadNote.id == id).title = tempTitle;
    tempStorage.find(loadNote => loadNote.id == id).content = tempContent;
    tempStorage.find(loadNote => loadNote.id == id).preview = tempPreview;
    tempStorage.find(
      loadNote => loadNote.id == id
    ).titlePreview = tempTitlePreview;
    tempStorage.find(loadNote => loadNote.id == id).tagsPresplit = tempTags;
    tempStorage.find(loadNote => loadNote.id == id).tags = tempStorage
      .find(loadNote => loadNote.id == id)
      .tagsPresplit.split(",");
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
    tempStorage.find(
      loadNote => loadNote.id == id
    ).tagsPresplit = document.getElementById("tag-input").value;
    tempStorage.find(loadNote => loadNote.id == id).tags = tempStorage
      .find(loadNote => loadNote.id == id)
      .tagsPresplit.split(",");
    if (myTemplate != undefined) {
      tempStorage.find(loadNote => loadNote.id == id).template = myTemplate;
    }
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
  } else if (
    notes[deletedIndex + 1] == undefined &&
    notes[deletedIndex - 1] == undefined
  ) {
    //If all notes were deleted
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

  const updatedObj = {
    ...notes[objIndex],
    star: notes[objIndex].star ? false : true
  };

  const updatedNotes = [
    ...notes.slice(0, objIndex),
    updatedObj,
    ...notes.slice(objIndex + 1)
  ];
  saveNotes(updatedNotes);
  updateView();
}

// Adds and checks the length of an array. If the length is over 0 - find the highest id. Return id +1.
const getAvailID = noteArray =>
  noteArray.length > 0 ? Math.max(...noteArray.map(note => note.id), 0) + 1 : 0;

function updateView(func = () => true) {
  let searchBar = document.getElementById("search-bar").value;
  let notes = [];
  if (document.getElementById("tag-search").checked) {
    notes = searchTags(searchBar);
    console.log("searching by tags");
  } else {
    notes = searchContent(searchBar);
    console.log("searching by content");
  }
  document.getElementById("notes").innerHTML = ""; //Empty base for created content
  // Generates content in saved notes area
  notes
    .filter(note => func(note))
    .forEach(note => {
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
      let starButtonText = document.createTextNode("");
      note.star
        ? starButton.setAttribute("class", "fas fa-star")
        : starButton.setAttribute("class", "far fa-star");
      note.star
        ? starButton.classList.add("test-star")
        : starButton.classList.remove("test-star");

      let newButton = document.createElement("button");
      let newButtonText = document.createTextNode("");
      newButton.setAttribute("class", "far fa-trash-alt");
      newButton.setAttribute("onclick", "deleteNote(" + note.id + ");");
      starButton.setAttribute("onclick", "toggleStarred(" + note.id + ");");
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
      newButton.title = "Delete Note";
      starButton.title = "Select Favorite";
      let currentSection = document.getElementById("notes");
      currentSection.appendChild(newDiv);
    });
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
  newNote.template = setTemplate(1);
  return newNote;
}

function setTemplate(templateNumber) {
  let newTemplate = "";

  if (getTemplates()[templateNumber - 1] != undefined) {
    newTemplate = getTemplates()[templateNumber - 1];
  } else {
    console.log("The template you tried to load doesn't exist!");
  }

  return newTemplate;
}

function getTemplates() {
  let templates = ["template1", "template2", "template3"];

  return templates;
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

document.getElementById("doPrint").addEventListener("click", function() {
  window.print();
});

document.getElementById("doPrintm").addEventListener("click", function() {
  window.print();
});
//LOAD DIFFERENT TEMPLATES
// ANCHORS
var stand = document.getElementById("standard");
var green = document.getElementById("green");
var blue = document.getElementById("blue");

// EVENT LISTENERS
stand.addEventListener("click", function() {
  document.getElementById("drop").value = "Template 1";
  saveNote(setTemplate(1));
  loadToQuill(getActiveId());
});
green.addEventListener("click", function() {
  document.getElementById("drop").value = "Template 2";
  saveNote(setTemplate(3));
  loadToQuill(getActiveId());
});
blue.addEventListener("click", function() {
  document.getElementById("drop").value = "Template 3";
  saveNote(setTemplate(2));
  loadToQuill(getActiveId());
});

function defaultTemplate() {
  document.getElementById("drop").value = "Template";
  document.getElementsByClassName("ql-editor")[0].classList.remove("template2");
  document.getElementsByClassName("ql-editor")[0].classList.remove("template3");
  document.getElementsByClassName("ql-editor")[0].classList.remove("template1");
}
//DELETE ALL NOTES
document.getElementById("nuke-all").addEventListener("click", function(id) {
  message = confirm("Are you sure you want to delete all notes?");
  if (message == true) {
    localStorage.removeItem("myNotes");
    console.log("Nuked all notes");
    updateView();
  } else {
    console.log("Cancel");
  }
});
// DROPDOWN FUNCTIONS
function myDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}
window.onclick = function(event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};
function myHamburger() {
  console.log("hej");
  document.getElementsByClassName("myHam")[0].classList.toggle("show");
  document.getElementsByClassName("myHam")[1].classList.toggle("show");
}

function searchContent(searchTerm) {
  let searchList = loadNotes();
  let searchHits = [];

  if (searchTerm === undefined) {
    return searchList; //If seach is called with an empty search term
  } else {
    searchTerm = searchTerm.toLowerCase();

    for (let i = 0; i < searchList.length; i++) {
      //search in content and title
      for (let j = 0; j < searchList[i].content.ops.length; j++) {
        if (
          searchList[i].content.ops[j].insert
            .toLowerCase()
            .includes(searchTerm) ||
          searchList[i].title.toLowerCase().includes(searchTerm)
        ) {
          searchHits.push(searchList[i]);
          break;
        }
      }
    }
    return searchHits;
  }
}

//Tagstring formatting:  -:exclude | Ex. Input: "todo,-css" Result: Display all notes tagged 'todo', excluding those tagged 'css'
//Char ',' is used for splitting and defining new tags
function searchTags(tagString) {
  let searchList = loadNotes();

  let inclusions = [];
  let exclusions = [];
  let searchHits = [];

  if (tagString === undefined) {
    return searchList; //If search is called with an empty search term
  } else {
    tagString = tagString.split(",");

    inclusions = tagString.filter(tag => !tag.startsWith("-"));
    exclusions = tagString.filter(tag => tag.startsWith("-"));

    for (let i = 0; i < exclusions.length; i++) {
      exclusions[i] = exclusions[i].replace("-", "");
    }
    console.log("inclusions " + inclusions);
    console.log("exclusions " + exclusions);
    //Creates initial array of hits
    for (let i = 0; i < searchList.length; i++) {
      for (let j = 0; j < inclusions.length; j++) {
        for (let k = 0; k < searchList[i].tags.length; k++) {
          if (searchList[i].tags[k] == inclusions[j]) {
            searchHits.push(searchList[i]);
            break;
          }
        }
      }
    }
    //removes exclusions
    for (let i = 0; i < searchHits.length; i++) {
      for (let j = 0; j < exclusions.length; j++) {
        for (let k = 0; k < searchHits[i].tags.length; k++) {
          if (searchList[i].tags[k] == exclusions[j]) {
            searchHits.splice(i, 1);
            break;
          }
        }
      }
    }

    if (searchHits.length > 0) {
      return searchHits;
    } else {
      return searchList;
    }
  }
}
//Google charts
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  let currentDate = "";
  let dateCount = [];
  let uniqueDates = [];
  let tempStorage = loadNotes();

  for (let i = 0; i < tempStorage.length; i++) {
    if (tempStorage[i].date != currentDate) {
      dateCount.push(1);
      uniqueDates.push(tempStorage[i].date);
      currentDate = tempStorage[i].date;
    } else {
      dateCount[dateCount.length - 1]++;
    }
  }
  console.log(dateCount);
  console.log(uniqueDates);

  let formattedDate = [];
  for (let i = 0; i < uniqueDates.length; i++) {
    formattedDate.push([uniqueDates[i], [dateCount[i]]]);
  }
  console.log(formattedDate);

  let dataArray = [
    [
      { label: "Date", id: "date" },
      {
        label: "Number of Notes",
        id: localStorage.getItem("myNotes"),
        type: "number"
      }
    ]
  ];

  dataArray.splice(1, 0, ...formattedDate);
  console.log("dataArrays " + dataArray);

  let data = google.visualization.arrayToDataTable(dataArray);

  var options = {
    title: "Number of Notes",
    titleTextStyle: {
      color: "black",
      fontName: "Playfair Display",
      fontSize: 20,
      bold: true,
      italic: false
    },
    width: 1135,
    height: 340,
    hAxis: {
      title: "Date"
    },
    curveType: "function",
    legend: {
      position: "bottom"
    },
    hAxis: {
      showTextEvery: 1,
      textStyle: {
        fontName: "Playfair Display",
        fontSize: 16,
        bold: true
      }
    },
    vAxis: {
      viewWindow: {
        max: 30
      },
      showTextEvery: 1,
      minValue: 1,
      maxValue: 15,
      showTextEvery: 1,
      baselineColor: "#DDD",
      textStyle: {
        fontSize: 12
      },
      animation: {
        duration: 1200,
        easing: "out",
        startup: true
      }
    }
  };
  let chart = new google.visualization.LineChart(
    document.getElementById("curve-chart")
  );

  chart.draw(data, options);
  console.log(data);
}
//Statistics page: Number of words in selected note
Quill.register("modules/counter", function(quill, options) {
  let container = document.querySelector("#counter");
  quill.on("text-change", function() {
    let text = quill.getText();
    if (quill.getText() < 1) {
      return (numberOfWords = 0);
      console.log("reached if");
    } else {
      console.log("reached else" + numberOfWords);
      return (numberOfWords = container.innerText =
        text.split(/\s+/).length - 1);
    }
  });
});


//Counter for statistics
function animateValue(id, start, end, duration) {
  // assumes integer values for start and end

  let obj = document.getElementById(id);
  let range = end - start;
  // no timer shorter than 50ms (not really visible any way)
  let minTimer = 50;
  // calc step time to show all interediate values
  let stepTime = Math.abs(Math.floor(duration / range));

  // never go below minTimer
  stepTime = Math.max(stepTime, minTimer);

  // get current time and calculate desired end time
  let startTime = new Date().getTime();
  let endTime = startTime + duration;
  let timer;

  function run() {
    let now = new Date().getTime();
    let remaining = Math.max((endTime - now) / duration, 0);
    let value = Math.round(end - remaining * range);
    obj.innerHTML = value;
    if (value == end) {
      clearInterval(timer);
    }
  }
  timer = setInterval(run, stepTime);

  document.addEventListener("click", function() {
    console.log(event.target.tagName);
  });
}

function toggleDIV() {
  document.getElementsByClassName("box3")[0].classList.toggle("show");
  document.getElementsByClassName("box2")[0].classList.toggle("none");
}


//Landing page info Event-Listeners
document.getElementById("info-link1").addEventListener("click", function(){
  setModalText("introduction");
});
document.getElementById("info-link2").addEventListener("click", function(){
  setModalText("saving & loading");
});
document.getElementById("info-link3").addEventListener("click", function(){
  setModalText("deleting notes");
});
document.getElementById("info-link4").addEventListener("click", function(){
  setModalText("tags");
});

function setModalText(info) {
  if (info =="introduction") {
    document.getElementById("text-box-text").innerHTML = "Welcome to Quire. To create a new note, press the pen icon in the sidebar. To save what you have written, press the save icon below the editor. If you come back to a note a lot it can be faster to favourite it by pressing the small star on that note to the left. Showing only favourites can be done by pressing the big star in the sidebar.";
  }
  else if (info == "saving & loading") {
    document.getElementById("text-box-text").innerHTML = "Saved notes are stored locally on your computer, and displayed in the list to the left. Pressing a note will load it into the editor."
  }
  else if (info == "deleting notes") {
    document.getElementById("text-box-text").innerHTML = "Deleting a note can be done by pressing the trashcan on that note in the list. If you want to delete all your notes click the large trashcan in the sidebar, you will be prompted with a warning. Please note that clearing browser data can delete your notes permanently; please create a backup!"
  }
  else if (info == "tags") {
    document.getElementById("text-box-text").innerHTML = "Tags can help organize notes. To add tags to a note type in the note's tag-box above the editor. To search by tag check the box below the searchbar. It supports multiple tags aswell as excluding tags. example: work,css,-boring would return notes tagged work and css as long as they dont have the tag boring."
  }
  else {
    document.getElementById("text-box-text").innerHTML = "Please contact the developers and tell them what you were trying to do."
  }
}
function getBack() {
  document.getElementsByClassName("box2")[0].classList.toggle("none");
  document.getElementsByClassName("box3")[0].classList.toggle("show");
}
var quill = new Quill("#editor", {
  modules: {
    counter: true,
    toolbar: toolbarOptions
  },
  placeholder: "Write your text here...",
  theme: "snow"
});
