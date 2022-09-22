$(document).ready(function () {
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);


    //$("#FK_DefBranchId").on('change', function () {
    //    debugger;
    //    var loadingoption = $('<option></option>').text("اختر");
    //    //('#FK_HrSubBranchId').attr("disabled", "disabled").empty().append(loadingoption);
    //    var id = $("#FK_DefBranchId > option:selected").val();
    //    //alert(id);
    //    jQuery.getJSON("/HrLookups/GetAllHrSubBranchByBranchId/" + id, function (data) {
    //        var defaultoption = $('<option value="">اختر</option>');
    //        $('#FK_HrSubBranchId').removeAttr("disabled").empty().append(defaultoption);
    //        jQuery.each(data, function (i) {
    //            var option2 = $('<option></option>').attr("value", data[i].id).text(data[i].branchNameAr);
    //            $("#FK_HrSubBranchId").append(option2);
    //        });
    //    });
    //});
});