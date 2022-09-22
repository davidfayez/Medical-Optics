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
                Type: "GET"
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
            }
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
            },
            requestEnd: function (response) {
            }
        }

    });


    /*************** Start Tree List Result ****************/
    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            type: "json",
            read: {
                url: "/GlReports/GetAccountBalanceMovement",
                Type: "GET"
            },

            parameterMap: function (data, action) {

                if (action === "read") {
                    var datefrom = $("#inputDateFrom").val();
                    var dateto = $("#inputDateTo").val();
                    var ids = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");
                    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

                    var costCenterId = parseInt($("#FK_CostCenterId").val());
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
                        firstRequest: $("#hdnFirstRequest").val(),
                        empIds: empIds
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
                    accountCode: { type: "string", validation: { required: true } },
                    accountName: { type: "string", validation: { required: true } },
                    sumCredit: { type: "number", nullable: true },
                    sumDebit: { type: "number", nullable: true },
                    sumPreviousDebit: { type: "number", nullable: true },
                    sumPreviousCredit: { type: "number", nullable: true },
                },
                //expanded: true
            }
        },
        aggregate: [
            //{ field: "accountCode", aggregate: "count" },
            //{ field: "previousDebit", aggregate: "max" }
            //{ field: "previousDebit", aggregate: "sum" },

        ]
    });

    var treeList = $("#gridGlMovementBalance").kendoTreeList({
        dataSource: dataSource,
        pageable: true,
        excel: {
            fileName: "GL Movement Audit.xlsx",
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
            { field: "accountCode", title: Resources.Code, width: Resources.NameWidth },

            { field: "accountName", title: Resources.NameArResource, width: Resources.NameWidth, template: '#if(isMainAccount){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#', },
            {
                title: Resources.PreviousBalanceResources,
                headerAttributes: {
                    style: "text-align: center"
                }, columns: [{
                    field: "previousDebit",
                    title: Resources.DebitResource,
                    width: Resources.AmountWidth,
                    format: '{0:n2}',
                    //footerTemplate: Resources.Total + ": #=  window.getTotalPreviousDebit() # "
                }, {
                    field: "previousCredit",
                    title: Resources.CreditResource,
                    width: Resources.AmountWidth,
                    format: '{0:n2}',
                    //template: "#: kendo.toString(previousCredit, '0.00')#",
                    /* footerTemplate: Resources.Total + ": #: kendo.toString(sum, '0.00') # "*/
                }]
            }, {
                title: Resources.CurrentBalanceResources,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [{
                    field: "debit",
                    title: Resources.DebitResource,
                    width: Resources.AmountWidth,
                    format: '{0:n2}',
                    //footerTemplate: "#= count # employee(s)"
                },

                {
                    field: "credit",
                    title: Resources.CreditResource,
                    width: Resources.AmountWidth,
                    format: '{0:n2}',
                    //template: "#: kendo.toString(credit, '0.00')#",
                    /*    footerTemplate: Resources.Total + ": #: kendo.toString(sum, '0.00') # "*/
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
    $('#gridGlMovementBalance').data('kendoTreeList').dataSource.page(1); // select current page

    /*************** End Tree List Result***************/
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
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    //var accountId = parseInt($("#AccountId").val()),
    var costCenterId = parseInt($("#FK_CostCenterId").val()),
        isSubAccountSupport = $("#IsSubAccountSupport").prop("checked"),
        lastParentsMain = $("#lastParentsMain").prop("checked"),
        lastParentsMainAndSub = $("#lastParentsMainAndSub").prop("checked"),
        isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");
    var ids = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");

    var multiselect = $("#multiSelectCostCenter").data("kendoDropDownTree");
    var costCenterIds = multiselect.value().join(", ");
    var multiTax = $("#FK_TaxesId").data("kendoDropDownTree");
    var taxIds = multiTax.value().join(", ");
    var multiemp = $("#FK_HrEmployeeId").data("kendoDropDownTree");
    var empIds = multiemp.value().join(", ");

    var url = "/GlReports/MovementAuditReportPrint?ids=" + ids + "&costCenterIds=" + costCenterIds + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId + "&taxIds=" + taxIds + "&empIds=" + empIds + "&lastParentsMain=" + lastParentsMain + "&lastParentsMainAndSub=" + lastParentsMainAndSub;
    window.open(url, '_blank').print();

});

function SetSummary() {
    var sumPreviousCredit = 0.00;
    var sumPreviousDebit = 0.00;
    var sumCredit = 0.00;
    var sumDebit = 0.00;
    var treeReport = $("#gridGlMovementBalance").data("kendoTreeList")

    var treeData = treeReport.dataSource._data;
    if (treeData != null && treeData != undefined) {
        var lastRowIdx = treeData.length - 1;
        if (lastRowIdx >= 0) {
            sumPreviousCredit = treeData[lastRowIdx].sumPreviousCredit;
            sumPreviousDebit = treeData[lastRowIdx].sumPreviousDebit;
            sumCredit = treeData[lastRowIdx].sumCredit;
            sumDebit = treeData[lastRowIdx].sumDebit;
        }
    }
    sumPreviousCredit = numberWithCommas(parseFloat(sumPreviousCredit).toFixed(2));
    sumPreviousDebit = numberWithCommas(parseFloat(sumPreviousDebit).toFixed(2));
    sumCredit = numberWithCommas(parseFloat(sumCredit).toFixed(2));
    sumDebit = numberWithCommas(parseFloat(sumDebit).toFixed(2));
    $('#sumPreviousCredit').val(sumPreviousCredit);
    $('#sumPreviousDebit').val(sumPreviousDebit);
    $('#sumCredit').val(sumCredit);
    $('#sumDebit').val(sumDebit);
    return '';
};
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}