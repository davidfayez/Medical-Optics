$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_HrLicenseType").data("kendoDropDownList").dataSource.read();
        $("#FK_HrLicenseType").data("kendoDropDownList").value(0);

    });

    $("#FK_HrLicenseType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllLicenseTypeForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        }
    });

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/HrLicenseData/GetLicenseData",
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
                    branchName: { editable: false },
                    hrLicenseTypeName: { editable: false },
                    licenseNumber: { editable: false },
                    licensePlace: { editable: false },
                    licenseDate: { type: "date", editable: false},
                    licenseEndDate: { type: "date", editable: false },
                    licenseRenewDate: { type: "date", editable: false },
                }
            }
        }
    });

    $("#GridLicenseData").kendoGrid({
        excel: {
            fileName: "Account Movement Report.xlsx",
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

            { field: "branchName", title: Resources.Branch, width: Resources.NameWidth },
            { field: "hrLicenseTypeName", title: Resources.LicenseTypeName, width: Resources.NameWidth },
            { field: "licenseNumber", title: Resources.LicenseNumber, width: Resources.NameWidth },
            { field: "licensePlace", title: Resources.LicensePlace, width: Resources.NameWidth },
            { field: "licenseDate", title: Resources.LicenseDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "licenseEndDate", title: Resources.LicenseEndDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "licenseRenewDate", title: Resources.LicenseRenewDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            {
                width: Resources.DoubleActionWidth,
                template: "<a  href='/HrLicenseData/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' onclick='removeLicenseData(#= id #)'><i class='fas fa-trash-alt'></i></a>"

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
        excelExport: function (e) {
            var accountId = $("#accountName").val();
            var costCenterId = $("#costCenterName").val();
            if (accountId !== "")
                e.workbook.fileName = $("#accountName  option:selected").text();
            else if (costCenterId !== "")
                e.workbook.fileName = $("#costCenterName  option:selected").text();
        }
    });
    //$('#GridLicenseData').data("kendoGrid").table.on("click", ".btnDelete", removeLicenseData);

    


    
});


function removeLicenseData(id) {

    //var deletee = stringify(resources.delete).serialize();

    //var row = $(this).closest("tr"),
    //    grid = $("#licenseDataGrid").data("kendoGrid"),
    //    dataItem = grid.dataItem(row);
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
                url: "/HrLicenseData/Delete?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        loadLicenseDataGrid();
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
$("#btnDataReview").on('click', function () {
    debugger;
    var licenseNumber = $("#LicenseNumber").val(),
        fK_DefBranchId = parseInt($("#FK_DefBranchId").val()),
        fK_HrLicenseType = parseInt($("#FK_HrLicenseType").val()),
        dateFrom = $("#LicenseDate").val(),
        dateTo = $("#LicenseEndDate").val(); 
    fK_HrLicenseType = fK_HrLicenseType > 0 ? fK_HrLicenseType : null;
    $('.exportExcel').fadeIn('slow');

    $('#GridLicenseData').data('kendoGrid').dataSource.read({ licenseNumber: licenseNumber, fK_DefBranchId: fK_DefBranchId, fK_HrLicenseType: fK_HrLicenseType, dateFrom: dateFrom, dateTo: dateTo});
    $('#GridLicenseData').data("kendoGrid").table.on("click", ".btnDelete", removeLicenseData);
});

$(".exportExcel").on('click', function () {
    $("#GridLicenseData").getKendoGrid().saveAsExcel();
});

