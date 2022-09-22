
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

    // kendoDropDownTree
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET",
            },
            async: false,
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
            }
        },
        /*serverFiltering: false,*/
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
        //serverFiltering: false,
        filter: "contains",
        checkboxes: true,
        checkAll: true,
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


    // cost Center Multi select

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
                            defBranchId: $("#FK_DefBranchId").val()
                        };


                    } else {
                        return data;
                    }
                }
            }
        }

    });

    //************** Tree List Result ************/
    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/GlReports/GetAccountBalanceMovement",
                dataType: "json",
                Type: "GET"
            },

            parameterMap: function (data, action) {

                if (action === "read") {

                    var datefrom = $("#inputDateFrom").val();
                    var dateto = $("#inputDateTo").val();
                    var ids = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");

                    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());


                    var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked");
                    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");
                    var multiselect = $("#multiSelectCostCenter").data("kendoDropDownTree");
                    var costCenterIds = multiselect.value().join(", ");
                    var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
                    var taxIds = multiTax.value().join(", ");
                    var multiemp = $("#FK_HrEmployeeId").data("kendoDropDownTree");
                    var empIds = multiemp.value().join(", ");

                    return {
                        ids: ids,
                        costCenterIds: costCenterIds,
                        dateFrom: datefrom,
                        dateTo: dateto,
                        isTotalAccountZero: isTotalAccountZero,
                        isSubAccountSupport: isSubAccountSupport,
                        fK_DefBranchId: fK_DefBranchId,
                        taxIds: taxIds,
                        empIds: empIds,
                        firstRequest: $("#hdnFirstRequest").val()
                    };
                } else {
                    return data;
                }
            }
        },
        //batch: true,
        schema: {
            model: {
                id: "accountId",
                parentId: "parentId",
                fields: {
                    accountId: { type: "number", nullable: false },
                    parentId: { field: "parentId", nullable: true },
                    accountCode: { type: "string" },
                    accountName: { type: "string" },
                    accountParentCode: { type: "string" },
                    accountParentName: { type: "string" },
                    balance: { type: "number" },
                    totalCridet: { type: "number" },
                    totalDebit: { type: "number" },
                    credit: { type: "number" },
                    debit: { type: "number" },
                    sumTotalCredit: { type: "number", nullable: true },
                    sumTotalDebit: { type: "number", nullable: true },
                    sumCreditTransaction: { type: "number", nullable: true },
                    sumDebitTransaction: { type: "number", nullable: true },

                    SumDebit: { type: "number", nullable: true },
                    sumDebit: { type: "number", nullable: true },
                }
            }
        },

        aggregate: [
            { field: "totalDebit", aggregate: "sum" },
            { field: "totalCridet", aggregate: "sum" },
            { field: "balance", aggregate: "sum" },
            { field: "credit", aggregate: "sum" },
            { field: "debit", aggregate: "sum" },
            { field: "accountCode", aggregate: "count" }
        ],

    });

    var treeList = $("#gridGlMovementBalance").kendoTreeList({
        dataSource: dataSource,
        pageable: true,
        excel: {
            fileName: "GL Movement Balance.xlsx",
            allPages: Resources.GridAllPages,
            filterable: Resources.GridFilterable
        },
        height: 540,
        pageSize: 20,
        serverPaging: Resources.GridServerPaging,
        serverFiltering: Resources.GridServerFiltering,
        filterable: Resources.GridFilterable,
        height: Resources.GridHeight,
        groupable: Resources.GridGroupable,
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
            },
            {
                title: Resources.CurrentMovementResources,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [
                    {
                        field: "totalDebit",
                        title: Resources.DebitResource,
                        width: Resources.AmountWidth,
                        format: '{0:n2}',
                        //template: "#: kendo.toString(totalDebit, '0.00')#",
                        footerTemplate: Resources.TotalDebit + "<span id='divTotalDebit' class= 'label danger'>Danger</span> "
                        //footerTemplate: Resources.TotalDebit + ": #: kendo.toString(mySum, '0.00') # "
                    },
                    {
                        field: "totalCridet",
                        title: Resources.CreditResource,
                        width: Resources.AmountWidth,
                        format: '{0:n2}',
                        //template: "#: kendo.toString(totalCridet, '0.00')#",

                        footerTemplate: Resources.TotalCredit + ": #: kendo.toString(sum, '0.00') # "
                    }
                ]
            }, {
                title: Resources.MovementBalanceResources,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [{
                    field: "debit",
                    title: Resources.DebitResource,
                    width: Resources.AmountWidth,
                    footerTemplate: Resources.TotalDebit + ": #: kendo.toString(sum, '0.00') # ",
                    format: '{0:n2}',
                    // template: "#: kendo.toString(debit, '0.00')#",
                }, {
                    field: "credit",
                    title: Resources.CreditResource,
                    width: Resources.AmountWidth,
                    footerTemplate: Resources.TotalCredit + ": #: kendo.toString(sum, '0.00') # ",
                    format: '{0:n2}',
                    //template: "#: kendo.toString(credit, '0.00')#",

                }]
            }

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);


            });
            SetSummary();
        },

    });

    $('#gridGlMovementBalance').data('kendoTreeList').dataSource.page(1);
    //********************End Tree List**************/
});

$(".exportExcel").on('click', function () {
    $("#gridGlMovementBalance").getKendoGrid().saveAsExcel();
});

$("#btnDataReview").click(function () {
    var datefrom = $("#inputDateFrom").val();
    var dateto = $("#inputDateTo").val();
    var ids = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked");
    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");
    var multiselect = $("#multiSelectCostCenter").data("kendoDropDownTree");
    var costCenterIds = multiselect.value().join(", ");
    var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
    var taxIds = multiTax.value().join(", ");
    var multiemp = $("#FK_HrEmployeeId").data("kendoDropDownTree");
    var empIds = multiemp.value().join(", ");

    if (ids == "" && costCenterIds == "" && taxIds == "" && empIds == "")
        $("#hdnFirstRequest").val('true');
    else
        $("#hdnFirstRequest").val('false');
    $('#gridGlMovementBalance').data('kendoTreeList').dataSource.read();
});

$(".btnPrint").on('click', function () {
    var dateFromPicker = new Date($("#inputDateFrom").val()),
        dateFrom = dateFromPicker.getFullYear() + '-' + (dateFromPicker.getMonth() + 1) + '-' + dateFromPicker.getDate(),
        dateToPicker = new Date($("#inputDateTo").val()),
        dateTo = dateToPicker.getFullYear() + '-' + (dateToPicker.getMonth() + 1) + '-' + dateToPicker.getDate();
    var accountId = parseInt($("#AccountId").val()),
        isSubAccountSupport = $("#IsSubAccountSupport").prop("checked"),
        isTotalAccountZero = $("#IsTotalAccountZero").prop("checked"),
        lastParentsMain = $("#lastParentsMain").prop("checked"),
        lastParentsMainAndSub = $("#lastParentsMainAndSub").prop("checked"),

        isPosted = $("#IsPosted").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var multiselect = $("#multiSelectCostCenter").data("kendoDropDownTree");
    var costCenterIds = multiselect.value().join(", ");
    var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
    var taxIds = multiTax.value().join(", ");
    var multiemp = $("#FK_HrEmployeeId").data("kendoDropDownTree");
    var empIds = multiemp.value().join(", ");

    var ids = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");

    var url = "/GlReports/MovementBalanceReportPrint?ids=" + ids + "&costCenterIds=" + costCenterIds + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId + "&taxIds=" + taxIds + "&empIds=" + empIds + "&lastParentsMain=" + lastParentsMain + "&lastParentsMainAndSub=" + lastParentsMainAndSub;
    window.open(url, '_blank').print();

});

function SetSummary() {
    var sumCreditTransaction = 0.00;
    var sumDebitTransaction = 0.00;
    var sumCredit = 0.00;
    var sumDebit = 0.00;
    var treeReport = $("#gridGlMovementBalance").data("kendoTreeList")

    var treeData = treeReport.dataSource._data;
    if (treeData != null && treeData != undefined) {
        var lastRowIdx = treeData.length - 1;
        if (lastRowIdx >= 0) {
            sumCreditTransaction = treeData[lastRowIdx].sumTotalCredit;
            sumDebitTransaction = treeData[lastRowIdx].sumTotalDebit;

            sumCredit = treeData[lastRowIdx].sumCredit;
            sumDebit = treeData[lastRowIdx].sumDebit;
        }
    }
    sumCreditTransaction = numberWithCommas(parseFloat(sumCreditTransaction).toFixed(2));
    sumDebitTransaction = numberWithCommas(parseFloat(sumDebitTransaction).toFixed(2));
    sumCredit = numberWithCommas(parseFloat(sumCredit).toFixed(2));
    sumDebit = numberWithCommas(parseFloat(sumDebit).toFixed(2));
    $('#SumCreditBalance').val(sumCreditTransaction);
    $('#SumDebitBalance').val(sumDebitTransaction);
    $('#sumCredit').val(sumCredit);
    $('#sumDebit').val(sumDebit);
    return '';
};
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}