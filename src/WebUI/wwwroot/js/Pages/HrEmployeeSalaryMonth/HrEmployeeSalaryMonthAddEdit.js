$(document).ready(function () {

    FillTotalData();
    var today = new Date();
    var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    $("#workingDaystxt").val(lastDayOfMonth);
    $('#DefBranches').change(function () {


        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartmentId").data("kendoDropDownList").value(0);

    });
    $('input[name="display"]').change(function () {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        $("#empIndex").html(0);
        $("#employeesCount").html(0);
        $("#employeeCodeSearch").val("");
        getEmployeeCardData(0);
    });
    $("#FK_HrManagementId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrManagementForDDList",
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
        select: onSelectManagement
    });
    function onSelectManagement(e) {
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read({ managementId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        $("#empIndex").html(0)
        $("#employeesCount").html(0)
        $("#employeeCodeSearch").val("")
        /*       getEmployeeCardData(0);*/

    }
    $("#FK_HrDepartmentId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrDepartment/GetAllForDDList",
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
        select: onSelectDepartment
    });
    function onSelectDepartment(e) {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read({ departmentId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        $("#empIndex").html(0)
        $("#employeesCount").html(0)
        $("#employeeCodeSearch").val("")
        /*  getEmployeeCardData(0);*/

    }

    //In Edit Get Card Data
    var EmployeeId = parseInt($("#FK_HrEmployeeId").val());
    if (EmployeeId > 0) {
        getEmployeeCardData(EmployeeId);

    }

    $("#FK_HrEmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeesValidContractForDDList",
                },
                parameterMap: function (data, action) {

                    var managementId = parseInt($("#FK_HrManagementId").val()),
                        display = $('input[name="display"]:checked').val(),
                        salaryDate = $('#SalaryDate').val(),
                        departmentId = parseInt($("#FK_HrDepartmentId").val());
                    if (managementId == 0 || isNaN(managementId))
                        managementId = null;
                    if (departmentId == 0 || isNaN(departmentId))
                        departmentId = null;


                    if (data.hasOwnProperty.length > 0 && data.display != undefined)
                        display = data.display;

                    if (data.hasOwnProperty.length > 0 && data.entryDate != undefined)
                        salaryDate = data.entryDate;

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
                                display: display,
                                entryDate: salaryDate,
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                managementId: managementId,
                                departmentId: departmentId,
                                display: display,
                                entryDate: salaryDate,
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onEmpSelect
    });
    function onEmpSelect(e) {

        $("#FK_HrEmployeeId").val(e.dataItem.id);
        $("#employeeName").val(e.dataItem.fullName);
        $.ajax({
            url: "/HrEmployee/GetCardData?id=" + e.dataItem.id,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
                var TodayDate = new Date();
                var month = TodayDate.getMonth();
                var year = TodayDate.getFullYear();
                var daysCount = new Date(year, month + 1, 0).getDate();
                var payPerDay = (Number((data.basicSalary + data.totalAllowance) / daysCount)).toFixed(2);
                var payPerHour = (data.hoursCount == 0 ? 0 : Number(payPerDay / data.hoursCount)).toFixed(2);
                $("#BasicSalary").val(data.basicSalary);
                $("#TotalAllowance").val(data.totalAllowance);
                $("#HoursCount").val(data.hoursCount);
                $("#PayPerDay").val(payPerDay);
                $("#PayPerHour").val(payPerHour);
                $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);

                $("#payPerDaytxt").val(payPerDay);
                $("#payPerHourtxt").val(payPerHour);
                getEmployeeSalaryData(e.dataItem.id)
            }
        });

    }


    $("#Count").change(function () {
        calculateAmount();
    });

    $("#workingDaystxt").change(function () {
        $("#workingDaystxt").val($("#workingDaystxt").val() >= 0 ? $("#workingDaystxt").val() : 0);
        calcOverTimeHour();
        calculateOvertimeValue();

        //calculateTotalSalary();
        FillTotalData();
    });

    $("#punishmentDaystxt").change(function () {
        $("#punishmentDaystxt").val($("#punishmentDaystxt").val() >= 0 ? $("#punishmentDaystxt").val() : 0);
        $("#punishmentDaysTotaltxt").val($("#punishmentDaystxt").val());
        FillExtraTotal();
    });

    $("#basicsalarytxt").change(function () {
        $("#basicsalarytxt").val($("#basicsalarytxt").val() >= 0 ? $("#basicsalarytxt").val() : 0);
        calcOverTimeHour();
        calculateOvertimeValue();
        //calculateTotalSalary();
        FillTotalData();
    });
    $("#housingAllowancetxt").change(function () {
        $("#housingAllowancetxt").val($("#housingAllowancetxt").val() >= 0 ? $("#housingAllowancetxt").val() : 0);

        calcOverTimeHour();
        //calculateTotalSalary();
        claculateHousing();
        calculateOvertimeValue();
        FillTotalData();
    });

    $("#otherDuestxt").change(function () {
        $("#otherDuestxt").val($("#otherDuestxt").val() >= 0 ? $("#otherDuestxt").val() : 0);
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#variableAllowancestxt").change(function () {
        $("#variableAllowancestxt").val($("#variableAllowancestxt").val() >= 0 ? $("#variableAllowancestxt").val() : 0);
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#overtimeHourCounttxt").change(function () {
        $("#overtimeHourCounttxt").val($("#overtimeHourCounttxt").val() >= 0 ? $("#overtimeHourCounttxt").val() : 0);
        calculateOvertimeValue();
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#bounsValuetxt").change(function () {
        $("#bounsValuetxt").val($("#bounsValuetxt").val() >= 0 ? $("#bounsValuetxt").val() : 0);
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#loanstxt").change(function () {
        $("#loanstxt").val($("#loanstxt").val() >= 0 ? $("#loanstxt").val() : 0);
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#electricitytxt").change(function () {
        $("#electricitytxt").val($("#electricitytxt").val() >= 0 ? $("#electricitytxt").val() : 0);
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#waterDeductiontxt").change(function () {
        $("#waterDeductiontxt").val($("#waterDeductiontxt").val() >= 0 ? $("#waterDeductiontxt").val() : 0);
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#socialInsuranceDeductiontxt").change(function () {
        $("#socialInsuranceDeductiontxt").val($("#socialInsuranceDeductiontxt").val() >= 0 ? $("#socialInsuranceDeductiontxt").val() : 0);
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#otherDeductiontxt").change(function () {
        $("#otherDeductiontxt").val($("#otherDeductiontxt").val() >= 0 ? $("#otherDeductiontxt").val() : 0);
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#phoneDeductiontxt").change(function () {
        $("#phoneDeductiontxt").val($("#phoneDeductiontxt").val() >= 0 ? $("#phoneDeductiontxt").val() : 0);
        //calculateTotalSalary();
        FillTotalData();
    });

    $("#housingDeductiontxt").change(function () {
        $("#housingDeductiontxt").val($("#housingDeductiontxt").val() >= 0 ? $("#housingDeductiontxt").val() : 0);
        //calculateTotalSalary();
        claculateHousing();
        FillTotalData();
    });

    $("#punishmentDaysTotaltxt").change(function () {
        $("#punishmentDaysTotaltxt").val($("#housingDeductiontxt").val() >= 0 ? $("#punishmentDaysTotaltxt").val() : 0);
        FillTotalData();
    });

    $("#housingTotaltxt").change(function () {
        $("#housingTotaltxt").val($("#housingTotaltxt").val() >= 0 ? $("#housingTotaltxt").val() : 0);
        FillTotalData();
    });

    $("#totalSalarytxt").change(function () {
        $("#totalSalarytxt").val($("#totalSalarytxt").val() >= 0 ? $("#totalSalarytxt").val() : 0);

    });


    $("#totalAllowancetxt").change(function () {
        $("#totalAllowancetxt").val($("#totalAllowancetxt").val() >= 0 ? $("#totalAllowancetxt").val() : 0);
    });


    $("#saveSalarybtn").click(function () {
        debugger
        var emId = $("#FK_HrEmployeeId").val();
        var total = $("#totalSalarytxt").val();
        if ($("#FK_HrEmployeeId").val() == "0") {
            swal({
                title: Resources.ChooseEmployee,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if ($("#totalSalarytxt").val() == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.TotalSalary,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        } else {

            var salaryData = {
                Id: $("#Id").val(),
                TotalExtra: $("#TotalExtra").val(),
                TotalIncentives: $("#TotalIncentives").val(),
                TotalPenalties: $("#TotalPenalties").val(),
                TotalDeduction: $("#TotalDeduction").val(),
                NetRecivableWithoutAddition: $("#NetRecivableWithoutAddition").val(),
                NetRecivable: $("#NetRecivable").val(),
                FK_HrEmployeeId: $("#FK_HrEmployeeId").val(),
                JobName: $("#jobNametxt").val(),
                CostCenterName: $("#costcenterNametxt").val(),
                FK_CostcenterId: $("#FK_CostcenterId").val(),
                FullName: $("#empNametxt").val(),
                Code: $("#empCodetxt").val(),
                WorkHourCount: $("#workingHourstxt").val(),
                WorkDayCount: $("#workingDaystxt").val(),
                BasicSalary: $("#basicsalarytxt").val(),
                HousingAllowance: $("#housingAllowancetxt").val(),
                OtherDues: $("#otherDuestxt").val(),
                VariableAllowances: $("#variableAllowancestxt").val(),
                OvertimeSalaryPerHour: $("#oneOverTimeHourPricetxt").val(),
                OvertimeHourCount: $("#overtimeHourCounttxt").val(),
                OvertimeValue: $("#overtimeValuetxt").val(),
                BounsValue: $("#bounsValuetxt").val(),
                LoanValue: $("#loanstxt").val(),
                SocialInsuranceDeduction: $("#socialInsuranceDeductiontxt").val(),
                ElectricityValue: $("#electricitytxt").val(),
                OtherDeduction: $("#otherDeductiontxt").val(),
                waterValue: $("#waterDeductiontxt").val(),
                MobileDeduction: $("#phoneDeductiontxt").val(),
                PunishmentDays: $("#punishmentDaystxt").val(),
                // HousingDeduction: $("#housingDeductiontxt").val(),
                HousingDeduction: $("#housingTotaltxt").val(),
                SalaryDate: $("#salaryReciveDatetxt").val(),
                PayType: $("#PayType").val(),
                TotalSalary: $("#totalSalarytxt").val(),
                TotalAllowances: $("#totalAllowancetxt").val(),
                IsSalaryStop: document.getElementById("isSalaryStopchk").checked,
                IsCashe: document.getElementById("isCashechk").checked,
                IsPaid: document.getElementById("IsPaid").checked
            }

            $.ajax({
                url: "/HrEmployeeSalaryCard/SaveEmployeeSalart",
                type: "POST",
                data: { salaryCardVM: salaryData },
                success: function (result) {
                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
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


    $("#SalaryDate").change(function () {
        if ($("#FK_HrEmployeeId").val() > 0) {
            getEmployeeSalaryData($("#FK_HrEmployeeId").val())
        }
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);
        $("#empIndex").html(0);
        $("#employeesCount").html(0);
        $("#employeeCodeSearch").val("");
    });

    $("#employeePrevbtn").click(function () {
        var save = $('#ViewAndSave').is(":checked");
        if (save) {
            saveAndMove("Prev")
        } else {
            getPrevEmployee();
        }
        FillTotalData();
    })
    function getPrevEmployee() {
        debugger
        var id = $("#FK_HrEmployeeId").val(),
            branchId = $("#FK_DefBranchId").val(),
            managementId = $("#FK_HrManagementId").val(),
            display = $('input[name="display"]:checked').val(),
            entryDate = $('#SalaryDate').val(),
            departmentId = $("#FK_HrDepartmentId").val(),
            Cardindex = $("#empIndex").html();
        // + entryDate + "&&index=" + Cardindex
        $.ajax({
            url: "/HrEmployee/GetPrevCardMonth?id=" + id + "&&branchId=" + branchId + "&&managementId=" + managementId + "&&departmentId=" + departmentId + "&&display=" + display + "&&entryDate=" + entryDate + entryDate + "&&index=" + Cardindex,
            success: function (result) {
                debugger
                if (result) {
                    $("#employeeCodeSearch").val("")
                    $("#empIndex").html(result.empIndex)
                    $("#employeesCount").html(result.employeesCount)
                    $("#FK_HrEmployeeId").val(result.emp.id)
                    $("#employeeAutoComplete").val(result.emp.code)
                    $("#employeeName").val(result.emp.fullName);
                    getEmployeeCardDataFromSearch(result.emp.id, result.ddate);

                    $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
                    $("#FK_HrEmployeeId").data("kendoDropDownList").value(result.emp.id);
                }

            }
        })
    }
    $("#employeeNextbtn").click(function () {
        var save = $('#ViewAndSave').is(":checked");
        if (save) {
            saveAndMove("Next")
        } else {
            getNextEmployee();
        }
        FillTotalData();
    })


    function getNextEmployee() {
        debugger
        var id = $("#FK_HrEmployeeId").val(),
            branchId = $("#FK_DefBranchId").val(),
            display = $('input[name="display"]:checked').val(),
            entryDate = $('#SalaryDate').val(),
            managementId = $("#FK_HrManagementId").val(),
            departmentId = $("#FK_HrDepartmentId").val(),
            Cardindex = $("#empIndex").html();
        // + entryDate + "&&index=" + Cardindex
        $.ajax({
            url: "/HrEmployee/GetNextCardMonth?id=" + id + "&&branchId=" + branchId + "&&managementId=" + managementId + "&&departmentId=" + departmentId + "&&display=" + display + "&&entryDate=" + entryDate + "&&index=" + Cardindex,
            success: function (result) {
                debugger
                if (result) {

                    $("#employeeCodeSearch").val("")
                    $("#empIndex").html(result.empIndex)
                    $("#employeesCount").html(result.employeesCount)
                    $("#FK_HrEmployeeId").val(result.emp.id)
                    $("#employeeAutoComplete").val(result.emp.code)
                    $("#employeeName").val(result.emp.fullName);
                    getEmployeeCardDataFromSearch(result.emp.id, result.ddate);

                    $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
                    $("#FK_HrEmployeeId").data("kendoDropDownList").value(result.emp.id);

                }
            }
        })
    }

    $("#employeeFirstbtn").click(function () {
        var save = $('#ViewAndSave').is(":checked");
        if (save) {
            saveAndMove("First")
        } else {
            getFisrtEmployee();
        }
        FillTotalData();
    })
    function getFisrtEmployee() {
        var id = $("#FK_HrEmployeeId").val(),
            branchId = $("#FK_DefBranchId").val(),
            display = $('input[name="display"]:checked').val(),
            entryDate = $('#SalaryDate').val(),
            managementId = $("#FK_HrManagementId").val(),
            departmentId = $("#FK_HrDepartmentId").val();
        $.ajax({
            url: "/HrEmployee/GetFirstCardMonth?id=" + id + "&&branchId=" + branchId + "&&managementId=" + managementId + "&&departmentId=" + departmentId + "&&display=" + display + "&&entryDate=" + entryDate,
            success: function (result) {

                if (result) {
                    $("#employeeCodeSearch").val("")
                    $("#empIndex").html(result.empIndex)
                    $("#employeesCount").html(result.employeesCount)
                    $("#FK_HrEmployeeId").val(result.emp.id)
                    $("#employeeAutoComplete").val(result.emp.code)
                    $("#employeeName").val(result.emp.fullName);
                    getEmployeeCardDataFromSearch(result.emp.id, result.ddate);

                    $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
                    $("#FK_HrEmployeeId").data("kendoDropDownList").value(result.emp.id);

                }
            }
        })
    }

    $("#employeeLastbtn").click(function () {

        var save = $('#ViewAndSave').is(":checked");
        if (save) {
            saveAndMove("Last")
        } else {
            getLastEmployee();
        }
        FillTotalData();
    })
    function getLastEmployee() {
        debugger
        var id = $("#FK_HrEmployeeId").val(),
            branchId = $("#FK_DefBranchId").val(),
            display = $('input[name="display"]:checked').val(),
            entryDate = $('#SalaryDate').val(),
            managementId = $("#FK_HrManagementId").val(),
            departmentId = $("#FK_HrDepartmentId").val();
        $.ajax({
            url: "/HrEmployee/GetLastCardMonth?id=" + id + "&&branchId=" + branchId + "&&managementId=" + managementId + "&&departmentId=" + departmentId + "&&display=" + display + "&&entryDate=" + entryDate,
            success: function (result) {
                debugger
                if (result) {
                    $("#employeeCodeSearch").val("")
                    $("#empIndex").html(result.empIndex)
                    $("#employeesCount").html(result.employeesCount)
                    $("#FK_HrEmployeeId").val(result.emp.id)
                    $("#employeeAutoComplete").val(result.emp.code)
                    $("#employeeName").val(result.emp.fullName);
                    getEmployeeCardDataFromSearch(result.emp.id, result.ddate);

                    $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
                    $("#FK_HrEmployeeId").data("kendoDropDownList").value(result.emp.id);


                }
            }
        })
    }
    function saveAndMove(moveTo) {
        var emId = $("#FK_HrEmployeeId").val();
        var total = $("#totalSalarytxt").val();
        if ($("#FK_HrEmployeeId").val() == "0") {
            swal({
                title: Resources.ChooseEmployee,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if ($("#totalSalarytxt").val() == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.TotalSalary,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        } else {
            var salaryData = {
                Id: $("#Id").val(),
                TotalExtra: $("#TotalExtra").val(),
                TotalIncentives: $("#TotalIncentives").val(),
                TotalPenalties: $("#TotalPenalties").val(),
                TotalDeduction: $("#TotalDeduction").val(),
                NetRecivableWithoutAddition: $("#NetRecivableWithoutAddition").val(),
                NetRecivable: $("#NetRecivable").val(),
                FK_HrEmployeeId: $("#FK_HrEmployeeId").val(),
                JobName: $("#jobNametxt").val(),
                CostCenterName: $("#costcenterNametxt").val(),
                FK_CostcenterId: $("#FK_CostcenterId").val(),
                FullName: $("#empNametxt").val(),
                Code: $("#empCodetxt").val(),
                WorkHourCount: $("#workingHourstxt").val(),
                WorkDayCount: $("#workingDaystxt").val(),
                BasicSalary: $("#basicsalarytxt").val(),
                HousingAllowance: $("#housingAllowancetxt").val(),
                OtherDues: $("#otherDuestxt").val(),
                VariableAllowances: $("#variableAllowancestxt").val(),
                OvertimeSalaryPerHour: $("#oneOverTimeHourPricetxt").val(),
                OvertimeHourCount: $("#overtimeHourCounttxt").val(),
                OvertimeValue: $("#overtimeValuetxt").val(),
                BounsValue: $("#bounsValuetxt").val(),
                LoanValue: $("#loanstxt").val(),
                SocialInsuranceDeduction: $("#socialInsuranceDeductiontxt").val(),
                ElectricityValue: $("#electricitytxt").val(),
                OtherDeduction: $("#otherDeductiontxt").val(),
                waterValue: $("#waterDeductiontxt").val(),
                MobileDeduction: $("#phoneDeductiontxt").val(),
                PunishmentDays: $("#punishmentDaystxt").val(),
                // HousingDeduction: $("#housingDeductiontxt").val(),
                HousingDeduction: $("#housingTotaltxt").val(),
                SalaryDate: $("#salaryReciveDatetxt").val(),
                PayType: $("#PayType").val(),
                TotalSalary: $("#totalSalarytxt").val(),
                TotalAllowances: $("#totalAllowancetxt").val(),
                IsSalaryStop: document.getElementById("isSalaryStopchk").checked,
                IsCashe: document.getElementById("isCashechk").checked,
                IsPaid: document.getElementById("IsPaid").checked
            }

            $.ajax({
                url: "/HrEmployeeSalaryCard/SaveEmployeeSalart",
                type: "POST",
                data: { salaryCardVM: salaryData },
                success: function (result) {
                    if (result) {
                        if (moveTo == "Next")
                            getNextEmployee();

                        else if (moveTo == "Prev")
                            getPrevEmployee();

                        else if (moveTo == "First")
                            getFisrtEmployee();

                        else if (moveTo == "Last")
                            getLastEmployee();

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



    }

    $("#btnSearchCode").click(function () {
        
        var code = $("#employeeCodeSearch").val(),
            branchId = $("#FK_DefBranchId").val(),
            display = $('input[name="display"]:checked').val(),
            entryDate = $('#SalaryDate').val(),
            managementId = $("#FK_HrManagementId").val(),
            departmentId = $("#FK_HrDepartmentId").val();
        if (code == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.EmployeeCode,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        } else {
            $.ajax({
                url: "/HrEmployee/GetEmployeeByCodeOfMonth?code=" + code + "&&branchId=" + branchId + "&&managementId=" + managementId + "&&departmentId=" + departmentId + "&&display=" + display + "&&entryDate=" + entryDate,
                success: function (result) {

                    if (result != 0) {
                        $("#empIndex").html(result.empIndex)
                        $("#employeesCount").html(result.employeesCount)
                        $("#FK_HrEmployeeId").val(result.emp.id)
                        $("#employeeAutoComplete").val(result.emp.code)
                        $("#employeeName").val(result.emp.fullName);
                        debugger
                        getEmployeeCardDataFromSearch(result.emp.id, result.ddate);

                        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
                        $("#FK_HrEmployeeId").data("kendoDropDownList").value(result.emp.id);
                        FillTotalData();

                    } else {
                        swal({
                            title: Resources.EmployeeCodeNotFoundResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                }
            })
        }

    })
})

function calculateAmount() {
    var calcMetod = $('input[name="CalculationMethod"]:checked').val();
    var count = $("#Count").val(),
        perday = $("#PayPerDay").val(),
        perHour = $("#PayPerHour").val(),
        basic = $("#BasicSalary").val();
    if (count > 0 && perday > 0 && perHour > 0 && basic > 0) {
        if (calcMetod == 1) {

            $("#Amount").val(perday * count);
        } else if (calcMetod == 2) {
            $("#Amount").val(perHour * count);
        } else if (calcMetod == 3) {

            $("#Amount").val((count / 100) * basic);
        } else {
            $("#Amount").val(count);
        }
    } else {
        $("#Amount").val("");
    }



}

function getEmployeeSalaryData(id, Ddate) {
    debugger
    $.ajax({
        url: "/HrEmployeeSalaryCard/GetEmployeeSalary?id=" + id + "&&day=" + Ddate,
        success: function (salary) {
            debugger
            if (salary.id == 0) {
                var today = new Date();
                var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                $("#workingDaystxt").val(lastDayOfMonth);
            } else {
                $("#workingDaystxt").val(salary.workDayCount);
            }

            $("#Id").val(salary.id);
            $("#jobNametxt").val(salary.jobName);
            $("#costcenterNametxt").val(salary.costCenterName);
            $("#FK_CostcenterId").val(salary.fK_CostCenterId);
            $("#empNametxt").val(salary.fullName);
            $("#empCodetxt").val(salary.code);
            $("#workingHourstxt").val(salary.workHourCount);

            $("#basicsalaryReadtxt").val(salary.basicSalary);
            $("#housingAllowanceReadtxt").val(salary.housingAllowance);
            $("#otherDuesReadtxt").val(salary.otherDues);
            $("#socialInsuranceReadtxt").val(salary.socialInsurance == null ? 0 : salary.socialInsurance);
            $("#basicsalarytxt").val(salary.basicSalary);
            $("#housingAllowancetxt").val(salary.housingAllowance);
            $("#otherDuestxt").val(salary.otherDues);

            $("#variableAllowancestxt").val(salary.variableAllowances >= 0 && salary.variableAllowances != null ? salary.variableAllowances : 0);
            if (salary.overtimeSalaryPerHour > 0) {
                $("#oneOverTimeHourPricetxt").val(salary.overtimeSalaryPerHour);
            } else {
                calcOverTimeHour()
            }

            $("#overtimeHourCounttxt").val(salary.overtimeHourCount);
            $("#overtimeValuetxt").val(salary.overtimeValue >= 0 && salary.overtimeValue != null ? salary.overtimeValue : 0);
            $("#bounsValuetxt").val(salary.bounsValue);
            $("#loanstxt").val(salary.loanValue);
            $("#socialInsuranceDeductiontxt").val(salary.socialInsuranceDeduction);
            $("#electricitytxt").val(salary.electricityValue);
            $("#otherDeductiontxt").val(salary.otherDeduction);
            $("#waterDeductiontxt").val(salary.waterValue);
            $("#phoneDeductiontxt").val(salary.mobileDeduction);
            $("#punishmentDaystxt").val(salary.punishmentDays);
            //$("#housingDeductiontxt").val(salary.housingDeduction);
            //var housingAllowance = $("#housingAllowancetxt").val(),
            //    housingDeduction = $("#housingDeductiontxt").val();
            //$("#housingTotaltxt").val(housingAllowance - housingDeduction);
            $("#housingDeductiontxt").val(salary.housingAllowance - salary.housingDeduction);
            $("#punishmentDaysTotaltxt").val(salary.punishmentDays);
            $("#housingTotaltxt").val(salary.housingDeduction);

            $("#salaryReciveDatetxt").val($("#SalaryDate").val());
            $("#PayTipe").val(salary.payTipe);
            $("#totalSalarytxt").val(salary.totalSalary);
            $("#totalAllowancetxt").val(salary.totalAllowances);
            debugger
            $("#TotalExtra").val(salary.TotalExtra >= 0 && salary.TotalExtra != null ? salary.TotalExtra : 0);
            $("#TotalExtra").val(salary.TotalExtra === undefined ? 0 : salary.TotalExtra);
            $("#TotalIncentives").val(salary.TotalIncentives);// >= 0 && salary.TotalIncentives != null ? salary.TotalIncentives : 0);
            $("#TotalPenalties").val(salary.TotalPenalties);// >= 0 && salary.TotalPenalties != null ? salary.TotalPenalties : 0);
            $("#TotalDeduction").val(salary.TotalDeduction);// >= 0 && salary.TotalDeduction != null ? salary.TotalDeduction : 0);
            $("#NetRecivableWithNoAddition").val(salary.NetRecivableWithNoAddition);// >= 0 && salary.NetRecivableWithNoAddition != null ? salary.NetRecivableWithNoAddition : 0);
            $("#NetRecivable").val(salary.NetRecivable);// >= 0 && salary.NetRecivable != null ? salary.NetRecivable : 0);
            FillTotalData();
            document.getElementById("isSalaryStopchk").checked = salary.isSalaryStop;
            document.getElementById("isCashechk").checked = salary.isCashe;
            document.getElementById("IsPaid").checked = salary.isPaid;

        }
    })
}

function calcOverTimeHour() {
    var basic = $("#basicsalarytxt").val(),
        housing = $("#housingAllowancetxt").val(),
        workingDays = $("#workingDaystxt").val();
    var date = new Date();
    var monthDays = getDaysInMonth(date.getMonth(), date.getFullYear())
    var overtimeHour = (((parseFloat(basic) + parseFloat(housing)) / monthDays) / workingDays) * 1.5
    $("#oneOverTimeHourPricetxt").val(overtimeHour.toFixed(2));
}
var getDaysInMonth = function (month, year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
};


function calculateTotalSalary() {
    var basic = $("#basicsalarytxt").val(),
        housingAllowance = $("#housingAllowancetxt").val(),
        socialInsuranceAllowance = $("#socialInsuranceReadtxt").val(),
        otherDue = $("#otherDuestxt").val(),
        variableAllowance = $("#variableAllowancestxt").val(),
        overtimeValue = $("#overtimeValuetxt").val(),
        bonusValue = $("#bounsValuetxt").val(),

        loans = $("#loanstxt").val(),
        socialInsuranceDeduction = $("#socialInsuranceDeductiontxt").val(),
        electricity = $("#electricitytxt").val(),
        otherDeduction = $("#otherDeductiontxt").val(),
        waterDeduction = $("#waterDeductiontxt").val(),
        mobileDeduction = $("#phoneDeductiontxt").val(),
        housingDeduction = $("#housingDeductiontxt").val();

    var moneyAdd = parseFloat(basic) + parseFloat(housingAllowance) + parseFloat(socialInsuranceAllowance) + parseFloat(otherDue) + parseFloat(variableAllowance) + parseFloat(overtimeValue) + parseFloat(bonusValue);
    var moneyDeduct = parseFloat(loans) + parseFloat(socialInsuranceDeduction) + parseFloat(electricity) + parseFloat(otherDeduction) + parseFloat(waterDeduction) + parseFloat(mobileDeduction) + parseFloat(housingDeduction);
    var totalSalary = (moneyAdd - moneyDeduct).toFixed(2);
    $("#totalSalarytxt").val(totalSalary);

}

function calculateTotalAllowance() {
    var housingAllowance = $("#housingAllowancetxt").val(),
        otherDues = $("#otherDuestxt").val(),
        variableAllowance = $("#variableAllowancestxt").val();
    var totalAllowance = (housingAllowance + otherDue + variableAllowance).toFixed(2);
    $("#totalAllowancetxt").val(totalAllowance);
}

function claculateHousing() {
    var housingAllowance = $("#housingAllowancetxt").val(),
        housingDeduction = $("#housingDeductiontxt").val();
    var housingTotal = (housingAllowance - housingDeduction).toFixed(2);
    $("#housingTotaltxt").val(housingTotal);
}

function calculateOvertimeValue() {
    if ($("#overtimeHourCounttxt").val() == null || $("#overtimeHourCounttxt").val() == "")
        $("#overtimeHourCounttxt").val(0);
    var overtime = parseFloat($("#overtimeHourCounttxt").val()) * parseFloat($("#oneOverTimeHourPricetxt").val());
    $("#overtimeValuetxt").val(overtime.toFixed(2));
}


function getEmployeeCardData(id) {
    $.ajax({
        url: "/HrEmployee/GetCardData?id=" + id,
        type: "Get",
        contentType: false,
        processData: false,
        success: function (data) {
            debugger
            var TodayDate = new Date();
            var month = TodayDate.getMonth();
            var year = TodayDate.getFullYear();
            var daysCount = new Date(year, month + 1, 0).getDate();
            var payPerDay = ((data.basicSalary + data.totalAllowance) / daysCount).toFixed(2);
            var payPerHour = (data.hoursCount == 0 ? 0 : payPerDay / data.hoursCount).toFixed(2);;
            $("#BasicSalary").val(data.basicSalary);
            $("#TotalAllowance").val(data.totalAllowance);
            $("#HoursCount").val(data.hoursCount);
            $("#PayPerDay").val(payPerDay);
            $("#PayPerHour").val(payPerHour);
            $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);

            $("#payPerDaytxt").val(payPerDay);
            $("#payPerHourtxt").val(payPerHour);
            getEmployeeSalaryData(id)
        }
    });
}

function getEmployeeCardDataFromSearch(id, ddate) {
    debugger
    $.ajax({
        url: "/HrEmployee/GetCardData?id=" + id,
        type: "Get",
        contentType: false,
        processData: false,
        success: function (data) {
            debugger
            var TodayDate = new Date();
            var month = TodayDate.getMonth();
            var year = TodayDate.getFullYear();
            var daysCount = new Date(year, month + 1, 0).getDate();
            var payPerDay = ((data.basicSalary + data.totalAllowance) / daysCount).toFixed(2);
            var payPerHour = (data.hoursCount == 0 ? 0 : payPerDay / data.hoursCount).toFixed(2);;
            $("#BasicSalary").val(data.basicSalary);
            $("#TotalAllowance").val(data.totalAllowance);
            $("#HoursCount").val(data.hoursCount);
            $("#PayPerDay").val(payPerDay);
            $("#PayPerHour").val(payPerHour);
            $("#userImage").attr("src", "../../images/Employee/" + data.imagePath);

            $("#payPerDaytxt").val(payPerDay);
            $("#payPerHourtxt").val(payPerHour);
            debugger
            getEmployeeSalaryData(id, ddate)
        }
    });
}

function FillTotalData() {
    FillSalaryTotal();
    FillAllowanceTotal();
    FillExtraTotal();
    FillDeductionTotal();
    FillIncentivesTotal();
    FillPenaltiesTotal();
    FillNetRecivableWithNoAdditionAndNetRecivable();
}


function FillSalaryTotal() {
    var SalaryTotal = $("#basicsalarytxt").val();
    $("#totalSalarytxt").val(SalaryTotal > 0 && SalaryTotal != null ? SalaryTotal.toFixed(2) : 0);
}
function FillAllowanceTotal() {
    var housingAllowancetxt = $("#housingAllowancetxt").val(),
        otherDuestxt = $("#otherDuestxt").val(),
        variableAllowancestxt = $("#variableAllowancestxt").val();
    var AllowanceTotal = (parseFloat(housingAllowancetxt) + parseFloat(otherDuestxt) + parseFloat(variableAllowancestxt));
    $("#totalAllowancetxt").val(AllowanceTotal > 0 && AllowanceTotal != null ? AllowanceTotal.toFixed(2) : 0);
}
function FillExtraTotal() {
    var ExtraTotal = $("#overtimeValuetxt").val();
    $("#TotalExtra").val(ExtraTotal > 0 && ExtraTotal != null ? ExtraTotal.toFixed(2) : 0);
}
function FillDeductionTotal() {
    var loanstxt = $("#loanstxt").val(),
        socialInsuranceDeductiontxt = $("#socialInsuranceDeductiontxt").val(),
        electricitytxt = $("#electricitytxt").val(),
        otherDeductiontxt = $("#otherDeductiontxt").val(),
        waterDeductiontxt = $("#waterDeductiontxt").val(),
        phoneDeductiontxt = $("#phoneDeductiontxt").val(),
        punishmentDaystxt = $("#punishmentDaystxt").val(),
        PayPerDaytxt = $("#PayPerDay").val(),
        housingDedudctiontxt = $("#housingDeductiontxt").val();
    var DeductionTotal = parseFloat(loanstxt) + parseFloat(socialInsuranceDeductiontxt) + parseFloat(electricitytxt) + parseFloat(otherDeductiontxt) +
        parseFloat(waterDeductiontxt) + parseFloat(phoneDeductiontxt) + (parseFloat(punishmentDaystxt) * parseFloat(PayPerDaytxt)) + parseFloat(housingDeductiontxt);
    $("#TotalDeduction").val(DeductionTotal > 0 && DeductionTotal != null ? DeductionTotal.toFixed(2) : 0);
}
function FillIncentivesTotal() {
    var IncentivesTotal = $("#bounsValuetxt").val();
    $("#TotalIncentives").val(IncentivesTotal > 0 && IncentivesTotal != null ? IncentivesTotal.toFixed(2) : 0);
}
function FillPenaltiesTotal() {
    var basicsalarytxt = $("#basicsalarytxt").val(),
        workingDaystxt = $("#workingDaystxt").val(),
        punishmentDaystxt = $("#punishmentDaystxt").val();
    var PenaltiesTotal = ((parseFloat(basicsalarytxt) / parseFloat(workingDaystxt)) * parseFloat(punishmentDaystxt)).toFixed(2);
    $("#TotalPenalties").val(PenaltiesTotal > 0 && PenaltiesTotal != null ? PenaltiesTotal.toFixed(2) : 0);
}
function FillNetRecivableWithNoAdditionAndNetRecivable() {
    var SalaryTotal = $("#basicsalarytxt").val(),
        housingAllowancetxt = $("#housingAllowancetxt").val(),
        otherDuestxt = $("#otherDuestxt").val(),
        variableAllowancestxt = $("#variableAllowancestxt").val();
    AllowanceTotal = (parseFloat(housingAllowancetxt) + parseFloat(otherDuestxt) + parseFloat(variableAllowancestxt)),
        ExtraTotal = $("#overtimeValuetxt").val(),
        loanstxt = $("#loanstxt").val(),
        socialInsuranceDeductiontxt = $("#socialInsuranceDeductiontxt").val(),
        electricitytxt = $("#electricitytxt").val(),
        otherDeductiontxt = $("#otherDeductiontxt").val(),
        waterDeductiontxt = $("#waterDeductiontxt").val(),
        phoneDeductiontxt = $("#phoneDeductiontxt").val(),
        punishmentDaystxt = $("#punishmentDaystxt").val(),
        PayPerDaytxt = $("#PayPerDay").val(),
        housingDeductiontxt = $("#housingDeductiontxt").val();
    DeductionTotal = parseFloat(loanstxt) + parseFloat(socialInsuranceDeductiontxt) + parseFloat(electricitytxt) + parseFloat(otherDeductiontxt) +
        parseFloat(waterDeductiontxt) + parseFloat(phoneDeductiontxt) + (parseFloat(punishmentDaystxt) * parseFloat(PayPerDaytxt)) + parseFloat(housingDeductiontxt),
        IncentivesTotal = $("#bounsValuetxt").val();
    var NetRecivableWithNoAddition = ((parseFloat(SalaryTotal) + parseFloat(AllowanceTotal) + parseFloat(IncentivesTotal)) - parseFloat(DeductionTotal));
    $("#NetRecivableWithoutAddition").val(NetRecivableWithNoAddition > 0 && NetRecivableWithNoAddition != null ? NetRecivableWithNoAddition.toFixed(2) : 0);
    var RecivableNet = ((parseFloat(SalaryTotal) + parseFloat(AllowanceTotal) + parseFloat(IncentivesTotal) + parseFloat(ExtraTotal)) - parseFloat(DeductionTotal));
    $("#NetRecivable").val(RecivableNet > 0 && RecivableNet != null ? RecivableNet.toFixed(2) : 0);
}
