
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

function localSave() 
{
    //console.log("Save was pressed.");
    console.log(quill.getContents());
    console.log(JSON.stringify(quill.getContents()));
}

window.addEventListener("load",function(){
    console.log("window loaded with listener");
    
    if (localStorage.cookieCheck == null) {
        localStorage.cookieCheck = true;
        console.log("localStorage Cookie was set!");
        //display landing page
        document.getElementById('landingpage').style.display='block';
    }
    else{
        console.log("LocalStorage Cookie exists, will not display landingpage!")
        return;
    }
})
