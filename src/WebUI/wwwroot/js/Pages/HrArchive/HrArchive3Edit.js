$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#HrArchiveLevel1Id").data("kendoDropDownList").dataSource.read();
        $("#HrArchiveLevel1Id").data("kendoDropDownList").value(0);
        $("#FK_HrArchiveLevel1Id").val(0);

        $("#HrArchiveLevel2Id").data("kendoDropDownList").dataSource.read();
        $("#HrArchiveLevel2Id").data("kendoDropDownList").value(0);
        $("#FK_HrArchiveLevel2Id").val(0);
    });

    $("#HrArchiveLevel1Id").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrArchive/GetAllArchiveLevel1ForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectLevel1
    });
    function onSelectLevel1(e) {

        $("#FK_HrArchiveLevel1Id").val(e.dataItem.id);
        $("#HrArchiveLevel2Id").data("kendoDropDownList").dataSource.read();
    }

    $("#HrArchiveLevel2Id").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrArchive/GetAllArchiveLevel2ForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                mainArchive: parseInt($("#FK_HrArchiveLevel1Id").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                mainArchive: parseInt($("#FK_HrArchiveLevel1Id").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectLevel2
    });
    function onSelectLevel2(e) {

        $("#FK_HrArchiveLevel2Id").val(e.dataItem.id);
    }

    $("#HrArchiveLevel1Id").data("kendoDropDownList").value($("#FK_HrArchiveLevel1Id").val());
    $("#HrArchiveLevel2Id").data("kendoDropDownList").dataSource.read();
    $("#HrArchiveLevel2Id").data("kendoDropDownList").value($("#FK_HrArchiveLevel2Id").val());
})

function removeArchiveLevel(id) {


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
                url: "/HrArchive/DeleteArchiveLevel3?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        //grid.refresh();
                        //grid.dataSource.filter(filters);
                        swal({
                            title: Resources.DeleteSuccessResource   ,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "../../HrArchive/IndexArchiveLevel3";
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource    ,
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

$("#btnSubmit").on('click', function () {

    if ($("#FK_HrArchiveLevel1Id").val() == 0)
        $("#FK_HrArchiveLevel1IdValidation").show();
    else
        $("#FK_HrArchiveLevel1IdValidation").hide();

    if ($("#FK_HrArchiveLevel2Id").val() == 0)
        $("#FK_HrArchiveLevel2IdValidation").show();
    else
        $("#FK_HrArchiveLevel2IdValidation").hide();

    if ($("#mainForm").valid() && $("#FK_HrArchiveLevel1Id").val() > 0 && $("#FK_HrArchiveLevel2Id").val() > 0) {
        $("#mainForm").submit();
    }
});