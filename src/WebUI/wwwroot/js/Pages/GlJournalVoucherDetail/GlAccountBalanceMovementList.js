$(document).ready(function () {

    $("#gridGlAccountBalanceMovement").kendoGrid({
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
        columns: [{ field: "accountParentCode", title: Resources.MainAccountNameResource, width: Resources.CodeWidth},
            { title: Resources.MainAccountName, width: Resources.NameWidth },
            { title: Resources.AccountCodeResource, width: Resources.CodeWidth },
            { title: Resources.AccountNameResource, width: Resources.NameWidth },
            { title: Resources.CreditResource, width: Resources.AmountWidth },
            { title: Resources.DebitResource, width: Resources.AmountWidth },
            { title: Resources.BalanceResource, width: Resources.AmountWidth }
        ]
    });

        

    $("#btnDataReview").click(function () {
        LoadgridGlAccountBalanceMovement();
    });
   
    function LoadgridGlAccountBalanceMovement() {
        var datefrom = $("#inputDateFrom").val();
        var dateto = $("#inputDateTo").val();
        var ids = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");
        var costCenterId = parseInt($("#FK_CostCenterId").val());
        var isSubAccountSupport = $("#IsSubAccountSupport").prop("checked");
        var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        var multiselect = $("#multiSelectCostCenter").data("kendoMultiSelect");
        var costCenterIds = multiselect.value().join(", ");

        var grid = $("#gridGlAccountBalanceMovement").kendoGrid({
            excel: {
                fileName: "Journal Account Balance Movement.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: {
                        url: "/GlJournalVoucher/GetAccountBalanceMovement",
                        type: "POST",
                        data: { ids: ids, costCenterIds: costCenterIds, dateFrom: datefrom, dateTo: dateto, isTotalAccountZero: isTotalAccountZero, isSubAccountSupport: isSubAccountSupport, fK_DefBranchId: fK_DefBranchId}
                    }
                },
                schema: {
                    model: {
                        //id: "id",
                        fields: {
                            accountCode: { type: "string" },
                            accountName: { type: "string" },
                            accountParentCode: { type: "string" },
                            accountParentName: { type: "string" },
                            balance: { type: "number" },
                            totalCridet: { type: "number" },
                            totalDebit: { type: "number" }
                        }
                    }
                },
                pageSize: 30,
                aggregate: [
                    { field: "totalDebit", aggregate: "sum" },
                    { field: "totalCridet", aggregate: "sum" },
                    { field: "balance", aggregate: "sum" }
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
            columns: [{
                field: "accountParentCode",
                title: Resources.MainAccountNameResource,
                width: Resources.CodeWidth
            }, {
                field: "accountParentName",
                    title: Resources.MainAccountName,
                    width: Resources.NameWidth
            }, {
                field: "accountCode",
                    title: Resources.AccountCodeResource,
                    width: Resources.CodeWidth 
            }, {
                    title: Resources.AccountNameResource,
                    width: Resources.NameWidth,
                    template: '#if(accountParentName==""){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#',
            }, {
                    field: "totalCridet",
                    title: Resources.CreditResource,
                    width: Resources.AmountWidth,
                    footerTemplate: Resources.Total + ": #: sum #"
            }, {
                field: "totalDebit",
                    title: Resources.DebitResource,
                    width: Resources.AmountWidth,
                    footerTemplate: Resources.Total + ": #: sum #"
            }, {
                field: "balance",
                    title: Resources.BalanceResource,
                    width: Resources.AmountWidth,
                    footerTemplate: Resources.Total + ": #: sum #"
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
    }   


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

    //costCenterAutoComplete
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
    $("#gridGlAccountBalanceMovement").getKendoGrid().saveAsExcel();
});


$(".btnPrint").on('click', function () {
    var dateFromPicker = new Date($("#inputDateFrom").val()),
        dateFrom = dateFromPicker.getFullYear() + '-' + (dateFromPicker.getMonth() + 1) + '-' + dateFromPicker.getDate(),
        dateToPicker = new Date($("#inputDateTo").val()),
        dateTo = dateToPicker.getFullYear() + '-' + (dateToPicker.getMonth() + 1) + '-' + dateToPicker.getDate();

    var ids = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", "),
        costCenterId = parseInt($("#FK_CostCenterId").val()),
        isSubAccountSupport = $("#IsSubAccountSupport").prop("checked"),
        isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());

    var multiselect = $("#multiSelectCostCenter").data("kendoMultiSelect");
    var costCenterIds = multiselect.value().join(", ");

    //if (isNaN(dateFromPicker) || isNaN(dateToPicker)) {
    //    swal({
    //        title: $("#ChooseDateInCurrenetFinanicalPeriodResources").text(),
    //        confirmButtonText: $("#DoneResource").text(),
    //        type: "error"
    //    });
    //} else {
    var url = "/GlJournalVoucher/AccountBalanceMovementReportPrint?ids=" + ids + "&costCenterIds=" + costCenterIds + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport + "&fK_DefBranchId=" + fK_DefBranchId;
        window.open(url, '_blank');
    //}
});