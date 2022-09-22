$(document).ready(function () {

    loadFreezingReasonGrid();

    function loadFreezingReasonGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/DefFreezingReason/GetAllFreezingReason",
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
                        reasonCode: { editable: false },
                        reasonTextAr: { editable: false },
                        reasonTextEn: { editable: false },
                        fK_SecModuleNameEn: { editable: false },
                        fK_SecModuleNameAr: { editable: false },
                        fK_SecModulePageNameEn: { editable: false },
                        fK_SecModulePageNameAr: { editable: false },
                        notes: { editable: false },
                        FK_CreatorId: { editable: false },
                        creationDate: { type: "date", editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isActive: { editable: false },
                        isDeleted: { editable: false },

                    }
                }
            }
        });


        var grid = $("#gridFreezingReason").kendoGrid({
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

                {
                    field: "reasonCode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "fK_SecModuleNameAr", title: Resources.SecModule, width: Resources.NameWidth },
                { field: "fK_SecModulePageNameAr", title: Resources.SecModulePage, width: Resources.NameWidth },
                {
                    width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },

                {
                    width: Resources.DoubleActionWidth, template: "<a  href='/DefFreezingReason/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                })
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },
            resizable: true,
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeFreezingReason);
    }
    function removeFreezingReason() {

        var row = $(this).closest("tr"),
            grid = $("#gridFreezingReason").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
        debugger;
        swal({
            title: Resources.DeleteResource,
            text:  Resources.DeleteConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.DeleteResource,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: "/DefFreezingReason/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        console.log(result);
                        if (result) {
                            loadFreezingReasonGrid();
                            swal({
                                title:    Resources.DeleteSuccessResource,
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
})