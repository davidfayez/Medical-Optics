$(document).ready(function () {


    loadRceNoticeBondGrid();

    function loadRceNoticeBondGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/RceNoticeBond/GetAll",
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageSize: 10,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        isActive: { editable: true },
                        id: { editable: false },
                        serial: { editable: false },
                        clientName: { editable: false },
                        noticeDate: { type: "date", editable: false },
                        totalAmount: { editable: false },
                        totalTaxAmount: { editable: false },
                    }
                }
            }
        });


        var grid = $("#rceNoticeBondGrid").kendoGrid({
            excel: {
                fileName: "Pay Notice.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            pageSize: 20,
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
            columns: [

                { field: "serial", title: Resources.CodeResource, width: Resources.CodeWidth },
                { field: "clientName", title: Resources.ClientNameResource, width: Resources.NameWidth },
                { field: "totalAmount", title: Resources.GrossResource, width: Resources.AmountWidth },
                { field: "totalTaxAmount", title: Resources.TaxValueResource, width: Resources.AmountWidth },
                //  { field: "remaining", title: Resources.RemainingResource, width: Resources.AmountWidth },
                // { field: "downPayment", title: Resources.DownPaymentResource, width: Resources.AmountWidth },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },

                {
                    field: "noticeDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                { width: Resources.DoubleActionWidth, template: "<a  href='/RceNoticeBond/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete ' ><i class='fas fa-trash-alt'></i></a>  <a  class='btn btn-warning btn-sm btnOpenVoucherReport'><i class='fas fa-eye'></i></a>" },

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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removePayNoticeBond);
        grid.data("kendoGrid").table.on("click", ".btnOpenVoucherReport", OpenVoucherReport);

    }
    function removePayNoticeBond() {

        var row = $(this).closest("tr"),
            grid = $("#rceNoticeBondGrid").data("kendoGrid"),
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
                    url: "/RceNoticeBond/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadRceNoticeBondGrid();
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
            grid = $("#rceNoticeBondGrid").data("kendoGrid"),
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
        $('#rceNoticeBondGrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });

});



$(".exportExcel").on('click', function () {
    $("#GridPayRepaymentCancellation").getKendoGrid().saveAsExcel();
});
