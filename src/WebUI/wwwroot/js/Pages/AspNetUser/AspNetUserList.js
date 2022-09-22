$(document).ready(function () {
    $("#FK_DefBranchId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "branchNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/DefBranch/GetAllBranches",
                }
            }
        },
        select: onSelectBranch,

    });
    function onSelectBranch(e) {
        $("#branchId").val(e.dataItem.id)
        loadUsersGrid();
    };
    
    loadUsersGrid();
    function loadUsersGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/AspNetUser/GetAll?branchId=" + $("#branchId").val(),
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
                        userName: { editable: false },
                        email: { editable: false },
                        employeeName: { editable: false },
                        surName: { editable: false },
                        fK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },

                    }
                }
            }
        });


        var grid = $("#GridUsers").kendoGrid({
            excel: {
                fileName: "Users.xlsx",
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

                { field: "userName", title: Resources.UserNameResource, width: Resources.NameWidth },
                { field: "email", title: Resources.EmailResource, width: Resources.EmailWidth },
                { field: "surName", title: Resources.SurNameResource, width: Resources.NameWidth },
                { field: "employeeName", title: Resources.EmployeeNameResource, width: Resources.NameWidth },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.StatusResource },
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
                            });
                        }
                    }
                },
                { width: Resources.DoubleActionWidth, template: "<a  href='/AspNetUser/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },


            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    //if (dataItem.isActive) {
                    //    $(this).addClass("k-state-selected");
                    //}
                });
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            }
            //resizable: true
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeUser);
    }

    function removeUser() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#GridUsers").data("kendoGrid"),
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
                    url: "/AspNetUser/Delete?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadUsersGrid();
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
});
$(".exportExcel").on('click', function () {
    $("#GridUsers").getKendoGrid().saveAsExcel();
});