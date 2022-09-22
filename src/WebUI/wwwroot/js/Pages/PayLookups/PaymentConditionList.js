$(document).ready(function () {

    $("#DefBranches").change(function () {
        
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#PaymentConditionGrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    });
    loadPaymentConditionGrid();

    function loadPaymentConditionGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/PayLookups/GetAllPaymentCondition",
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
                        conditionCode: { editable: false },
                        conditionNameAr: { editable: false },
                        conditionNameEn: { editable: false },
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


        var grid = $("#PaymentConditionGrid").kendoGrid({
            excel: {
                fileName: "Payment Condition.xlsx",
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

                { field: "conditionCode", title: Resources.CodeResource, width: Resources.CodeWidth },
                { field: "conditionNameAr", title: Resources.NameArResource, width: Resources.NameWidth },
                { field: "conditionNameEn", title: Resources.NameEnResource, width: Resources.NameWidth },

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
                    width: Resources.DoubleActionWidth,
                    template: '#if(standalone==="True") {#<a  href="/PayLookups/EditPaymentCondition/#= id #?standalone=1"  class="btn btn-success btn-sm btnEdit"><i class="fas fa-edit"></i></a> <a  class="btn btn-danger btn-sm btnDelete" ><i class="fas fa-trash-alt"></i></a>#} else {# <a  href="/PayLookups/EditPaymentCondition/#= id # "  class="btn btn-success btn-sm btnEdit"><i class="fas fa-edit"></i></a> <a  class="btn btn-danger btn-sm btnDelete" ><i class="fas fa-trash-alt"></i></a> #}#'

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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removePaymentCondition);
    }

    function removePaymentCondition() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#PaymentConditionGrid").data("kendoGrid"),
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
                    url: "/PayLookups/DeletePaymentCondition?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadPaymentConditionGrid();
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
    $("#PaymentConditionGrid").getKendoGrid().saveAsExcel();
});