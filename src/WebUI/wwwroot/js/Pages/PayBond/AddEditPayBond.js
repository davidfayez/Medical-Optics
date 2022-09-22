$(document).ready(function () {

    if ($('input[name="IsPosted"]').prop("checked") == true) {
        $("#btnSave").attr("disabled", "disabled");
    }

    $('#DefBranches').change(function () {

        $("#FK_PaySupplierId").val(0);
        $("#FK_PaySupplierId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierId").data("kendoDropDownList").dataSource.read();

        $("#FK_CbCashAndBankAccountId").val(0);
        $("#FK_CbCashAndBankAccountId").data("kendoDropDownList").value("0");
        $("#FK_CbCashAndBankAccountId").data("kendoDropDownList").dataSource.read();

        $("#FK_RepresentativeId").data("kendoDropDownList").value("0");
        $("#FK_RepresentativeId").data("kendoDropDownList").dataSource.read();

    });

    $("#FK_RepresentativeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeeForDDList",
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
        var BondDate = $("#InvoiceDate").val();
        var voucherDate = new Date($("#InvoiceDate").val());
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + DefcurrencyId + "&period=" + BondDate /*voucherDate.toUTCString()*/,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
                if (data.hasOwnProperty("factor")) {
                    $("#Factor").val(data.factor);
                    $('#Factor').attr('readonly', false);
                }
                else {
                    $("#Factor").val(data.defaultFactor);
                    if (data.isPimary == true)
                        $('#Factor').attr('readonly', true);
                    else
                        $('#Factor').attr('readonly', false);
                }
            }
        });
    }

    isSupplier = true;
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
    if (activeVal == "False") {
        $(".disabled-input").removeAttr('disabled');
    }

    //Edit Currency Factor
    var currencyFactorVal = $("#CurrencyFactor").val();
    if (currencyFactorVal == 1)
        $('#CurrencyFactor').attr('readonly', true);
    else
        $('#CurrencyFactor').attr('readonly', false);

    //cash Bank AutoComplete


    $("#FK_CbCashAndBankAccountId").kendoDropDownList({
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
        select: onCashAndBankSelect
    });
    function onCashAndBankSelect(e) {
        $("#FK_CbCashAndBankAccountId").val(e.dataItem.id);
        $("#CashAndBankAccount").val(e.dataItem.accountNameAr);
    }
    //Supplier AutoComplete
    var supplierCodeDataSource = new kendo.data.DataSource({

        //serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/PayLookups/GetAllSuppliersForDDLList",
            },
            parameterMap: function (data, action) {
                debugger
                if (action === "read") {
                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    } else {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    }

                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "id",
                fields: {

                    codeAndName: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#FK_PaySupplierId").kendoDropDownList({

        dataSource: supplierCodeDataSource,
        //placeholder: Resources.AutocompleateChoose,
        select: onSelectSupplier,
        //change: onChangeSupplier,
        //placeholder: Resources.AutocompleateChoose,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
    function onSelectSupplier(e) {
        debugger
        $("#FK_PaySupplierId").val(e.dataItem.id);
        $("#SupplierName").val(e.dataItem.supplierNameAr);

    }

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

    $("#btnSave").click(function () {
        debugger;

        if ($("#FK_RepresentativeId").val() > 0)
            $("#FK_RepresentativeIdValid").text("")
        else
            $("#FK_RepresentativeIdValid").text(Resources.Required)

        if ($("#FK_DefCurrencyId").val() > 0)
            $("#FK_DefCurrencyIdValid").text("")
        else
            $("#FK_DefCurrencyIdValid").text(Resources.Required)

        if ($("#FK_PaySupplierId").val() > 0)
            $("#FK_PaySupplierIdValid").text("")
        else
            $("#FK_PaySupplierIdValid").text(Resources.Required)

        if ($("#FK_CbCashAndBankAccountId").val() > 0)
            $("#FK_CbCashAndBankAccountIdValid").text("")
        else
            $("#FK_CbCashAndBankAccountIdValid").text(Resources.Required)

        if ($("#mainForm").valid())
            $("#mainForm").submit();

    });

});


function onSelect(e) {
    debugger;
    var ss = e.dataItem;
    if (isSupplier == true) {
        $("#FK_PaySupplierId").val(e.dataItem.id);
        $("#FK_PaySubSupplierId").val(null);
        $("#SupplierName").val(e.dataItem.supplierNameAr);
    }
    else {
        $("#FK_PaySubSupplierId").val(e.dataItem.id);
        $("#FK_PaySupplierId").val(null);
        $("#SupplierName").val(e.dataItem.supplierNameAr);
    }


}
function onChange(e) {
    debugger;
    var code = this.value();
    var id = "";
    var hiddennId = "";
    var checkUrl = "";
    if (isSupplier == true) {
        id = 'FK_PaySupplierId';
        hiddennId = 'FK_PaySubSupplierId';
        checkUrl = "/PayLookups/CheckSupplierCodeExist?code=";
    }
    else {
        id = 'FK_PaySubSupplierId';
        hiddennId = 'FK_PaySupplierId';
        checkUrl = "/PayLookups/CheckSubSupplierCodeExist?code=";
    }
    $.ajax({
        type: "GET",
        url: checkUrl + code,

        success: function (response) {
            debugger;

            if (response != null) {
                $("#" + id + "").val(response.id);
                $("#" + hiddennId + "").val(null);
                $("#SupplierName").val(response.supplierNameAr);
            } else {
                $("#" + id + "").val(null);
                $("#SupplierName").val("");

                // $("#supplierAutoComplete").val(null);
                swal({
                    title: Resources.SupplierCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}

$("#btnPrint").on('click', function () {

    var url = "/PayBond/ReportPrint?id=" + $("#Id").val();
    window.open(url, '_blank').print();

});








