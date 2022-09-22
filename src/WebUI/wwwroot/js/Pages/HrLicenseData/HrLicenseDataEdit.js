$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_HrLicenseType").data("kendoDropDownList").dataSource.read();
        $("#FK_HrLicenseType").data("kendoDropDownList").value(0);

        $("#FK_HrLicensesActivityType").data("kendoDropDownList").dataSource.read();
        $("#FK_HrLicensesActivityType").data("kendoDropDownList").value(0);



    });

    $("#FK_HrLicenseType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllLicenseTypeForDDList",
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
        }
    });

    $("#FK_HrLicensesActivityType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllLicensesActivityForDDList",
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
        }
    });
  
})

function removeDocumentType(id) {


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
                url: "/HrLookups/DeleteHrDocumentType?Id=" + id,
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
                        document.location = "../../HrLookups/IndexHrDocumentType";
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

$("#btnSubmit").on('click', function () {

    if ($("#FK_HrLicenseType").val() == 0)
        $("#FK_HrLicenseTypeValidation").show();
    else
        $("#FK_HrLicenseTypeValidation").hide();

    if ($("#FK_HrLicensesActivityType").val() == 0)
        $("#FK_HrLicensesActivityTypeValidation").show();
    else
        $("#FK_HrLicensesActivityTypeValidation").hide();

    if ($("#mainForm").valid() && $("#FK_HrLicenseType").val() > 0 && $("#FK_HrLicensesActivityType").val() > 0) {
        $("#mainForm").submit();
    }
});