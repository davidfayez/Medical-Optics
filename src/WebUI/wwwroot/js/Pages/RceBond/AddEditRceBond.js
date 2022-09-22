$(document).ready(function () {

    if ($('input[name="IsPosted"]').prop("checked") == true) {
        $("#btnSubmit").attr("disabled", "disabled");
    }
    $('#DefBranches').change(function () {

        $("#FK_RceClientId").val(0);
        $("#FK_RceClientId").data("kendoDropDownList").value("0");
        $("#FK_RceClientId").data("kendoDropDownList").dataSource.read();

        $("#FK_RepresentativeId").data("kendoDropDownList").value("0");
        $("#FK_RepresentativeId").data("kendoDropDownList").dataSource.read();

        //$("#FK_CbCashAndBankAccountId").val(0);
        $("#FK_CbCashAndBankAccountId").data("kendoDropDownList").value("0");
        $("#FK_CbCashAndBankAccountId").data("kendoDropDownList").dataSource.read();
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
        var DefcurrencyId = parseInt($("#FK_DefCurrencyId").val());
        $.ajax({
            url: "/CbExchangeBond/GetCurrncyDefaultFactor?id=" + DefcurrencyId,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.isPimary) {
                    $("#CurrencyFactor").val(1);
                    $("#CurrencyFactor").attr('readonly', true);
                } else {
                    $("#CurrencyFactor").val(data.defaultFactor);
                    $("#CurrencyFactor").attr('readonly', false);
                }
            }
        });
    }
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
                    url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",
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


    //Client AutoComplete
    
    
    $("#FK_RceClientId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientsForDDLList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectRceClient
    });

    function onSelectRceClient(e) {       
        $("#FK_RceClientId").val(e.dataItem.id);
        $("#ClientName").val(e.dataItem.clientNameAr);
    }   

});

$("#btnSubmit").on('click', function () {

    if ($("#FK_DefCurrencyId").val() > 0)
        $("#FK_DefCurrencyIdValid").text("")
    else
        $("#FK_DefCurrencyIdValid").text(Resources.Required)

    if ($("#FK_RepresentativeId").val() > 0)
        $("#FK_RepresentativeIdValid").text("")
    else
        $("#FK_RepresentativeIdValid").text(Resources.Required)

    if ($("#FK_CbCashAndBankAccountId").val() > 0)
        $("#FK_CbCashAndBankAccountIdValid").text("")
    else
        $("#FK_CbCashAndBankAccountIdValid").text(Resources.Required)

    if ($("#FK_RceClientId").val() > 0 || $("#FK_RceSubClientId").val() > 0)
        $("#FK_RceClientIdValid").text("")
    else
        $("#FK_RceClientIdValid").text(Resources.Required)

    if ($("#mainForm").valid() && $("#FK_CbCashAndBankAccountId").val() > 0&& $("#FK_RepresentativeId").val() > 0 && $("#FK_DefCurrencyId").val() > 0 && ($("#FK_RceClientId").val() > 0 || $("#FK_RceSubClientId").val() > 0))
        $("#mainForm").submit();
});

$("#btnPrint").on('click', function () {

    var url = "/RceBond/ReportPrint?id=" + $("#Id").val();
    window.open(url, '_blank').print();

});










