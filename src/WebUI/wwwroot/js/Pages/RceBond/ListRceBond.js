$(document).ready(function () {

    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#RceBondList').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });

    LoadGridRceBond();
    function LoadGridRceBond() {
        var grid = $("#RceBondList").kendoGrid({
            excel: {
                fileName: "Rce Bond.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: {
                transport: {
                    read: "/RceBond/GetAllRceBond"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            serial: { type: "number" },
                            fK_CbPayTypeId: { type: "string" },
                            fK_DefCurrencyId: { type: "string" },
                            fK_CbCashAndBankAccountId: { type: "string" },
                            fK_GlJournalVoucherId: { editable: false },
                            //fK_CbCashAndBankAccountCrediId: { type: "string" },
                            isActive: { editable: false },
                            //fK_CbAccountTypeId: { type: "string" },
                            //address: { type: "string" },
                            //website: { type: "string" },
                            //responsiblePerson: { type: "string" },
                            //fK_DefCurrencyId: { type: "string" },
                            //fK_GlAccountId: { type: "string" },
                            //fK_CbCreditMachineId: { type: "string" },
                            //fK_CbCheckFormEnglishId: { type: "string" },
                            //fK_CbCheckFormArabicId: { type: "string" },
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
                pageSizes: [10, 20, 50, Resources.All],
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
                width: Resources.TypeWidth
            }, {
                field: "fK_DefCurrencyId",
                title: Resources.Currency,
                width: Resources.TypeWidth
            }, {
                field: "fK_CbCashAndBankAccountId",
                title: Resources.CashBankAccount,
                width: Resources.NameWidth
            },
            //{
            //    field: "fK_CbCashAndBankAccountCrediId",
            //    title: resources.FK_CbCashAndBankAccountCrediId,
            //    width: 150
            //},
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
                { width: Resources.DoubleActionWidth, template: "<a  href='/RceBond/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> <a  class='btn btn-warning btn-sm btnOpenVoucherReport'><i class='fas fa-eye'></i></a>" },

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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeRceBond);
        grid.data("kendoGrid").table.on("click", ".btnOpenVoucherReport", OpenVoucherReport);
    }

    function OpenVoucherReport() {

        var row = $(this).closest("tr"),
            grid = $("#RceBondList").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        if (dataItem.fK_GlJournalVoucherId > 0) {
            var url = "/GlJournalVoucher/GlJournalVoucherDetailsReport/" + dataItem.fK_GlJournalVoucherId
            window.open(url, '_blank').print();
        }
    }
    function removeRceBond() {

        var row = $(this).closest("tr"),
            grid = $("#RceBondList").data("kendoGrid"),
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
                    url: "/RceBond/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadGridRceBond();
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
    $("#RceBondList").getKendoGrid().saveAsExcel();
});
