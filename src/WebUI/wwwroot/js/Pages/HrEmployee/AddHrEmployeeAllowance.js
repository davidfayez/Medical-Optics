$().ready(function () {
    $('#DefBranches').change(function () {

        $("#FK_HrAllowanceTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrAllowanceTypeId").data("kendoDropDownList").value(0);

    });

    // ddls

    $("#FK_HrAllowanceTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllAllowanceTypeForDDList",
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
    LoadGridAllowances();
    function LoadGridAllowances() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployee/GetEmployeeAllowances?id=" + empId,
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
                        allowanceTypeName: { type: "text", editable: false },
                        percentageFromBasic: { type: "text", editable: false },
                        amount: { type: "text", editable: false },

                    }
                }
            }
        });
        var grid = $("#GridAllowances").kendoGrid({
            dataSource: tempSource,
            navigatable: true,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "allowanceTypeName", title: Resources.AllowanceType, format: "{0:c}", width: Resources.NameWidth },
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
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAllowance);
    }
    function removeAllowance() {

        var row = $(this).closest("tr"),
            grid = $("#GridAllowances").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            allowanceId = dataItem.id,
            dataSource = $("#GridAllowances").data("kendoGrid").dataSource;
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

            if (allowanceId != "" && allowanceId != null) {
                setTimeout(function () {
                    $.ajax({
                        url: "/HrEmployee/DeleteAllowance?id=" + allowanceId,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (response) {
                            debugger
                            if (response != null) {
                                //set Totals
                                $("#TotalAllowance").val(response.totalAllowance);
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

    $("#addAllowance").on('click', function () {
        debugger
        var employeeId = $("#EmployeeId").val(),
            fK_HrAllowanceTypeId = $("#FK_HrAllowanceTypeId").val(),
            allowanceAmount = $("#allowanceAmount").val(),
            allowancePercentageFromBasic = $("#allowancePercentageFromBasic").val();
        var isChecked = $('input[type=radio][name=allowancePercentageAmountFromBasic]:checked').val();



        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (fK_HrAllowanceTypeId == "0") {
            swal({
                title: Resources.ChooseResource + " " + Resources.AllowanceType,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (isChecked == "percentage" && (allowancePercentageFromBasic == "0" || allowancePercentageFromBasic == "")) {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.PercentageOfBasicSalary,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (isChecked == "amount" && (allowanceAmount == "0" || allowanceAmount == "")) {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.DeductedAmount,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                FK_HrAllowanceTypeId: parseInt(fK_HrAllowanceTypeId),
                PercentageFromBasic: parseFloat(allowancePercentageFromBasic),
                Amount: parseFloat(allowanceAmount),
            }
            $.ajax({
                url: "/HrEmployee/CreateAllowance",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {

                    if (response != null) {
                        debugger
                        LoadGridAllowances();
                        //set Totals
                        $("#TotalAllowance").val(response.totalAllowance);
                        $("#GrossSalary").val(response.grossSalary);
                        $("#NetSalary").val(response.netSalary)

                        // $("#FK_HrAllowanceTypeId").val("");
                        $("#FK_HrAllowanceTypeId").data("kendoDropDownList").value(0);
                        $("#allowanceAmount").val("");
                        $("#allowancePercentageFromBasic").val("");
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
    //function CalcTotalAllowance() {
    //    var gridData = $('#GridAllowances').data("kendoGrid").dataSource.data();
    //    var totalAllowance = 0;
    //    for (var i = 0; i < gridData.length; i++) {
    //        totalAllowance += gridData[i].amount;
    //    }
    //    $("#TotalAllowance").val(totalAllowance);
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

    $('input[type=radio][name=allowancePercentageAmountFromBasic]').change(function () {
        if ($("#allowancePercentageFromBasicrd").is(':checked')) {
            $("#allowancePercentageFromBasic").prop("disabled", false);
            $("#allowanceAmount").prop("disabled", true);
            $("#allowanceAmount").val(0);
            $("#allowanceAmount").prop("disabled", true);
        }
        else {
            $("#allowancePercentageFromBasic").prop("disabled", true);
            $("#allowancePercentageFromBasic").val(0);

            $("#allowanceAmount").prop("disabled", false);

        }
    });
});