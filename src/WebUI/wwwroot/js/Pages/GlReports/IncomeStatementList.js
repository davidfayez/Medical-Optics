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

    $("#gridGlIncomeStatement").kendoGrid({

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
        { title: Resources.MainAccountName, width: Resources.NameWidth },
        { title: Resources.FinancialPeriodNameResource, width: Resources.NameWidth },
        { title: Resources.OpeningBalance, columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] },
        { title: Resources.Balance, columns: [{ title: Resources.DebitResource, width: Resources.AmountWidth }, { title: Resources.CreditResource, width: Resources.AmountWidth }] }
        ]
    });

    function LoadgridGlIncomeStatement() {
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
            var grid = $("#gridGlIncomeStatement").kendoGrid({
                excel: {
                    fileName: "Income Statement.xlsx",
                    allPages: true,
                    filterable: true
                },
                dataSource: {
                    transport: {
                        read: {
                            url: "/GlReports/GetIncomeStatement?financialPeriodId=" + finPeriod + "&&ids=" + ids + "&costCenterIds=" + costCenterIds + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId
                        }
                    },
                    schema: {
                        model: {
                            //id: "id",
                            fields: {
                                accountCode: { type: "string" },
                                accountName: { type: "string" },
                                accountParentName: { type: "string" },
                                financialPeriodName: { type: "string" },
                                openingDebit: { type: "number" },
                                openingCredit: { type: "number" },
                                currentDebit: { type: "number" },
                                currentCredit: { type: "number" },
                            }
                        }
                    },
                    pageSize: Resources.GridPageSize,
                    aggregate: [
                        { field: "openingDebit", aggregate: "sum" },
                        { field: "openingCredit", aggregate: "sum" },
                        { field: "currentDebit", aggregate: "sum" },
                        { field: "currentCredit", aggregate: "sum" }
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
                        //field: "accountName",
                        title: Resources.AccountNameResource,
                        width: Resources.NameWidth,
                        template: '#if(accountParentName==""){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#',
                    },
                    {
                        field: "accountParentName",
                        title: Resources.AccountNameResource,
                        width: Resources.NameWidth
                    },
                    {
                        field: "financialPeriodName",
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
                    }, {
                        title: Resources.Balance,
                        columns: [{
                            field: "currentDebit",
                            title: Resources.DebitResource,
                            width: Resources.AmountWidth,
                            footerTemplate: Resources.Total + ": #: sum #"
                        }, {
                            field: "currentCredit",
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

$(".exportExcel").on('click', function () {
    $("#gridGlIncomeStatement").getKendoGrid().saveAsExcel();
});


$("#btnDataReview").click(function () {
    LoadgridGlIncomeStatement();
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