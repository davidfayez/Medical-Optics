$(document).ready(function () {
    $('#DefBranches').change(function () {

        $("#FK_HrEvaluationFormId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEvaluationFormId").data("kendoDropDownList").value(0);

        GetItems(0);
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
        }, select: onSelectForm
    });

    function onSelectForm(e) {
        GetItems(e.dataItem.id);
    }
    GetItems($("#FK_HrEvaluationFormId").val());
    function GetItems(fileId) {

        var url = '/HrEvaluationFormItem/GetItems?fileId=' + fileId + '&branchId=' + parseInt($("#FK_DefBranchId").val());
        var divBody = $('#sectionItems');
        divBody.load(url);
    }

})


$("#btnSubmit").on('click', function () {

    if ($("#FK_HrEvaluationFormId").val() == 0) {
        swal({
            title: Resources.FileMustBeSelected,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if ($("#FK_HrEvaluationFormId").val() > 0) {
        var itemIds = [];
        $('#tableItems tbody tr').each(function () {

            var itemId = $(this).find(".eItem").val();
            if (itemId != undefined && itemId > 0) {
                if ($('#eItem_' + itemId).is(":checked")) {
                    itemIds.push(parseInt(itemId));
                }
            }
        });
        debugger
        if (itemIds.length == 0) {
            swal({
                title: Resources.ItemsMustBeSelected,
                confirmButtonText: Resources.Done,
                type: "error"
            });
        } else {
            var obj = {
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                FileId: parseInt($("#FK_HrEvaluationFormId").val()),
                ItemsId: itemIds,
            }
            debugger
            $.ajax({
                url: '/HrEvaluationFormItem/CreateEdit',
                type: 'POST',
                data: { evaluationItems: obj },
                success: function (result) {
                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            setTimeout(function () {
                                /* document.location = "../../GlAccountOpeningBalance/Index"*/
                                window.location.href = '/HrEvaluationFormItem/Index';
                            }, 1000);
                        });

                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                }
            })

        }
    }
});







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