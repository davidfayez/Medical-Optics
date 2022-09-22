$(document).ready(function () {

    $("#FK_InsurSubCompClassIdModal").on('change', function () {
        debugger;
        var loadingoption = $('<option></option>').text("اختر");
        //('#FK_InsurSubCompClassId').attr("disabled", "disabled").empty().append(loadingoption);
        var id = $("#FK_InsurSubCompClassIdModal > option:selected").val();
        //alert(id);
        jQuery.getJSON("/CltClient/GetAllSubCompaniesByClassId/" + id, function (data) {
            var defaultoption = $('<option value="">اختر</option>');
            $('#FK_InsuranceSubCompanyIdModal').removeAttr("disabled").empty().append(defaultoption);
            jQuery.each(data, function (i) {
                debugger
                var option2 = $('<option></option>').attr("value", data[i].id).text(data[i].companyNameAr);
                $("#FK_InsuranceSubCompanyIdModal").append(option2);
            });
        });
    });
});

function setImage(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgCard");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}
function setImageResidence(e) {
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgResidence");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}


$("#submitCltClientModal").on('click', function () {


    if ($("#CltClientModal").valid()) {

        var formData = new FormData();
        formData.append('CardImageFile', $('#CardImageFile')[0].files[0]);
        formData.append('ResidenceImageFile', $('#ResidenceImageFile')[0].files[0]);


        var data = {
            ClientCode: $("#ClientCodeModal").val(),
            FirstName: $("#FirstNameModal").val(),
            SecondName: $("#SecondNameModal").val(),
            ThirdName: $("#ThirdNameModal").val(),
            FamilyName: $("#FamilyNameModal").val(),
            Address: $("#AddressModal").val(),
            Phone: $("#PhoneModal").val(),
            FK_InsurSubCompClassId: parseInt($("#FK_InsurSubCompClassIdModal").val()),
            FK_InsuranceSubCompanyId: parseInt($("#FK_InsuranceSubCompanyIdModal").val()),
            EligibilityNo: $("#EligibilityNoModal").val(),
            ApprovalNo: $("#ApprovalNoModal").val(),
            InsuranceId: $("#InsuranceIdModal").val(),
            PolicyNo: $("#PolicyNoModal").val(),
            ResidentialNo: $("#ResidentialNoModal").val(),
            //CardImageFile: formData,
            //ResidenceImageFile: dataResidance,
            IsActive: true,
            Description: $("#DescriptionModal").val()
        }
        //evt.preventDefault();

        $.ajax({
            type: "POST",
            url: "/CltClient/UploadImages",
            data: formData,
            async: false,
            processData: false,
            contentType: false,
            success: function (response) {
                //window.location.href = response;
            }
        });

        $.ajax({
            url: "/CltClient/PopUpCreate",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                //$("#FK_CltClientId").append("<option selected='selected' value='" + result.id + "'>" + result.firstName + " "+  result.secondName +"</option>");

                $("#FK_CltClientId").val(result.id);
                $("#cltClientAutoComplete").val(result.clientCode);
                $("#CltClientName").val(result.clientFullName);
                $("#InsuranceSubCompanyName").val(result.insuranceSubCompanyName);
                $("#InsurSubCompClassName").val(result.insurSubCompClassName);
                $("#CltClientPhone").val(result.phone);
                $("#EligibilityNo").val(result.eligibilityNo);
                $("#ApprovalNo").val(result.approvalNo);
                $("#InsuranceId").val(result.insuranceId);
                $("#PolicyNo").val(result.policyNo);
                $("#ResidentialNo").val(result.residentialNo);

                if (result.cardImage != null)
                    $("#ClientCard").attr("src", "/images/Clt/" + result.cardImage);
                if (result.residenceImage != null)
                    $("#ResidenceImage").attr("src", "/images/Clt/" + result.residenceImage);


                $("#closeCltClientModal").click();

            }
        });
    }

});
$("#closeCltClientModal").on('click', function () {

    //$("#ClientCodeModal").val('');
    $("#FirstNameModal").val('');
    $("#SecondNameModal").val('');
    $("#ThirdNameModal").val('');
    $("#FamilyNameModal").val('');
    $("#AddressModal").val('');
    $("#PhoneModal").val('');
    $("#FK_InsurSubCompClassIdModal").val(null);
    $("#FK_InsuranceSubCompanyIdModal").val(null);
    $("#EligibilityNoModal").val('');
    $("#ApprovalNoModal").val('');
    $("#InsuranceIdModal").val('');
    $("#PolicyNoModal").val('');
    $("#ResidentialNoModal").val('');
    $("#CardImageFile").val(null);
    $("#ResidenceImageFile").val(null);
    $("#DescriptionModal").val('');

    $("#imgCard").attr("src", "/images/back-login.jpg");
    $("#imgResidence").attr("src", "/images/back-login.jpg");
});

$("#openCltClientModal").on('click', function () {

    jQuery.getJSON("/CltClient/GetNextCode", function (result) {
        $("#ClientCodeModal").val(result);
    });
});
