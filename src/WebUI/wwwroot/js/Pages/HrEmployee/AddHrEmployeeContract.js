$(document).ready(function () {
    $('#DefBranches').change(function () {

        //$.ajax({
        //    url: "/HrLookups/GetHrSubBranchByBranch?id=" + parseInt($("#FK_DefBranchId").val()),
        //    Type: "GET",
        //    success: function (subBranch) {
        //        var html = "<option value=''>" + Resources.Choose + "</option>";
        //        for (var i = 0; i < subBranch.length; i++) {

        //            html += "<option value='" + subBranch[i].id + "'>" + subBranch[i].branchNameAr + "</option>";
        //        }
        //        $("#FK_HrSubBranchId").html(html);
        //    }
        //})

        $("#FK_HrBloodTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrBloodTypeId").data("kendoDropDownList").value(0);

        $("#FK_NationalityId").data("kendoDropDownList").dataSource.read();
        $("#FK_NationalityId").data("kendoDropDownList").value(0);

        $("#FK_DefReligionId").data("kendoDropDownList").dataSource.read();
        $("#FK_DefReligionId").data("kendoDropDownList").value(0);

        $("#FK_SocialStatusId").data("kendoDropDownList").dataSource.read();
        $("#FK_SocialStatusId").data("kendoDropDownList").value(0);

        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrContractTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrContractTypeId").data("kendoDropDownList").value(0);

        $("#FK_HrContractPeriodId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrContractPeriodId").data("kendoDropDownList").value(0);
        

    });

    $("#FK_HrContractPeriodId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllContractPeriodForDDList",
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

    $("#FK_HrContractTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllContractTypeForDDList",
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

    LoadContract();
    function LoadContract() {

        $.ajax({
            url: '/HrEmployee/GetEmployeeContract?id=' + $("#EmployeeId").val(),
            type: 'GET',
            success: function (contract) {
           
                var strDateFrom = new Date();
                var dateFrom = new Date(strDateFrom);
                var strDateTo = new Date();
                var dateTo = new Date(strDateTo);
                if (contract != null) {
                    $("#ContractId").val(contract.id);
                    $("#FK_HrContractPeriodId").val(contract.fK_HrContractPeriodId);
                   // $("#FK_HrContractTypeId").val();
                    $("#FK_HrContractTypeId").data("kendoDropDownList").value(contract.fK_HrContractTypeId);
                    $("#DateFromContract").val(contract.dateFrom);
                    $("#DateToContract").val(contract.dateTo);
                    $("#HoursCount").val(contract.hoursCount);
                    $("#DaysCountOfMonth").val(contract.daysCountOfMonth);
                    $("#IsAutoRenew")[0].checked = contract.isAutoRenew;
                    var days = contract.daysOff.split(',');
                    for (var i = 0; i < days.length; i++) {
                        $("#" + days[i] + "").prop("checked", true);
                    }
                    $("#AnnualLeaveCount").val(contract.annualLeaveCount);
                    $("#CasualLeaveCount").val(contract.casualLeaveCount);
                    $("#MaximumOvertimeHoursInMonth").val(contract.maximumOvertimeHoursInMonth)
                    $("#MaximumOvertimeDaysInMonth").val(contract.maximumOvertimeDaysInMonth);
                    $("#MaximumDelayHoursInMonth").val(contract.maximumDelayHoursInMonth);
                    $("#MaximumDaysOfAbsence").val(contract.maximumDaysOfAbsence);
                    $("#Description").val(contract.description);

                    strDateFrom = contract.dateFrom;
                    strDateFrom = strDateFrom.substring(0, strDateFrom.indexOf('T'));
                    dateFrom = new Date(strDateFrom);

                    strDateTo = contract.dateTo;
                    strDateTo = strDateTo.substring(0, strDateTo.indexOf('T'));
                    dateTo = new Date(strDateTo);
                    document.getElementById("DateFromContract").valueAsDate = dateFrom;
                    document.getElementById("DateToContract").valueAsDate = new Date(dateTo);
                }
                //else {
                //    strDateFrom = strDateFrom.substring(0, strDateFrom.indexOf('T'));
                //    dateFrom = new Date(strDateFrom);

                //    strDateTo = strDateTo.substring(0, strDateTo.indexOf('T'));
                //    dateTo = new Date(strDateTo);
                //}



            }
        })
    }
    $("#contractSavebtn").click(function () {
        debugger
        var days = [];
        $.each($("input[name='Days']:checked"), function () {
            days.push($(this).val());
        });
        var id = $("#ContractId").val(),
            empId = $("#EmployeeId").val(),
            contractPeriod = $("#FK_HrContractPeriodId").val(),
            contractType = $("#FK_HrContractTypeId").val(),
            dateFrom = $("#DateFromContract").val(),
            dateTo = $("#DateToContract").val(),
            hoursCount = $("#HoursCount").val(),
            daysCountOfMonth = $("#DaysCountOfMonth").val(),
            isAutoRenew = $("#IsAutoRenew")[0].checked,
            daysOff = days.join(","),
            annualLeaveCount = $("#AnnualLeaveCount").val(),
            casualLeaveCount = $("#CasualLeaveCount").val(),
            maximumOvertimeHoursInMonth = $("#MaximumOvertimeHoursInMonth").val(),
            maximumOvertimeDaysInMonth = $("#MaximumOvertimeDaysInMonth").val(),
            maximumDelayHoursInMonth = $("#MaximumDelayHoursInMonth").val(),
            maximumDaysOfAbsence = $("#MaximumDaysOfAbsence").val(),
            description = $("#Description").val();
        if (empId > 0) {
            if (daysOff != null && daysOff.length > 0) {
                daysOff = daysOff.toString();
                $("#DaysOffValid").text("");
            } else {
                $("#DaysOffValid").text(Resources.Required);
                return;
            }
            if (contractPeriod > 0) {
                $("#FK_HrContractPeriodIdValid").text("");
           
            } else {
                $("#FK_HrContractPeriodIdValid").text("");
                return;
            }
            if (contractType > 0) {
                $("#FK_HrContractTypeIdValid").text("");

            } else {
                $("#FK_HrContractTypeIdValid").text(Resources.Required);
                return;
            }
            if (hoursCount > 0) {
                $("#HoursCountValid").text("");

            } else {
                $("#HoursCountValid").text(Resources.Required);
                return;
            }
            if (daysCountOfMonth > 0) {
                $("#DaysCountOfMonthValid").text("");

            } else {
                $("#DaysCountOfMonthValid").text(Resources.Required);
                return;
            }

            if (annualLeaveCount > 0) {
                $("#AnnualLeaveCountValid").text("");

            } else {
                $("#AnnualLeaveCountValid").text(Resources.Required);
                return;
            }

            if (casualLeaveCount > 0) {
                $("#CasualLeaveCountValid").text("");

            } else {
                $("#CasualLeaveCountValid").text(Resources.Required);
                return;
            }
            if (maximumOvertimeHoursInMonth > 0) {
                $("#MaximumOvertimeHoursInMonthValid").text("");

            } else {
                $("#MaximumOvertimeHoursInMonthValid").text(Resources.Required);
                return;
            }
            if (maximumOvertimeDaysInMonth > 0) {
                $("#MaximumOvertimeDaysInMonthValid").text("");

            } else {
                $("#MaximumOvertimeDaysInMonthValid").text(Resources.Required);
                return;
            }
            if (maximumDelayHoursInMonth > 0) {
                $("#MaximumDelayHoursInMonthValid").text("");

            } else {
                $("#MaximumDelayHoursInMonthValid").text(Resources.Required);
                return;
            }
            if (maximumDaysOfAbsence > 0) {
                $("#MaximumDaysOfAbsenceValid").text("");

            } else {
                $("#MaximumDaysOfAbsenceValid").text(Resources.Required);
                return;
            }
            debugger;
            var data1 = {
                Id: id,
                FK_HrEmployeeId: empId,
                FK_HrContractTypeId: contractType,
                FK_HrContractPeriodId: contractPeriod,
                DateFrom: dateFrom,
                DateTo: dateTo,
                HoursCount: hoursCount,
                DaysCountOfMonth: daysCountOfMonth,
                IsAutoRenew: isAutoRenew,
                DaysOff: daysOff,
                AnnualLeaveCount: annualLeaveCount,
                CasualLeaveCount: casualLeaveCount,
                MaximumOvertimeHoursInMonth: maximumOvertimeHoursInMonth,
                MaximumOvertimeDaysInMonth: maximumOvertimeDaysInMonth,
                MaximumDelayHoursInMonth: maximumDelayHoursInMonth,
                MaximumDaysOfAbsence: maximumDaysOfAbsence,
                Description: description
            }
            $.ajax({
                url: '/HrEmployee/AddEmployeeContract',
                type: "POST",
                data: { contractVM: data1 },
                success: function (result) {
                    if (result) {
                        LoadContract();
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
        } else {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    });

    SetDefaultValues();

});

function SetDefaultValues() {
    if ($("#HoursCount").val() == '0' || $("#HoursCount").val() == '') {
        $("#HoursCount").val('8');
    }


    if ($('#daysOff:checkbox:checked').length == 0) {
        $("#Friday").prop("checked", true);
    }
    
   
}