$(document).ready(function () {


    $('#DefBranches').change(function () {

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartmentId").data("kendoDropDownList").value(0);



    });

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
        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read({ managementId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

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

        $("#FK_HrEmployeeId").data("kendoDropDownList").dataSource.read({ departmentId: e.dataItem.id });
        $("#FK_HrEmployeeId").data("kendoDropDownList").value(0);

    }
    $("#FK_HrEmployeeId").kendoDropDownList({
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

    $("#btnSearch").on('click', function () {

        var employeeId = $("#FK_HrEmployeeId").val();
        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.ChooseEmployee,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
            var url = '/HrEmployeeEndorsement/GetEmployeeEndorsement/' + 0;
            var sectionTable = $('#sectionTable');
            sectionTable.load(url);
        } else {
            var url = '/HrEmployeeEndorsement/GetEmployeeEndorsement/' + employeeId;
            var sectionTable = $('#sectionTable');
            sectionTable.load(url);

        }

    });

});

function SaveRow(empId, stepId, typeId) {
    debugger
    var fileUpload = $('#file_' + stepId + '').get(0);
    if (fileUpload != undefined && fileUpload.files.length == 0) {
        swal({
            title: Resources.FileMustBeSelected,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (empId > 0 && stepId > 0 && typeId > 0 && fileUpload != undefined) {

        var files = fileUpload.files;

        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }
        data.append('FK_HrEmployeeId', empId);
        data.append('FK_ReqEndorsementStepId', stepId);
        data.append('FK_ReqEndorsementTypeId', typeId);
        data.append('FK_DefBranchId', $('#FK_DefBranchId').val());


        $.ajax({
            type: 'POST',
            url: '/HrEmployeeEndorsement/Upload',
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {
                if (result) {
                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });
                    $("#FK_HrEmployeeId").data("kendoDropDownList").value(empId);
                    $("#btnSearch").click();
                }
                else {
                    swal({
                        title: Resources.DefaultErrorMessageResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    else {
        swal({
            title: Resources.DefaultErrorMessageResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }

}

function checkFile(file) {

    if (!file) {
        $('#divError').css('display', 'block');
        $('#error').empty();
        $('#error').append(Resources.NoFileSelectedMsgResource);
        return false;
    } else {
        var fileSize = file.size / 1024 / 1024;
        var fileName = file.name;
        var dotPosition = fileName.lastIndexOf(".");
        var fileExt = fileName.substring(dotPosition);

        if (fileSize > 10) {
            $('#divError').css('display', 'block');
            $('#error').empty();
            $('#error').append(Resources.MaxAllowedFileSizeMsgResource);
            return false;
        }
        else {
            $('#divError').css('display', 'none');
            $('#error').empty();
            return true;
        }
    }
}