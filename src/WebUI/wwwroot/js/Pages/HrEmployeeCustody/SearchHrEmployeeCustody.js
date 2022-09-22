$(document).ready(function () {
    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        loadEmployeeCustody();
    });

    $("#FK_HrEmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployeeCustody/GetAllCustodyEmployeesForDDList",
                },
                parameterMap: function (data, action) {


                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        }
    });

    loadEmployeeCustody();

    function loadEmployeeCustody() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeCustody/GetHrEmployeeCustodySearch",
                    Type: "GET"
                },
                parameterMap: function (data, action) {

                    if (action === "read") {

                        return {

                            fK_DefBranchId: $("#FK_DefBranchId").val(),
                            dateFrom: $("#DateFrom").val(),
                            dateTo: $("#DateTo").val(),
                            custdySerial: $("#Serial").val(),
                            documentNumber: $("#DocumentNumber").val(),
                            fK_HrEmployeeId: $("#FK_HrEmployeeId").val(),
                        };


                    } else {
                        return data;
                    }
                },
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
                        serial: { type: "number", editable: false },
                        fK_HrEmployeeId: { editable: false },
                        employeeCode: { editable: false },
                        employeeName: { editable: false },
                        documentNumber: { editable: false },
                        description: { editable: false },
                        dateCustody: { type: "date", editable: false },
                        isActive: { editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isDeleted: { editable: false },
                        creator: { editable: false },
                    }
                }
            }
        });


        var grid = $("#GridEmployeeCustody").kendoGrid({
            excel: {
                fileName: "Employee Custody.xlsx",
                allPages: true,
                filterable: true
            },
            dataSource: dataSource,
            pageSize: 20,
           // serverPaging: Resources.GridServerPaging,
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
                pageSizes: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "employeeCode", title: Resources.EmployeeCode, width: Resources.NameWidth },
                { field: "employeeName", title: Resources.EmployeeName, width: Resources.NameWidth },
                { field: "serial", title: Resources.CustodySerial, width: Resources.CodeWidth },
                { field: "documentNumber", title: Resources.VoucherCodeResource, width: Resources.CodeWidth },
                {
                    field: "dateCustody", title: Resources.Date, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
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
                { field: "description", title: Resources.DescriptionResource, width: Resources.DescriptionWidth },
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
        
    }


  
    $("#btnDataReview").click(function () {
        loadEmployeeCustody();

    })


});



$(".exportExcel").on('click', function () {
    $("#GridEmployeeCustody").getKendoGrid().saveAsExcel();
});
