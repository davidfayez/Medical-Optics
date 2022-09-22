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
        id = e.dataItem.id
        $("#SecModulePage").data("kendoDropDownList").dataSource.read();
    }

    $("#SecModulePage").kendoDropDownList({
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
        },
        select: onSelectSecModulePage
    });

    function onSelectSecModulePage(e) {
        $("#FK_SecModulePageId").val(e.dataItem.id);
    }
    id = $("#FK_SecModuleId").val();
    
    $("#SecModulePage").data("kendoDropDownList").dataSource.read();
    $("#SecModulePage").data("kendoDropDownList").value($("#FK_SecModulePageId").val());
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


    if ($("#formFreezingReason").valid() && $("#FK_SecModuleId").val() > 0 && $("#FK_SecModulePageId").val() > 0)
        $("#formFreezingReason").submit();
});
function removeFreezingReason(id) {

    swal({
        title: Resources.DeleteResource,
        text:  Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText:  Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/DefFreezingReason/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    console.log(result);
                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "/DefFreezingReason/index";
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                },
                error: function (err, xqr, txt) { }
            });

        }, 3000);
    });
}
