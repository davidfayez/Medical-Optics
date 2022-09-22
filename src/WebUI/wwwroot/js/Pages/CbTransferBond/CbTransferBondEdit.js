$(document).ready(function () {
    $('#DefBranches').change(function () {
        $("#FK_DefCurrencyId").data("kendoDropDownList").value("0");
        $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();

        $("#FK_GlAccountDebitId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountDebitId").data("kendoDropDownList").dataSource.read();

        $("#FK_GlAccountCreditId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountCreditId").data("kendoDropDownList").dataSource.read();
    });

    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {
        if (this.value == "True") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingNotes").val("");
        }
        else
            $(".disabled-input").removeAttr('disabled');
    });
    //Active In Edit
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == undefined) {
        $(".disabled-input").removeAttr('disabled');
    }


    //Edit Currency Factor
    var currencyFactorVal = $("#CurrencyFactor").val();
    if (currencyFactorVal == 1)
        $('#CurrencyFactor').attr('readonly', true);
    else
        $('#CurrencyFactor').attr('readonly', false);


    //Account Debit DdlTree
    //dataSourceDebitDdlTree = new kendo.data.HierarchicalDataSource({
    //    transport: {
    //        read: {
    //            url: "/CbCashAndBankAccount/GetAllAccountsForDDLTree",
    //            Type: "GET"
    //        },
    //        parameterMap: function (data, action) {

    //            if (action === "read") {
    //                return {
    //                    id: data.id,
    //                    defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                };
    //            } else {
    //                return data;
    //            }
    //        }
    //    },
    //    schema: {
    //        model: {
    //            id: "id",
    //            hasChildren: "hasChildren"
    //        }
    //    }
    //});

    //$("#FK_GlAccountDebitId").kendoDropDownTree({
    //    placeholder: Resources.Choose,
    //    dataSource: dataSourceDebitDdlTree,
    //    height: 300,
    //    dataTextField: "accountNameAr",
    //    dataValueField: "id",
    //    //checkboxes: true,
    //    //checkAll: true,
    //    autoClose: false
    //});

    //Account Credit DdlTree
    //dataSourceCreditDdlTree = new kendo.data.HierarchicalDataSource({
    //    transport: {
    //        read: {
    //            url: "/CbCashAndBankAccount/GetAllAccountsForDDLTree",
    //            Type: "GET"
    //        },
    //        parameterMap: function (data, action) {

    //            if (action === "read") {
    //                return {
    //                    id: data.id,
    //                    defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                };
    //            } else {
    //                return data;
    //            }
    //        }
    //    },
    //    schema: {
    //        model: {
    //            id: "id",
    //            hasChildren: "hasChildren"
    //        }
    //    }
    //});

    //$("#FK_GlAccountCreditId").kendoDropDownTree({
    //    placeholder: Resources.Choose,
    //    dataSource: dataSourceCreditDdlTree,
    //    height: 300,
    //    dataTextField: "accountNameAr",
    //    dataValueField: "id",
    //    //checkboxes: true,
    //    //checkAll: true,
    //    autoClose: false
    //});

    //cash Bank AutoComplete
    //var CashAndBankAccountDebitDataSource = new kendo.data.DataSource({

    //    serverFiltering: true,
    //    type: "json",
    //    transport: {
    //        read: {
    //            url: "/CbCashAndBankAccount/GetAllAutoCompleteSearchByCode"
    //        },
    //        parameterMap: function (data, action) {
    //            if (action === "read") {
    //                return {
    //                    code: data.filter.filters[0].value
    //                };
    //            } else {
    //                return data;
    //            }
    //        }
    //    }
    //    ,
    //    schema: {
    //        model: {
    //            id: "id",
    //            fields: {

    //                accountCode: {
    //                    type: "string"
    //                }
    //            }
    //        }
    //    }
    //});
    //$("#CashAndBankAccountDebitAutoComplete").kendoAutoComplete({

    //    dataSource: CashAndBankAccountDebitDataSource,
    //    select: onCashDebitSelect,
    //    change: onCashDebitChange,
    //    headerTemplate: '<div class="dropdown-header k-widget k-header">' +
    //        '<span style="margin-left:100px">' + Resources.AccountCodeResource + ' </span>' +
    //        '<span>' + Resources.AccountNameResource + '</span>' +

    //        '</div>',
    //    template: '<span style="margin-left:100px">#: data.accountCode #</span>' +
    //        '<span>#: data.accountNameAr #</span>',
    //    dataTextField: "accountCode",
    //    dataValueField: "id",
    //    filter: "contains",
    //    minLength: 1,
    //    placeholder: Resources.AutocompleateChoose
    //});

    ////Account AutoComplete
    //var CashAndBankAccountCreditDataSource = new kendo.data.DataSource({

    //    serverFiltering: true,
    //    type: "json",
    //    transport: {
    //        read: {
    //            url: "/CbCashAndBankAccount/GetAllAutoCompleteSearchByCode"
    //        },
    //        parameterMap: function (data, action) {
    //            if (action === "read") {
    //                return {
    //                    code: data.filter.filters[0].value
    //                };
    //            } else {
    //                return data;
    //            }
    //        }
    //    }
    //    ,
    //    schema: {
    //        model: {
    //            id: "id",
    //            fields: {

    //                accountCode: {
    //                    type: "string"
    //                }
    //            }
    //        }
    //    }
    //});
    //$("#CashAndBankAccountCreditAutoComplete").kendoAutoComplete({

    //    dataSource: CashAndBankAccountCreditDataSource,
    //    select: onCashCreditSelect,
    //    change: onCashCreditChange,
    //    headerTemplate: '<div class="dropdown-header k-widget k-header">' +
    //        '<span style="margin-left:100px">' + Resources.AccountCodeResource + ' </span>' +
    //        '<span>' + Resources.AccountNameResource + '</span>' +

    //        '</div>',
    //    template: '<span style="margin-left:100px">#: data.accountCode #</span>' +
    //        '<span>#: data.accountNameAr #</span>',
    //    dataTextField: "accountCode",
    //    dataValueField: "id",
    //    filter: "contains",
    //    minLength: 1,
    //    placeholder: Resources.AutocompleateChoose
    //});

    //Currency Factor
    $("#FK_DefCurrencyId").change(function (e) {
        var BondDate = $("#BondDate").val();
        var voucherDate = new Date($("#BondDate").val());
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + BondDate /*voucherDate.toUTCString()*/,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
                if (data.hasOwnProperty("factor")) {
                    $("#CurrencyFactor").val(data.factor);
                    $('#CurrencyFactor').attr('readonly', false);
                }
                else {
                    $("#CurrencyFactor").val(data.defaultFactor);
                    if (data.isPimary == true)
                        $('#CurrencyFactor').attr('readonly', true);
                    else
                        $('#CurrencyFactor').attr('readonly', false);
                }
            }
        });
    })

    $("#FK_DefCurrencyId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCurrency/GetAllCurrenciesForDDList",
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
        change: onSelectCurrency

    });
    function onSelectCurrency(e) {
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/CbExchangeBond/GetCurrncyDefaultFactor?id=" + DefcurrencyId,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger
                if (data.isPimary) {
                    $("#CurrencyFactor").val(data.defaultFactor);
                    $("#CurrencyFactor").attr('readonly', true);
                } else {
                    $("#CurrencyFactor").val(data.defaultFactor);
                    $("#CurrencyFactor").attr('readonly', false);
                }
            }
        });
    }
    $("#FK_CbPayTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbTransferBond/GetAllCbPayTypeForDDList",
                },

            }
        },
        select: OnSelectCbPayType
    });
    //Pay Type
    function OnSelectCbPayType(e) {

        var id = e.dataItem.id;
        if (id == 2)
            $("#Check").show();
        else
            $("#Check").hide();
    }
    //Edit Pay Type
    var PayTypeId = $("#FK_CbPayTypeId").data("kendoDropDownList").value();
    if (PayTypeId == "2")
        $("#Check").show();
    else
        $("#Check").hide();

    $("#FK_GlAccountDebitId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",//GetAllAccountsForDDLTree",
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
        },
        // select: onCashAndBankSelect
    });
    $("#FK_GlAccountCreditId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",//GetAllAccountsForDDLTree",
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
        },
        // select: onCashAndBankSelect
    });
    //$("#FK_CbPayTypeId").change(function (e) {
    //    debugger;
    //    var id = $("#FK_CbPayTypeId").val();
    //    if (id == 2)
    //        $("#Check").show();
    //    else
    //        $("#Check").hide();


    //});

    $("#btnEdit").click(function () {
        var openedPeriodCount = 0;
        $.ajax({
            url: "/GlFinancialPeriod/GetOpenPeriodsCount",
            type: "Get",
            contentType: false,
            processData: false,
            success: function (result) {

                openedPeriodCount = result;
                $.ajax({
                    url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + $("#BondDate").val(),
                    type: "Get",
                    contentType: false,
                    processData: false,
                    success: function (result) {

                        if (result && openedPeriodCount > 1) {
                            swal({
                                title: Resources.WarningResource,
                                text: Resources.ThereIsMoreThanOneFinancialPeriodOpen,
                                type: "info",
                                showCancelButton: true,
                                confirmButtonText: Resources.ContinueResource,
                                cancelButtonText: Resources.CancelResource,
                                closeOnConfirm: true,
                                showLoaderOnConfirm: true
                            }, function () {
                                setTimeout(function () {
                                    SaveTransferBondEdit();
                                }, 3000);
                            });
                        }
                        else if (!result) {
                            swal({
                                title: Resources.BondDateOutsideOpenPeriods,
                                confirmButtonText: Resources.CancelResource,
                                type: "error"
                            }, function () {
                            });

                        } else {
                            SaveTransferBondEdit();
                        }
                    }
                });
            }
        });
       

    });
    function SaveTransferBondEdit() {
        var FK_GlAccountDebitId = $("#FK_GlAccountDebitId").data("kendoDropDownList").value();
        if (FK_GlAccountDebitId == "0")
            $("#GlAccountDebitId").text(Resources.Required)
        else
            $("#GlAccountDebitId").text("")

        var FK_GlAccountCreditId = $("#FK_GlAccountCreditId").data("kendoDropDownList").value();

        if (FK_GlAccountCreditId == "0")
            $("#GlAccountCreditId").text(Resources.Required)
        else
            $("#GlAccountCreditId").text("");

        var FK_DefCurrencyId = $("#FK_DefCurrencyId").data("kendoDropDownList").value();

        if (FK_DefCurrencyId == "0")
            $("#DefCurrencyIdValidation").text(Resources.Required)
        else
            $("#DefCurrencyIdValidation").text("");


        if ($("#mainForm").valid() && FK_GlAccountDebitId != "0" && FK_GlAccountCreditId != "0" && FK_DefCurrencyId != "0")
            $("#mainForm").submit();

    }
});

function GetNextSerial() {

    $.ajax({
        url: "/CbTransferBond/GetNextSerial?branchId=" + parseInt($("#FK_DefBranchId").val()),
        type: "Get",
        contentType: false,
        processData: false,
        success: function (result) {

            if (result > 0) {
                $("#Serial").val(result);
            }
        }
    });
}

function onCashDebitSelect(e) {
    debugger;
    var item = e.dataItem;
    $("#FK_CbCashAndBankAccountDebitId").val(e.dataItem.id);
    $("#CashAndBankAccountDebit").val(e.dataItem.accountNameAr);


}
function onCashDebitChange(e) {
    debugger;
    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                $("#FK_CbCashAndBankAccountDebitId").val(response.id);
                $("#CashAndBankAccountDebit").val(response.accountNameAr);
            } else {
                $("#FK_CbCashAndBankAccountDebitId").val(null);
                $("#CashAndBankAccountDebit").val("");

                swal({
                    title: Resources.AccountCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}

function onCashCreditSelect(e) {
    debugger;
    var item = e.dataItem;
    $("#FK_CbCashAndBankAccountCreditId").val(e.dataItem.id);
    $("#CashAndBankAccountCredit").val(e.dataItem.accountNameAr);


}
function onCashCreditChange(e) {
    debugger;
    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                $("#FK_CbCashAndBankAccountCreditId").val(response.id);
                $("#CashAndBankAccountCredit").val(response.accountNameAr);

            } else {
                $("#FK_CbCashAndBankAccountCreditId").val(null);
                $("#CashAndBankAccountCredit").val("");
                swal({
                    title: Resources.AccountCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}
function ChangeIsActive(e) {
    if (e.checked === true) {
        $(".disabled-input").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#FreezingNotes").val("");
    }
    else
        $(".disabled-input").removeAttr('disabled');

}








