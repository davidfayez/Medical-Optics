function removeDefDocumentTypeEdit(Id) {

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
                url: "/DefDocumentType/Delete?Id=" + Id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                                window.location.href = '/DefDocumentType/Index'
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

$(document).ready(function () {

    $("#FK_SecModuleId").kendoDropDownList({
        optionLabel: Resources.ChoseModule,
        filter: "contains",
        height: 300,
        dataTextField: "moduleNameAr",
        dataValueField: "id",

        dataSource: {
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Role/GetAllSecModules",
                }
            }
        }
    });
});

$("#btnSubmit").on('click', function () {

    //submit form if valid
    if ($("#FK_SecModuleId").val() > 0)
        $("FK_SecModuleIdValidation").hide();
    else
        $("#FK_SecModuleIdValidation").show();



    if ($("#formDocumentType").valid() && $("#FK_SecModuleId").val() > 0)
        $("#formDocumentType").submit();
});