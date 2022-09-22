$().ready(function () {
    $('#DefBranches').change(function () {

        $("#FK_HrSalaryTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrSalaryTypeId").data("kendoDropDownList").value(0);

    });

    // ddls
    $("#FK_HrSalaryTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllSalaryTypeForDDList",
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
    // Grid 
    var empId = $("#EmployeeId").val();
    LoadEmployeeSalary();
    function LoadEmployeeSalary() {
       
        if (empId != "" && empId != "0") {
            $.ajax({
                type: "POST",
                url: "/HrEmployee/GetEmployeeSalary?id=" + empId,
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (response) {
              
                    if (response != null && response.basicSalary != null) {
                        $("#BasicSalary").val(response.basicSalary);
                        //$("#FK_CbPayTypeId").val(response.fK_CbPayTypeId);
                        //$("#WagesProtection").val(response.wagesProtection);
                        $("#TotalAllowance").val(response.totalAllowance);
                        $("#TotalDeduction").val(response.totalDeduction);
                        $("#GrossSalary").val(response.grossSalary);
                        $("#NetSalary").val(response.netSalary);
                    } else {


                        CalcTotalAllowance();
                        CalcTotalDeduction();

                    }

                }
            });
        } else {
            CalcTotalAllowance();
            CalcTotalDeduction();
        }

    }
    LoadGridEmpSalary();
/*    LoadEmployeeSalary();*/
    function LoadGridEmpSalary() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetEmployeeSalaries?id=" + empId,
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
            //pageSize: 20,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: true },
                        salaryTypeName: { type: "text", editable: false },
                        cbPayTypeName: { type: "text", editable: false },
                        wagesProtection: { type: "text", editable: false },
                        amount: { type: "text", editable: false },

                    }
                }
            }
        });
        var grid = $("#GridEmployeeSalary").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "salaryTypeName", title: Resources.BasicSalaryType, width: Resources.NameWidth },
                { field: "amount", title: Resources.Value, width: Resources.NameWidth },
                { field: "cbPayTypeName", title: Resources.PaymentMethod, width: Resources.NameWidth },
                { field: "wagesProtectionName", title: Resources.WagesProtection, width: Resources.NameWidth },
                { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: true,
            selectable: "multiple, cell",
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },

        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeSalary);
    }
    function removeSalary() {

        var row = $(this).closest("tr"),
            grid = $("#GridEmployeeSalary").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            salaryId = dataItem.id,
            dataSource = $("#GridEmployeeSalary").data("kendoGrid").dataSource;
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

            if (salaryId != "" && salaryId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/HrEmployee/DeleteEmployeeSalary?id=" + salaryId,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (response) {
                            debugger
                            if (response != null) {
                                //set Totals

                                //$("#TotalAllowance").val(response.totalAllowance);
                                //$("#GrossSalary").val(response.grossSalary);
                                //$("#NetSalary").val(response.netSalary)
                                dataSource.remove(dataItem);
                                LoadEmployeeSalary();
                                //CalcBasicSalary();
                                //CalcGrossSalary();
                                //CalcNetSalary();
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
            } else {
                setTimeout(function () {

                    if (dataSource.remove(dataItem)) {
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

                }, 1000);
            }
        });


    }
    $("#saveSalary").on('click', function () {

        var employeeId = $("#EmployeeId").val(),
            fK_HrSalaryTypeId = $("#FK_HrSalaryTypeId").val(),
            amount = $("#AmountSalary").val(),
            fK_CbPayTypeId = $("#fK_CbPayTypeIdSalary").val(),
            wagesProtection = $("#WagesProtectionSalary").val();

        debugger
        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (fK_HrSalaryTypeId == "0") {
            swal({
                title: Resources.ChooseResource + " " + Resources.BasicSalaryType,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (amount == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.Value,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            debugger
            CalcBasicSalary();
            var basicSalary = $("#BasicSalary").val();
            $("#BasicSalary").val(parseFloat(basicSalary) + parseFloat(amount));
            basicSalary = $("#BasicSalary").val();

            CalcGrossSalary();
            CalcNetSalary();

            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                FK_HrSalaryTypeId: parseInt(fK_HrSalaryTypeId),
                FK_CbPayTypeId: parseInt(fK_CbPayTypeId),
                WagesProtection: parseInt(wagesProtection),

                BasicSalary: parseFloat(basicSalary),
                GrossSalary: parseFloat($("#GrossSalary").val()),
                TotalAllowance: parseFloat($("#TotalAllowance").val()),
                TotalDeduction: parseFloat($("#TotalDeduction").val()),
                NetSalary: parseFloat($("#NetSalary").val()),

                Amount: parseFloat(amount),
            }
            $.ajax({
                url: "/HrEmployee/CreateEmployeeSalary",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {

                    if (response != null) {
                        debugger
                        LoadGridEmpSalary();
                        $("#FK_HrSalaryTypeId").data("kendoDropDownList").value(0);
                        $("#AmountSalary").val("")
                        //CalcBasicSalary();
                        //CalcGrossSalary();
                        //CalcNetSalary();

                        //CalcTotalAllowance();
                        //CalcTotalDeduction();
                        //set Totals
                        //$("#TotalAllowance").val(response.totalAllowance);
                        //$("#GrossSalary").val(response.grossSalary);
                        //$("#NetSalary").val(response.netSalary)

                        //// $("#FK_HrAllowanceTypeId").val("");
                        //$("#FK_HrAllowanceTypeId").data("kendoDropDownList").value(0);
                        //$("#allowanceAmount").val("");
                        //$("#allowancePercentageFromBasic").val("");
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }

                }
            });


        }

        //var employeeId = $("#EmployeeId").val(),
        //    basicSalary = $("#BasicSalary").val();



        //if (employeeId == "" || employeeId == "0") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else if (basicSalary == "") {
        //    swal({
        //        title: Resources.EnterRequiredResource + " " + Resources.BasicSalary,
        //        confirmButtonText: Resources.DoneResource,
        //        type: "error"
        //    });
        //}
        //else {

        //    var Obj = {
        //        FK_HrEmployeeId: parseInt(employeeId),
        //        BasicSalary: parseFloat(basicSalary),
        //        GrossSalary: parseFloat($("#GrossSalary").val()),
        //        TotalAllowance: parseFloat($("#TotalAllowance").val()),
        //        TotalDeduction: parseFloat($("#TotalDeduction").val()),
        //        NetSalary: parseFloat($("#NetSalary").val()),
        //        WagesProtection: parseInt($("#WagesProtection").val()),
        //        FK_CbPayTypeId: parseInt($("#FK_CbPayTypeId").val()),

        //    }

        //    $.ajax({
        //        url: "/HrEmployee/UpdateEmployeeSalary",
        //        type: "Post",
        //        cache: false,
        //        processData: false,
        //        data: JSON.stringify(Obj),
        //        contentType: 'application/json',
        //        success: function (response) {
        //            if (response != null) {

        //                swal({
        //                    title: Resources.SavedSuccessfullyResource,
        //                    confirmButtonText: Resources.DoneResource,
        //                    type: "success"
        //                });
        //            }

        //        }
        //    });




        //}


    });

    //$("#BasicSalary").keyup(function () {
    //    CalcGrossSalary();
    //    CalcNetSalary();
    //});
    function CalcTotalAllowance() {
        var gridData = $('#GridAllowances').data("kendoGrid").dataSource.data();
        var totalAllowance = 0;
        for (var i = 0; i < gridData.length; i++) {
            totalAllowance += gridData[i].amount;
        }
        $("#TotalAllowance").val(totalAllowance);
    }
    function CalcTotalDeduction() {
        var gridData = $('#GridDeductions').data("kendoGrid").dataSource.data();
        var totalDeduction = 0;
        for (var i = 0; i < gridData.length; i++) {
            totalDeduction += gridData[i].amount;
        }
        $("#TotalDeduction").val(totalDeduction);
    }
    function CalcGrossSalary() {
        var allowance = parseFloat($("#TotalAllowance").val());
        var basicSalary = parseFloat($("#BasicSalary").val());
        $("#GrossSalary").val(basicSalary + allowance);
    }
    function CalcNetSalary() {
        var grossSalary = parseFloat($("#GrossSalary").val());
        var deduction = parseFloat($("#TotalDeduction").val());
        $("#NetSalary").val(grossSalary - deduction);
    }
    function CalcBasicSalary() {
        debugger
        var gridData = $('#GridEmployeeSalary').data("kendoGrid").dataSource.data();
        var basicSalary = 0;
        for (var i = 0; i < gridData.length; i++) {
            basicSalary += parseFloat(gridData[i].amount);
        }
        $("#BasicSalary").val(basicSalary);
    }

    setDefaultValue();
});

function setDefaultValue() {
    if ($("#WagesProtection").val() == '0' || $("#WagesProtection").val() == '') {
        $("#WagesProtection").val('1');
    }
    if ($("#FK_CbPayTypeId").val() == '0' || $("#FK_CbPayTypeId").val() == '') {

        $("#FK_CbPayTypeId").val('3');
    }



}