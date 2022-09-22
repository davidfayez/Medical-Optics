$(document).ready(function () {

    // kendoDropDownTree
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
        dataTextField: "accountNameAr",
        dataValueField: "id",
        checkboxes: true,
        checkAll: true,
        autoClose: false
    });

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
                        code: $("#costCenterAutoComplete").text()
                        //code: data.filter.filters[0].value
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
    $("#costCenterAutoComplete").kendoAutoComplete({

        dataSource: costCenterDataSource,
        select: onSelectCostCenter,
        change: onChangeCostCenter,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:30px">' + Resources.CostCenterCodeResource + ' </span>' +
            '<span>' + Resources.CostCenterNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:150px">#: data.costCenterCode #</span>' +
            '<span>#: data.costCenterNameAr #</span>',
        dataTextField: "costCenterCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });

    function onSelectCostCenter(e) {
        $("#FK_CostCenterId").val(e.dataItem.id);
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
                    $("#FK_CostCenterId").val(response.id);
                    $("#CostCenterName").val(response.costCenterNameAr);

                } else {
                    $("#FK_CostCenterId").val(null);
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

    $("#btnDataReview").click(function () {
        LoadgridGlAccountBalances();
    });

    $("#gridGlAccountBalances").kendoGrid({

        height: Resources.GridHeight,
        sortable: Resources.GridSortable,
        reorderable: Resources.GridReorderable,
        groupable: Resources.GridGroupable,
        resizable: Resources.GridResizable,
        filterable: Resources.GridFilterable,
        columnMenu: Resources.GridColumnMenu,
        noRecords: Resources.GridNoRecords,
        messages: {
            noRecords: Resources.GridNoRecordsMessage
        },
        pageable: Resources.GridPageable,
        columns: [{ title: Resources.AccountCodeResource, width: Resources.CodeWidth },
        { title: Resources.AccountNameResource, width: Resources.NameWidth },
            { title: Resources.OpeningBalance, columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 1", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 2", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 3", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 4", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 5", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 6", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 7", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 8", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 9", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 10", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 11", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
            { title: Resources.Month + " 12", columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] }
        ]
    });

    function LoadgridGlAccountBalances() {
        var finPeriod = $("#finacialPeriod").val();
        var dateFrom = $("#inputDateFrom").val();
        var dateTo = $("#inputDateTo").val();
        var ids = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");

        var costCenterId = parseInt($("#FK_CostCenterId").val());
        var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked");
        var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

        var multiselect = $("#multiSelectCostCenter").data("kendoMultiSelect");
        var costCenterIds = multiselect.value().join(", ");

        if (finPeriod > 0 ) {
            var grid = $("#gridGlAccountBalances").kendoGrid({
                excel: {
                    fileName: "Account Balances.xlsx",
                    allPages: true,
                    filterable: true
                },
                dataSource: {
                    transport: {
                        read: {
                            url: "/GlReports/GetAccountBalances?financialPeriodId=" + finPeriod + "&&ids=" + ids + "&costCenterIds=" + costCenterIds + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId
                        }
                    },
                    schema: {
                        model: {
                            //id: "id",
                            fields: {
                                accountCode: { type: "string" },
                                accountName: { type: "string" },
                                openingDebit: { type: "number" },
                                openingCredit: { type: "number" },
                                debitMonth1: { type: "number" },
                                creditMonth1: { type: "number" },
                                debitMonth2: { type: "number" },
                                creditMonth2: { type: "number" },
                                debitMonth3: { type: "number" },
                                creditMonth3: { type: "number" },
                                debitMonth4: { type: "number" },
                                creditMonth4: { type: "number" },
                                debitMonth5: { type: "number" },
                                creditMonth5: { type: "number" },
                                debitMonth6: { type: "number" },
                                creditMonth6: { type: "number" },
                                debitMonth7: { type: "number" },
                                creditMonth7: { type: "number" },
                                debitMonth8: { type: "number" },
                                creditMonth8: { type: "number" },
                                debitMonth9: { type: "number" },
                                creditMonth9: { type: "number" },
                                debitMonth10: { type: "number" },
                                creditMonth10: { type: "number" },
                                debitMonth11: { type: "number" },
                                creditMonth11: { type: "number" },
                                debitMonth12: { type: "number" },
                                creditMonth12: { type: "number" },
                            }
                        }
                    },
                    pageSize: Resources.GridPageSize,
                    aggregate: [
                        { field: "openingDebit", aggregate: "sum" },
                        { field: "openingCredit", aggregate: "sum" },
                        { field: "debitMonth1", aggregate: "sum" },
                        { field: "creditMonth1", aggregate: "sum" },
                        { field: "debitMonth2", aggregate: "sum" },
                        { field: "creditMonth2", aggregate: "sum" },
                        { field: "debitMonth3", aggregate: "sum" },
                        { field: "creditMonth3", aggregate: "sum" },
                        { field: "debitMonth4", aggregate: "sum" },
                        { field: "creditMonth4", aggregate: "sum" },
                        { field: "debitMonth5", aggregate: "sum" },
                        { field: "creditMonth5", aggregate: "sum" },
                        { field: "debitMonth6", aggregate: "sum" },
                        { field: "creditMonth6", aggregate: "sum" },
                        { field: "debitMonth7", aggregate: "sum" },
                        { field: "creditMonth7", aggregate: "sum" },
                        { field: "debitMonth8", aggregate: "sum" },
                        { field: "creditMonth8", aggregate: "sum" },
                        { field: "debitMonth9", aggregate: "sum" },
                        { field: "creditMonth9", aggregate: "sum" },
                        { field: "debitMonth10", aggregate: "sum" },
                        { field: "creditMonth10", aggregate: "sum" },
                        { field: "debitMonth11", aggregate: "sum" },
                        { field: "creditMonth11", aggregate: "sum" },
                        { field: "debitMonth12", aggregate: "sum" },
                        { field: "creditMonth12", aggregate: "sum" }
                    ]
                },
                height: Resources.GridHeight,
                sortable: Resources.GridSortable,
                reorderable: Resources.GridReorderable,
                groupable: Resources.GridGroupable,
                resizable: Resources.GridResizable,
                filterable: Resources.GridFilterable,
                columnMenu: Resources.GridColumnMenu,
                noRecords: Resources.GridNoRecords,
                messages: {
                    noRecords: Resources.GridNoRecordsMessage
                },
                pageable: Resources.GridPageable,
                columns: [

                    {
                        field: "accountCode",
                        title: Resources.AccountCodeResource,
                        width: Resources.CodeWidth
                    }, {
                        field: "accountName",
                        title: Resources.AccountNameResource,
                        width: Resources.NameWidth
                    },
                    {
                        title: Resources.OpeningBalance, columns: [{
                            field: "openingDebit",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "openingCredit",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 1",
                        columns: [{
                            field: "debitMonth1",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth1",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 2",
                        columns: [{
                            field: "debitMonth2",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth2",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 3",
                        columns: [{
                            field: "debitMonth3",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth3",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 4",
                        columns: [{
                            field: "debitMonth4",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth4",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 5",
                        columns: [{
                            field: "debitMonth5",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth5",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 6",
                        columns: [{
                            field: "debitMonth6",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth6",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 7",
                        columns: [{
                            field: "debitMonth7",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth7",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 8",
                        columns: [{
                            field: "debitMonth8",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth8",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 9",
                        columns: [{
                            field: "debitMonth9",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth9",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 10",
                        columns: [{
                            field: "debitMonth10",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth10",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 11",
                        columns: [{
                            field: "debitMonth11",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth11",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    },
                    {
                        title: Resources.Month + " 12",
                        columns: [{
                            field: "debitMonth12",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "creditMonth12",
                            title: Resources.CreditResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }]
                    }

                ],
                dataBound: function (e) {
                    e.sender.items().each(function () {
                        var dataItem = e.sender.dataItem(this);
                        kendo.bind(this, dataItem);
                        if (dataItem.isActive) {
                            $(this).addClass("k-state-selected");
                        }
                    });
                }
            });
        } else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    }

    // cost Center Multi select
    var multiSelectSource = new kendo.data.DataSource({
        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CostCenter/GetAllAutoCompleteBySearch"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: $("#multiSelectCostCenter").text()

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
    $("#multiSelectCostCenter").kendoMultiSelect({
        placeholder: Resources.Choose,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:30px">' + Resources.CostCenterCodeResource + ' </span>' +
            '<span>' + Resources.CostCenterNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:150px">#: data.costCenterCode #</span>' +
            '<span>#: data.costCenterNameAr #</span>',
        dataTextField: "costCenterNameAr",
        dataValueField: "id",
        //placeholder: Resources.AutocompleateChoose,
        dataSource: multiSelectSource,
        height: 300,
        autoClose: false
    });
});

$(".glAccountMapped").change(function () {
    var _value = $(this).val();
    var select_group = $(this).attr("select-group");
    $('select[select-group="' + select_group + '"]').not(this).val(_value);
});

$(".CostCenterMapped").change(function () {
    var _value = $(this).val();
    var select_group = $(this).attr("select-group");
    $('select[select-group="' + select_group + '"]').not(this).val(_value);
});

$(".exportExcel").on('click', function () {
    $("#gridGlAccountBalances").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    var finPeriod = $("#finacialPeriod").val();
    var dateFrom = $("#inputDateFrom").val();
    var dateTo = $("#inputDateTo").val();
    var ids = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");
    var costCenterId = parseInt($("#FK_CostCenterId").val());
    var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked");
    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var multiselect = $("#multiSelectCostCenter").data("kendoMultiSelect");
    var costCenterIds = multiselect.value().join(", ");
    var url = "/GlReports/IncomeStatementPrint?financialPeriodId=" + finPeriod + "&&ids=" + ids + "&costCenterIds=" + costCenterIds + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId
    window.open(url, '_blank');

});