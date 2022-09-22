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
    catIds = [1];
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
                url: "/GlReports/GetAccountMovementTradeReport",
                dataType: "json",
                Type: "GET"
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    debugger;
                    var dateFrom = $("#DateFrom").val();
                    var dateTo = $("#DateTo").val();
                    var multiCategoriesValue = $("#multiCategories").data("kendoDropDownTree");
                    var multiCategories = multiCategoriesValue.value().join(", ");

                    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

                    var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked");
                    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");


                    var typesIds = $("#FK_GlAccountTypeId").data("kendoDropDownTree").value().join(", ");

                    isPosted = $("#IsPosted").val();


                    return {

                        dateFrom: dateFrom,
                        dateTo: dateTo,
                        isTotalAccountZero: isTotalAccountZero,
                        isSubAccountSupport: isSubAccountSupport,
                        isPosted: isPosted,
                        fK_DefBranchId: fK_DefBranchId,
                        accountCategoryIds: multiCategories,
                        accountTypeIds: typesIds,
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
                    balance: { type: "number" }
                }
            }
        },
        aggregate: [
            { field: "debit", aggregate: "sum" },
            { field: "credit", aggregate: "sum" },
        ]
    });

    $("#GridAccountMovementTradeReport").kendoTreeList({
        excel: {
            fileName: "Account Movement Report.xlsx",
            allPages: true,
            filterable: true
        },
        dataSource: dataSource,
        pageSize: 20,
        serverPaging: false,
        serverFiltering: false,
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
            //{ field: "balance", title: Resources.BalanceResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.BalanceResource + ": <span id='finalBalance'> #: window.getFinalBalance()#</span>" },
        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
            });
            SetSummary();
        },

        excelExport: function (e) {
            var accountId = $("#accountName").val();
            var costCenterId = $("#costCenterName").val();
            if (accountId !== "")
                e.workbook.fileName = $("#accountName  option:selected").text();
            else if (costCenterId !== "")
                e.workbook.fileName = $("#costCenterName  option:selected").text();
        },

    });

    //  $('#GridAccountMovementTradeReport').data('kendoTreeList').dataSource.page(1);
    /*********** End Tree List Result ************/


});


$(".exportExcel").on('click', function () {
    $("#GridAccountMovementTradeReport").getKendoGrid().saveAsExcel();
});

$("#btnDataReview").on('click', function () {
    $("#hdnFirstRequest").val('false');

    var categoriesIds = $("#multiCategories").data("kendoDropDownTree").value().join(", ");

    if (categoriesIds.length > 0) {
        $('.exportExcel').fadeIn('slow');
        $('#GridAccountMovementTradeReport').data('kendoTreeList').dataSource.read();
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
    var categoriesIds = $("#multiCategories").data("kendoDropDownTree").value().join(", ");
    var typesIds = $("#FK_GlAccountTypeId").data("kendoDropDownTree").value().join(", ");
    var isPosted = $("#IsPosted").val();

    if (categoriesIds.length > 0) {
        var url = "/GlReports/AccountMovementTradeReportPrint?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isPosted=" + isPosted + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId + "&accountCategoryIds=" + categoriesIds + "&accountTypeIds=" + typesIds;
        window.open(url, '_blank').print();
    }
    else {
        swal({
            title: Resources.ChooseResource + " " + Resources.AccountCategory,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }

});


function SetSummary() {

    var sumCredit = 0.00;
    var sumDebit = 0.00;

    var treeReport = $("#GridAccountMovementTradeReport").data("kendoTreeList")

    var treeData = treeReport.dataSource._data;
    if (treeData != null && treeData != undefined) {
        var lastRowIdx = treeData.length - 1;
        if (lastRowIdx >= 0) {

            sumCredit = treeData[lastRowIdx].sumCredit;
            sumDebit = treeData[lastRowIdx].sumDebit;

        }
    }

    sumCredit = numberWithCommas(parseFloat(sumCredit).toFixed(2));
    sumDebit = numberWithCommas(parseFloat(sumDebit).toFixed(2));


    $('#sumCredit').val(sumCredit);
    $('#sumDebit').val(sumDebit);

    return '';
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}