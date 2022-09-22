$(document).ready(function () {

    $("#FK_InsurSubCompClassId").on('change', function () {
        debugger;
        var loadingoption = $('<option></option>').text("اختر");
        //('#FK_InsurSubCompClassId').attr("disabled", "disabled").empty().append(loadingoption);
        var id = $("#FK_InsurSubCompClassId > option:selected").val();
        //alert(id);
        jQuery.getJSON("/CltClient/GetAllSubCompaniesByClassId/" + id, function (data) {
            var defaultoption = $('<option value="">اختر</option>');
            $('#FK_InsuranceSubCompanyId').removeAttr("disabled").empty().append(defaultoption);
            jQuery.each(data, function (i) {
                var option2 = $('<option></option>').attr("value", data[i].id).text(data[i].companyNameAr);
                $("#FK_InsuranceSubCompanyId").append(option2);
            });
        });
    });
});