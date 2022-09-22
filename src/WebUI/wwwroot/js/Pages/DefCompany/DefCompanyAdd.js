$(document).ready(function () {
       
});

function setImage(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgCompany");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}