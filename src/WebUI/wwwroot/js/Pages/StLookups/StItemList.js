$(document).ready(function () {


    LoadGridStItem();
    function LoadGridStItem() {
        var grid = $("#GridStItem").kendoGrid({
            excel: {
                fileName: "Stock Items.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: {
                transport: {
                    read: "/StLookups/GetAllStItem"
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            itemCode: { type: "string" },
                            itemName: { type: "string" },
                            mainCategoryName: { type: "string" },
                            modelName: { type: "string" },
                            brandName: { type: "string" },
                            manufacturingCountryName: { type: "string" },
                            unitName: { type: "string" },

                            creationDate: { type: "date", editable: false },
                            isActive: { editable: false },
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
            pageable: {
                pageSizes: [20, 40, 60, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [{
                field: "itemCode",
                title: Resources.Code,
                width: Resources.CodeWidth
            }, {
                field: "itemName",
                title: Resources.ItemName,
                width: Resources.NameWidth
            }, {
                field: "mainCategoryName",
                title: Resources.MainCategory,
                width: Resources.NameWidth
            },
            {
                field: "modelName",
                title: Resources.Model,
                width: Resources.NameWidth
            }, {
                field: "brandName",
                title: Resources.Brand,
                width: Resources.NameWidth
            }, {
                field: "manufacturingCountryName",
                title: Resources.ManufacturingCountry,
                width: Resources.NameWidth
            }, {
                field: "unitName",
                title: Resources.Unit,
                width: Resources.NameWidth
            },
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
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
            {
                width: Resources.DoubleActionWidth, template: "<a  href='/StLookups/EditStItem/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>"
            },

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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeItem);
    }
    function removeItem() {

        var row = $(this).closest("tr"),
            grid = $("#GridStItem").data("kendoGrid"),
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
                    url: "/StLookups/DeleteStItem?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadGridStItem();
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
    $("#GridStItem").getKendoGrid().saveAsExcel();
});