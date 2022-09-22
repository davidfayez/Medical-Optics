$(document).ready(function () {

    $("#btnSearch").click(function () {

        $.ajax({
            url: "/HrDashboard/GetEmployeeData?id=" + $("#FK_HrEmployeeId").val() + "&dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val(),
            success: function (emp) {
                $("#FullName").text(emp.fullName);
                $("#JobName").text(emp.jobName);
                $("#ManagerName").text(emp.managerName);
                $("#Email").text(emp.email);
                $("#Phone").text(emp.phone);
                $("#ContractPeriod").text(emp.contractPeriod);
                var contractDateFrom = new Date(emp.contractDateFrom);
                $("#ContractDateFrom").text(contractDateFrom.toLocaleDateString());
                var contractDateTo = new Date(emp.contractDateTo);
                $("#ContractDateTo").text(contractDateTo.toLocaleDateString());
                var imgsrc = "/images/users/";
                if (emp.imagePath!=null)
                    imgsrc += emp.imagePath;
                else
                    imgsrc += "profile-icon.jpg";
                document.getElementById("empImg").src = imgsrc;

                $("#BasicSalary").val(emp.basicSalary);
                $("#TotalAllowances").val(emp.totalAllowances);
                $("#TotalExtra").val(emp.totalExtra);
                $("#LoanValue").val(emp.loanValue);
                $("#Absence").val(emp.absence);
                $("#PunishmentDays").val(emp.punishmentDays);
                $("#NetSalary").val(parseFloat(emp.basicSalary) + parseFloat(emp.totalAllowances) + parseFloat(emp.totalExtra) - parseFloat(emp.loanValue) - parseFloat(emp.punishmentDays));

                $("#AnnualLeaveCount").val(emp.annualLeaveCount);
                var vacationDate = new Date(emp.yearlyVacationDate);
                $("#YearlyVacationDate").val(vacationDate.toLocaleDateString());
                $("#EndOfServiceCompensation").val(emp.endOfServiceCompensation);
                var endOfServiceDate = new Date(emp.endOfServiceCompensationDate);
                $("#EndOfServiceCompensationDate").val(endOfServiceDate.toLocaleDateString());

                if (emp.hasAirlineTicket) {
                    document.getElementById("HasAirlineTicket").checked = true;
                    
                } else {
                    document.getElementById("HasAirlineTicket").checked = false;
                }

                var medicalExpiryDate = new Date(emp.medicalDateExpiry);
                $("#MedicalDateExpiry").val(medicalExpiryDate.toLocaleDateString());
                $("#ContractDateTo1").val(contractDateTo.toLocaleDateString());

            }
        });

        $.ajax({
            url: "/HrArchive/SearchInHrArchive?fK_EmployeeId=" + $("#FK_HrEmployeeId").val() + "&dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val(),
            success: function (archive) {
                var archivehtml = ""; 
                for (var i = 0; i <  archive.length; i++) {
                    archivehtml += "<tr>";
                    archivehtml += "<td>" + archive[i].fileName + "</td>";
                    archivehtml += '<td> <a href="/HrArchive/Download?filePath=' + archive[i].filePath + '&&fileName=' + archive[i].fileName+'">تحميل</a></td>';
                    archivehtml += "</tr>";
                }

                $("#archivetable").html(archivehtml)
            }
        });
        $.ajax({
            url: "/HrDashboard/GetEmployeeLoans?id=" + $("#FK_HrEmployeeId").val() + "&dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val(),
            success: function (loan) {
                var loanHtml=""
                for (var i = 0; i < loan.length; i++) {
                    loanHtml += '<td>' + loan[i].totalAmount+'</td>';
                    loanHtml += '<td>' + loan[i].installmentValue+ '</td>';
                    loanHtml += '<td>' + loan[i].installmentCount+ '</td>';
                    loanHtml += '<td></td>';
                    loanHtml += '<td><a href="/HrEmployeeLoan/Edit?id=' + loan[i].id+'" class="btn btn-success btn-sm" target="_blank">تفاصيل</a></td>';
                }

                $("#loantable").html(loanHtml);
            }
        });
        $.ajax({
            url: "/HrDashboard/GetEmployeeEvaluation?id=" + $("#FK_HrEmployeeId").val() + "&dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val(),
            success: function (evaluation) {
                var evaluationHtml = ""
                for (var i = 0; i < evaluation.length; i++) {
                    var evaluationDate = new Date(evaluation[i].evaluationDate);
                    evaluationHtml +='<tr>'
                    evaluationHtml += '<td>' + evaluationDate.toLocaleDateString() + '</td>';
                    evaluationHtml += '<td>' + evaluation[i].InstallmentValue + '</td>';
                    evaluationHtml += '</tr>'
                }

                $("#evaluationtable").html(evaluationHtml);
            }
        });

        $.ajax({
            url: "/HrDashboard/GetEmployeeJoB?id=" + $("#FK_HrEmployeeId").val() + "&dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val(),
            success: function (job) {
                var jobHtml = ""
                for (var i = 0; i < job.length; i++) {
                    var jobdate = new Date(job[i].startDate)
                    jobHtml += '<tr>'
                    jobHtml += '<td>' + jobdate.getFullYear() + '</td>';
                    jobHtml += '<td>' + jobdate.getMonth()+ '</td>';
                    jobHtml += '<td></td>';
                    jobHtml += '</tr>'
                    
                }

                $("#jobtable").html(jobHtml);
            }
        });

        getRequest();
    })

    $("#requestddl").change(function () {
        getRequest();
    })
    $("#FK_HrDepartment").change(function () {
        $.ajax({
            url: "/HrEmployee/GetEmployeeByDepartment?id=" + $("#FK_HrDepartment").val(),
            success: function (emp) {
                var employeehtml = "";
                for (var i = 0; i < emp.length; i++) {
                    employeehtml += '<option value="' + emp[i].id + '">' + emp[i].fullName + '</option>';
                }
                $("#FK_HrEmployeeId").html(employeehtml);
            }
        })
    })
    $("#FK_HrManagement").change(function () {
        $.ajax({
            url: "/HrEmployee/GetEmployeeByManagment?id=" + $("#FK_HrManagement").val(),
            success: function (emp) {
                var employeehtml = "";
                for (var i = 0; i < emp.length; i++) {
                    employeehtml += '<option value="' + emp[i].id + '">' + emp[i].fullName + '</option>';
                }
                $("#FK_HrEmployeeId").html(employeehtml);
            }
        })
    })
    $("#DefBranches").change(function () {
        $.ajax({
            url: "/HrEmployee/GetEmployeeByBranch?id=" + $("#DefBranches").val(),
            success: function (emp) {
                var employeehtml = "";
                for (var i = 0; i < emp.length; i++) {
                    employeehtml += '<option value="' + emp[i].id + '">' + emp[i].fullName + '</option>';
                }
                $("#FK_HrEmployeeId").html(employeehtml);
            }
        })
    })
    function getRequest() {
        $.ajax({
            url: "/HrDashboard/GetEmployeeRequest?id=" + $("#FK_HrEmployeeId").val() + "&dateFrom=" + $("#DateFrom").val() + "&dateTo=" + $("#DateTo").val() + "&type=" + $("#requestddl").val(),
            success: function (request) {
                var requestHtml = ""
                if ($("#requestddl").val() == 10) {
                    
                    for (var i = 0; i < request.length; i++) {
                        var reqDate = new Date(request[i].dateOfPermission)
                        requestHtml += '<tr>'
                        requestHtml += '<td>' + reqDate.toLocaleDateString() + '</td>';
                        requestHtml += '<td></td>';
                        requestHtml += '</tr>'

                    }
                } else {
                    for (var i = 0; i < request.length; i++) {
                        var reqDate = new Date(request[i].dateOfDue)
                        requestHtml += '<tr>'
                        requestHtml += '<td>' + reqDate.toLocaleDateString() + '</td>';
                        requestHtml += '<td></td>';
                        requestHtml += '</tr>'

                    }
                }
                

                $("#requesttable").html(requestHtml);
            }
        });
    }
});


