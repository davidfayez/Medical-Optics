$(document).ready(function () {


    $('#DefBranches').change(function () {

        $("#FK_HrMainManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrMainManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrSubManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrSubManagementId").data("kendoDropDownList").value(0);

        $("#FK_ManagerId").data("kendoDropDownList").dataSource.read();
        $("#FK_ManagerId").data("kendoDropDownList").value(0);

    });


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
        select: onSelectMainManagement
    });
    function onSelectMainManagement(e) {
        
        $('#FK_HrSubManagementId').data('kendoDropDownList').dataSource.read({ id: e.dataItem.id });
        $("#FK_HrSubManagementId").data("kendoDropDownList").value(0);
    }
    $("#FK_HrSubManagementId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrSubManagementByMainIdForDDList",
                },
                parameterMap: function (data, action) {
                    debugger
                    var mainId = 0;
                    if (Object.keys(data).length > 0 && data.id > 0) {
                        mainId = data.id
                    }

                    if (action === "read") {
                        return {
                            id: mainId,
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        }
    });

    $("#FK_ManagerId").kendoDropDownList({
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
        }

    });
    $("#btnSubmit").on('click', function () {

        if ($("#FK_HrMainManagementId").val() == 0)
            $("#mainManagementIdValidation").show();
        else
            $("#mainManagementIdValidation").hide();

        if ($("#FK_HrSubManagementId").val() == 0)
            $("#subManagementIdValidation").show();
        else
            $("#subManagementIdValidation").hide();

        if ($("#FK_ManagerId").val() == 0)
            $("#managerIdValidation").show();
        else
            $("#managerIdValidation").hide();



        if ($("#create").valid() && $("#FK_HrMainManagementId").val() > 0 && $("#FK_HrSubManagementId").val() > 0 && $("#FK_ManagerId").val() > 0) {
            $("#create").submit();
        }
    });



})




