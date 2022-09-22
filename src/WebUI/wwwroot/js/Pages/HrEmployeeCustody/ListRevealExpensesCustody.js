$(document).ready(function () {
    $("#DefBranches").change(function () {
        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").value(0);

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        loadRevealExpensesCustody();
    });
    $("#FK_HrEmployeeCustodyId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployeeCustody/GetAllHrEmployeeCustodyForDDList",
                },
                parameterMap: function (data, action) {


                    if (action === "read") {
                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val()),
                            //  employeeId: parseInt($("#EmployeeId").val()),
                        };

                    } else {
                        return data;
                    }
                }
            }
        },

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

    loadRevealExpensesCustody();

    function loadRevealExpensesCustody() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeCustody/GetAllRevealExpensesCustody",
                    Type: "GET"
                },
                parameterMap: function (data, action) {

                    if (action === "read") {

                        return {
                            fK_HrEmployeeCustodyId: $("#FK_HrEmployeeCustodyId").val(),
                            fK_HrEmployeeId: $("#FK_HrEmployeeId").val(),
                            fK_DefBranchId: $("#FK_DefBranchId").val(),

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
                        fK_HrEmployeeCustodyId: { editable: false },
                        hrEmployeeCustodyName: { editable: false },
                        fK_AccountStatementId: { editable: false },
                        fK_HrEmployeeId: { editable: false },
                        hrEmployeeName: { editable: false },
                        totalExpense: { editable: false },
                        totalCustody: { editable: false },
                        totalBalance: { editable: false },

                    }
                }
            }
        });


        var grid = $("#GridRevealExpensesCustody").kendoGrid({
            excel: {
                fileName: "Reveal Expenses Custody.xlsx",
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

                { field: "hrEmployeeCustodyName", title: Resources.CustodySerial, width: Resources.NameWidth },
                { field: "hrEmployeeName", title: Resources.EmployeeName, width: Resources.NameWidth },
                { field: "totalCustody", title: Resources.TotalCustody, width: Resources.NameWidth },
                { field: "totalExpense", title: Resources.TotalReveal, width: Resources.NameWidth },
                { field: "totalBalance", title: Resources.Balance, width: Resources.NameWidth },
                {
                    //<a  href='/CbReceiptBond/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a>
                    width: Resources.DoubleActionWidth, template: "<a  class='btn btn-warning btn-sm btnOpenReport'><i class='fas fa-eye'></i></a>"
                },
            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                })
                //if (!hasRoleEdit)
                //    $(".btnEdit").addClass('disabled');

                //if (!hasRoleDelete)
                //    $(".btnDelete").addClass('disabled');
            },
            resizable: true,
        });
        grid.data("kendoGrid").table.on("click", ".btnOpenReport", OpenReport);
    }

    function OpenReport() {

        var row = $(this).closest("tr"),
            grid = $("#GridRevealExpensesCustody").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        if (dataItem.fK_HrEmployeeCustodyId > 0 && dataItem.fK_AccountStatementId) {
            var url = "/HrEmployeeCustody/RevealExpensesCustodyPrint?id=" + dataItem.fK_HrEmployeeCustodyId + "&accStatementId=" + dataItem.fK_AccountStatementId;
            window.open(url, '_blank').print();
        }
        else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    }

    $("#btnDataReview").click(function () {
        loadRevealExpensesCustody();

    })


});



$(".exportExcel").on('click', function () {
    $("#GridRevealExpensesCustody").getKendoGrid().saveAsExcel();
});
