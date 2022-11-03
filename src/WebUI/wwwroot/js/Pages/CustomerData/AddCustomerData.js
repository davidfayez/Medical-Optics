$(document).ready(function () {

    $("#CustomerDataVM_BirthDate").on('change', function () {
        debugger;
        var BirthDate = $("#CustomerDataVM_BirthDate").val();
        var age = getAge(BirthDate);
        $("#CustomerDataVM_Age").val(age);
    });

    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    //--------------------------------- Cities
    $("#NationalAddressVM_CityId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "cityNameEn",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/City/GetAll",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        return {

                        };

                    } else {
                        return data;
                    }
                }
            }
        }
    });

});

function setCustomerImage(e) {
    debugger;
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("customerImage");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}

function setMedicalCardImage(e) {
    debugger;
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("cardImage");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}


