$(document).ready(function () {
    loadGrid();
    function loadGrid() {

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/PurchaseOrder/GetAll?dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val() + "&statusId=" + $("#FK_StStatusId :selected").val() + "&serialNumber=" + $("#SerialNumber").val() + "&departId=" + $("#FK_HrDepartmentId :selected").val() + "&empId=" + $("#FK_HrEmployeeId :selected").val(),
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
                        serialNumber: { editable: false },
                        orderDate: { type: "date", editable: false },
                        employeeName: { editable: false },
                        department: { editable: false },
                        fK_StStatusId: { editable: false },
                        status: { editable: false }
                    }
                }
            }
        });

        $("#PurchaseOrderGrid").kendoGrid({
            excel: {
                fileName: "Purchase Orders.xlsx",
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
                { field: "serialNumber", title: Resources.OrderNumber, width: Resources.CodeWidth },
                { field: "orderDate", title: Resources.OrderDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
                { field: "employeeName", title: Resources.ResponsiblePersonName, width: Resources.InputNumberWidth },
                { field: "department", title: Resources.DepartmentName, width: Resources.InputNumberWidth },
                { field: "status", title: Resources.Status, width: Resources.TypeWidth },
                { width: Resources.DoubleActionWidth, template: "<a  href='/PurchaseOrder/Approve/#= id #'  class='btn btn-success btn-sm btnApprove'>" + Resources.Approve + "</a>    <a  href='/PurchaseOrder/Reject/#= id #'  class='btn btn-danger btn-sm btnReject'>" + Resources.Reject + "</a> #if(fK_StStatusId == 7){#  <a  href='/PurchaseOrder/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> #}else{# #}#" },

            ],
            dataBound: function (e) {

                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');
                if (!hasRoleApprove)
                    $(".btnApprove").addClass('disabled');
                if (!hasRoleReject)
                    $(".btnReject").addClass('disabled');

                //if (!hasRoleDelete)
                //    $(".btnDelete").addClass('disabled');
            }
        });
    }

    $("#btnSearch").on('click', function () {
        loadGrid();
    });

});






