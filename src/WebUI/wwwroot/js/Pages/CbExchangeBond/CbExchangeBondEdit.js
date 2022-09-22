$().ready(function () {

    $('#DefBranches').change(function () {
        $("#FK_DefCurrencyId").data("kendoDropDownList").value("0");
        $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();

        $("#FK_GlAccountId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();

        $("#FK_DistractedToId").data("kendoDropDownList").value("0");
        $("#FK_DistractedToId").data("kendoDropDownList").dataSource.read();
        GetNextSerial();
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
        select: onSelectDefCurrency
    });
    function onSelectDefCurrency(e) {
        var currnencyId = e.dataItem.id;
        $.ajax({
            type: "POST",
            url: "/CbExchangeBond/GetCurrncyDefaultFactor?id=" + currnencyId,
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.isPimary) {
                        $("#CurrencyFactor").val(1);
                        $("#CurrencyFactor").attr("disabled", "disabled");
                    } else {
                        $("#CurrencyFactor").val(response.defaultFactor);
                        $("#CurrencyFactor").removeAttr('disabled');
                    }
                }
            }

        });
        var totalAmount = parseFloat($("#TotalAmount").val());
        NumberToText(totalAmount, currnencyId);
    }

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    var resources = {
        accountCode: $('#AccountCodeResource').text(),
        accountName: $("#AccountNameResource").text(),
        costCenterCode: $('#CostCenterCodeResource').text(),
        costCenterName: $('#CostCenterNameResource').text(),
        debit: Resources.Debit,
        description: Resources.CBDescription,

    };

    if ($('#isActive').is(':checked'))
        $(".isActive").removeAttr('disabled');


  

    if ($('input[type=radio][name=FK_CbPaymentTypeId]:checked').val() == 2) {
        $("#CheckNumber").removeAttr("disabled");
        $("#CheckDate").removeAttr("disabled");
        $("#FK_BankId").removeAttr("disabled");
    }
    else {
        $("#CheckNumber").attr("disabled", "disabled");
        $("#CheckDate").attr("disabled", "disabled");
        $("#FK_BankId").attr("disabled", "disabled");
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

    $('#editCollector').click(function () {

        if ($('#Collector').is('[readonly]')) {
            $("#Collector").attr("readonly", false);
            $(this).removeClass("text-success");
            $(this).addClass("text-danger");

        } else {
            $("#Collector").attr("readonly", true);
            $(this).removeClass("text-danger");
            $(this).addClass("text-success");

        }
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

    CheckCurrncyIsPrimary();

    // DdlTree For Cash Bank Account
    dataSourceGlAccountIdDdlTree = new kendo.data.HierarchicalDataSource({
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
    $("#FK_DistractedToId").kendoDropDownList({
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
    // DdlTree For Gl Account
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET"
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });
    $("#accountsDDLTree").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
    });

    // Cost Cente DDL
    $("#costCenterDDL").kendoDropDownList({
        //placeholder: Resources.Choose,
        optionLabel: Resources.Choose,
        filter: "contains",
        dataTextField: "costCenterNameAr",
        dataValueField: "id",
        filter: "contains",
        dataSource: {
            //type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllDDLBySearch",
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
                        field: "costCenterNameAr",
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

    $("#FK_CostCenterId").kendoDropDownList({
        //placeholder: Resources.Choose,
        optionLabel: Resources.Choose,
        filter: "contains",
        dataTextField: "costCenterNameAr",
        dataValueField: "id",
        filter: "contains",
        dataSource: {
            //type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllDDLBySearch",
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
                        field: "costCenterNameAr",
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
    // Account AutoComplete 
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
                id: "Id",
                fields: {

                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#accountAutoCompleteBondAdd").kendoAutoComplete({

        dataSource: accountCodeDataSource,
        select: onSelectAccount,
        change: onChangeAccount,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:50px">' + Resources.AccountCodeResource + ' </span>' +
            '<span>' + Resources.AccountNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:50px">#: data.accountCode #</span>' +
            '<span>#: data.accountNameAr #</span>',
        dataTextField: "accountCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });

    function onSelectAccount(e) {
        $("#AccountId").val(e.dataItem.accountId);
        $("#accountName").val(e.dataItem.accountNameAr);
    }
    function onChangeAccount(e) {
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/GlAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#AccountId").val(response.accountId);
                    $("#accountName").val(response.accountNameAr);

                } else {
                    $("#AccountId").val(null);
                    $("#accountName").val(null);
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

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
    $("#costCenterAutoCompleteBondAdd").kendoAutoComplete({

        dataSource: costCenterDataSource,
        select: onSelectCostCenter,
        change: onChangeCostCenter,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:25px">' + Resources.CostCenterCodeResource + ' </span>' +
            '<span>' + Resources.CostCenterNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:110px">#: data.costCenterCode #</span>' +
            '<span>#: data.costCenterNameAr #</span>',
        dataTextField: "costCenterCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });

    function onSelectCostCenter(e) {
        $("#CostCenterId").val(e.dataItem.id);
        $("#CostCenterName").val(e.dataItem.costCenterNameAr);
    }
    function onChangeCostCenter(e) {
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CostCenter/CheckCostCenterExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#CostCenterId").val(response.id);
                    $("#CostCenterName").val(response.costCenterNameAr);

                } else {
                    $("#CostCenterId").val(null);
                    $("#CostCenterName").val(null);
                    swal({
                        title: Resources.CostCenterCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    var cashAndBankAccountCodeDataSource = new kendo.data.DataSource({

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
    $("#cashAndBankAccountAutoComplete").kendoAutoComplete({

        dataSource: cashAndBankAccountCodeDataSource,
        select: onSelectCashAndBankAccount,
        change: onChangeCashAndBankAccount,
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

    function onSelectCashAndBankAccount(e) {

        $("#FK_CbCashAndBankAccountId").val(e.dataItem.id);
        $("#CashAndBankAccountName").val(e.dataItem.accountNameAr);

    }
    function onChangeCashAndBankAccount(e) {

        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#FK_CbCashAndBankAccountId").val(response.id);
                    $("#CashAndBankAccountName").val(response.accountNameAr);


                } else {
                    $("#FK_CbCashAndBankAccountId").val(null);
                    $("#CashAndBankAccountName").val(null);
                    $("#CashAndBankAccountCode").val(null);
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    // Grid

    LoadGridBondDetails();
    function LoadGridBondDetails() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/CbExchangeBond/GetExchangeBondDetailsById?id=" + id,
                    Type: "GET"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }

            },
            //autoSync: true,
            batch: true,
            //pageSize: 20,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: true },
                        fK_GlAccountId: { editable: false },
                        //accountCode: { type: "text", editable: false },
                        accountName: { type: "text", editable: false },
                        fK_CostCenterId: { editable: false },
                        //costCenterCode: { type: "text", editable: false },
                        costCenterName: { type: "text", editable: false },
                        debit: { type: "number", editable: false },
                        description: { type: "text" }
                    }
                }
            }
        });
        var gridBound = $("#BondEditgrid").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "fK_GlAccountId", hidden: true, format: "{0:c}" },
                //{ field: "accountCode", title: Resources.AccountCodeResource, format: "{0:c}", width: Resources.CodeWidth  },
                { field: "accountName", title: Resources.AccountNameResource, width: Resources.NameWidth },
                { field: "fK_CostCenterId", hidden: true },
                //{ field: "costCenterCode", width: Resources.CodeWidth, title: Resources.CostCenterCodeResource },
                { field: "costCenterName", width: Resources.NameWidth, title: Resources.CostCenterNameResource },

                { field: "debit", title: Resources.Credit, width: 80 },

                { field: "description", width: 150, title: Resources.Description },
                { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: true,
            selectable: "multiple, cell",
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },

        });
        gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeBondDetailRow);
    }
    function removeBondDetailRow() {

        var row = $(this).closest("tr"),
            grid = $("#BondEditgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            detailId = dataItem.id,
            dataSource = $("#BondEditgrid").data("kendoGrid").dataSource;
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

            if (detailId != "" && detailId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/CbExchangeBond/DeleteBondDetail?id=" + detailId,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {

                            if (result) {
                                //LoadGridBondDetails();
                                dataSource.remove(dataItem)
                                swal({
                                    title: Resources.DeleteSuccessResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                });
                                var currencyId = parseInt($("#FK_DefCurrencyId").val());
                                var totalAmount = parseFloat($("#TotalAmount").val());
                                totalAmount -= dataItem.debit;
                                $("#TotalAmount").val(totalAmount);
                                NumberToText(totalAmount, currencyId);
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
            } else {
                setTimeout(function () {

                    if (dataSource.remove(dataItem)) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        var currencyId = parseInt($("#FK_DefCurrencyId").val());
                        var totalAmount = parseInt($("#TotalAmount").val());
                        totalAmount -= dataItem.debit;
                        $("#TotalAmount").val(totalAmount);
                        NumberToText(totalAmount, currencyId);
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }

                }, 1000);
            }
        });


    }
    $("#btnAddNewBondDetail").on('click', function () {

        var id = null,
            fK_GlAccountId = parseInt($("#accountsDDLTree").data("kendoDropDownTree").value()),
            //accountCode = $("#accountAutoCompleteBondAdd").val(),
            accountName = $("#accountsDDLTree").data("kendoDropDownTree").text(),
            FK_CostCenterId = parseInt($("#costCenterDDL").data("kendoDropDownList").value()),
            //costCenterCode = $("#costCenterAutoCompleteBondAdd").val(),
            costCenterName = $("#costCenterDDL").data("kendoDropDownList").text(),
            debit = $("#debit").val(),
            description = $("#descriptionDetail").val(),
            formDetailValid = true;
        if (costCenterName == "اختر")
            costCenterName = "  ";
        if (debit == "") {
            formDetailValid = false;
            swal({
                title: Resources.CreditRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        //if (FK_CostCenterId == "" || isNaN(FK_CostCenterId)) {
        //    formDetailValid = false;
        //    swal({
        //        title: Resources.ChooseCostCenterResource,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        if (fK_GlAccountId == "" || fK_GlAccountId == 0 || isNaN(fK_GlAccountId)) {
            formDetailValid = false;
            swal({
                title: Resources.ChooseAccountResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }


        if (formDetailValid) {
            tempSource.insert(0, {
                id: id,
                fK_GlAccountId: fK_GlAccountId,
                //accountCode: accountCode,
                accountName: accountName,
                fK_CostCenterId: FK_CostCenterId,
                //costCenterCode: costCenterCode,
                costCenterName: costCenterName,
                debit: debit,
                description: description,

            });

            $("#AccountId").val("");
            $("#accountAutoCompleteBondAdd").val("");
            $("#accountName").val("");
            $("#CostCenterId").val("");
            $("#CostCenterName").val("");
            $("#debit").val("");
            $("#costCenterAutoCompleteBondAdd").val("");
            $("#descriptionDetail").val("");
            $("#accountsDDLTree").data("kendoDropDownTree").value("");
            $("#costCenterDDL").data("kendoDropDownList").value("");
            var currencyId = parseInt($("#FK_DefCurrencyId").val());
            var totalAmount = parseFloat($("#TotalAmount").val());
            totalAmount += parseFloat(debit);
            $("#TotalAmount").val(totalAmount);
            //$("#TotalAmountText").val(null);
            NumberToText(parseFloat(totalAmount), currencyId);

        }


    });

    if ($('input[name="IsPosted"]').prop("checked") == true) {
        $("#btnSavePrint").attr("disabled", "disabled");
        $("#btnSave").attr("disabled", "disabled");
        $("#btnAddNewBondDetail").attr("disabled", "disabled");
        $(".btnDelete").addClass('disabled');
        $("#divStatus").addClass('disabled');
        $("#divPosted").addClass('disabled');



    }
    else {
        $("#btnAddNewBondDetail").removeAttr('disabled');
        $("#btnSave").removeAttr('disabled');
        $("#btnSavePrint").removeAttr('disabled');

    }


});
function GetNextSerial() {

    $.ajax({
        url: "/CbExchangeBond/GetNextSerial?branchId=" + parseInt($("#FK_DefBranchId").val()),
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
$('select[name="FK_DefCurrencyId"]').change(function () {

    var currnencyId = $(this).val();
    $.ajax({
        type: "POST",
        url: "/CbExchangeBond/GetCurrncyDefaultFactor?id=" + currnencyId,
        dataType: "json",
        success: function (response) {
            if (response != null) {
                if (response.isPimary) {
                    $("#CurrencyFactor").val(1);
                    $("#CurrencyFactor").attr("disabled", "disabled");
                } else {
                    $("#CurrencyFactor").val(response.defaultFactor);
                    $("#CurrencyFactor").removeAttr('disabled');
                }
            }
        }

    });
    var totalAmount = parseFloat($("#TotalAmount").val());
    NumberToText(totalAmount, currnencyId);

});


$("input[name='IsActive']").on('click', function () {
    if ($("input[name='IsActive']:checked").val() == "true") {
        disableFreezing()
    }
    else {
        disableFreezing()
    }

});
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

function checkPeriodAndSubmitBondEdit() {

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
                                SubmitBondEdit();

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
                        SubmitBondEdit();
                    }
                }
            });
        }
    });


}

function checkPeriodAndSubmitBondAndPrintEdit() {
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
                                SubmitBondAndPrintEdit();
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
                        SubmitBondAndPrintEdit();
                    }
                }
            });
        }
    });

}
function SubmitBondAndPrintEdit() {
    if ($("#bondEditForm").valid()) {
        var listDetails = [];
        var gridData = $('#BondEditgrid').data("kendoGrid").dataSource.data();

        if (gridData.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            for (var i = 0; i < gridData.length; i++) {

                var detail = {
                    Id: parseInt(gridData[i].id),
                    FK_GlAccountId: parseInt(gridData[i].fK_GlAccountId),
                    FK_CostCenterId: parseInt(gridData[i].fK_CostCenterId),
                    Debit: parseFloat(gridData[i].debit),
                    Description: gridData[i].description,
                };
                listDetails.push(detail);
            }

            var isPosted = $("input[name='IsPosted']:checked").val(),
                isActive = $("input[name='IsActive']:checked").val();
            if (isPosted == "True")
                isPosted = true;
            else
                isPosted = false;

            if (isActive == "True")
                isActive = true;
            else
                isActive = false;

            var FK_GlAccountId = parseInt($("#FK_GlAccountId").data("kendoDropDownList").value());
            if (FK_GlAccountId == 0)
                $("#glAccountValidation").text(Resources.Required);
            else
                $("#glAccountValidation").text("");

            var FK_DistractedToId = parseInt($("#FK_DistractedToId").data("kendoDropDownList").value());

            //if (FK_DistractedToId == 0)
            //    $("#FK_DistractedToIdValid").text(Resources.Required);
            //else
            //    $("#FK_DistractedToIdValid").text("");
            var Obj = {
                Id: parseInt($("#Id").val()),
                Serial: parseInt($("#Serial").val()),
                BondDate: $("#BondDate").val(),
                FK_DefCurrencyId: parseInt($("#FK_DefCurrencyId").val()),
                FK_CostCenterId: parseInt($("#FK_CostCenterId").val()),
                CurrencyFactor: parseFloat($("#CurrencyFactor").val()),
                CheckNumber: $("#CheckNumber").val(),
                CheckDate: $("#CheckDate").val(),
                FK_BankId: parseInt($("#FK_BankId").val()),
                TotalAmount: parseFloat($("#TotalAmount").val()),
                TotalAmountText: $("#TotalAmountText").val(),
                CustodyNumber: $("#CustodyNumber").val(),
                Collector: $("#Collector").val(),
                PaperNumber: parseInt($("#PaperNumber").val()),
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                Description: $("#Description").val(),
                FK_CbPaymentTypeId: parseInt($("input[name='FK_CbPaymentTypeId']:checked").val()),
                IsPosted: isPosted,
                IsActive: isActive,
                FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
                FreezingNotes: $("#FreezingNotes").val(),
                FK_GlAccountId: parseInt(FK_GlAccountId),
                FK_DistractedToId: parseInt(FK_DistractedToId),
                ListDetails: listDetails
            };

            if (FK_GlAccountId > 0) {//&& FK_DistractedToId > 0
                $.ajax({
                    url: "/CbExchangeBond/EditBond",
                    type: "Post",
                    cache: false,
                    processData: false,
                    data: JSON.stringify(Obj),
                    contentType: 'application/json',
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.SavedSuccessfullyResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            }, function () {
                                // Object.assign(document.createElement('a'), { target: '_blank', href: '/CbExchangeBond/CbExchangeBondDetailsReport/' + $("#Id").val() }).click();
                                var url = '/CbExchangeBond/CbExchangeBondDetailsReport/' + $("#Id").val()
                                window.open(url, '_blank').print();
                                window.location.href = '/CbExchangeBond/Index';
                            });
                        }
                        else {
                            swal({
                                title: Resources.DefaultErrorMessageResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    }
                });
            }

        }


    }

}

function SubmitBondEdit() {
    if ($("#bondEditForm").valid()) {
        var listDetails = [];
        var gridData = $('#BondEditgrid').data("kendoGrid").dataSource.data();

        if (gridData.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            for (var i = 0; i < gridData.length; i++) {

                var detail = {
                    Id: parseInt(gridData[i].id),
                    FK_GlAccountId: parseInt(gridData[i].fK_GlAccountId),
                    FK_CostCenterId: parseInt(gridData[i].fK_CostCenterId),
                    Debit: parseFloat(gridData[i].debit),
                    Description: gridData[i].description,
                };
                listDetails.push(detail);
            }

            var isPosted = $("input[name='IsPosted']:checked").val(),
                isActive = $("input[name='IsActive']:checked").val();
            if (isPosted == "True")
                isPosted = true;
            else
                isPosted = false;

            if (isActive == "True")
                isActive = true;
            else
                isActive = false;

            var FK_GlAccountId = parseInt($("#FK_GlAccountId").data("kendoDropDownList").value());
            if (FK_GlAccountId == 0)
                $("#glAccountValidation").text(Resources.Required);
            else
                $("#glAccountValidation").text("");

            var FK_DistractedToId = parseInt($("#FK_DistractedToId").data("kendoDropDownList").value());

            //if (FK_DistractedToId == 0 && $('#editCollector').val() == '')
            //    $("#FK_DistractedToIdValid").text(Resources.Required);
            //else
            //    $("#FK_DistractedToIdValid").text("");
            var Obj = {
                Id: parseInt($("#Id").val()),
                Serial: parseInt($("#Serial").val()),
                BondDate: $("#BondDate").val(),
                FK_DefCurrencyId: parseInt($("#FK_DefCurrencyId").val()),
                FK_CostCenterId: parseInt($("#FK_CostCenterId").val()),
                CurrencyFactor: parseFloat($("#CurrencyFactor").val()),
                CheckNumber: $("#CheckNumber").val(),
                CheckDate: $("#CheckDate").val(),
                FK_BankId: parseInt($("#FK_BankId").val()),
                TotalAmount: parseFloat($("#TotalAmount").val()),
                TotalAmountText: $("#TotalAmountText").val(),
                CustodyNumber: $("#CustodyNumber").val(),
                Collector: $("#Collector").val(),
                PaperNumber: parseInt($("#PaperNumber").val()),
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                Description: $("#Description").val(),
                FK_CbPaymentTypeId: parseInt($("input[name='FK_CbPaymentTypeId']:checked").val()),
                IsPosted: isPosted,
                IsActive: isActive,
                FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
                FreezingNotes: $("#FreezingNotes").val(),
                FK_GlAccountId: parseInt(FK_GlAccountId),
                FK_DistractedToId: parseInt(FK_DistractedToId),
                ListDetails: listDetails
            };

            if (FK_GlAccountId > 0) {//&& FK_DistractedToId > 0
                $.ajax({
                    url: "/CbExchangeBond/EditBond",
                    type: "Post",
                    cache: false,
                    processData: false,
                    data: JSON.stringify(Obj),
                    contentType: 'application/json',
                    success: function (result) {

                        if (result) {

                            swal({
                                title: Resources.SavedSuccessfullyResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            }, function () {
                                window.location.href = '/CbExchangeBond/Index';
                            });
                        }
                        else {
                            swal({
                                title: Resources.DefaultErrorMessageResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    }
                });
            }

        }


    }

}


function CheckCurrncyIsPrimary() {
    $.ajax({
        type: "POST",
        url: "/CbExchangeBond/GetCurrncyDefaultFactor?id=" + $("#FK_DefCurrencyId").val(),
        dataType: "json",
        success: function (response) {

            if (response != null) {
                if (response.isPimary) {
                    $("#CurrencyFactor").attr("disabled", "disabled");
                    $("#CurrencyFactor").val(1);
                }
                else {
                    $("#CurrencyFactor").val(response.defaultFactor);
                    $("#CurrencyFactor").removeAttr('disabled');
                }
            }
        }
    });
}

function NumberToText(number, currencyId) {

    $.ajax({
        url: "/CbExchangeBond/NumberToText?number=" + number + "&currencyId=" + currencyId,
        type: "Post",
        cache: false,
        processData: false,
        contentType: 'application/json',
        success: function (result) {

            if (result != null)
                $("#TotalAmountText").val(result);
            else
                $("#TotalAmountText").val(null);
        }
    });
}