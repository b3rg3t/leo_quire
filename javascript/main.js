
let modal = document.getElementById('landingpage');

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
  else if (document.getElementsByClassName('show')) {
  }
}

var toolbarOptions = [
   [ "bold","italic","underline", "strike"],
   [ "blockquote", "code-block"],
   [{ "header": [1,2,3,4,5,6, false] }],
   [{ "list": "ordered"}, {"list": "bullet"}],
   [{ "script": "sub"}, {"script": "super"}],
   [{ "indent": "-1"}, {"indent": "-1"}],
   [{ "direction": "rtl" }],
   [{ "size": ["small", false, "large", "huge"] }],
   [ "link", "image", "video", "formula" ],
   [{ "color": []}, {"background": [] }],
   [{ "font": [] }],
   [{ "align":[] }]

];

var quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow'
});

window.addEventListener("load",function(){
    cookieCheck();

    

})

function loadToQuill()
{
    quill.setContents(JSON.parse())
}

function addNote()
{
    let tempStorage = loadNotes();
    tempStorage.push(newNote(tempStorage));
    saveNotes(tempStorage);
    console.log(tempStorage);
    
}

function getFreeId()
{

}

function saveNotes(notes) 
{

    console.log(quill.getContents());
    console.log(JSON.stringify(quill.getContents()));

    localStorage.setItem('myNotes', JSON.stringify(notes));
}

function loadNotes()
{
    return JSON.parse(localStorage.getItem('myNotes') ? localStorage.getItem('myNotes') : '[]');
}

function newNote(/*id*/)
{
    let note = {};
    note.title = "New note";
    note.content = quill.getContents();
    //note.id = id;
    return note;
}

function cookieCheck()
{
    if (localStorage.cookieCheck == null) {
        localStorage.cookieCheck = true;
        console.log("localStorage Cookie was set!");

        document.getElementById('landingpage').style.display='block';
    }
    else{
        console.log("LocalStorage Cookie exists, will not display landingpage!")
        return;
    }
}

