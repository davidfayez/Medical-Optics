$(document).ready(function () {
    //$("#TypeCode").blur(function () {
    //    validTypeCode();
    //});
});

//var _validcode = false;
//function validTypeCode() {
//    $("#mainForm").valid();
//    var code = $("#TypeCode").val();
//    if (code == "") {
//        return false;
//    }
//    $.ajax({
//        url: '/GlAccountType/CodeValidate/' + code,
//        success: (e) => {
//            if (e == "true") {
//                $("#validTypeCode").text("");
//                _validcode = true;
//            } else {
//                $("#validTypeCode").text(e);
//                _validcode = false;
//            }
//        }
//    });

//    return _validcode;
//}

$("#submitAccountTypeModal").on('click', function () {
    //debugger;
    //if (!validTypeCode()) {
    //    return false;
    //}
    if ($("#accountTypeModal").valid()) {

        var data = {
            Id: 0,
            TypeNameAr: $("#TypeNameAr").val(),
            TypeNameEn: $("#TypeNameEn").val(),
            Description: $("#accountTypeDescription").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
        }

        $.ajax({
            url: "/GlAccountType/SaveCreatePopUp",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_GlAccountTypeId").append("<option selected='selected' value='" + result.id + "'>" + result.typeNameAr + "</option>");
                $("#Account-type").modal('toggle');
            }
        });
    }

});
$("#closeAccountTypeModal").on('click', function () {
    $("#TypeCode").val('');
    $("#validTypeCode").text('');
    $("#TypeNameAr").val('');
    $("#TypeNameAr-error").text('');
    $("#TypeNameEn").val('');
    $("#TypeNameEn-error").text('');
    $("#accountTypeDescription").val('');
});