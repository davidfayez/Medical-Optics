
$(document).ready(function () {
    $('#DefBranches').change(function () {

        $("#FK_HrEvaluationFormId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEvaluationFormId").data("kendoDropDownList").value(0);

    });

    $("#FK_HrEvaluationFormId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "formNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEvaluationForm/GetAllEvaluationFormForDDList",
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

function removeHrEvaluationItem(id) {

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
                url: "/HrEvaluationFormItem/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                                window.location.href = '/HrEvaluationFormItem/Index'
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

$("#btnSubmit").on('click', function () {

    if ($("#FK_HrEvaluationFormId").val() == 0)
        $("#FK_HrEvaluationFormIdValidation").show();
    else
        $("#FK_HrEvaluationFormIdValidation").hide();

    if ($("#mainForm").valid() && $("#FK_HrEvaluationFormId").val() > 0) {
        $("#mainForm").submit();
    }
});