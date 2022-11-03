$(document).ready(function () {


    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/CustomerData/GetAllPatientsFiles",
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
                    customerMRN: { editable: false },
                    customerNameAr: { editable: false },
                    customerNameEn: { editable: false },
                    email: { editable: false },
                    birthDate: { type: "date", editable: false },
                    creationDate: { type: "date", editable: false },
                    lastModifiedDate: { type: "date", editable: false },
                    isActive: { editable: false },
                    isDeleted: { editable: false },

                }
            }
        }
    });
    var grid = $("#PatientsFilesGrid").kendoGrid({
        excel: {
            fileName: "PatientsFiles.xlsx",
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

            { field: "customerMRN", title: Resources.CodeResource, width: Resources.CodeWidth },
            { field: "customerNameAr", title: Resources.NameArResource, width: Resources.NameWidth },
            { field: "customerNameEn", title: Resources.NameEnResource, width: Resources.NameWidth },
            { field: "email", title: Resources.Email, width: Resources.NameWidth },

            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
            {
                field: "birthDate", title: Resources.BirthDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                template: "<a  href='/CustomerData/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>"

            },

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);

            });

        },
        //resizable: true
    });
    grid.data("kendoGrid").table.on("click", ".btnDelete", removeCustomer);
    function removeCustomer() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#PatientsFilesGrid").data("kendoGrid"),
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
                    url: "/CustomerData/Delete?Id=" + dataItem.id,
                    type: "Post",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadPatientsFilesGrid();
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

    //$('.nav-tabs li').eq(1).click(function () {
    //})
    $("#btnSearch").on("click", function (e) {
        var ref_this = $('ul.nav-tabs li a.active');
        var tabId = ref_this[0].id;
        if (tabId == "KendoGrid-tab") {
            e.preventDefault();
            var customerMRN = $("#CustomerMRN").val();
            var iDNumber = $("#IDNumber").val();
            var clientName = $("#ClientName").val();
            $('#PatientsFilesGrid').data('kendoGrid').dataSource.read({ customerMRN: customerMRN, iDNumber: iDNumber, clientName: clientName});
        }
        

    });
});

function RefreshGrid() {

}
//$('#list-item').on("click", function () {
//});

$(".exportExcel").on('click', function () {
    $("#PatientsFilesGrid").getKendoGrid().saveAsExcel();
});