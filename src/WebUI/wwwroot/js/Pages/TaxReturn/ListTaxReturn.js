$(document).ready(function () {
    $("#DefBranches").change(function () {
        debugger;
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#TaxReturnList').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
    $("#DefBranches").removeAttr('disabled');
    LoadGridVoucher();
    function LoadGridVoucher() {
        var grid = $("#TaxReturnList").kendoGrid({
            excel: {
                fileName: "Tax Return.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: {
                transport: {
                    read: "/TaxReturn/GetAllTaxReturn"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: { editable: false },
                            taxReturnNameAr: { type: "string" },
                            taxReturnNameEn: { type: "string" },
                            periodName: { type: "string" },
                            taxsIds: { type: "string" },
                            dateFrom: { type: "date" },
                            dateTo: { type: "date" },
                            gross: { type: "number" },
                            taxGross: { type: "number" },

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
            pageable: true,
            columns: [{
                field: "taxReturnNameAr",
                title: Resources.NameArResource,
                width: Resources.NameWidth
            }, {
                field: "taxReturnNameEn",
                title: Resources.NameEnResource,
                width: Resources.NameWidth
            },
            //{
            //    field: "periodName",
            //    title: Resources.PeriodName,
            //    width: Resources.NameWidth
            //},
            {
                field: "gross",
                title: Resources.Total,
                width: Resources.AmountWidth
            },
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
            { width: Resources.DoubleActionWidth, template: "<a  title=" + Resources.TaxReturnDetailed + " class='btn-sm btn btn-warning btnOpenDetailedReport'><i class='fas fa-eye'></i></a> <a  title=" + Resources.TaxReturnTotal + " class='btn-sm btn btn-warning btnOpenTotalReport'><i class='fas fa-eye'></i></a> " },

                //{ width: Resources.DoubleActionWidth, template: "<a  href='/TaxReturn/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

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
        grid.data("kendoGrid").table.on("click", ".btnOpenTotalReport", OpenTotalReport);
        grid.data("kendoGrid").table.on("click", ".btnOpenDetailedReport", OpenDetailedReport);
    }
    function removeAccount() {

        var row = $(this).closest("tr"),
            grid = $("#TaxReturnList").data("kendoGrid"),
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
                    url: "/TaxReturn/Delete?id=" + dataItem.id,
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
    function OpenTotalReport() {

        var row = $(this).closest("tr"),
            grid = $("#TaxReturnList").data("kendoGrid"),
            dataItem = grid.dataItem(row);


        if (dataItem.id > 0) {
            var url = "/TaxReturn/TaxReturnDetailedReportById?id=" + dataItem.id + "&dateFrom=" + dataItem.dateFrom + "&dateTo=" + dataItem.dateTo + "&fK_DefBranchId=" + parseInt($("#FK_DefBranchId").val()) + "&returnReport=" + "Total";
            window.open(url, '_blank').print();

        } else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    }
    function OpenDetailedReport() {

        var row = $(this).closest("tr"),
            grid = $("#TaxReturnList").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        debugger

        if (dataItem.id > 0) {
            var url = "/TaxReturn/TaxReturnDetailedReportById?id=" + dataItem.id + "&dateFrom=" + dataItem.dateFrom + "&dateTo=" + dataItem.dateTo + "&fK_DefBranchId=" + parseInt($("#FK_DefBranchId").val()) + "&returnReport=" + "Detailed";
            window.open(url, '_blank').print();

        } else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    }
});

$(".exportExcel").on('click', function () {
    $("#TaxReturnList").getKendoGrid().saveAsExcel();
});
