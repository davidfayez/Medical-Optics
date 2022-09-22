var EmpId = 0;
function setImage(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgEmployee");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}

function setEmpImageCropped(e) {
    debugger

    // extract content type and base64 payload from original string

    //var str = myfile.original.base64;
    //var pos = str.indexOf(';base64,');
    //var type = str.substring(5, pos);
    //var b64 = str.substr(pos + 8);

    //// decode base64
    //var imageContent = atob(b64);
    ///*  $('#EmployeeImage').val(imageContent); */
    //// create an ArrayBuffer and a view (as unsigned 8-bit)
    //var buffer = new ArrayBuffer(imageContent.length);
    //var view = new Uint8Array(buffer);

    //// fill the view, using the decoded base64
    //for (var n = 0; n < imageContent.length; n++) {
    //    view[n] = imageContent.charCodeAt(n);
    //}

    //// convert ArrayBuffer to Blob
    //var blob = new Blob([buffer], { type: type });
    //var file = new File([blob], myfile.original.filename, {
    //    type: type
    //});
    var file = dataURLtoFile(myfile.original.base64, myfile.original.filename);

    var selectedFile = file;
    var reader = new FileReader();

    var imgtag = document.getElementById("imgEmployee");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}


function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

function setImageSignature(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("sigEmployee");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}

function setMedicalCardImage(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("InsuranceCardImage");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}

function removeEmployee(id) {

    swal({
        title: Resources.DeleteResource,
        text: Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText: Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/HrEmployee/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/HrEmployee/Index'
                        });
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                },
                error: function (err, xqr, txt) { }
            });

        }, 3000);
    });
}

function setEmpMeicalImage(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("empMedicalCardImg");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}

window.onbeforeunload = function () {
    var id = $('#EmployeeId').val();
    // this.EmpId = $('#EmployeeId').val();
    //alert(id);
    //localStorage.setItem("EmpId", $('#EmployeeId').val());
    // ...
}

window.onload = function () {
    debugger;
    this.EmpId = $('#EmployeeId').val();
    //alert(Emp);
    //alert(this.EmpId);
    //var EmpId = localStorage.getItem("EmpId");
    //if (EmpId !== null) {
    //    $('#EmployeeId').val(EmpId);
    //    alert(EmpId);
    //}

    // ...
}