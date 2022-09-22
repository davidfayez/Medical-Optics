$(document).ready(function () {
    $('#DefBranches').change(function () {
        $("#FK_HrJobTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrJobTypeId").data("kendoDropDownList").value(0);

    });


    // ddls 
    $("#FK_HrJobTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllJobTypeForDDList",
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
        if ($("#FK_HrJobTypeId").val() == 0)
            $("#jobTypeIdvalidation").show();
        else
            $("#jobTypeIdvalidation").hide();


        if ($("#formJob").valid() && $("#FK_HrJobTypeId").val() > 0) {
            $("#formJob").submit();
        }
    });
})