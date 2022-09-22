$(document).ready(function () {
    $("#FK_SecModuleId").kendoDropDownList({
        optionLabel: Resources.ChoseModule,
        filter: "contains",
        height: 300,
        dataTextField: "moduleNameAr",
        dataValueField: "id",
        
        dataSource: {
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Role/GetAllSecModules",
                }
            }
        },
        select: onSelect
    });
    var id = 0;
    function onSelect(e) {
        id=e.dataItem.id
        $("#FK_SecModulePageId").data("kendoDropDownList").dataSource.read();
    }

    $("#FK_SecModulePageId").kendoDropDownList({
        optionLabel: Resources.ChoseModule,
        dataTextField: "moduelPageNameAr",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    url: "/DefFreezingReason/GetModulePageByModule",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                id: id// data.filter.filters[0].value
                            };
                        } else {
                            return {
                                id: id
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        }
    });
})


$("#btnSubmit").on('click', function () {

    //submit form if valid
    if ($("#FK_SecModuleId").val() > 0)
        $("FK_SecModuleIdValidation").hide();
    else
        $("#FK_SecModuleIdValidation").show();

    if ($("#FK_SecModulePageId").val() > 0)
        $("#FK_SecModulePageIdValidation").hide();
    else
        $("#FK_SecModulePageIdValidation").show();


    if ($("#formFreezingReason").valid() && $("#FK_SecModuleId").val() > 0 && $("#FK_SecModulePageId").val() > 0 )
        $("#formFreezingReason").submit();
});