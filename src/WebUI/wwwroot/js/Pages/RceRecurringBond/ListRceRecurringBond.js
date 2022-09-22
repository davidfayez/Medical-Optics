$(document).ready(function () {

    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#RceRecurringBondList').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });

    LoadGridRecurringBond();
    function LoadGridRecurringBond() {
        var grid = $("#RceRecurringBondList").kendoGrid({
            excel: {
                fileName: "Rce Recurring Bond.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: {
                transport: {
                    read: "/RceRecurringBond/GetAllRceRecurringBond"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            rceBondSerial: { type: "string" },
                            fK_RceBondId: { type: "string" },
                            fK_GlFinancialPeriodId: { type: "string" },
                            notificationPeriod: { type: "number" },
                            recurrenceStartDate: { type: "date" },
                            recurrenceEndDate: { type: "date" },
                            isActive: { editable: false },

                        }
                    }
                },
                pageSize: Resources.GridPageSize
            },
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
            columns: [{
                field: "rceBondSerial",
                title: Resources.Serial,
                width: Resources.CodeWidth
            }, {
                field: "fK_RceBondId",
                title: Resources.PayType,
                width: Resources.NameWidth
            }, {
                field: "fK_GlFinancialPeriodId",
                title: Resources.FinancialPeriodName,
                width: Resources.NameWidth
            },
            {
                field: "notificationPeriod",
                title: Resources.NotificationPeriod,
                width: Resources.AmountWidth
            },
            {
                field: "recurrenceStartDate",
                title: Resources.RecurrenceStartDate,
                format: "{0:yyyy/MM/dd}",
                width: 150
            },
            {
                field: "recurrenceEndDate",
                title: Resources.RecurrenceEndDate,
                format: "{0:yyyy/MM/dd}",
                width: Resources.DateWidth
            },
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
            { width: Resources.ActionWidth, template: " <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },
            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            }
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeRecurringBond);
    }
    function removeRecurringBond() {

        var row = $(this).closest("tr"),
            grid = $("#RceRecurringBondList").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        swal({
            title: Resources.DeleteResource,
            text: Resources.DeleteConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.DeleteResource,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: "/RceRecurringBond/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadGridRecurringBond();
                            swal({
                                title: Resources.DeleteSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                        }
                        else {
                            swal({
                                title: Resources.DeleteFailedResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    },
                    error: function (err, xqr, txt) { }
                });

            }, 3000);
        });
    }
});

$(".exportExcel").on('click', function () {
    $("#RceRecurringBondList").getKendoGrid().saveAsExcel();
});
