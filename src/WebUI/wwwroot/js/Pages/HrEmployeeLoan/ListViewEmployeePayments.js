$(document).ready(function () {
    $("#DefBranches").change(function () {
        var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        $('#GridEmployeeLoan').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });

       
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
                    url: "/HrEmployee/GetAllEmployeesForDDList",
                },
                parameterMap: function (data, action) {

                    var managementId = parseInt($("#FK_HrManagementId").val()),
                        departmentId = parseInt($("#FK_HrDepartmentId").val());
                    if (managementId == 0 || isNaN(managementId))
                        managementId = null;
                    if (departmentId == 0 || isNaN(departmentId))
                        departmentId = null;


                    if (data.hasOwnProperty.length > 0 && data.managementId > 0 && data.managementId != undefined)
                        managementId = data.managementId;
                    else if (data.managementId == 0)
                        managementId = null;


                    if (data.hasOwnProperty.length > 0 && data.departmentId > 0 && data.departmentId != undefined)
                        departmentId = data.departmentId;
                    else if (data.departmentId == 0)
                        departmentId = null;

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                managementId: managementId,
                                departmentId: departmentId,
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                managementId: managementId,
                                departmentId: departmentId,
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
    });

    loadEmployeeLoanGrid();

    function loadEmployeeLoanGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeLoan/GetAllEmployeeLoanForInstallment?fK_DefBranchId=" + $("#FK_DefBranchId").val() + "&&employeeId=" + $("#FK_HrEmployeeId").val() + "&&id=" + $("#RequestId").val() ,
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
                        employeeCode: { editable: false },
                        employeeName: { editable: false },
                        totalAmount: { type: "number", editable: false },
                        installmentCount: { type: "number", editable: false },
                        isActive: { editable: false },
                        lastModifiedDate: { type: "date", editable: false },
                        isDeleted: { editable: false },
                        creator: { editable: false },
                    }
                }
            }
        });


        var grid = $("#GridEmployeeLoan").kendoGrid({
            excel: {
                fileName: "Employee Loan.xlsx",
                allPages: true,
                filterable: true
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
                pageSizes: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "employeeCode", title: Resources.Code, width: Resources.CodeWidth },
                { field: "employeeName", title: Resources.EmployeeName, width: Resources.NameWidth },
                { field: "totalAmount", title: Resources.TotalAmount, width: Resources.NameWidth },
                
                {
                    width: Resources.DoubleActionWidth, template: "<button data-toggle='modal' data-target='.installment' class='btn btn-success btn-sm btnView'><i class='fas fa-sticky-note'></i></a> "
                },
            ],
            dataBound: function (e) {
                //e.sender.items().each(function () {
                //    var dataItem = e.sender.dataItem(this);
                //    kendo.bind(this, dataItem);
                //    if (dataItem.isActive) {
                //        //$(this).addClass("k-state-selected");
                //    }
                //})
               
            },
            resizable: true,
        });
        grid.data("kendoGrid").table.on("click", ".btnView", viewDetails);
    }


    $("#btnDataReview").click(function () {
        loadEmployeeLoanGrid();
    })

 

});
function viewDetails() {

    var row = $(this).closest("tr"),
        grid = $("#GridEmployeeLoan").data("kendoGrid"),
        dataItem = grid.dataItem(row);
    //var filters = grid.dataSource.filter();
    $.ajax({
        url: "/HrEmployeeLoan/GetLoanInstallment?id=" + dataItem.id,
        type: "Get",
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            var loandate = new Date(result.dateOfDue)
            var total = parseFloat(result.totalAmount);
            $("#TotalAmount").val(result.totalAmount);
            $("#DateOfDue").val(loandate.toLocaleDateString());
            $("#InstallmentCount").val(result.installmentCount);
            $("#InstallmentValue").val(result.installmentValue);
            var table = "";
            var remainAdd = false;
            for (var i = 0; i < result.details.length; i++) {
                var dueDate = new Date(result.details[i].dateDue);
                var paid = result.details[i].isPaid ? '<input type="checkbox" checked readonly disabled />' : '<input type="checkbox" readonly disabled />';
                total -= result.details[i].isPaid ? result.details[i].amount : 0;
                var remain = "";
                if (!remainAdd && !result.details[i].isPaid) {
                    remain = result.details[i].isPaid ? "" : total;
                    remainAdd = true;
                }
                table += "<tr><td>" + dueDate.toLocaleDateString() + "</td><td>" + result.details[i].amount + "</td><td>" +
                    paid + "</td><td>" + remain + "</td></tr>"
            }
            $("#istallmentTable").html(table)

        },
        error: function (err, xqr, txt) { }
    });
}
$(".exportExcel").on('click', function () {
    $("#GridEmployeeLoan").getKendoGrid().saveAsExcel();
});
