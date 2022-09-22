function setManufacturerImage(e) {
    debugger
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgManufacturer");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}

function setManufactCountryImage(e) {
    debugger
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgCountryImage");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}
function setItemImage(e) {
    debugger
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgItemImage");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}