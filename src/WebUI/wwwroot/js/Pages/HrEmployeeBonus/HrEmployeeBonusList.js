$(document).ready(function () {

    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#HrEmployeeBonusGrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });

    loadBonusGrid();

    function loadBonusGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeBonus/GetAll",
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
                        employeeName: { editable: false },
                        typeNameAr: { editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },
                        creator: { editable: false },
                    }
                }
            }
        });


        var grid = $("#HrEmployeeBonusGrid").kendoGrid({
            excel: {
                fileName: "Discount Types.xlsx",
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

                { field: "employeeName", title: Resources.NameArResource, width: Resources.NameWidth },

                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
                { field: "creator ", title: Resources.UserName, width: Resources.NameWidth },
                {
                    field: "lastModifiedDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                { title: Resources.Status, width: Resources.DoubleActionWidth, template: "#if(isDeleted==true){# " + Resources.Deleted + " #}else if(isActive==true){# " + Resources.Active + " #}else{#" + Resources.Inactive + "#}#" },

                {
                    width: Resources.DoubleActionWidth, template: "<a  href='/HrEmployeeBonus/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> #if(isDeleted==false){#<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>#}else{# <a  style='background-color:lightgreen!important' class='btn btn-sm btnRetrieve' ><i class='fas fa-reply'></i></a> #}#"
                },

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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeEmployeeBonus);
        grid.data("kendoGrid").table.on("click", ".btnRetrieve", retrieveBonus);
    }

    function removeEmployeeBonus() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#HrEmployeeBonusGrid").data("kendoGrid"),
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
                    url: "/HrEmployeeBonus/Delete?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadBonusGrid();
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

    function retrieveBonus() {

        var row = $(this).closest("tr"),
            grid = $("#HrEmployeeBonusGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
        swal({
            title: Resources.Retrieve,
            text: Resources.RetrieveConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.Retrieve,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: "/HrEmployeeBonus/Retrieve?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadBonusGrid();
                            swal({
                                title: Resources.RetrieveSuccessResource,
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
    $("#HrEmployeeBonusGrid").getKendoGrid().saveAsExcel();
});