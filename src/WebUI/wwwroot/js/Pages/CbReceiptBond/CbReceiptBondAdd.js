$(document).ready(function () {

    var currencyFactorVal = $("#CurrencyFactor").val();
    if (currencyFactorVal == 1)
        $('#CurrencyFactor').attr('readonly', true);
    else
        $('#CurrencyFactor').attr('readonly', false);

    $('#DefBranches').change(function () {

        $("#FK_CollectorId").data("kendoDropDownList").value("0");
        $("#FK_CollectorId").data("kendoDropDownList").dataSource.read();

        $("#FK_GlAccountCreditId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountCreditId").data("kendoDropDownList").dataSource.read();
        GetNextSerial();

    });
    $('#editCollector').click(function () {

        if ($('#Collector').is('[readonly]')) {
            $('#Collector').attr("readonly", false);
            $('#Collector').removeClass("text-success");
            // $('#Collector').addClass("text-danger");

            $('#Collector').prop('required', true);
            $('#FK_CollectorId').prop('required', false);


        } else {
            $('#Collector').attr("readonly", true);
            // $('#Collector').removeClass("text-danger");
            $('#Collector').addClass("text-success");
            $('#Collector').prop('required', false);
            $('#Collector').val("");
            $('#FK_CollectorId').prop('required', true);
        }
    });
    $('input[type=radio][name=FK_CbPaymentTypeId]').change(function () {
        if (this.value == 2) {
            $("#CheckNumber").removeAttr("disabled");
            $("#CheckDate").removeAttr("disabled");
            $("#FK_BankId").removeAttr("disabled");
        }
        else {
            $("#CheckNumber").attr("disabled", "disabled");
            $("#CheckDate").attr("disabled", "disabled");
            $("#FK_BankId").attr("disabled", "disabled");
        }
    });
    //Account DdlTree
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/CbCashAndBankAccount/GetAllAccountsForDDLTree",
                Type: "GET"
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                    };
                } else {
                    return data;
                }
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });


    $("#showAllAccounts").change(function () {

        $("#FK_GlAccountId").data("kendoDropDownList").value("0");
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
                    url: function () {
                        if ($('#showAllAccounts').is(':checked')) {
                            return "/GlAccount/GetAllAccountsForDDList"
                        } else {
                            return "/CbCashAndBankAccount/GetGlAccountsForCashAndBank"
                        }
                    },
                    // url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",//GetAllAccountsForDDLTree",
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
                    url: "/GlAccount/GetAllAccountsForDDList",
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

    });
    // Cost Cente rDDL
    $("#FK_CostCenterCreditId").kendoDropDownList({
        // optionLabel: Resources.Choose,
        filter: "contains",
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            //type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllCostCentersForDDList",
                    dataType: "json",
                }
            }
        },
        filtering: function (ev) {
            var filterValue = ev.filter != undefined ? ev.filter.value : "";
            ev.preventDefault();

            this.dataSource.filter({
                logic: "or",
                filters: [
                    {
                        field: "codeAndName",
                        operator: "contains",
                        value: filterValue
                    },
                    {
                        field: "id",
                        operator: "contains",
                        value: filterValue
                    }
                ]
            });
        }
    });

    $("#FK_CostCenterDebitId").kendoDropDownList({
        // optionLabel: Resources.Choose,
        filter: "contains",
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            //type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllCostCentersForDDList",
                    dataType: "json",
                }
            }
        },
        filtering: function (ev) {
            var filterValue = ev.filter != undefined ? ev.filter.value : "";
            ev.preventDefault();

            this.dataSource.filter({
                logic: "or",
                filters: [
                    {
                        field: "codeAndName",
                        operator: "contains",
                        value: filterValue
                    },
                    {
                        field: "id",
                        operator: "contains",
                        value: filterValue
                    }
                ]
            });
        }
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
    $("#FK_CollectorId").kendoDropDownList({
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

    $("#FK_BankId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbBank/GetAllBanksForDDList",
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
    //cashAndBank autocompleate
    var accountCashAndBankCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CbCashAndBankAccount/GetAllAutoCompleteSearchByCode"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters[0].value
                    };
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

                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#accountCashAndBankAutoComplete").kendoAutoComplete({

        dataSource: accountCashAndBankCodeDataSource,
        select: onCashAndBankSelect,
        change: onCashAndBankChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:50px">' + Resources.AccountCodeResource + ' </span>' +
            '<span>' + Resources.AccountNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.accountCode #</span>' +
            '<span>#: data.accountNameAr #</span>',
        dataTextField: "accountCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });

    function onCashAndBankSelect(e) {
        $("#FK_CbCashAndBankAccountId").val(e.dataItem.id);
    }
    function onCashAndBankChange(e) {

        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#FK_CbCashAndBankAccountId").val(response.id);
                    $("#CbCashAndBankAccountName").val(response.accountNameAr);

                } else {
                    $("#FK_CbCashAndBankAccountId").val(null);
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }
    //

    //GLAccount autocompleate
    var accountCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/GlAccount/GetAllAutoCompleteBySearch"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters[0].value
                    };
                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "url",
                fields: {
                    id: {
                        type: "int"
                    },
                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });

    $("#accountAutoComplete").kendoAutoComplete({
        minLength: 1,
        dataTextField: "accountCode",
        filter: "contains",
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:50px">' + Resources.AccountCodeResource + ' </span>' +
            '<span>' + Resources.AccountNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.accountCode #</span>' +
            '<span class="k-state-default">#: data.accountNameAr #</span>',
        dataSource: accountCodeDataSource,
        select: onAccountSelect,
        change: onAccountChange,
        height: 400,
        placeholder: Resources.AutocompleateChoose
    }).data("kendoAutoComplete");
    function onAccountSelect(e) {

        $("#FK_GlAccountId").val(e.dataItem.id);

    }
    function onAccountChange(e) {

        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/GlAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#FK_GlAccountId").val(response.accountId);
                    $("#GlAccountName").val(response.accountNameAr);
                } else {
                    $("#FK_GlAccountId").val(null);
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });

    }
    //

    //costCenter autocompleate
    var costCenterDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CostCenter/GetAllAutoCompleteBySearch"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters[0].value
                    };
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

                    costCenterCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#costCenterAutoComplete").kendoAutoComplete({

        dataSource: costCenterDataSource,
        select: onCostCenterSelect,
        change: onCostCenterChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:10px">' + Resources.CostCenterCodeResource + ' </span>' +
            '<span>' + Resources.CostCenterNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:150px">#: data.costCenterCode #</span>' +
            '<span>#: data.costCenterNameAr #</span>',
        dataTextField: "costCenterCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });

    function onCostCenterSelect(e) {
        $("#FK_CostCenterId").val(e.dataItem.id);
    }
    function onCostCenterChange(e) {
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CostCenter/CheckCostCenterExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#FK_CostCenterId").val(response.id);
                    $("#CostCenterName").val(response.costCenterNameAr);
                } else {
                    $("#FK_CostCenterId").val(null);
                    swal({
                        title: Resources.CostCenterCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }
    //


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

    $("#btnSave,#btnSavePrint").click(function () {
        var buttonId = this.id;
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
                                    SaveReceiptBond(buttonId);
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
                            SaveReceiptBond(buttonId);
                        }
                    }
                });
            }
        });


        //if (this.id == "btnSave")
        //    $("#SavePrint").val(1);//save only

        //if (this.id == "btnSavePrint")//save only
        //    $("#SavePrint").val(2);//save with print


    });

    function SaveReceiptBond(btnId) {

        if (btnId == "btnSave")
            $("#SavePrint").val(1);//save only

        if (btnId == "btnSavePrint")//save only
            $("#SavePrint").val(2);//save with print

        var FK_GlAccountId = $("#FK_GlAccountId").data("kendoDropDownList").value();
        if (FK_GlAccountId == "0")
            $("#glAccountValidation").text(Resources.Required)
        else {
            $("#glAccountValidation").text("")
            $("#FK_GlAccountId").val(parseInt(FK_GlAccountId));
        }

        var FK_GlAccountCreditId = $("#FK_GlAccountCreditId").data("kendoDropDownList").value();
        if (FK_GlAccountCreditId == "0")
            $("#glAccountCreditValidation").text(Resources.Required);
        else
            $("#glAccountCreditValidation").text("");

        var FK_CostCenterCreditId = $("#FK_CostCenterCreditId").data("kendoDropDownList").value();
        //if (FK_CostCenterCreditId == "0")
        //    $("#costCenterCreditValidation").text(Resources.Required);
        //else
        //    $("#costCenterCreditValidation").text("");

        var FK_CostCenterDebitId = $("#FK_CostCenterDebitId").data("kendoDropDownList").value();
        //if (FK_CostCenterDebitId == "0")
        //    $("#costCenterDebitValidation").text(Resources.Required);
        //else
        //    $("#costCenterDebitValidation").text("");

        if ($("#FK_DefCurrencyId").val() == "0")
            $("#FK_DefCurrencyIdValid").text(Resources.Required);
        else
            $("#FK_DefCurrencyIdValid").text("");

        //if ($("#FK_CollectorId").val() > 0)
        //    $("#FK_CollectorIdValid").text("")
        //else if ($("#FK_CollectorId").val() == 0 && $("#Collector").val() == '')
        //    $("#FK_CollectorIdValid").text(Resources.Required);
        //else
        //    $("#FK_CollectorIdValid").text("");


        if ($("#mainForm").valid() && $("#FK_DefCurrencyId").val() != "0" && FK_GlAccountId != "0" && FK_GlAccountCreditId != "0") //&& $("#FK_CollectorId").val() != "0" && FK_CostCenterCreditId != "0" && FK_CostCenterDebitId != "0"
            $("#mainForm").submit();

    }
    $('#Amount').change(function () {
  
        var currencyId = $("#FK_DefCurrencyId").val();
        NumberToText(this.value, currencyId);
    });
    function NumberToText(number, currencyId) {

        $.ajax({
            url: "/CbExchangeBond/NumberToText?number=" + number + "&currencyId=" + currencyId,
            type: "Post",
            cache: false,
            processData: false,
            contentType: 'application/json',
            success: function (result) {

                if (result != null)
                    $("#AmountText").val(result);
                else
                    $("#AmountText").val(null);
            }
        });
    }
});

function GetNextSerial() {

    $.ajax({
        url: "/CbReceiptBond/GetNextSerial?branchId=" + parseInt($("#FK_DefBranchId").val()),
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

