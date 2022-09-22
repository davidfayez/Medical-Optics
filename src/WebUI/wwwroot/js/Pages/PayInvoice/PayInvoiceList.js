$(document).ready(function () {

    loadPayInvoiceGrid();

    function loadPayInvoiceGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/PayInvoice/GetAll",
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageSize: Resources.GridPageSize,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        serial: { editable: false },
                        supplierName: { editable: false },
                        creatorName: { editable: false },
                        isSubSupplier: { editable: false },
                        fK_GlJournalVoucherId: { editable: false },
                        gross: { editable: false },
                        discount: { editable: false },
                        taxAmount: { editable: false },
                        remaining: { editable: false },
                        downPayment: { editable: false },
                        creationDate: { type: "date", editable: false },
                    }
                }
            }
        });


        var grid = $("#GridPayInvoice").kendoGrid({
            excel: {
                fileName: "Invoices .xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: dataSource,
            pageSize: 20,
            serverPaging: Resources.GridServerPaging,
            serverFiltering: Resources.GridServerFiltering,
            filterable: Resources.GridFilterable,
            height: Resources.GridHeight,
            groupable: Resources.GridGroupable,
            sortable: Resources.GridSortable,
            resizable: Resources.GridResizable,
            noRecords: Resources.GridServerPaging,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            pageable: {
                pageSizes: [20, 40, 60, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "creatorName", title: Resources.EmployeeName, width: Resources.NameWidth },
                { field: "serial", title: Resources.CodeResource, width: Resources.CodeWidth },
                { field: "supplierName", title: Resources.SupplierNameResource, width: Resources.NameWidth },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isSubSupplier' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.SupSupplierResource },
                { field: "gross", title: Resources.GrossResource, width: Resources.AmountWidth },
                { field: "discount", title: Resources.DiscountValueResource, width: Resources.AmountWidth },
                { field: "taxAmount", title: Resources.TaxValueResource, width: Resources.AmountWidth },
                { field: "remaining", title: Resources.RemainingResource, width: Resources.AmountWidth },
                { field: "downPayment", title: Resources.DownPaymentResource, width: Resources.AmountWidth },

                {
                    width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status
                },
                {
                    width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isPosted' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Posted
                },

                {
                    field: "creationDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.IsAfterOrEqualTo,
                                lte: Resources.IsBeforeOrEqualTo
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: '{0: dd/MM/yyyy}'
                            })
                        }
                    }
                },

                { width: Resources.DoubleActionWidth, template: "<a  href='/PayInvoice/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete ' ><i class='fas fa-trash-alt'></i></a> <a  class='btn btn-warning btn-sm btnOpenVoucherReport'><i class='fas fa-eye'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },
            //resizable: true
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeInvoice);
        grid.data("kendoGrid").table.on("click", ".btnOpenVoucherReport", OpenVoucherReport);
    }

    function OpenVoucherReport() {

        var row = $(this).closest("tr"),
            grid = $("#GridPayInvoice").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        if (dataItem.fK_GlJournalVoucherId > 0) {
            var url = "/GlJournalVoucher/GlJournalVoucherDetailsReport/" + dataItem.fK_GlJournalVoucherId
            window.open(url, '_blank').print();
        }
    }
    function removeInvoice() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#GridPayInvoice").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
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
                    url: "/PayInvoice/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadPayInvoiceGrid();
                            //grid.refresh();
                            //grid.dataSource.filter(filters);
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
        $('#PaymentTypeGrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
});
$(".exportExcel").on('click', function () {
    $("#GridPayInvoice").getKendoGrid().saveAsExcel();
});