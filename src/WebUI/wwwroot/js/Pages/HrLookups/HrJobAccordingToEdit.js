﻿$(document).ready(function () {


  
})

function removeJobAccordingTo(id) {


    swal({
        title: Resources.DeleteResource,
        text:  Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText:  Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/HrLookups/DeleteHrJobAccordingTo?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        //grid.refresh();
                        //grid.dataSource.filter(filters);
                        swal({
                            title: Resources.DeleteSuccessResource   ,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "../../HrLookups/IndexHrJobAccordingTo";
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource    ,
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