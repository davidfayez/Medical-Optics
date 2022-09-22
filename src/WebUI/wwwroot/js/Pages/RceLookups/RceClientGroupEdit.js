$(document).ready(function () {


    disableFreezing();
    $("#rdActive").change(function () {
        disableFreezing();
    })
    $("#rdInactive").click(function () {
        disableFreezing();
    })
    function disableFreezing() {
        var state = $("input[name='IsActive']:checked").val();
        if (state == "True") {
            $("#FK_DefFreezingReasonId").attr("disabled", "disabled");
            $("#FreezingNotes").attr("disabled", "disabled");
            $("#frezzingReasonBtn").attr("disabled", "disabled");

        } else {
            $("#FK_DefFreezingReasonId").removeAttr("disabled");
            $("#FreezingNotes").removeAttr("disabled");
            $("#frezzingReasonBtn").removeAttr("disabled");

        }
    }
    $("#FK_RceClientCategoryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",

        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientCategoryForDDList",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        }
    });
})

function removeRceClientGroup(id) {


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
                url: "/RceLookups/DeleteRceClientGroup?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "../../RceLookups/IndexRceClientGroup";
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

    //submit form if valid

    if ($("#FK_RceClientCategoryId").val() > 0)
        $("#FK_RceClientCategoryIdValidation").hide();
    else
        $("#FK_RceClientCategoryIdValidation").show();


    if ($("#formGroup").valid() && $("#FK_RceClientCategoryId").val() > 0)
        $("#formGroup").submit();
});