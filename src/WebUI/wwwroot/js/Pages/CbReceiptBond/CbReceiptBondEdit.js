$(document).ready(function () {


    $('#DefBranches').change(function () {

        $("#FK_CollectorId").data("kendoDropDownList").value("0");
        $("#FK_CollectorId").data("kendoDropDownList").dataSource.read();

        $("#FK_GlAccountCreditId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountCreditId").data("kendoDropDownList").dataSource.read();

        GetNextSerial();
    });
    enableCheckFileds();
    $("#FK_CbPaymentTypeId").change(function () {
        enableCheckFileds();
    })
    $('#editCollector').click(function () {

        if ($('#Collector').is('[readonly]')) {
            $("#Collector").attr("readonly", false);
            $(this).removeClass("text-success");
            $(this).addClass("text-danger");

        } else {
            $("#Collector").attr("readonly", true);
            $(this).removeClass("text-danger");
            $(this).addClass("text-success");
            $("#Collector").val("");

        }
    });
    function enableCheckFileds() {

        if ($("#FK_CbPaymentTypeId").val() == 2) {
            $("#CheckNumber").removeAttr("disabled");
            $("#CheckDate").removeAttr("disabled");
            $("#FK_BankId").removeAttr("disabled");
        } else {
            $("#CheckNumber").attr("disabled", "disabled");
            $("#CheckDate").attr("disabled", "disabled");
            $("#FK_BankId").attr("disabled", "disabled");
        }

        if ($("#Collector").val() != "") {
            $("#Collector").attr("readonly", false);
            $("#editCollector").removeClass("text-success");
            $("#editCollector").addClass("text-danger");
        }
    }

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
                    //  url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",//GetAllAccountsForDDLTree",
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


    //$("#FK_CbPaymentTypeId").kendoDropDownList({
    //    filter: "contains",
    //    height: 300,
    //    dataTextField: "text",
    //    dataValueField: "value",
    //    dataSource: {
    //        type: "json",
    //        //serverFiltering: true,
    //        transport: {
    //            read: {
    //                url: "/CbReceiptBond/GetPaymentTypes",
    //            },
    //            parameterMap: function (data, action) {

    //                if (action === "read") {



    //                } else {
    //                    return data;
    //                }
    //            }
    //        }
    //    },
    //    select: onSelectPaymentType

    //});
    //function onSelectPaymentType(e) {
    //    if (e.dataItem.value == 2) {
    //        $("#CheckNumber").removeAttr("disabled");
    //        $("#CheckDate").removeAttr("disabled");
    //        $("#FK_BankId").removeAttr("disabled");
    //    } else {
    //        $("#CheckNumber").attr("disabled", "disabled");
    //        $("#CheckDate").attr("disabled", "disabled");
    //        $("#FK_BankId").attr("disabled", "disabled");
    //    }
    //}

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





    $("#accountCashAndBankAutoComplete").val($("#CbCashAndBankAccountCode").val());
    $("#accountAutoComplete").val($("#GlAccountCode").val());
    $("#costCenterAutoComplete").val($("#CostCenterCode").val());

    function checkPrimary() {
        $.ajax({
            type: "POST",
            url: "/CbExchangeBond/GetCurrncyDefaultFactor?id=" + $("#FK_DefCurrencyId").val(),
            dataType: "json",
            success: function (response) {
                debugger
                if (response != null) {
                    if (response.isPimary) {
                        $("#CurrencyFactor").val(1);
                        $("#CurrencyFactor").attr("readonly", "readonly");
                    }
                    else {
                        $("#CurrencyFactor").val(response.defaultFactor);
                        $("#CurrencyFactor").removeAttr("readonly", "readonly");
                    }
                }
            }
        });
        //$.ajax({
        //    url: "/DefCurrency/CheckIsPimary",
        //    type: "POST",
        //    data: { id: $("#FK_DefCurrencyId").val() },
        //    success: function (response) {
        //        if (response) {
        //            $("#CurrencyFactor").attr("readonly", "readonly");
        //            $("#CurrencyFactor").val(1);
        //        } else {
        //            $("#CurrencyFactor").removeAttr("readonly", "readonly");

        //        }
        //    }
        //});
    }

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
                                    SaveReceiptBondEdit(buttonId);
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
                            SaveReceiptBondEdit(buttonId);
                        }
                    }
                });
            }
        });




    });

    function SaveReceiptBondEdit(btnId) {

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

    function removeCbReceiptBond(id) {


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
                    url: "/CbReceiptBond/Delete?Id=" + id,
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
                            document.location = "/CbReceiptBond/"
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