$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#accountsDDLTree").data("kendoDropDownList").value(0);
        $("#accountsDDLTree").data("kendoDropDownList").dataSource.read();
    });


    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/CbBondRpt/GetMovementBankReport",
                Type: "GET"
            }
        },
        error: function (e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        pageSize: Resources.GridPageSize,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false },
                    description: { editable: false },
                    serial: { editable: false },
                    referenceNumber: { editable: false },
                    glJournalVoucherSerial: { editable: false },
                    invoiceDate: { type: "date", editable: false },
                    billDueDate: { type: "date", editable: false },
                    voucherDate: { type: "date", editable: false },
                    referenceDate: { type: "date", editable: false },
                    debit: { editable: false },
                    credit: { editable: false },
                    balance: { type: "number" }
                }
            }
        },
        change: function (e) {
            var total = getFinalBalance();
            var span = $("#finalBalance");

            span.html(total.toString());
        },
        aggregate: [
            { field: "debit", aggregate: "sum" },
            { field: "credit", aggregate: "sum" },
            { field: "balance", aggregate: "sum" }
        ]
    });

    $("#GridAccountMovementBankReport").kendoGrid({
        excel: {
            fileName: "Account Movement Bank Report.xlsx",
            allPages: Resources.GridAllPages,
            filterable: Resources.GridFilterable
        },
        dataSource: dataSource,
        pageSize: 20,
        serverPaging: Resources.GridServerPaging,
        serverFiltering: Resources.GridServerFiltering,
        filterable: Resources.GridFilterable,
        height: Resources.GridHeight,
        groupable: Resources.GridGroupable
        ,
        sortable: Resources.GridSortable,
        resizable: Resources.GridResizable,
        noRecords: Resources.GridNoRecords,
        messages: {
            noRecords: Resources.GridNoRecordsMessage
        },
        pageable: {
            pageSizes: [10, 20, 50, Resources.All],
            numeric: Resources.GridNumeric,
            refresh: Resources.GridRefresh,

        },
        columns: [
            { width: Resources.InputNumberWidth, template: "<span class='counter'> </span>", title: Resources.Serial },
            { field: "description", title: Resources.DescriptionResource, width: Resources.DescriptionWidth },
            { field: "serial", title: Resources.BillBondNumberResource, width: Resources.CodeWidth },
            { field: "voucherDate", title: Resources.BillDateResource, format: "{0:yyyy/MM/dd}", width: Resources.CodeWidth },
            { field: "referenceNumber", title: Resources.BondSerialResource, width: Resources.CodeWidth },
            { field: "referenceDate", title: Resources.BondDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
          //  { field: "billDueDate", title: Resources.BillDueDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "debit", title: Resources.DebitResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.TotalDebit + ": #: kendo.toString(sum, 'n2') # " },
            { field: "credit", title: Resources.CreditResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.TotalCredit + ": #: kendo.toString(sum, 'n2') # " },
            { field: "balance", title: Resources.BalanceResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.BalanceResource + ": <span id='finalBalance'> #: window.getFinalBalance()#</span>" },

            //{ field: "serial", title: Resources.BondSerialResource, width: Resources.CodeWidth },
            //{ field: "bondDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            //{ field: "debit", title: Resources.DebitResource, width: Resources.InputNumberWidth, format: '{0:n2}' },
            //{ field: "credit", title: Resources.CreditResource, width: Resources.InputNumberWidth, format: '{0:n2}' },
            //{ field: "bondType", title: Resources.BondTypeResource, width: Resources.TypeWidth },
        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.isActive) {
                    // $(this).addClass("k-state-selected");
                }
            });
        },
        excelExport: function (e) {
            var accountId = $("#accountName").val();
            var costCenterId = $("#costCenterName").val();
            if (accountId !== "")
                e.workbook.fileName = $("#accountName  option:selected").text();
            else if (costCenterId !== "")
                e.workbook.fileName = $("#costCenterName  option:selected").text();
        }
    });

    // DdlTree
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

    $("#FK_GlAccountIdDD").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "accountNameAr",
        dataValueField: "id",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false
    });

    $("#accountsDDLTree").kendoDropDownList({
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
    var cashAndBankAccountCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CbCashAndBankAccount/GetAllAutoCompleteSearchByCode"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    var filter = data.filter.filters[0];
                    if (filter != undefined) {
                        return {
                            code: data.filter.filters[0].value
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

                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#accountAutoCompleteMovementBankReport").kendoAutoComplete({

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
        minLength: 1
    });

    function onSelectCashAndBankAccount(e) {
        debugger
        $("#FK_CbCashAndBankAccountId").val(e.dataItem.id);
        $("#accountName").val(e.dataItem.accountNameAr);

    }
    function onChangeCashAndBankAccount(e) {

        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger
                if (response != null) {
                    $("#FK_CbCashAndBankAccountId").val(response.id);
                    $("#accountName").val(response.accountNameAr);
                }
                else {
                    $("#FK_CbCashAndBankAccountId").val(null);
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
});


$("#btnDataReview").on('click', function () {
    var accountId = parseInt($("#accountsDDLTree").data("kendoDropDownList").value()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        withoutCostCenter = $('#chkWithoutCostcenter').prop('checked'),
        isPosted = $("#IsPosted").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    if (isNaN(accountId) || accountId == "") {
        swal({
            title: Resources.ChooseAccountResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else {
        $('.exportExcel').fadeIn('slow');
        $('#GridAccountMovementBankReport').data('kendoGrid').dataSource.read({ accountId: accountId, dateFrom: dateFrom, dateTo: dateTo, isPosted: isPosted, fK_DefBranchId: fK_DefBranchId, withoutCostCenter: withoutCostCenter }).then(function () {

            var firstItem = $('#GridAccountMovementBankReport').data().kendoGrid.dataSource.data()[0];

            //set col reason  value
            firstItem["voucherDate"] = " ";
            firstItem["referenceDate"] = " ";
            var grid = $("#GridAccountMovementBankReport").data("kendoGrid");
            grid.saveChanges();

        });
    }
});

$(".exportExcel").on('click', function () {
    $("#GridAccountMovementBankReport").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    var accountId = parseInt($("#accountsDDLTree").data("kendoDropDownList").value()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        isSubAccountSupport = $("#IsSubAccountSupport").prop("checked"),
        isTotalAccountZero = $("#IsTotalAccountZero").prop("checked"),
        withoutCostCenter = $('#chkWithoutCostcenter').prop('checked'),
        isPosted = $("#IsPosted").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    if (isNaN(accountId) || accountId == "") {
        swal({
            title: Resources.ChooseAccountResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    } else {
        var url = "/CbBondRpt/MovementBankReportPrint?accountId=" + accountId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isPosted=" + isPosted + "&fK_DefBranchId=" + fK_DefBranchId + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&withoutCostCenter=" + withoutCostCenter;
        window.open(url, '_blank').print();
    }
});

function getFinalBalance() {

    var balance = 0.00;
    var gridReport = $("#GridAccountMovementBankReport").data("kendoGrid")
    // var gridData = gridReport.dataSource.view();
    var gridData = gridReport.dataSource._data;
    if (gridData != null && gridData != undefined) {
        var lastRowIdx = gridData.length - 1;
        if (lastRowIdx >= 0) {
            balance = gridData[lastRowIdx].balance;
        }
    }
    setGridSerial();
    return numberWithCommas(parseFloat(balance).toFixed(2));
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function setGridSerial() {

    var grid = $("#GridAccountMovementBankReport").data("kendoGrid");
    var counter = 1;
    grid.tbody.find("tr[role='row']").each(function () {

        $(this).find(".counter").text(counter);
        counter += 1;

    });
}