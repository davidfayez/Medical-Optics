$(document).ready(function () {


    $('#DefBranches').change(function () {

        $("#FK_HrMainManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrMainManagementId").data("kendoDropDownList").value(0);

    });
    //Account

    $("#FK_HrMainManagementId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrMainManagementForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    $("#btnSubmit").on('click', function () {
        debugger
        if ($("#FK_HrMainManagementId").val() == 0)
            $("#mainManagementIdValidation").show();
        else
            $("#mainManagementIdValidation").hide();



        if ($("#mainForm").valid() && $("#FK_HrMainManagementId").val() > 0) {
            $("#mainForm").submit();
        }
    });

})

