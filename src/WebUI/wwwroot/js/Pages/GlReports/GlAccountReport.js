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

    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/GlReports/GetGlAccountReport",
                dataType: "json",
                Type: "GET"
            },
            parameterMap: function (data, action) {

                if (action === "read") {

                    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
                    var periodId = parseInt($("#FK_GlFinancialId").val());
                    var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked");
                    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");

                    var multiCategoriesValue = $("#multiCategories").data("kendoDropDownTree");
                    var multiCategories = multiCategoriesValue.value().join(", ");
                    var GlAccountTypesValue = $("#FK_GlAccountTypeId").data("kendoDropDownTree");
                    var fK_GlAccountTypeId = GlAccountTypesValue.value().join(", ");


                    return {

                        isTotalAccountZero: isTotalAccountZero,
                        isSubAccountSupport: isSubAccountSupport,

                        fK_DefBranchId: fK_DefBranchId,
                        multiCategories: multiCategories,
                        fK_GlAccountTypeId: fK_GlAccountTypeId,
                        periodId: periodId,
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
                    finincialPeriodId: { type: "number" },
                    parentId: { field: "parentId", nullable: true },
                    accountCode: { type: "string", validation: { required: true } },
                    accountName: { type: "string", validation: { required: true } },
                    accountCategory: { type: "string" },
                    accountType: { type: "string" },

                    openingDebit: { type: "number" },
                    openingCredit: { type: "number" },

                    currentDebit: { type: "number" },
                    currentCredit: { type: "number" },

                    debit: { type: "number" },
                    credit: { type: "number" },
                    balance: { type: "number" }
                }
            }
        },
        aggregate: [
            { field: "openingDebit", aggregate: "sum" },
            { field: "openingCredit", aggregate: "sum" },
            { field: "debit", aggregate: "sum" },
            { field: "credit", aggregate: "sum" },
        ]
    });

    var treeList = $("#GridGlAccountReport").kendoTreeList({
        dataSource: dataSource,
        pageable: true,
        excel: {
            fileName: "Gl Account Report.xlsx",
            allPages: Resources.GridAllPages,
            filterable: Resources.GridFilterable
        },
        height: 540,
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
            pageSizes: [20, 40, 60, Resources.All],
            numeric: Resources.GridNumeric,
            refresh: Resources.GridRefresh,

        },
        columns: [
            {
                field: "accountCode",
                title: Resources.AccountCodeResource,
                width: Resources.CodeWidth,
                //footerTemplate: "#= count # " 
            },
            {
                field: "accountName",
                title: Resources.AccountNameResource,
                width: Resources.NameWidth,
                template: '#if(isMainAccount){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#',
            }, {
                field: "accountCategory",
                title: Resources.AccountCategory,
                width: Resources.NameWidth,
            }, {
                field: "accountType",
                title: Resources.CbAccountTypeResource,
                width: Resources.NameWidth,
            },
            {
                title: Resources.OpeningBalance,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [{
                    field: "openingDebit",
                    title: Resources.DebitResource,
                    width: Resources.AmountWidth,
                    // footerTemplate: Resources.TotalDebit + ": #: kendo.toString(sum, '0.00') # ",
                    format: '{0:n2}',
                    // template: "#: kendo.toString(debit, '0.00')#",
                }, {
                    field: "openingCredit",
                    title: Resources.CreditResource,
                    width: Resources.AmountWidth,
                    //  footerTemplate: Resources.TotalCredit + ": #: kendo.toString(sum, '0.00') # ",
                    format: '{0:n2}',
                    //template: "#: kendo.toString(credit, '0.00')#",

                }]
            },
            {
                title: Resources.CurrentMovementResources,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [
                    {
                        field: "debit",
                        title: Resources.DebitResource,
                        width: Resources.AmountWidth,
                        format: '{0:n2}',
                        //template: "#: kendo.toString(totalDebit, '0.00')#",
                        // footerTemplate: Resources.TotalDebit + "<span id='divTotalDebit' class= 'label danger'>Danger</span> "
                        //footerTemplate: Resources.TotalDebit + ": #: kendo.toString(mySum, '0.00') # "
                    },
                    {
                        field: "credit",
                        title: Resources.CreditResource,
                        width: Resources.AmountWidth,
                        format: '{0:n2}',
                        //template: "#: kendo.toString(totalCridet, '0.00')#",

                        /*   footerTemplate: Resources.TotalCredit + ": #: kendo.toString(sum, '0.00') # "*/
                    }
                ]
            },


            { width: Resources.ActionWidth, template: "#if(isMainAccount==true){# #}else{#<button class='btn btn-warning btn-sm btnOpenDetails'><i class='fas fa-eye'></i></button> #}#" },

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);

            });
            SetSummary();
        },

    });
    treeList.data("kendoTreeList").table.on("click", ".btnOpenDetails", OpenDetails);
    /* $('#GridGlAccountReport').data('kendoTreeList').dataSource.page(1);*/
    function OpenDetails() {
        var row = $(this).closest("tr"),
            grid = $("#GridGlAccountReport").data("kendoTreeList"),
            dataItem = grid.dataItem(row);
        loadDistributionOpeningBalanceDetaillGrid(dataItem.accountId, dataItem.finincialPeriodId);
        $("#balanceDetailModal").modal();
    }

    $("#btnDataReview").on('click', function () {

        $('.exportExcel').fadeIn('slow');
        $('#GridGlAccountReport').data('kendoTreeList').dataSource.read();

    });

    //Grid Distribution Opening Balance Detaill
    function loadDistributionOpeningBalanceDetaillGrid(accId, fpId) {
        debugger
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlAccountOpeningBalance/GetDistributionOpeningBalanceDetails?accId=" + accId + "&fpId=" + fpId,
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
            /*      scrollable: true,*/
            //sortable: true,
            //reorderable: true,
            //groupable: true,

            //pageSize: 20,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: true },
                        description: { editable: false },
                        balanceDate: { type: "date", editable: false },
                        fK_CostCenterId: { editable: false },
                        costCenter: { editable: false },
                        fK_HrEmployeeId: { editable: false },
                        employee: { editable: false },
                        fK_TaxesId: { editable: false },
                        tax: { editable: false },
                        debit: { editable: false },
                        credit: { editable: false },

                    }
                }
            }
        });
        var balanceDetailGrid = $("#balanceDetailGrid").kendoGrid({
            dataSource: tempSource,
            excel: {
                fileName: "Distribution Of Opening Balances.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            /*  scrollable: true,*/
            //sortable: true,
            //reorderable: true,
            //groupable: true,
            /*     resizable: true,*/
            pageable: false,
            columns: [
                { field: "fK_CostCenterId", hidden: true, format: "{0:c}" },
                { field: "fK_HrEmployeeId", hidden: true, format: "{0:c}" },
                { field: "fK_TaxesId", hidden: true, format: "{0:c}" },
                { field: "balanceDate", hidden: true, format: "{0:yyyy/MM/dd}" },
                { field: "description", title: Resources.DescriptionResource, width: Resources.NameWidth },
                { field: "costCenter", title: Resources.CostCenter, width: Resources.NameWidth },
                { field: "tax", title: Resources.TaxCategory, width: Resources.NameWidth },
                { field: "employee", title: Resources.EmployeeName, width: Resources.NameWidth },
                { field: "debit", title: Resources.Debit, width: Resources.InputNumberWidth },
                { field: "credit", title: Resources.Credit, width: Resources.InputNumberWidth },

                // { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: false,
            selectable: "multiple, cell",


        });

        //  balanceDetailGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
        //tempSource.fetch(function () {

        //    getTotalDebit();
        //    getTotalCredit();

        //});
    }

});


$(".exportExcel").on('click', function () {
    $("#GridGlAccountReport").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {

    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked"),
        isTotalAccountZero = $("#IsTotalAccountZero").prop("checked"),
        lastParentsMain = $("#lastParentsMain").prop("checked"),
        lastParentsMainAndSub = $("#lastParentsMainAndSub").prop("checked");

    var multiCategoriesValue = $("#multiCategories").data("kendoDropDownTree");
    var multiCategories = multiCategoriesValue.value().join(", ");
    var GlAccountTypesValue = $("#FK_GlAccountTypeId").data("kendoDropDownTree");
    var fK_GlAccountTypeId = GlAccountTypesValue.value().join(", ");
    var periodId = parseInt($("#FK_GlFinancialId").val());

    var url = "/GlReports/GlAccountReportPrint?isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId + "&multiCategories=" + multiCategories + "&fK_GlAccountTypeId=" + fK_GlAccountTypeId + "&periodId=" + periodId + "&lastParentsMain=" + lastParentsMain + "&lastParentsMainAndSub=" + lastParentsMainAndSub;
    window.open(url, '_blank').print();

});

function SetSummary() {
    var sumOpeningDebit = 0.00;
    var sumOpeningCredit = 0.00;
    var sumCredit = 0.00;
    var sumDebit = 0.00;

    var treeReport = $("#GridGlAccountReport").data("kendoTreeList")

    var treeData = treeReport.dataSource._data;
    if (treeData != null && treeData != undefined) {
        var lastRowIdx = treeData.length - 1;
        if (lastRowIdx >= 0) {
            sumOpeningDebit = treeData[lastRowIdx].sumOpeningDebit;
            sumOpeningCredit = treeData[lastRowIdx].sumOpeningCredit;

            sumCredit = treeData[lastRowIdx].sumCredit;
            sumDebit = treeData[lastRowIdx].sumDebit;

        }
    }
    sumOpeningDebit = numberWithCommas(parseFloat(sumOpeningDebit).toFixed(2));
    sumOpeningCredit = numberWithCommas(parseFloat(sumOpeningCredit).toFixed(2));

    sumCredit = numberWithCommas(parseFloat(sumCredit).toFixed(2));
    sumDebit = numberWithCommas(parseFloat(sumDebit).toFixed(2));


    $('#sumOpeningDebit').val(sumOpeningDebit);
    $('#sumOpeningCredit').val(sumOpeningCredit);

    $('#sumCredit').val(sumCredit);
    $('#sumDebit').val(sumDebit);

    return '';
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}