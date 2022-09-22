$(document).ready(function () {


    LoadGridVoucher();
    function LoadGridVoucher() {
        var grid = $("#PayRecurringBondList").kendoGrid({
            excel: {
                fileName: "Pay Recurring Bond.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/PayRecurringBond/GetAllPayRecurringBond"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            payBondSerial: { type: "string" },
                            fK_PayBondId: { type: "string" },
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
                field: "payBondSerial",
                title: Resources.Serial,
                width: Resources.CodeWidth
            }, {
                field: "fK_PayBondId",
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
                width: Resources.NameWidth
            },
            {
                field: "recurrenceStartDate",
                title: Resources.RecurrenceStartDate,
                format: "{0:yyyy/MM/dd}",
                width: Resources.DateWidth
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAccount);
    }
    function removeAccount() {

        var row = $(this).closest("tr"),
            grid = $("#PayRecurringBondList").data("kendoGrid"),
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
                    url: "/PayRecurringBond/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadGridVoucher();
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
    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#PayRecurringBondList').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
});

$(".exportExcel").on('click', function () {
    $("#PayRecurringBondList").getKendoGrid().saveAsExcel();
});
