$(document).ready(function () {

    loadTaxesPeriodGrid();

    function loadTaxesPeriodGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/TaxesPeriod/GetAllTaxesPeriodList",
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
                        periodCode: { editable: false },
                        periodNameAr: { editable: false },
                        periodNameEn: { editable: false },
                        taxCodeAr: { editable: false },
                        taxCodeEn: { editable: false },
                        dateFrom: { type: "date", editable: false },
                        dateTo: { type: "date", editable: false },
                        isActive: { editable: false },
                    }
                }
            }
        });


        var grid = $("#GridTaxesPeriod").kendoGrid({
            excel: {
                fileName: "Taxes Period.xlsx",
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
                pageSizes: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "periodCode", title: Resources.CodeResource, width: Resources.CodeWidth },
                { field: "periodNameAr", title: Resources.NameArResource, width: Resources.NameWidth },
                { field: "periodNameEn", title: Resources.NameEnResource, width: Resources.NameWidth },
                { field: "taxCodeAr", title: Resources.TypeCodeArResource, width: Resources.NameWidth },
                { field: "taxCodeEn", title: Resources.TypeCodeEnResource, width: Resources.NameWidth },
                {
                    field: "dateFrom", title: Resources.DateFromResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                {
                    field: "dateTo", title: Resources.DateToResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },

                { width: Resources.DoubleActionWidth, template: "<a  href='/TaxesPeriod/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete ' ><i class='fas fa-trash-alt'></i></a>" },

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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeTaxesPeriod);
    }

    function removeTaxesPeriod() {

        var row = $(this).closest("tr"),
            grid = $("#GridTaxesPeriod").data("kendoGrid"),
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
                    url: "/TaxesPeriod/Delete?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadTaxesPeriodGrid();
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
        debugger;
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#GridTaxesPeriod').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });

});
$(".exportExcel").on('click', function () {
    $("#GridTaxesPeriod").getKendoGrid().saveAsExcel();
});