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
    var catIds = [3];
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


    var dataSourceAssets = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/GlReports/GetAssetsReport",
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
                    //id: { editable: false },
                    accountId: { type: "number", nullable: false },
                    parentId: { field: "parentId", nullable: true },
                    accountName: { type: "string", validation: { required: true } },
                    balance: { type: "number" },
                }
            }
        }
        ,
        aggregate: [
            { field: "balance", aggregate: "sum" },
        ]
    });
    var dataSourceDiscounts = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/GlReports/GetDiscountsReport",
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
                    //id: { editable: false },
                    accountId: { type: "number", nullable: false },
                    parentId: { field: "parentId", nullable: true },
                    accountName: { type: "string", validation: { required: true } },
                    balance: { type: "number" },
                }
            }
        },
        aggregate: [
            { field: "balance", aggregate: "sum" },
        ]
    });
    $("#Assets").kendoTreeList({
        excel: {
            fileName: "Balance And Financial Center Report (Assets).xlsx",
            allPages: true,
            filterable: true
        },
        dataSource: dataSourceAssets,
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
            {
                field: "accountName", title: Resources.AccountName, width: Resources.NameWidth, template: '#if(isMainAccount){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#',
            },
            {
                title: Resources.Assets,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [

                    {
                        field: "balance", title: Resources.BalanceResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # "
                    }
                ],
               
            },

        ], dataBound: function (e) {
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
        }
    });

    $("#Discounts").kendoTreeList({
        excel: {
            fileName: "Balance And Financial Center Report (Discounts) .xlsx",
            allPages: true,
            filterable: true
        },
        dataSource: dataSourceDiscounts,
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
            {
                field: "accountName", title: Resources.AccountName, width: Resources.NameWidth, template: '#if(isMainAccount){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#',
            },
            {
                title: Resources.Discounts,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [

                    {
                        field: "balance", title: Resources.BalanceResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.TotalDebit + ": #: kendo.toString(sum, 'n2') # "
                    }
                ],
              
            },
        ], dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
            });
            SetDiscountSummary();
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


    //$('#GridBalanceAndFinancialCenterReport').data('kendoTreeList').dataSource.page(1); // select current page


    $("#btnDataReview").on('click', function () {
        $("#hdnFirstRequest").val('false');


        $('.exportExcel').fadeIn('slow');
        $('#Assets').data('kendoTreeList').dataSource.read();
        $('#Discounts').data('kendoTreeList').dataSource.read();

    });
});


$(".exportExcel").on('click', function () {
    $("#Discounts").getKendoGrid().saveAsExcel();
    $("#Assets").getKendoGrid().saveAsExcel();
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

    var url = "/GlReports/BalanceAndFinancialCenterReportPrint?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isPosted=" + isPosted + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId + "&multiCategories=" + multiCategories + "&fK_GlAccountTypeId=" + fK_GlAccountTypeId;
    window.open(url, '_blank').print();


});
function SetSummary() {

    var sumBalance = 0.00;
    var treeReport = $("#Assets").data("kendoTreeList")

    var treeData = treeReport.dataSource._data;
    if (treeData != null && treeData != undefined) {
        var lastRowIdx = treeData.length - 1;
        if (lastRowIdx >= 0) {
            sumBalance = treeData[lastRowIdx].sumBalance;
        }
    }
    sumBalance = numberWithCommas(parseFloat(sumBalance).toFixed(2));
    $('#sumTotalCredit').val(sumBalance);
    return '';
};
function SetDiscountSummary() {
 
    var sumBalance = 0.00;
    var treeReport = $("#Discounts").data("kendoTreeList")
    var treeData = treeReport.dataSource._data;
    if (treeData != null && treeData != undefined) {
        var lastRowIdx = treeData.length - 1;
        if (lastRowIdx >= 0) {
            sumBalance = treeData[lastRowIdx].sumBalance;
        }
    }
    sumBalance = numberWithCommas(parseFloat(sumBalance).toFixed(2));
    $('#sumTotalDebit').val(sumBalance);

    return '';
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}