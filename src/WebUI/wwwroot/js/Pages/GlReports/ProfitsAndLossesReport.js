$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_GlAccountTypeId").data("kendoDropDownTree").value("");
        $("#FK_GlAccountTypeId").data("kendoDropDownTree").dataSource.read();
    });
    // Multi Select categories

    $("#multiCategories").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "categoryNameAr",
        dataValueField: "id",
        height: 300,
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: {
            transport: {
                read: {
                    url: "/GlAccountCategory/GetAllGlAccountCategory"
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
    var catIds = [2];
    $("#multiCategories").data("kendoDropDownTree").value(catIds);
    $("#FK_GlAccountTypeId").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "typeNameAr",
        dataValueField: "id",
        height: 300,
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/GlAccountType/GetAllGlAccountTypes",
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

    /*********** start Tree List Result */
    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/GlReports/GetProfitsAndLossesReport",
                dataType: "json",
                Type: "GET"
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    var dateFrom = $("#DateFrom").val(),
                        dateTo = $("#DateTo").val(),
                        isPosted = $("#IsPosted").val();
                    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

                    var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked");
                    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");

                    var multiCategoriesValue = $("#multiCategories").data("kendoDropDownTree");
                    var multiCategories = multiCategoriesValue.value().join(", ");
                    var GlAccountTypesValue = $("#FK_GlAccountTypeId").data("kendoDropDownTree");
                    var fK_GlAccountTypeId = GlAccountTypesValue.value().join(", ");
                    var isPosted = $("#IsPosted").val();


                    return {

                        dateFrom: dateFrom,
                        dateTo: dateTo,
                        isTotalAccountZero: isTotalAccountZero,
                        isSubAccountSupport: isSubAccountSupport,
                        isPosted: isPosted,
                        fK_DefBranchId: fK_DefBranchId,
                        multiCategories: multiCategories,
                        fK_GlAccountTypeId: fK_GlAccountTypeId,
                        firstRequest: $("#hdnFirstRequest").val(),
                    };
                } else {
                    return data;
                }
            }
        },
        error: function (e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        pageSize: 20,

        schema: {
            model: {
                id: "accountId",
                parentId: "parentId",
                fields: {
                    id: { editable: false },
                    accountId: { type: "number", nullable: false },
                    parentId: { field: "parentId", nullable: true },
                    accountCode: { type: "string", validation: { required: true } },
                    accountName: { type: "string", validation: { required: true } },
                    debit: { type: "number" },
                    credit: { type: "number" },
                    sumDebit: { type: "number" },
                    sumCredit: { type: "number" },
                    balance: { type: "number" }
                }
            }
        },
        aggregate: [
            { field: "debit", aggregate: "sum" },
            { field: "credit", aggregate: "sum" },
            { field: "balance", aggregate: "sum" }
        ]
    });

    $("#GridProfitsAndLossesReport").kendoTreeList({
        excel: {
            fileName: "Profits And Losses  Report.xlsx",
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

            { field: "accountCode", title: Resources.Code, width: Resources.NameWidth },
            { field: "accountName", title: Resources.NameArResource, width: Resources.NameWidth, template: '#if(isMainAccount){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#', },
            { field: "debit", title: Resources.DebitResource, width: Resources.AmountWidth, format: '{0:n2}' },
            { field: "credit", title: Resources.CreditResource, width: Resources.AmountWidth, format: '{0:n2}' },
            //    { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPosted' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Posted },
            //    { width: Resources.DoubleActionWidth, template: "#if(fk_TransactionTypeId==1){# <a href='/GlJournalVoucher/GlJournalVoucherDetailsReport/#= id #'  target='_blank' class='btn btn-success btn-sm'><i class='fas fa-eye'></i></a>#}else if(fk_TransactionTypeId==2){#<a href='/GlBond/GlBondDetailsReport/#= id #'  target='_blank' class='btn btn-success btn-sm'><i class='fas fa-eye'></i></a> #}#" },
        ],
        dataBound: function (e) {
           
            SetSummary();
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
    //$('#GridProfitsAndLossesReport').data('kendoTreeList').dataSource.page(1); // select current page


});

$(".exportExcel").on('click', function () {
    $("#GridProfitsAndLossesReport").getKendoGrid().saveAsExcel();
});

$("#btnDataReview").on('click', function () {
    $("#hdnFirstRequest").val('false');

    var multiCategoriesValue = $("#multiCategories").data("kendoDropDownTree");
    var multiCategories = multiCategoriesValue.value().join(", ");



    if (multiCategories.length > 0) {
        $('.exportExcel').fadeIn('slow');
        $('#GridProfitsAndLossesReport').data('kendoTreeList').dataSource.read();
    }
    else {
        swal({
            title: Resources.ChooseResource + " " + Resources.AccountCategory,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }


});
$(".btnPrint").on('click', function () {
    var dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        isPosted = $("#IsPosted").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked");
    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");

    var multiCategoriesValue = $("#multiCategories").data("kendoDropDownTree");
    var multiCategories = multiCategoriesValue.value().join(", ");
    var GlAccountTypesValue = $("#FK_GlAccountTypeId").data("kendoDropDownTree");
    var fK_GlAccountTypeId = GlAccountTypesValue.value().join(", ");
    var isPosted = $("#IsPosted").val();



    if (multiCategories.length > 0) {
        var url = "/GlReports/ProfitsAndLossesReportPrint?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isPosted=" + isPosted + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId + "&multiCategories=" + multiCategories + "&fK_GlAccountTypeId=" + fK_GlAccountTypeId;
        window.open(url, '_blank').print();
    }
    else {
        swal({
            title: Resources.ChooseResource + " " + Resources.AccountCategory,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }

    if (isselect) {


    }
});

function SetSummary() {

    //var sumTotalCredit = 0.00;
    //var sumTotalDebit = 0.00;

    var sumCredit = 0.00;
    var sumDebit = 0.00;

    var treeReport = $("#GridProfitsAndLossesReport").data("kendoTreeList")

    var treeData = treeReport.dataSource._data;
    if (treeData != null && treeData != undefined) {
        var lastRowIdx = treeData.length - 1;
        if (lastRowIdx >= 0) {
            
            //sumTotalCredit = treeData[lastRowIdx].sumTotalCredit;
            //sumTotalDebit = treeData[lastRowIdx].sumTotalDebit;

            sumCredit = treeData[lastRowIdx].sumCredit;
            sumDebit = treeData[lastRowIdx].sumDebit;
        }
    }
    sumCredit = numberWithCommas(parseFloat(sumCredit).toFixed(2));
    sumDebit = numberWithCommas(parseFloat(sumDebit).toFixed(2));

    $('#sumTotalCredit').val(sumCredit);
    $('#sumTotalDebit').val(sumDebit);

    return '';
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}