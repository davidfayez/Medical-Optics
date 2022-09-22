$(document).ready(function () {

    var resources = {
        accountCode: Resources.AccountCodeResource,
        accountName: Resources.AccountNameResource,
    };
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

    //Account
    $('#DefBranches').change(function () {

        $("#GlAccountName").val("");
        $("#FK_GlAccountId").data("kendoDropDownList").value(0);
        $("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();

    });

    $("#FK_GlAccountId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/GlAccount/GetAllAccountsForDDList",
                },
                parameterMap: function (data, action) {

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
        },
        select: onSelectTaxAccount
    });

    function onSelectTaxAccount(e) {

        $.ajax({
            type: "POST",
            url: "/GlAccount/IsMainAccount?id=" + e.dataItem.id,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response) {

                    $("#FK_GlAccountId").data("kendoDropDownList").value(0);
                    swal({
                        title: Resources.NoTansactionCanMadeOnMainAccounts,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                } else {
                    $("#AccountName").val(e.dataItem.accountNameAr);
                }
            }
        });
    }

})


function removePaymentType(id) {


    swal({
        title: Resources.DeleteResource,
        text:  Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText:  Resources.CancelResource ,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/PayLookups/DeletePaymentType?Id=" + id,
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
                        document.location = "../../PayLookups/IndexPaymentType";
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
    if ($("#FK_GlAccountId").val() > 0)
        $("#FK_GlAccountIdValidation").hide();
    else
        $("#FK_GlAccountIdValidation").show();

    if ($("#formPaymentType").valid() && $("#FK_GlAccountId").val() > 0)
        $("#formPaymentType").submit();
});