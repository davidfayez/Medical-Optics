$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_LaborOfficeId").data("kendoDropDownList").value("0");
        $("#FK_LaborOfficeId").data("kendoDropDownList").dataSource.read();

    });

    $("#FK_LaborOfficeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllLaborOfficeForDDList",
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

    $("#btnSave").click(function (e) {
        debugger;

        if ($("#FK_LaborOfficeId").val() != "0")
            $("#FK_LaborOfficeIdValid").text("")
        else
            $("#FK_LaborOfficeIdValid").text(Resources.Required)


        if ($("#mainForm").valid() && $("#FK_LaborOfficeId").val() != "0")
            $("#mainForm").submit();
        else
            e.preventDefault();


    });
  
})

function removeInsuranceBranch(id) {


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
                url: "/HrLookups/DeleteHrInsuranceBranch?Id=" + id,
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
                        document.location = "../../HrLookups/IndexHrInsuranceBranch";
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