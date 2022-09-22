$(document).ready(function () {
    $("#TypeCode").blur(function () {
        //validAccountCategoryCode();
    });
});

//var _validcode = false;
//function validAccountCategoryCode(){
//    $("#mainForm").valid();
//    var code = $("#CategoryCode").val();
//    if (code == "") {
//        return false;
//    }
//    $.ajax({
//        url: '/GlAccountCategory/CodeValidate/' + code,
//        success: (e) => {
//            if (e == "true") {
//                $("#validCategoryCode").text("");
//                _validcode = true;
//            } else {
//                $("#validCategoryCode").text(e);
//                _validcode = false;
//            }
//        }
//    });

//    return _validcode;
//}

$("#submitCreateModal").on('click', function () {
    debugger;

    if ($("#formCreateModal").valid()) {

        var cDate = new Date($("#CreationDate").text());
        var lDate = new Date($("#LastModifiedDate").text());
        var data = {
            Id: 0,
            TypeCode: $("#TypeCode").val(),
            TypeNameAr: $("#TypeNameAr").val(),
            TypeNameEn: $("#TypeNameEn").val(),
            Description: $("#Description").val(),
            FK_CreatorId: 1,
            IsActive: true,
            IsDeleted: false,
        }
        $.ajax({
            url: "/CbCreditCardType/AddDiscountType",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $("#FK_CbDiscountTypeId").append("<option selected='selected' value='" + result.id + "'>" + result.typeNameAr + "</option>");
                $("#Discount-Type").modal('toggle');
            }
        });
    }
});

$("#closeCreateModal").on('click', function () {
    $("#TypeCode").val('');
    $("#validCategoryCode").text('');
    $("#TypeNameAr").val('');
    $("#TypeNameAr-error").text('');
    $("#TypeNameEn").val('');
    $("#TypeNameEn-error").text('');
    $("#Description").val('');
});