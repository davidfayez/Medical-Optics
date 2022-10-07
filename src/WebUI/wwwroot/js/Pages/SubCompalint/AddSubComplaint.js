$(document).ready(function () {

    $("#ComplaintId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "complaintNameEn",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/Complaint/GetAll",
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


