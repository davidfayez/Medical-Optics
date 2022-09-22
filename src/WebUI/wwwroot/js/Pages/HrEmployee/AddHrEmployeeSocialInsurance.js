$().ready(function () {
    // Grid
    var empId = $("#EmployeeId").val();
    var socialInsuranceId = $("#socialInsuranceId").val();
    $('#DefBranches').change(function () {

        $("#FK_HrInsuranceBranchId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrInsuranceBranchId").data("kendoDropDownList").value(0);

        $("#FK_HrLaborOfficeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrLaborOfficeId").data("kendoDropDownList").value(0);

    });
    $("#FK_HrInsuranceBranchId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllInsuranceBranchForDDList",
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

    $("#FK_HrLaborOfficeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllLaborOfficeForDDList",
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
    SetSocialInsurance();
    function SetSocialInsurance() {
        debugger
        if (empId != "" && empId != "0") {
            $.ajax({
                type: "POST",
                url: "/HrEmployee/GetEmployeeSocialInsurance?id=" + empId,
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (response) {
                    debugger
                    if (response != null) {
                        $("#socialInsuranceId").val(response.id);
                        $("#InsuranceNumber").val(response.insuranceNumber);
                        $("#FK_HrLaborOfficeId").data("kendoDropDownList").value(response.fK_HrLaborOfficeId);
                        $("#FK_HrInsuranceBranchId").data("kendoDropDownList").value(response.fK_HrInsuranceBranchId);

                        $("#Percentage").val(response.percentage);
                        $("#Amount").val(response.amount);
                        $("#LabourOfficeNumber").val(response.labourOfficeNumber);
                        $("#isDeducted").prop("checked", response.isDeducted);
                        $("#DescriptionSocialInsurance").val(response.description);
                        var dateOfJoin = new Date(response.dateOfJoin),
                            dateOfExcluded = new Date(response.dateOfExcluded);
                        dateOfJoin = dateOfJoin.getFullYear() + "-" + ("0" + (dateOfJoin.getMonth() + 1)).slice(-2) + "-" + ("0" + dateOfJoin.getDate()).slice(-2);
                        dateOfExcluded = dateOfExcluded.getFullYear() + "-" + ("0" + (dateOfExcluded.getMonth() + 1)).slice(-2) + "-" + ("0" + dateOfExcluded.getDate()).slice(-2);
                        $('#DateOfJoin').val(dateOfJoin);
                        $('#DateOfExcluded').val(dateOfExcluded);
                    } else {
                        $.ajax({
                            url: '/HrEmployee/GetEmployeeContract?id=' + $("#EmployeeId").val(),
                            type: 'GET',
                            success: function (contract) {

                                var strDateFrom = new Date();
                                var dateFrom = new Date(strDateFrom);
                                var strDateTo = new Date();
                                if (contract != null) { //get DateOfJoin تاريخ التعيين - تاريخ التعاقد
                                    debugger
                                    strDateFrom = contract.dateFrom;
                                    strDateFrom = strDateFrom.substring(0, strDateFrom.indexOf('T'));
                                    dateFrom = new Date(strDateFrom);
                                    var joindate = dateFrom.getFullYear() + "-" + ("0" + (dateFrom.getMonth() + 1)).slice(-2) + "-" + ("0" + dateFrom.getDate()).slice(-2);
                                    $('#DateOfJoin').val(joindate);
                                    var now = new Date(),
                                        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);

                                    $('#DateOfExcluded').val(today);

                                } else {
                                    var now = new Date(),
                                        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
                                    $('#DateOfJoin').val(today);
                                    $('#DateOfExcluded').val(today);
                                }




                            }
                        })

                    }

                }
            });
        } else {
            var now = new Date(),
                today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
            $('#DateOfJoin').val(today);
            $('#DateOfExcluded').val(today);
        }

    }
    $("#addSocialInsurance").on('click', function () {
        debugger
        var employeeId = $("#EmployeeId").val(),
            socialInsuranceId = $("#socialInsuranceId").val(),
            insuranceNumber = $("#InsuranceNumber").val().trim(),
            dateOfJoin = $("#DateOfJoin").val(),
            percentage = $("#Percentage").val(),
            amount = $("#Amount").val(),
            labourOfficeNumber = $("#LabourOfficeNumber").val(),
            isDeducted = $("#isDeducted").is(':checked'),
            dateOfExcluded = $("#DateOfExcluded").val(),
            fK_HrLaborOfficeId = $("#FK_HrLaborOfficeId").val(),
            fK_HrInsuranceBranchId = $("#FK_HrInsuranceBranchId").val(),
            description = $("#DescriptionSocialInsurance").val().trim();



        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (insuranceNumber == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.InsuranceNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

        else if (fK_HrInsuranceBranchId == "0") {
            swal({
                title: Resources.ChooseResource + " " + Resources.InsuranceBranch,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (fK_HrLaborOfficeId == "0") {
            swal({
                title: Resources.ChooseResource + " " + Resources.LaborOffice,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (percentage == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.Percentage,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (amount == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.DeductedAmount,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (labourOfficeNumber == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.LabourOfficeNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {

            debugger
            var Obj = {
                Id: parseInt(socialInsuranceId),
                FK_HrEmployeeId: parseInt(employeeId),
                FK_HrInsuranceBranchId: parseInt(fK_HrInsuranceBranchId),
                FK_HrLaborOfficeId: parseInt(fK_HrLaborOfficeId),
                InsuranceNumber: insuranceNumber,
                DateOfJoin: dateOfJoin,
                Percentage: parseFloat(percentage),
                Amount: parseFloat(amount),
                LabourOfficeNumber: labourOfficeNumber,
                IsDeducted: isDeducted,
                DateOfExcluded: dateOfExcluded,
                Description: description,
            }
            if (socialInsuranceId == "" || socialInsuranceId == "0") { // Add
                Obj.Id = 0;
                $.ajax({
                    url: "/HrEmployee/CreateSocialInsurance",
                    type: "Post",
                    cache: false,
                    processData: false,
                    data: JSON.stringify(Obj),
                    contentType: 'application/json',
                    success: function (response) {
                        debugger
                        if (response > 0) {
                            $("#socialInsuranceId").val(response);
                            swal({
                                title: Resources.SavedSuccessfullyResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                        }

                    }
                });
            }
            else {//Edit
                $.ajax({
                    url: "/HrEmployee/EditSocialInsurance",
                    type: "Post",
                    cache: false,
                    processData: false,
                    data: JSON.stringify(Obj),
                    contentType: 'application/json',
                    success: function (response) {
                        debugger
                        if (response) {
                            swal({
                                title: Resources.SavedSuccessfullyResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                        }

                    }
                });
            }



        }


    });
});