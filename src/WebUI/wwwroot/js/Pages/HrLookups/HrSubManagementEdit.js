$(document).ready(function () {



    $('#DefBranches').change(function () {

        $("#FK_HrMainManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrMainManagementId").data("kendoDropDownList").value(0);

    });
    //Account

    $("#FK_HrMainManagementId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrMainManagementForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    $("#btnSubmit").on('click', function () {
        
        if ($("#FK_HrMainManagementId").val() == 0)
            $("#mainManagementIdValidation").show();
        else
            $("#mainManagementIdValidation").hide();



        if ($("#mainForm").valid() && $("#FK_HrMainManagementId").val() > 0) {
            $("#mainForm").submit();
        }
    });

})

function removeSubManagement(id) {


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
                url: "/HrLookups/DeleteHrSubManagement?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        //grid.refresh();
                        //grid.dataSource.filter(filters);
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "../../HrLookups/IndexHrSubManagement";
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
