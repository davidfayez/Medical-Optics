$(document).ready(function () {


    LoadGridVoucher();
    function LoadGridVoucher() {
        var grid = $("#BondList").kendoGrid({
            excel: {
                fileName: "Recurring Bond.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: {
                transport: {
                    read: "/PayBond/GetAllPayBond"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            serial: { type: "number" },
                            fK_CbPayTypeId: { type: "string" },
                            fK_DefCurrencyId: { type: "string" },
                            fK_CbCashAndBankAccountId: { type: "string" },
                            fK_GlFinancialPeriodId: { type: "string" },
                            totalAmount: { type: "number" },
                            isActive: { editable: false },
                        }
                    }
                },
                pageSize: Resources.GridPageSize
            },
            //height: 300,
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
                field: "serial",
                title: Resources.Serial,
                width: Resources.CodeWidth
            }, {
                field: "fK_CbPayTypeId",
                title: Resources.PayType,
                width: Resources.NameWidth
            }, {
                field: "fK_DefCurrencyId",
                title: Resources.Currency,
                width: Resources.NameWidth
            }, {
                field: "fK_CbCashAndBankAccountId",
                title: Resources.CashBankAccount,
                width: Resources.NameWidth
            },
            {
                field: "fK_GlFinancialPeriodId",
                title: Resources.FinancialPeriodName,
                width: Resources.NameWidth
            },
            {
                field: "totalAmount",
                title: Resources.Amount,
                width: Resources.AmountWidth
            },
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' name='choose' class= 'control-label i-check'/>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
                //if (!hasRoleEdit)
                //    $(".btnEdit").addClass('disabled');
                //
                //if (!hasRoleDelete)
                //    $(".btnDelete").addClass('disabled');
            }
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAccount);
    }
    function removeAccount() {

        var row = $(this).closest("tr"),
            grid = $("#BondList").data("kendoGrid"),
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
                    url: "/PayBond/Delete?id=" + dataItem.id,
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
});

$(".exportExcel").on('click', function () {
    $("#BondList").getKendoGrid().saveAsExcel();
});
