
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

