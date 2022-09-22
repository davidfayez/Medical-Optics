$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#multiSelectCostCenter").data("kendoDropDownTree").value("");
        $("#multiSelectCostCenter").data("kendoDropDownTree").dataSource.read();

        $("#FK_HrEmployeeId").data("kendoDropDownTree").value("");
        $("#FK_HrEmployeeId").data("kendoDropDownTree").dataSource.read();

        $("#accountsDDLTree").data("kendoDropDownTree").value("");
        $("#accountsDDLTree").data("kendoDropDownTree").dataSource.read();

        $("#FK_TaxesId").data("kendoDropDownTree").value("");
        $("#FK_TaxesId").data("kendoDropDownTree").dataSource.read();
    });

    if ($('input[name="chkWithoutCostcenter"]').prop("checked") == true) {
        $("#multiSelectCostCenter").data("kendoDropDownTree").value("");
    }
   



    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/GlReports/GetAccountMovementReport",
                Type: "GET"
            }
        },
        error: function (e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        pageSize: 20,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false },
                    description: { editable: false },
                    serial: { editable: false },
                    referenceNumber: { editable: false },
                    voucherCode: { editable: false },
                    voucherDate: { type: "date", editable: false },
                    referenceDate: { type: "date", editable: false },
                    debit: { type: "number" },
                    cridet: { type: "number" },
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

    $("#GridAccountMovementReport").kendoGrid({
        excel: {
            fileName: "Account Movement Report.xlsx",
            allPages: true,
            filterable: true
        },
        dataSource: dataSource,
        pageSize: 20,
        serverPaging: Resources.GridServerPaging,
        serverFiltering: Resources.GridServerFiltering,
        filterable: Resources.GridFilterable,
        height: Resources.GridHeight,
        groupable: Resources.GridGroupable,
        sortable: Resources.GridSortable,
        resizable: Resources.GridResizable,
        noRecords: Resources.GridServerPaging,
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
            { field: "serial", title: Resources.VoucherCodeResource, width: Resources.NameWidth },
            { field: "voucherDate", title: Resources.VoucherDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "referenceNumber", title: Resources.ReferenceNumber, width: Resources.NameWidth },
            { field: "referenceDate", title: Resources.BondDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "debit", title: Resources.DebitResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.TotalDebit + ": #: kendo.toString(sum, 'n2') # " },
            { field: "credit", title: Resources.CreditResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.TotalCredit + ": #: kendo.toString(sum, 'n2') # " },
            { field: "balance", title: Resources.BalanceResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.BalanceResource + ": <span id='finalBalance'> #: window.getFinalBalance()#</span>" },
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPosted' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Posted },
            { width: Resources.DoubleActionWidth, template: "#if(fk_TransactionTypeId==1){# <a href='/GlJournalVoucher/GlJournalVoucherDetailsReport/#= id #'  target='_blank' class='btn btn-success btn-sm'><i class='fas fa-eye'></i></a>#}else if(fk_TransactionTypeId==2){#<a href='/GlBond/GlBondDetailsReport/#= id #'  target='_blank' class='btn btn-success btn-sm'><i class='fas fa-eye'></i></a> #}#" },
        ],
        dataBound: function (e) {

            e.sender.items().each(function () {

                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.isActive) {
                    $(this).addClass("k-state-selected");
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

    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET",

            },
            parameterMap: function (data, action) {
                
                if (action === "read") {
                    
                    if (data != undefined && data.id != undefined && data.id > 0) {
                        return {
                            id: data.id,
                            defBranchId: parseInt($("#FK_DefBranchId").val())
                        };
                    }
                    else {
                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val())
                        };
                    }



                } else {
                    return data;
                }
            },
        },

        requestEnd: function (response) {
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });
    var counter = 0;
    var firstRequest = true;
    $("#accountsDDLTree").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: false,
        //checkAll: false,
        autoClose: false,
        dataBound: function (e) {
            if (firstRequest == true) {

                $("#iRefreshGLAccount").addClass("fa-spin");
                $("#accountsDDLTree").data("kendoDropDownTree").enable(false);
                var ddt = e.sender;
                var dataSource = ddt.dataSource;
                var node = e.node;

                if (!node) {
                    var children = dataSource.data();

                    children.forEach(function (item, index) {
                        if (item.hasChildren) {
                            counter++;
                        }
                    });
                } else {
                    var children = ddt.treeview.dataItem(node).children.data();

                    children.forEach(function (item, index) {
                        if (item.hasChildren) {
                            counter++;
                        }
                    });

                    counter--;
                }

                if (counter === 0) {
                    // alert("Fully bound");
                    firstRequest = false;
                    $("#accountsDDLTree").data("kendoDropDownTree").enable(true);
                    $("#iRefreshGLAccount").removeClass("fa-spin");
                }
            }

        }
    });



    //Multi select 

    $("#multiSelectCostCenter").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "codeAndName",
        dataValueField: "id",
        height: 300,
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllAutoCompleteBySearchInBranch",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            code: $("#multiSelectCostCenter").text(),
                            fK_DefBranchId: $("#FK_DefBranchId").val()
                        };


                    } else {
                        return data;
                    }
                }
            }
        }

    });


    $("#FK_TaxesId").kendoDropDownTree({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        checkboxes: true,
        checkAll: true,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Taxes/GetAllTaxesForDDTree",
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
        }

    });
    $("#FK_HrEmployeeId").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "codeAndName",
        dataValueField: "id",
        height: 300,
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeesForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            code: $("#FK_HrEmployeeId").text(),
                            defBranchId: parseInt($("#FK_DefBranchId").val())
                        };


                    } else {
                        return data;
                    }
                }
            }
        }

    });

});

$(".exportExcel").on('click', function () {
    $("#GridAccountMovementReport").getKendoGrid().saveAsExcel();
});

$("#btnDataReview").on('click', function () {

    var accountId = parseInt($("#accountsDDLTree").data("kendoDropDownTree").value()),
        costCenterId = parseInt($("#FK_CostCenterId").val()),
        description = $("#Description").val(),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        isPosted = $("#IsPosted").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var multiselect = $("#multiSelectCostCenter").data("kendoDropDownTree");
    var costCenterIds = multiselect.value().join(", ");
    var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
    var taxIds = multiTax.value().join(", ");
    var multiemp = $("#FK_HrEmployeeId").data("kendoDropDownTree");
    var empIds = multiemp.value().join(", ");
    var withoutCostCenter = $('#chkWithoutCostcenter').prop('checked');
    if (withoutCostCenter == true)
        costCenterIds = '';

    var isselect = false;
    if (accountId > 0) {
        isselect = true;
    } else if (costCenterIds.length > 0) {
        isselect = true;
    } else if (taxIds.length > 0) {
        isselect = true;
    } else if (empIds.length > 0) {
        isselect = true;
    }
    else {
        swal({
            title: Resources.SelectAtLeastOneToSearch,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    if (isselect) {
        $('.exportExcel').fadeIn('slow');

        $('#GridAccountMovementReport').data('kendoGrid').dataSource.read({ accountId: accountId, costCenterIds: costCenterIds, dateFrom: dateFrom, dateTo: dateTo, isPosted: isPosted, fK_DefBranchId: fK_DefBranchId, taxIds: taxIds, empIds: empIds, withoutCostCenter: withoutCostCenter, description: description }).then(function () {

            var firstItem = $('#GridAccountMovementReport').data().kendoGrid.dataSource.data()[0];

            //set col reason  value
            firstItem["voucherDate"] = " ";
            firstItem["referenceDate"] = " ";
            var grid = $("#GridAccountMovementReport").data("kendoGrid");
            grid.saveChanges();

        });
    }


});

$(".btnPrint").on('click', function () {
    var accountId = parseInt($("#accountsDDLTree").data("kendoDropDownTree").value()),
        costCenterId = parseInt($("#FK_CostCenterId").val()),
        description = $("#Description").val(),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        isSubAccountSupport = $("#IsSubAccountSupport").prop("checked"),
        isTotalAccountZero = $("#IsTotalAccountZero").prop("checked"),
        isPosted = $("#IsPosted").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var multiselect = $("#multiSelectCostCenter").data("kendoDropDownTree");
    var costCenterIds = multiselect.value().join(", ");
    var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
    var taxIds = multiTax.value().join(", ");
    var multiemp = $("#FK_HrEmployeeId").data("kendoDropDownTree");
    var empIds = multiemp.value().join(", ");
    var withoutCostCenter = $('#chkWithoutCostcenter').prop('checked');
    if (withoutCostCenter == true)
        costCenterIds = "";

    var isselect = false;
    if (accountId > 0) {
        isselect = true;
    } else if (costCenterIds.length > 0) {
        isselect = true;
    } else if (taxIds.length > 0) {
        isselect = true;
    } else if (empIds.length > 0) {
        isselect = true;
    }
    else {
        swal({
            title: Resources.SelectAtLeastOneToSearch,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }

    if (isselect) {
        var url = "/GlReports/AccountMovementReportPrint?accountId=" + accountId + "&costCenterIds=" + costCenterIds + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isPosted=" + isPosted + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId + "&taxIds=" + taxIds + "&empIds=" + empIds + "&description=" + description;
        window.open(url, '_blank').print();

    }
});

function getFinalBalance() {
   
    var balance = 0.00;
    var gridReport = $("#GridAccountMovementReport").data("kendoGrid")
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

    var grid = $("#GridAccountMovementReport").data("kendoGrid");
    var counter = 1;
    grid.tbody.find("tr[role='row']").each(function () {

        $(this).find(".counter").text(counter);
        counter += 1;

    });
}