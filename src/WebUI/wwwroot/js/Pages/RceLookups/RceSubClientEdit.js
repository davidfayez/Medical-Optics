$(document).ready(function () {


    disableFreezing();
    $("#rdActive").change(function () {
        disableFreezing();
    })
    $("#rdInactive").click(function () {
        disableFreezing();
    })
    function disableFreezing() {
        var state = $("input[name='IsActive']:checked").val();
        if (state == "True") {
            $("#FK_DefFreezingReasonId").attr("disabled", "disabled");
            $("#FreezingNotes").attr("disabled", "disabled");
            $("#frezzingReasonBtn").attr("disabled", "disabled");

        } else {
            $("#FK_DefFreezingReasonId").removeAttr("disabled");
            $("#FreezingNotes").removeAttr("disabled");
            $("#frezzingReasonBtn").removeAttr("disabled");

        }
    }
    //$("#FK_RceClientId").kendoDropDownList({
    //    filter: "contains",
    //    height: 300,
    //    dataTextField: "fullName",
    //    dataValueField: "id",
    //    //valueTemplate: '<span class="selected-value"></span><span>' + Resources.Choose + '</span>',
    //    template: '<span class="k-state-default" style="margin-left:150px">#: data.code #</span>' +
    //        '<span class="k-state-default">#: data.fullName #</span>',
    //    dataSource: {
    //        type: "json",
    //        //serverFiltering: true,
    //        transport: {
    //            read: {
    //                url: "/HrEmployee/GetAllEmployeesForDDList",
    //            },
    //            parameterMap: function (data, action) {

    //                if (action === "read") {
    //                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
    //                        return {
    //                            code: data.filter.filters[0].value,
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    } else {
    //                        return {
    //                            code: "",
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    }

    //                } else {
    //                    return data;
    //                }
    //            }
    //        }
    //    },
    //});

    $("#FK_RceClientId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        //valueTemplate: '<span class="selected-value"></span><span>' + Resources.Choose + '</span>',
        //template: '<span class="k-state-default">#: data.codeAndName #</span>',
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllRceClientsForDDLList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                //code: data.filter.filters[0].value,
                                //defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                //code: "",
                                //defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
    });

})

$("#btnSubmit").on('click', function () {

    //submit form if valid
    if ($("#FK_RceClientId").val() > 0)
        $("#FK_RceClientIdValidation").hide();
    else
        $("#FK_RceClientIdValidation").show();

    if ($("#formSubClient").valid() && $("#FK_RceClientId").val() > 0)
        $("#formSubClient").submit();
});