$(document).ready(function () {


    LoadGridpayRepaymentBonds();
    function LoadGridpayRepaymentBonds() {
        var grid = $("#payRepaymentBondsGrid").kendoGrid({
            excel: {
                fileName: "pay Repayment Bonds.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/PayRepaymentBond/GetAll"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            serial: { type: "number" },
                            totalAmount: { type: "number" },
                            balnceAfterRepayment: { type: "number" },
                            fK_CbPayTypeId: { type: "string" },
                            fK_DefCurrencyId: { type: "string" },
                            isActive: { editable: false },
                            fK_GlJournalVoucherId: { editable: false },
                            bondDate: { type: "date" },

                        }
                    }
                },
                pageSize: Resources.GridPageSize
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
                field: "serial",
                title: Resources.BondSerialResource,
                width: Resources.CodeWidth
            },
            {
                field: "bondDate",
                title: Resources.BondDateResource,
                format: "{0:yyyy/MM/dd}",
                width: Resources.DateWidth
            },

            {
                field: "totalAmount",
                title: Resources.PayTotalAmountResource,
                width: Resources.NameWidth
            }, {
                field: "balnceAfterRepayment",
                title: Resources.BalnceAfterRepayment,
                width: Resources.NameWidth
            },
            //   { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
            { width: Resources.DoubleActionWidth, template: "<a  href='/PayRepaymentBond/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> <a  class='btn btn-warning btn-sm btnOpenVoucherReport'><i class='fas fa-eye'></i></a>" },

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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removePayRepaymentBond);
        grid.data("kendoGrid").table.on("click", ".btnOpenVoucherReport", OpenVoucherReport);
    }

    function removePayRepaymentBond() {

        var row = $(this).closest("tr"),
            grid = $("#payRepaymentBondsGrid").data("kendoGrid"),
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
                    url: "/PayRepaymentBond/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadGridpayRepaymentBonds();
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
    function OpenVoucherReport() {

        var row = $(this).closest("tr"),
            grid = $("#payRepaymentBondsGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        if (dataItem.fK_GlJournalVoucherId > 0) {
            var url = "/GlJournalVoucher/GlJournalVoucherDetailsReport/" + dataItem.fK_GlJournalVoucherId
            window.open(url, '_blank').print();
        } else {
            swal({
                title: Resources.DefaultErrorMessageResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    }
    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#payRepaymentBondsGrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
});

$(".exportExcel").on('click', function () {
    $("#payRepaymentBondsGrid").getKendoGrid().saveAsExcel();
});
