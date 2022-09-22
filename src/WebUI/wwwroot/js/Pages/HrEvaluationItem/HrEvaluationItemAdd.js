$(document).ready(function () {
    $('#DefBranches').change(function () {

        $("#FK_HrEvaluationMainItemId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEvaluationMainItemId").data("kendoDropDownList").value(0);

        
    });

    $("#FK_HrEvaluationMainItemId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEvaluationMainItem/GetAll",
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

    $("#FK_HrEvaluationMainItemId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAr",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEvaluationMainItem/GetAllEvaluationMainItemForDDList",
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

    $("#FK_HrEvaluationTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEvaluationItem/GetAllEvaluationType",
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
        select:onSelectType
    });

    if ($("#FK_HrEvaluationTypeId").val() == 1) {
        $("#rdIsAnswerCheckBox").prop("disabled", true);
        $("#rdIsAnswerTextArea").prop("disabled", true);

        $("#rdIsAnswerCheckBox").prop("checked", false)
        $("#rdIsAnswerTextArea").prop("checked", false)
    } else {
        $("#rdIsAnswerCheckBox").prop("disabled", false);
        $("#rdIsAnswerTextArea").prop("disabled", false);
    }

    function onSelectType(e) {
        if (e.dataItem.value == 1) {
            $("#rdIsAnswerCheckBox").prop("disabled", true);
            $("#rdIsAnswerTextArea").prop("disabled", true);

            $("#rdIsAnswerCheckBox").prop("checked", false)
            $("#rdIsAnswerTextArea").prop("checked", false)
        } else {
            $("#rdIsAnswerCheckBox").prop("disabled", false);
            $("#rdIsAnswerTextArea").prop("disabled", false);
        }
    }

    $("#rdIsAnswerCheckBox").change(function () {
        if ($("#rdIsAnswerCheckBox").is(":checked")) {
            $("#rdIsAnswerTextArea").prop("checked", false)
        } else {
            $("#rdIsAnswerCheckBox").prop("checked", false)
        }
    })

    $("#rdIsAnswerTextArea").change(function () {
        if ($("#rdIsAnswerTextArea").is(":checked")) {
            $("#rdIsAnswerCheckBox").prop("checked", false)
        } else {
            $("#rdIsAnswerTextArea").prop("checked", false)
        }
    })
})