$(document).ready(function () {
    LoadMedicalInsurance();
    function LoadMedicalInsurance() {
        $.ajax({
            url: '/HrEmployee/GetEmployeeMedicalInsurance?id=' + $("#EmployeeId").val(),
            type: 'GET',
            success: function (medical) {
                debugger
                if (medical != null) {
                    $("#empMedicalId").val(medical.id);
                    $("#insuranseCompanyName").val(medical.companyName);
                    $("#CardNumber").val(medical.cardNumber);
                    $("#ClassTypeMedicalInsurance").val(medical.classType);
                    $("#empHasVirtualCard")[0].checked = medical.hasVirtualCard;
                    var imgpath = medical.cardPath
                    $("#empMedicalDescription").val(medical.description);
                    var strDateFrom = medical.dateIssued
                    strDateFrom = strDateFrom.substring(0, strDateFrom.indexOf('T'))
                    var dateFrom = new Date(strDateFrom)
                    //dateFrom.setDate(dateFrom.getDate() + 1);
                    var strDateTo = medical.dateExpiry
                    strDateTo = strDateTo.substring(0, strDateTo.indexOf('T'))
                    var dateTo = new Date(strDateTo)
                    //dateTo.setDate(dateTo.getDate() + 1);
                    document.getElementById("empMedicalDateIssued").valueAsDate = dateFrom;
                    document.getElementById("empMedicalDateExpire").valueAsDate = new Date(dateTo);
                    document.getElementById("empMedicalCardImg").src = "../../Images/EmployeeMedicalInsuranceCard/" + medical.cardPath
                }

            }
        })
    }
    $("#addEmployeeMedicalInsurancebtn").click(function () {

        var id = $("#empMedicalId").val(),
            empId = $("#EmployeeId").val(),
            companyName = $("#insuranseCompanyName").val(),
            cardNumber = $("#CardNumber").val(),
            classType = $("#ClassTypeMedicalInsurance").val(),
            dateIssued = $("#empMedicalDateIssued").val(),
            dateExpired = $("#empMedicalDateExpire").val(),
            hasVirtualCard = $("#empHasVirtualCard")[0].checked,
            description = $("#empMedicalDescription").val();
        if (empId > 0) {
            if (companyName != null && companyName.length > 0) {
                $("#CompanyNameValid").text("");
            } else {
                $("#CompanyNameValid").text(Resources.Required);
                return;
            }
            if (cardNumber.length < 1 || cardNumber == "") {
                $("#CardNumberValid").text(Resources.Required);
                return;
            } else {
                $("#CardNumberValid").text("");
            }
            debugger
            if (classType.length < 1 || classType == "") {
                $("#ClassTypeValid").text(Resources.Required);
                return;
            } else {
                $("#ClassTypeValid").text("");
            }


            var data = new FormData();
            var imageUpload = $("#empMedicalCardfile").get(0);
            var files = imageUpload.files;
            if (files.length > 0) {
                data.append(files[0].name, files[0]);
                $.ajax({
                    type: "POST",
                    url: "/HrEmployee/SaveEmployeeMedicalCardImage",
                    data: data,
                    async: false,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        //window.location.href = response;
                    }
                });
            }


            var data1 = {
                Id: id,
                FK_HrEmployeeId: empId,
                CompanyName: companyName,
                CardNumber: cardNumber,
                ClassType: classType,
                DateIssued: dateIssued,
                DateExpiry: dateExpired,
                HasVirtualCard: hasVirtualCard,
                Description: description
            }





            $.ajax({
                url: '/HrEmployee/AddEmployeeMedicalInsurance',
                type: "POST",
                data: { medicalInsuranceVM: data1 },
                success: function (result) {
                    if (result) {
                        debugger
                        LoadMedicalInsurance();
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



});