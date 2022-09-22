function removeDepartment(id) {

  
    swal({
        title: Resources.DeleteResource,
        text: Resources.DeleteConfirmResource,
        type: "info",
        showCancelButton: true,
        confirmButtonText: Resources.DeleteResource,
        cancelButtonText: Resources.CancelResource,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function () {
        setTimeout(function () {
            $.ajax({
                url: "/HrDepartment/Delete?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        document.location="/HrDepartment"
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

$(document).ready(function () {
    $('#DefBranches').change(function () {


        $("#FK_ManagerId").data("kendoDropDownList").dataSource.read();
        $("#FK_ManagerId").data("kendoDropDownList").value(0);
       
        $("#FK_SupervisorId").data("kendoDropDownList").dataSource.read();
        $("#FK_SupervisorId").data("kendoDropDownList").value(0);
    });

    $("#FK_ManagerId").kendoDropDownList({
       // optionLabel: Resources.SelectOne,
        filter: "contains",
        height: 300,
        dataTextField: "fullName",
        dataValueField: "id",
        template: '<span class="k-state-default" > #: data.code #</span>' +
            '--<span class="k-state-default">#: data.fullName #</span>',
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
        },
        select: onEmpSelect
    });
    function onEmpSelect(e) {

        $("#hrEmployeeId").val(e.dataItem.id);
        $("#employeeName").val(e.dataItem.fullName);


    }

    $("#FK_SupervisorId").kendoDropDownList({
       // optionLabel: Resources.SelectOne,
        filter: "contains",
        height: 300,
        dataTextField: "fullName",
        dataValueField: "id",
        template: '<span class="k-state-default" > #: data.code #</span>' +
            '--<span class="k-state-default">#: data.fullName #</span>',
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
        },
    });

    
})