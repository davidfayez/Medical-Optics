$("#FK_GlAccountTypeId").kendoDropDownList({
    filter: "contains",
    height: 300,
    dataTextField: "codeAndName",
    dataValueField: "id",
    dataSource: {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: "/GlAccountType/GetAllAccountTypeForDDList",
            },
            parameterMap: function (data, action) {
                debugger
                if (action === "read") {
                    return {
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                    };

                } else {
                    return data;
                }
            }
        }
    }
});