$(document).ready(function () {

    $("#FK_DefCountryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "countryNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCountry/GetAllForDDList",
                },
            }
        },
        select: onSelectCountry
    });

    function onSelectCountry(e) {

        var countryId = e.dataItem.id;

        $("#FK_DefCityId").data("kendoDropDownList").dataSource.read({ id: countryId });
        $("#FK_DefCityId").data("kendoDropDownList").value(0);
    }

    $("#FK_DefCityId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "cityNameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCity/GetAllForDDListByCountryId",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0) {
                            return {
                                id: data.id,
                            };
                        } else {
                            return {
                                id: parseInt($("#FK_DefCountryId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        // select: onSelectCity
    });



});

$('input[type=radio][name=IsActive]').change(function () {
    if (this.value == "True") {
        $(".disabled-input").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#FreezingNote").val("");
    }
    else
        $(".disabled-input").removeAttr('disabled');
});

function setImage(e) {

    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgBranch");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}

//$("#FK_DefCountryId").change(function () {
//    debugger
//    var countryId = $(this).val();
//    $.ajax({
//        type: "POST",
//        url: "/DefCity/GetAllByCountryId?id=" + countryId,
//        dataType: "json",
//        success: function (response) {
//            debugger
//            if (response != null) {
//                var option = "";
//                $.each(response, function (index, item) {
//                    option += "<option value='" + item.id + "'>" + item.cityNameAr + "</option>"
//                });
//                $("#FK_DefCityId").html(option)

//            }

//        }
//    });

//});

function setHeaderImage(e) {

    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgHeader");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}

function setFooterImage(e) {

    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgFooter");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}
$("#btnSubmit").on('click', function () {
    debugger
    var footerValid = false,
        headerValid = false,
        imgHeader = document.getElementById("imgHeader"),
        imgFooter = document.getElementById("imgFooter");

    if ($("#Id").val() > 0) { // page edit 
        if ($("#HeaderUrl").val() != "" || imgHeader.title != "")
            headerValid = true;

        if ($("#FooterUrl").val() != "" || imgFooter.title != "")
            footerValid = true;
    }
    else {// page create
        if (imgHeader.title != "")
            headerValid = true;

        if (imgFooter.title != "")
            footerValid = true;
    }

    if ($("#FK_DefCountryId").val() == 0)
        $("#countryIdvalidation").show();
    else
        $("#countryIdvalidation").hide();

    if ($("#FK_DefCityId").val() == 0)
        $("#cityIdvalidation").show();
    else
        $("#cityIdvalidation").hide();

    if (!headerValid)
        $("#imgHeaderValidation").show();
    else
        $("#imgHeaderValidation").hide();

    if (!footerValid)
        $("#imgFooterValidation").show();
    else
        $("#imgFooterValidation").hide();

    if ($("#formBranch").valid() && $("#FK_DefCountryId").val() > 0 && $("#FK_DefCityId").val() > 0 && headerValid && footerValid) {
        $("#formBranch").submit();
    }
});