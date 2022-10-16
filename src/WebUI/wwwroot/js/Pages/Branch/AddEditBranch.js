$(document).ready(function () {
    //debugger;

    //--------------------------------- Countries

    $("#DefCountryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "countryNameEn",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCountry/GetAll",
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

    //--------------------------------- Companies
    $("#DefCompanyId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "companyNameEn",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/Company/GetAll",
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


    //--------------------------------- Cities
    $("#DefCityId").kendoDropDownList({
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


//---------------------------------Add Picture
function setImage(e) {
    debugger;
    var selectedFile = e.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("branchImage");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}



