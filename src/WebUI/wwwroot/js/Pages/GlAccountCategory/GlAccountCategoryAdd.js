$(document).ready(function () {
    //$("#CategoryCode").blur(function () {
    //    validAccountCategoryCode();
    //});
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

        var data = {
            Id: 0,
            CategoryNameAr: $("#CategoryNameAr").val(),
            CategoryNameEn: $("#CategoryNameEn").val(),
            Description: $("#CategoryDescription").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
        }


        $.ajax({
            url: "/GlAccountCategory/SaveCreatePopUp",
            type: "post",
            cache: false,
            processData: false,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $("#FK_GlAccountCategoryId").append("<option selected='selected' value='" + result.id + "'>" + result.categoryNameAr + "</option>");

                if (result.id > 0) {
                    if (isNaN($("#Id").val())) { //Create Page
                        var multiCategories = $("#multiCategories").getKendoMultiSelect()
                        var dataSource = multiCategories.dataSource;
                        dataSource.add({
                            id: result.id,
                            categoryNameAr: result.categoryNameAr
                        });
                        var selectedCatsIds = [];
                        var catsData = multiCategories.dataItems();
                        for (var i = 0; i < catsData.length; i++) {
                            selectedCatsIds.push(catsData[i].id);
                        }
                        selectedCatsIds.push(result.id);
                        $("#multiCategories").data("kendoMultiSelect").value(selectedCatsIds);
                        selectedCatsIds = [];
                    } else {//edit Page

                        var multiCategories = $("#multiCategoriesEdit").getKendoMultiSelect()
                        var dataSource = multiCategories.dataSource;
                        dataSource.add({
                            id: result.id,
                            categoryNameAr: result.categoryNameAr
                        });
                        var selectedCatsIds = [];
                        var catsData = multiCategories.dataItems();
                        for (var i = 0; i < catsData.length; i++) {
                            selectedCatsIds.push(catsData[i].id);
                        }
                        selectedCatsIds.push(result.id);
                        $("#multiCategoriesEdit").data("kendoMultiSelect").value(selectedCatsIds);
                        selectedCatsIds = [];
                    }

                }


                $("#Account-category").modal('toggle');
            }
        });
    }

});

$("#closeCreateModal").on('click', function () {
    $("#CategoryCode").val('');
    $("#validCategoryCode").text('');
    $("#CategoryNameAr").val('');
    $("#CategoryNameAr-error").text('');
    $("#CategoryNameEn").val('');
    $("#CategoryNameEn-error").text('');
    $("#CategoryDescription").val('');
});