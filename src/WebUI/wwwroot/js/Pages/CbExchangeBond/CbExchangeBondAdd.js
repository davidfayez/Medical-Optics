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
    //$("#GlAccountId").kendoDropDownTree({
    //    placeholder: Resources.Choose,
    //    dataSource: dataSourceGlAccountIdDdlTree,
    //    height: 300,
    //    dataTextField: "accountNameAr",
    //    dataValueField: "id",
    //    filter: "contains",
    //    //checkboxes: true,
    //    //checkAll: true,
    //    autoClose: false,
    //    select: function (e) {

    //        var dataItem = e.sender.dataItem(e.node);
    //        $("#FK_GlAccountId").val(parseInt(dataItem.id));
    //        // Use the selected item or its text
    //    }
    //});
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

    // auto Complete Account
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
    var tempSource = new kendo.data.DataSource({

    });
    var gridBound = $("#BondAddgrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        columns: [

            { field: "FK_GlAccountId", hidden: true, format: "{0:c}" },
            //{ field: "AccountCode", title: Resources.AccountCodeResource, format: "{0:c}", width: Resources.CodeWidth },
            { field: "AccountName", title: Resources.AccountNameResource, width: Resources.NameWidth },
            { field: "FK_CostCenterId", hidden: true },
            //{ field: "CostCenterCode", width: Resources.CodeWidth, title: Resources.CostCenterCodeResource },
            { field: "CostCenterName", width: Resources.NameWidth, title: Resources.CostCenterNameResource },
            { field: "Debit", title: Resources.Credit, width: 80 },

            // { field: "Debit", title: Resources.Debit, width: 80 },
            { field: "Description", width: 150, title: Resources.Description },
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
    function removeBondDetailRow() {

        var row = $(this).closest("tr"),
            grid = $("#BondAddgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
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
                var dataSource = $("#BondAddgrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                    var currencyId = parseInt($("#FK_DefCurrencyId").val());
                    var totalAmount = parseFloat($("#TotalAmount").val());
                    totalAmount -= dataItem.Debit;
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
        });
    }
    $("#btnAddNewBondDetail").on('click', function () {

        var fK_GlAccountId = parseInt($("#accountsDDLTree").data("kendoDropDownTree").value()),
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
        debugger
        if (debit == "") {
            formDetailValid = false;
            swal({
                title: Resources.CreditRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

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
                FK_GlAccountId: fK_GlAccountId,
                //AccountCode: accountCode,
                AccountName: accountName,
                FK_CostCenterId: FK_CostCenterId,
                //CostCenterCode: costCenterCode,
                CostCenterName: costCenterName,
                Debit: debit,
                Description: description,

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
})


function checkPeriodAndSubmitBond() {

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
                                SubmitBondCreate();

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
                        SubmitBondCreate();
                    }
                }
            });
        }
    });


}

function checkPeriodAndSubmitBondAndPrint() {
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
                                SubmitBondAndPrintCreate();
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
                        SubmitBondAndPrintCreate();
                    }
                }
            });
        }
    });

}

function SubmitBondAndPrintCreate() {
    if ($("#bondCreateForm").valid()) {
        var listDetails = [];
        var gridData = $('#BondAddgrid').data("kendoGrid").dataSource.data();

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
                    Id: 0,
                    FK_GlAccountId: parseInt(gridData[i].FK_GlAccountId),
                    FK_CostCenterId: parseInt(gridData[i].FK_CostCenterId),
                    Debit: parseFloat(gridData[i].Debit),
                    Description: gridData[i].Description,
                };
                listDetails.push(detail);
            }

            var isPosted = $("input[name='IsPosted']:checked").val();
            var isActive = $("input[name='IsActive']:checked").val();
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
                Id: 0,

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
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                FK_GlAccountId: parseInt(FK_GlAccountId),
                FK_DistractedToId: parseInt(FK_DistractedToId),
                FK_SecModuleId: parseInt($("#FK_SecModuleId").val()),
                FK_SecModulePageId: parseInt($("#FK_SecModulePageId").val()),
                ReferenceId: parseInt($("#ReferenceId").val()),
                ListDetails: listDetails
            };

            if (FK_GlAccountId > 0) {//&& FK_DistractedToId > 0
                $.ajax({
                    url: "/CbExchangeBond/SaveBond",
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
                                var url = '/CbExchangeBond/CbExchangeBondDetailsReport/' + result
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

function SubmitBondCreate() {
    debugger
    if ($("#bondCreateForm").valid()) {
        var listDetails = [];
        var gridData = $('#BondAddgrid').data("kendoGrid").dataSource.data();

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
                    Id: 0,
                    FK_GlAccountId: parseInt(gridData[i].FK_GlAccountId),
                    FK_CostCenterId: parseInt(gridData[i].FK_CostCenterId),
                    Debit: parseFloat(gridData[i].Debit),
                    Description: gridData[i].Description,
                };
                listDetails.push(detail);
            }

            var isPosted = $("input[name='IsPosted']:checked").val();
            var isActive = $("input[name='IsActive']:checked").val();
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
                Id: 0,
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
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                FK_GlAccountId: parseInt(FK_GlAccountId),
                FK_DistractedToId: parseInt(FK_DistractedToId),
                FK_SecModuleId: parseInt($("#FK_SecModuleId").val()),
                FK_SecModulePageId: parseInt($("#FK_SecModulePageId").val()),
                ReferenceId: parseInt($("#ReferenceId").val()),
                ListDetails: listDetails
            };

            if (FK_GlAccountId > 0) {//&& FK_DistractedToId > 0
                $.ajax({
                    url: "/CbExchangeBond/SaveBond",
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