$(document).ready(function () {
    loadGrid();

    $("#FK_StMainCategoryId").change(function () {
        if ($("#FK_StMainCategoryId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllStItemByMainCategory?id=' + $("#FK_StMainCategoryId").val(),
                success: function (items) {
                    debugger
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    for (var i = 0; i < items.length; i++) {
                        options += '<option value="' + items[i].id + '">' + items[i].itemName + '</options>'
                    }
                    $("#FK_StItemId").html(options)
                }
            })
        }
    });
    function loadGrid() {

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/StTransaction/GetAllDepartmentExchangeFollowUp?dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val() + "&departId=" + $("#FK_HrDepartmentId :selected").val() + "&statusId=" + $("#FK_StStatusId :selected").val() + "&serialNumber=" + $("#SerialNumber").val() + "&itemId=" + $("#FK_StItemId :selected").val() + "&itemCode=" + $("#ItemCode").val(),
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
                        storeName: { editable: false },
                        department: { editable: false },
                        serialNumber: { editable: false },
                        transactionDate: { type: "date", editable: false },
                        itemName: { editable: false },
                        itemCode: { editable: false },
                        status: { editable: false }
                    }
                }
            }
        });

        $("#StFollowUpDepartmentExchangeGrid").kendoGrid({
            excel: {
                fileName: "Department Exchange.xlsx",
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
            scrollable: true,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            pageable: {
                pageSizes: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [
                { field: "storeName", title: Resources.Store, width: Resources.NameWidth },
                { field: "department", title: Resources.DepartmentName, width: Resources.NameWidth },
                { field: "serialNumber", title: Resources.SerialNumber, width: Resources.NameWidth },
                { field: "transactionDate", title: Resources.BillDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
                { field: "itemName", title: Resources.ItemName, width: Resources.NameWidth },
                { field: "itemCode", title: Resources.Barcode, width: Resources.NameWidth },
                { field: "status", title: Resources.Status, width: Resources.TypeWidth },
                { width: Resources.DoubleActionWidth, template: "<a  href='/StTransaction/EditDepartmentExchange/#= id #'  class='btn btn-success btn-sm btnApprove'>" + Resources.Details + "</a>" },

            ],
            dataBound: function (e) {

                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                //if (!hasRoleDelete)
                //    $(".btnDelete").addClass('disabled');
            }
        });
    }

    $("#btnSearch").on('click', function () {
        loadGrid();
    });

});