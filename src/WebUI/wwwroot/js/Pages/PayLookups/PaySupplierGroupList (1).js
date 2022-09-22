$(document).ready(function () {
    var resources = {
        Code: $('#CodeResource').text(),
        NameAr: $('#NameArResource').text(),
        NameEn: $('#NameEnResource').text(),
        creationDate: $('#CreationDateResource').text(),
        status: Resources.Status,
        all: Resources.All,
        isAfterOrEqualTo: Resources.IsAfterOrEqualTo,
        isBeforeOrEqualTo: Resources.IsBeforeOrEqualTo,
    };

    loadPaySupplierGroupGrid();

    function loadPaySupplierGroupGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/PayLookups/GetAllPaySupplierGroup",
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
                        id: { editable: false },
                        groupCode: { editable: false },
                        groupNameAr: { editable: false },
                        groupNameEn: { editable: false },
                        description: { editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },

                    }
                }
            }
        });


        var grid = $("#PaySupplierGroupGrid").kendoGrid({
            excel: {
                fileName: "Pay Supplier Class.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: dataSource,
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            filterable: true,
            height: 550,
            groupable: true
            ,
            sortable: true,
            resizable: true,
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },
            pageable: {
                pageSizes: [20, 40, 60, Resources.All],
                numeric: true,
                refresh: true,

            },
            columns: [

                { field: "groupCode", title: resources.Code, width: "150px" },
                { field: "groupNameAr", title: resources.NameAr, width: "150px" },
                { field: "groupNameEn", title: resources.NameEn, width: "150px" },

                { width: "90px", template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: resources.status },

                {
                    field: "creationDate", title: resources.creationDate, format: "{0:yyyy/MM/dd}", width: "150px",
                    filterable: {
                        operators: {
                            date: {
                                gte: resources.isAfterOrEqualTo,
                                lte: resources.isBeforeOrEqualTo
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
                { width: "150px", template: "<a  href='/PayLookups/EditPaySupplierGroup/#= id #'  class='btn btn-success btn-sm '><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete ' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);

                });
            },
            //resizable: true
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removePaySupplierGroup);
    }

    function removePaySupplierGroup() {

        var row = $(this).closest("tr"),
            grid = $("#PaySupplierGroupGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        swal({
            title: $("#DeleteResource").text(),
            text: $("#DeleteConfirmResource").text(),
            type: "info",
            showCancelButton: true,
            confirmButtonText: $("#DeleteResource").text(),
            cancelButtonText: $("#CancelResource").text(),
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: "/PayLookups/DeletePaySupplierGroup?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadPaySupplierGroupGrid();
                            swal({
                                title: $("#DeleteSuccessResource").text(),
                                confirmButtonText: $("#DoneResource").text(),
                                type: "success"
                            });
                        }
                        else {
                            swal({
                                title: $("#DeleteFailedResource").text(),
                                confirmButtonText: $("#DoneResource").text(),
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
    $("#PaySupplierGroupGrid").getKendoGrid().saveAsExcel();
});