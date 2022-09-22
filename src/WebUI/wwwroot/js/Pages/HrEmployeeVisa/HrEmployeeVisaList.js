﻿$(document).ready(function () {

    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#HrEmployeeVisaGrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });

    loadEmployeeVisaGrid();

    function loadEmployeeVisaGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeVisa/GetAll",
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
                        countryName: { editable: false },
                        visaNumber: { editable: false },
                        totalVisaCount: { editable: false },
                        jobName: { editable: false },
                        creationDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },
                    }
                }
            }
        });


        var grid = $("#HrEmployeeVisaGrid").kendoGrid({
            excel: {
                fileName: "Employee Visa.xlsx",
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

                { field: "countryName", title: Resources.Country, width: Resources.NameWidth },
                { field: "visaNumber", title: Resources.VisaNumber, width: Resources.NameWidth },
                { field: "totalVisaCount", title: Resources.TotalVisaCount, width: Resources.NameWidth },
                { field: "jobName ", title: Resources.Job, width: Resources.NameWidth },
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
                    width: Resources.DoubleActionWidth, template: "<a  href='/HrEmployeeVisa/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>"
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeEmployeeVisa);
    }

    function removeEmployeeVisa() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#HrEmployeeVisaGrid").data("kendoGrid"),
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
                    url: "/HrEmployeeVisa/Delete?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadEmployeeVisaGrid();

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
    $("#HrEmployeeVisaGrid").getKendoGrid().saveAsExcel();
});