var EmpId = 0;
function setImage(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgCard");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}
function setImageResidence(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgResidence");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}
