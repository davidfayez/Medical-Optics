$().ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_HrDeductionTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDeductionTypeId").data("kendoDropDownList").value(0);

    });

    // ddls

    $("#FK_HrDeductionTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllDeductionTypeForDDList",
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
    LoadGridDeductions();
    function LoadGridDeductions() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetEmployeeDeductions?id=" + empId,
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
                        deductionTypeName: { type: "text", editable: false },
                        percentageFromBasic: { type: "text", editable: false },
                        amount: { type: "text", editable: false },

                    }
                }
            }
        });
        var grid = $("#GridDeductions").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "deductionTypeName", title: Resources.DeductionType, format: "{0:c}", width: Resources.NameWidth },
                { field: "percentageFromBasic", title: Resources.PercentageOfBasicSalary, width: Resources.NameWidth },
                { field: "amount", title: Resources.DeductedAmount, width: Resources.NameWidth },

                { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: true,
            selectable: "multiple, cell",
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },

        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeDeduction);
    }
    function removeDeduction() {

        var row = $(this).closest("tr"),
            grid = $("#GridDeductions").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            deductionId = dataItem.id,
            dataSource = $("#GridDeductions").data("kendoGrid").dataSource;
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

            if (deductionId != "" && deductionId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/HrEmployee/DeleteDeduction?id=" + deductionId,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (response) {

                            debugger
                            if (response != null) {
                                //set Totals
                                $("#TotalDeduction").val(response.totalDeduction);
                                $("#GrossSalary").val(response.grossSalary);
                                $("#NetSalary").val(response.netSalary)
                                dataSource.remove(dataItem)
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

    $("#addDeduction").on('click', function () {

        var employeeId = $("#EmployeeId").val(),
            fK_HrDeductionTypeId = $("#FK_HrDeductionTypeId").val(),
            deductionAmount = $("#deductionAmount").val(),
            deductionPercentageFromBasic = $("#deductionPercentageFromBasic").val();
        var isChecked = $('input[type=radio][name=deductionPercentageAmountFromBasic]:checked').val();
        //if ($("#deductionPercentageFromBasicrd").is(':checked'))
        //    deductionAmount = 0;
        //else 
        //    deductionPercentageFromBasic = 0;

        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (fK_HrDeductionTypeId == "0") {
            swal({
                title: Resources.ChooseResource + " " + Resources.DeductionType,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (isChecked == "percentage" && (deductionPercentageFromBasic == "0" || deductionPercentageFromBasic == "")) {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.PercentageOfBasicSalary,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (isChecked == "amount" && (deductionAmount == "0" || deductionAmount == "")) {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.DeductedAmount,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {

            debugger
            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                FK_HrDeductionTypeId: parseInt(fK_HrDeductionTypeId),
                PercentageFromBasic: parseFloat(deductionPercentageFromBasic),
                Amount: parseFloat(deductionAmount),
            }
            $.ajax({
                url: "/HrEmployee/CreateDeduction",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {

                    if (response) {
                        debugger
                        LoadGridDeductions();
                        //set Totals

                        $("#TotalDeduction").val(response.totalDeduction);
                        $("#GrossSalary").val(response.grossSalary);
                        $("#NetSalary").val(response.netSalary);

                        $("#FK_HrDeductionTypeId").val("");
                        $("#FK_HrDeductionTypeId").data("kendoDropDownList").value(0);
                        $("#deductionAmount").val("");
                        $("#deductionPercentageFromBasic").val("");
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }

                }
            });


        }


    });
    //function CalcTotalDeduction() {
    //    var gridData = $('#GridDeductions').data("kendoGrid").dataSource.data();
    //    var totalDeduction = 0;
    //    for (var i = 0; i < gridData.length; i++) {
    //        totalDeduction += gridData[i].amount;
    //    }
    //    $("#TotalDeduction").val(totalDeduction);
    //}
    //function CalcGrossSalary() {
    //    var allowance = parseFloat($("#TotalAllowance").val());
    //    var basicSalary = parseFloat($("#BasicSalary").val());
    //    $("#GrossSalary").val(basicSalary + allowance);
    //}
    //function CalcNetSalary() {
    //    var grossSalary = parseFloat($("#GrossSalary").val());
    //    var deduction = parseFloat($("#TotalDeduction").val());
    //    $("#NetSalary").val(grossSalary - deduction);
    //}

    $('input[type=radio][name=deductionPercentageAmountFromBasic]').change(function () {
        if ($("#deductionPercentageFromBasicrd").is(':checked')) {
            $("#deductionPercentageFromBasic").prop("disabled", false);
            $("#deductionAmount").val(0);
            $("#deductionAmount").prop("disabled", true);
        }
        else {
            $("#deductionPercentageFromBasic").prop("disabled", true);
            $("#deductionPercentageFromBasic").val(0);
            $("#deductionAmount").prop("disabled", false);
        }
    });
});