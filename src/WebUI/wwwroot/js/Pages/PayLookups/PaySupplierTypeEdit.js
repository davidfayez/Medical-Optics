$().ready(function () {
    //var url = window.location.pathname;
    //var id = url.substring(url.lastIndexOf('/') + 1);

    if (!$('#isActive').is(':checked'))
        $(".isActive").removeAttr('disabled');

    $('#DefBranches').change(function () {

        //$("#FK_DefCurrencyId").data("kendoDropDownList").value("0");
        //$("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierClassId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.read();

        //$("#FK_PaySupplierCategoryId").data("kendoDropDownList").value("0");
        //$("#FK_PaySupplierCategoryId").data("kendoDropDownList").dataSource.read();

        //$("#FK_RepresentativeId").data("kendoDropDownList").value("0");
        //$("#FK_RepresentativeId").data("kendoDropDownList").dataSource.read();

        //$("#FK_GlAccountId").val(0);
        //$("#FK_GlAccountId").data("kendoDropDownList").value("0");
        //$("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();

        //$("#FK_BrokerAccountId").val(0);
        //$("#FK_BrokerAccountId").data("kendoDropDownList").value("0");
        //$("#FK_BrokerAccountId").data("kendoDropDownList").dataSource.read();
    });

    //$("#FK_DefCurrencyId").kendoDropDownList({
    //    filter: "contains",
    //    height: 300,
    //    dataTextField: "codeAndName",
    //    dataValueField: "id",
    //    dataSource: {
    //        type: "json",
    //        //serverFiltering: true,
    //        transport: {
    //            read: {
    //                url: "/DefCurrency/GetAllCurrenciesForDDList",
    //            },
    //            parameterMap: function (data, action) {

    //                if (action === "read") {
    //                    return {
    //                        fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
    //                    };


    //                } else {
    //                    return data;
    //                }
    //            }
    //        }
    //    },

    //});

    $("#FK_PaySupplierClassId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllSupplierClassForDDList",
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



    //$("#FK_RepresentativeId").kendoDropDownList({
    //    filter: "contains",
    //    height: 300,
    //    dataTextField: "codeAndName",
    //    dataValueField: "id",
    //    dataSource: {
    //        type: "json",
    //        //serverFiltering: true,
    //        transport: {
    //            read: {
    //                url: "/HrEmployee/GetAllEmployeeForDDList",
    //            },
    //            parameterMap: function (data, action) {

    //                if (action === "read") {
    //                    return {
    //                        fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
    //                    };


    //                } else {
    //                    return data;
    //                }
    //            }
    //        }
    //    },

    //});

    ////Account
    //$("#FK_GlAccountId").kendoDropDownList({
    //    filter: "contains",
    //    height: 300,
    //    dataTextField: "codeAndName",
    //    dataValueField: "id",
    //    dataSource: {
    //        type: "json",
    //        //serverFiltering: true,
    //        transport: {
    //            read: {
    //                url: "/GlAccount/GetAllAccountsForDDList",
    //            },
    //            parameterMap: function (data, action) {
    //                debugger
    //                if (action === "read") {
    //                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
    //                        return {
    //                            code: data.filter.filters[0].value,
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    } else {
    //                        return {
    //                            code: "",
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    }

    //                } else {
    //                    return data;
    //                }
    //            }
    //        }
    //    },
    //    select: onSelectAccount
    //});
    //function onSelectAccount(e) {

    //    $("#FK_GlAccountId").val(e.dataItem.id);
    //    $("#GlAccountName").val(e.dataItem.accountNameAr);
    //}

    ////BrokerAccount
    //$("#FK_BrokerAccountId").kendoDropDownList({
    //    filter: "contains",
    //    height: 300,
    //    dataTextField: "codeAndName",
    //    dataValueField: "id",
    //    dataSource: {
    //        type: "json",
    //        //serverFiltering: true,
    //        transport: {
    //            read: {
    //                url: "/GlAccount/GetAllAccountsForDDList",
    //            },
    //            parameterMap: function (data, action) {
    //                debugger
    //                if (action === "read") {
    //                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
    //                        return {
    //                            code: data.filter.filters[0].value,
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    } else {
    //                        return {
    //                            code: "",
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    }

    //                } else {
    //                    return data;
    //                }
    //            }
    //        }
    //    },
    //    select: onBrokerAccountSelect
    //});
    //function onBrokerAccountSelect(e) {

    //    $("#FK_BrokerAccountId").val(e.dataItem.id);
    //    $("#BrokerAccountName").val(e.dataItem.accountNameAr);

    //}

    $("#btnEdit").click(function () {
        debugger;
        if ($("#FK_PaySupplierClassId").val() != "0")
            $("#FK_PaySupplierClassIdValid").text("")
        else
            $("#FK_PaySupplierClassIdValid").text(Resources.Required)

        //if ($("#FK_PaySupplierCategoryId").val() > 0)
        //    $("#FK_PaySupplierCategoryIdValid").text("0")
        //else
        //    $("#FK_PaySupplierCategoryIdValid").text(Resources.Required)

        //if ($("#FK_RepresentativeId").val() > 0)
        //    $("#FK_RepresentativeIdValid").text("0")
        //else
        //    $("#FK_RepresentativeIdValid").text(Resources.Required)

        //if ($("#FK_DefCurrencyId").val() > 0)
        //    $("#FK_DefCurrencyIdValid").text("0")
        //else
        //    $("#FK_DefCurrencyIdValid").text(Resources.Required)

        //if ($("#FK_GlAccountId").val() > 0)
        //    $("#FK_GlAccountIdValid").text("0")
        //else
        //    $("#FK_GlAccountIdValid").text(Resources.Required)



        if ($("#mainFormEdit").valid() && $("#FK_PaySupplierClassId").val() != "0")
            $("#mainFormEdit").submit();
        else
            e.preventDefault();

    });

});
function removePaySupplierType(id) {
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
                url: "/PayLookups/DeleteSupplierType?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {

                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/PayLookups/IndexSupplierType'
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
$("input[name='IsActive']").on('click', function () {
    if ($("input[name='IsActive']:checked").val() == "true") {
        $(".isActive").attr("disabled", "disabled");
        $(".isActive").val(null);
        $("#frezzingReasonBtn").attr("disabled", "disabled");

    }
    else {
        $(".isActive").removeAttr('disabled');
        $(".isActive").val(null);
        $("#frezzingReasonBtn").removeAttr("disabled");

    }

});
