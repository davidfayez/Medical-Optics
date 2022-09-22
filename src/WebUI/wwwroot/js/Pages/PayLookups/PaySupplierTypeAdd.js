$().ready(function () {

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
        //$("#accountAutoComplete").data("kendoDropDownList").value("0");
        //$("#accountAutoComplete").data("kendoDropDownList").dataSource.read();

        //$("#FK_BrokerAccountId").val(0);
        //$("#BrokerAutoComplete").data("kendoDropDownList").value("0");
        //$("#BrokerAutoComplete").data("kendoDropDownList").dataSource.read();

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
    //$("#accountAutoComplete").kendoDropDownList({
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
    //$("#BrokerAutoComplete").kendoDropDownList({
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

    $("#btnSave").click(function (e) {
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



        if ($("#mainForm").valid() && $("#FK_PaySupplierClassId").val() != "0")
            $("#mainForm").submit();
        else
            e.preventDefault();


    });

});

$("input[name='IsActive']").on('click', function () {
    if ($("input[name='IsActive']:checked").val() == "true") {
        $(".isActive").attr("disabled", "disabled");
        $(".isActive").val(null);
        $("#frezzingReasonBtn").attr("disabled", "disabled");

    }
    else {
        $(".isActive").removeAttr('disabled');
        $(".isActive").val(null);
    }

});