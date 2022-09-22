$(document).ready(function () {

    getSubBranches();
    $("#DefBranches").change(function () {
        getSubBranches();
        $("#HrArchiveLevel1Id").data("kendoDropDownList").dataSource.read();
        $("#HrArchiveLevel1Id").data("kendoDropDownList").value(0);
        $("#FK_HrArchiveLevel1Id").val(0);

        $("#HrArchiveLevel2Id").data("kendoDropDownList").dataSource.read();
        $("#HrArchiveLevel2Id").data("kendoDropDownList").value(0);
        $("#FK_HrArchiveLevel2Id").val(0);

        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartmentId").data("kendoDropDownList").value(0);

        $("#FK_EmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_EmployeeId").data("kendoDropDownList").value(0);
    })
    function getSubBranches() {
        $.ajax({
            url: "/HrLookups/GetHrSubBranchByBranch?id=" + $("#FK_DefBranchId").val(),
            success: function (branch) {
                var html = "";
                for (var i = 0; i < branch.length; i++) {
                    html += "<option value='" + branch[i].id + "'>" + branch[i].branchNameAr + "</option>";
                }

                $("#FK_HrSubBranchId").html(html);
            }
        })
    }

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
        $("#HrArchiveLevel3Id").data("kendoDropDownList").dataSource.read();
    }

    $("#HrArchiveLevel3Id").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrArchive/GetAllArchiveLevel3ForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                subArchive: parseInt($("#FK_HrArchiveLevel2Id").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                subArchive: parseInt($("#FK_HrArchiveLevel2Id").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectLevel3
    });
    function onSelectLevel3(e) {

        $("#FK_HrArchiveLevel3Id").val(e.dataItem.id);
    }

    $("#FK_HrManagementId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrManagementForDDList",
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
        select: onSelectManagement
    });
    function onSelectManagement(e) {
        $("#FK_EmployeeId").data("kendoDropDownList").dataSource.read({ managementId: e.dataItem.id });
        $("#FK_EmployeeId").data("kendoDropDownList").value(0);

    }
    $("#FK_HrDepartmentId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrDepartment/GetAllForDDList",
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
        select: onSelectDepartment
    });
    function onSelectDepartment(e) {

        $("#FK_EmployeeId").data("kendoDropDownList").dataSource.read({ departmentId: e.dataItem.id });
        $("#FK_EmployeeId").data("kendoDropDownList").value(0);

    }

    $("#FK_EmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeesForDDList",
                },
                parameterMap: function (data, action) {

                    var managementId = parseInt($("#FK_HrManagementId").val()),
                        departmentId = parseInt($("#FK_HrDepartmentId").val());
                    if (managementId == 0 || isNaN(managementId))
                        managementId = null;
                    if (departmentId == 0 || isNaN(departmentId))
                        departmentId = null;


                    if (data.hasOwnProperty.length > 0 && data.managementId > 0 && data.managementId != undefined)
                        managementId = data.managementId;
                    else if (data.managementId == 0)
                        managementId = null;


                    if (data.hasOwnProperty.length > 0 && data.departmentId > 0 && data.departmentId != undefined)
                        departmentId = data.departmentId;
                    else if (data.departmentId == 0)
                        departmentId = null;

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                managementId: managementId,
                                departmentId: departmentId,
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                                managementId: managementId,
                                departmentId: departmentId,
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        }
    });

    $("#HrArchiveLevel1Id").data("kendoDropDownList").dataSource.read();
    $("#HrArchiveLevel1Id").data("kendoDropDownList").value($("#FK_HrArchiveLevel1Id").val());
    ;

    $("#HrArchiveLevel2Id").data("kendoDropDownList").dataSource.read();
    $("#HrArchiveLevel2Id").data("kendoDropDownList").value($("#FK_HrArchiveLevel2Id").val());

    $("#HrArchiveLevel3Id").data("kendoDropDownList").dataSource.read();
    $("#HrArchiveLevel3Id").data("kendoDropDownList").value($("#FK_HrArchiveLevel3Id").val());
    
})

function removeArchive(id) {


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
                url: "/HrArchive/DeleteArchiveAddFile?Id=" + id,
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
                        document.location = "../../HrArchive/IndexArchiveAddFile";
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

    if ($("#FK_HrArchiveLevel3Id").val() == 0)
        $("#FK_HrArchiveLevel3IdValidation").show();
    else
        $("#FK_HrArchiveLevel3IdValidation").hide();

    if ($("#FK_EmployeeId").val() == 0)
        $("#employeeIdValidation").show();
    else
        $("#employeeIdValidation").hide();

    if ($("#FK_HrManagementId").val() == 0)
        $("#FK_HrManagementId").val(null);
    if ($("#FK_HrDepartmentId").val() == 0)
        $("#FK_HrDepartmentId").val(null);

    if ($("#mainForm").valid() && $("#FK_HrArchiveLevel1Id").val() > 0 && $("#FK_HrArchiveLevel2Id").val() > 0 && $("#FK_HrArchiveLevel3Id").val() > 0 && $("#FK_EmployeeId").val() > 0) {
        $("#mainForm").submit();
    }
});