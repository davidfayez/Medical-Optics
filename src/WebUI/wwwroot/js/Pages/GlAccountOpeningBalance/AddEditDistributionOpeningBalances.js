$(document).ready(function () {
    $("#DefBranches").change(function () {

        $("#FK_CostCenterId").data("kendoDropDownList").value(0);
        $("#FK_CostCenterId").data("kendoDropDownList").dataSource.read();


        $("#FK_TaxesId").data("kendoDropDownList").value("0");
        $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();


        $("#FK_HrEmployeeId").data("kendoDropDownList").value("0");
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();

        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").value(0);
    });

    $("#FK_CostCenterId").kendoDropDownList({
        filter: "contains",
        height: 300,
        open: function (e) {
            $(document).off('focusin.bs.modal');
        },
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllCostCentersForDDList",
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
    $("#FK_HrEmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        open: function (e) {
            $(document).off('focusin.bs.modal');
        },
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeeForDDList",
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
        },
        select: onSelectEmployee
    });
    $("#FK_TaxesId").kendoDropDownList({
        filter: "contains",
        height: 300,
        open: function (e) {
            $(document).off('focusin.bs.modal');
        },
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Taxes/GetAllTaxesForDDList",
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
        },

    });
    function onSelectEmployee(e) {

        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").dataSource.read({ defBranchId: parseInt($("#FK_DefBranchId").val()), employeeId: e.dataItem.id });
        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").value(0);
    }
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
                    url: "/HrEmployeeCustody/GetAllHrEmployeeCustodyByEmpIdForDDList",
                },
                parameterMap: function (data, action) {

                    debugger
                    if (action === "read" && data.employeeId == undefined) {

                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val()),
                            employeeId: parseInt($("#FK_HrEmployeeId").val()),
                        };

                    } else {
                        return data;
                    }
                }
            }
        },
    });
    //Grid
    loadCustodyDetailGrid();

    function loadCustodyDetailGrid() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlAccountOpeningBalance/GetDistributionOpeningBalanceDetails?accId=" + $("#GlAccountId").val() + "&fpId=" + $("#GlFinancialPeriodId").val(),
                    Type: "GET"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }

            },
            //autoSync: true,
            batch: true,
            /*      scrollable: true,*/
            //sortable: true,
            //reorderable: true,
            //groupable: true,

            //pageSize: 20,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: true },
                        description: { editable: false },
                        balanceDate: { type: "date", editable: false },
                        fK_CostCenterId: { editable: false },
                        costCenter: { editable: false },
                        fK_HrEmployeeId: { editable: false },
                        employee: { editable: false },
                        fK_TaxesId: { editable: false },
                        tax: { editable: false },
                        custodyName: { editable: false },
                        debit: { editable: false },
                        credit: { editable: false },

                    }
                }
            }
        });
        var balanceDetailGrid = $("#balanceDetailGrid").kendoGrid({
            dataSource: tempSource,
            excel: {
                fileName: "Distribution Of Opening Balances.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            /*  scrollable: true,*/
            //sortable: true,
            //reorderable: true,
            //groupable: true,
            /*     resizable: true,*/
            pageable: false,
            columns: [
                { field: "fK_CostCenterId", hidden: true, format: "{0:c}" },
                { field: "fK_HrEmployeeId", hidden: true, format: "{0:c}" },
                { field: "fK_HrEmployeeCustodyId", hidden: true, format: "{0:c}" },
                { field: "fK_TaxesId", hidden: true, format: "{0:c}" },
                { field: "balanceDate", hidden: true, format: "{0:yyyy/MM/dd}" },
                { field: "description", title: Resources.DescriptionResource, width: Resources.NameWidth },
                { field: "costCenter", title: Resources.CostCenter, width: Resources.NameWidth },
                { field: "tax", title: Resources.TaxCategory, width: Resources.NameWidth },
                { field: "employee", title: Resources.EmployeeName, width: Resources.NameWidth },
                { field: "custodyName", title: Resources.CustodySerial, width: Resources.NameWidth },
                { field: "debit", title: Resources.Debit, width: Resources.InputNumberWidth },
                { field: "credit", title: Resources.Credit, width: Resources.InputNumberWidth },

                { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: false,
            selectable: "multiple, cell",


        });

        balanceDetailGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
        tempSource.fetch(function () {

            getTotalDebit();
            getTotalCredit();

        });
    }

    $("#btnAddNewDetail").on('click', function () {
        if ($("#FK_CostCenterId").val() == "0") {

            swal({
                title: Resources.Choose + " " + Resources.CostCenter,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (($("#Debit").val() == "" && $("#Credit").val() == "") || ($("#Debit").val() == "0" && $("#Credit").val() == "0")) {
            swal({
                title: Resources.DebitCreditRequiredResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {

            var tax = "",
                custody = "",
                employe = "";

            if ($("#FK_TaxesId").data("kendoDropDownList").value() != "0")
                tax = $("#FK_TaxesId").data("kendoDropDownList").text();

            if ($("#FK_HrEmployeeId").data("kendoDropDownList").value() != "0")
                employe = $("#FK_HrEmployeeId").data("kendoDropDownList").text();

            if ($("#FK_HrEmployeeCustodyId").data("kendoDropDownList").value() != "0")
                custody = $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").text();

            var totalRecords = $("#balanceDetailGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                id: 0,
                balanceDate: new Date($("#BalanceDate").val()),
                fK_CostCenterId: $("#FK_CostCenterId").data("kendoDropDownList").value(),
                costCenter: $("#FK_CostCenterId").data("kendoDropDownList").text(),
                fK_HrEmployeeId: $("#FK_HrEmployeeId").data("kendoDropDownList").value(),
                employee: employe,
                fK_HrEmployeeCustodyId: $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").value(),
                custodyName: custody,
                fK_TaxesId: $("#FK_TaxesId").data("kendoDropDownList").value(),
                tax: tax,
                debit: $("#Debit").val(),
                credit: $("#Credit").val(),
                description: $("#Description").val(),

            });

            getTotalDebit();
            getTotalCredit();
            ClearFormDetails();

        }


    });



    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#balanceDetailGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            detailId = dataItem.id,
            dataSource = $("#balanceDetailGrid").data("kendoGrid").dataSource;
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

            if (detailId != "" && detailId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/GlAccountOpeningBalance/DeleteDistributionOpeningBalanceDetail?id=" + detailId,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {

                            if (result) {

                                dataSource.remove(dataItem)
                                swal({
                                    title: Resources.DeleteSuccessResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                });
                                getTotalDebit();
                                getTotalCredit();
                                $("#btnSearch").click();

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
            }
            else {
                setTimeout(function () {

                    if (dataSource.remove(dataItem)) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        getTotalDebit();
                        getTotalCredit();

                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }

                }, 1000);
            }

        });
    }


    function ClearFormDetails() {
        $("#Debit").val("");
        $("#Credit").val("");

        $("#FK_TaxesId").data("kendoDropDownList").value("0");
        $("#FK_HrEmployeeId").data("kendoDropDownList").value("0");

        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").dataSource.read({ defBranchId: parseInt($("#FK_DefBranchId").val()), employeeId: 0 });
        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").value(0);

    }




})
//$("#btnSaveBalanceDetails").click(function (e) {
$("#btnSaveBalanceDetails").off("click").on("click", function (e) {

    var table = $("#balanceDetailGrid").data("kendoGrid").dataSource.data();
    //if ($("#FK_HrEmployeeCustodyId").val() == "0") {

    //    swal({
    //        title: Resources.Choose + " " + Resources.CustodySerial,
    //        confirmButtonText: Resources.DoneResource,
    //        type: "error"
    //    });
    //}
    //else 
    if (table.length == 0) {
        swal({
            title: Resources.GridLengthZeroResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });

    }
    if (table.length > 0) {
        var balanceDetail = [];
        for (var i = 0; i < table.length; i++) {
            var balanceDate = new Date(table[i].balanceDate);
            var balanceDateFormated = balanceDate.getFullYear() + "-" + ("0" + (balanceDate.getMonth() + 1)).slice(-2) + "-" + ("0" + balanceDate.getDate()).slice(-2);

            var detail = {
                Id: table[i].id,
                Description: table[i].description,
                FK_CostCenterId: table[i].fK_CostCenterId,
                FK_HrEmployeeId: table[i].fK_HrEmployeeId,
                FK_HrEmployeeCustodyId: table[i].fK_HrEmployeeCustodyId,
                FK_TaxesId: table[i].fK_TaxesId,
                Debit: table[i].debit,
                Credit: table[i].credit,
                BalanceDate: balanceDateFormated,
            }
            balanceDetail.push(detail);
        }

        var obj = {
            GlAccountId: $("#GlAccountId").val(),
            FK_DefBranchId: $("#FK_DefBranchId").val(),
            GlFinancialPeriodId: $("#GlFinancialPeriodId").val(),
            Details: balanceDetail
        }

        $.ajax({
            url: '/GlAccountOpeningBalance/SaveDistributionOpeningBalances',
            type: 'POST',
            data: { balanceDetails: obj },
            success: function (result) {
                if (result) {
                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    }, function () {
                        setTimeout(function () {
                            /* document.location = "../../GlAccountOpeningBalance/Index"*/

                            $('#balanceDetailModal').modal('toggle');
                            $("#btnSearch").click();
                            e.preventDefault();
                        }, 1000);
                    });

                } else {
                    swal({
                        title: Resources.ErrorMsgResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }
            }
        })
    }
})

function getTotalDebit() {

    var DebitTotal = 0;
    var grid = $("#balanceDetailGrid").data("kendoGrid");
    var gridData = grid.dataSource.view();
    for (var i = 0; i < grid.dataSource.data().length; i++) {
        var debit = parseFloat(gridData[i].debit);
        if (isNaN(debit))
            debit = 0;
        DebitTotal += debit;
    }
    $("#TotalDebit").val(DebitTotal.toFixed(2));

}

function getTotalCredit() {

    var CreditTotal = 0
    var grid = $("#balanceDetailGrid").data("kendoGrid");
    var gridData = grid.dataSource.view();
    for (var i = 0; i < grid.dataSource.data().length; i++) {
        var credit = parseFloat(gridData[i].credit);
        if (isNaN(credit))
            credit = 0;
        CreditTotal += credit;
    }
    $("#TotalCredit").val(CreditTotal.toFixed(2));

}