$(document).ready(function () {
    var EmployeeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/HrEmployee/GetAllHrEmployeeAutoComplete"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters[0].value,
                        branchId: $("#FK_DefBranchId").val(),
                        managementId: $("#FK_HrManagementId").val(),
                        departmentId: $("#FK_HrDepartmentId").val()
                    };
                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "id",
                fields: {

                    fullName: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#employeeAutoComplete").kendoAutoComplete({

        dataSource: EmployeeDataSource,
        select: onEmpSelect,
        change: onEmpChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.Code + ' </span>' +
            '<span>' + Resources.EmployeeName + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.code #</span>' +
            '<span>#: data.fullName #</span>',
        dataTextField: "code",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });
    function onEmpSelect(e) {

        $("#FK_HrEmployeeId").val(e.dataItem.id);
        $("#employeeName").val(e.dataItem.fullName);
       
    }
    function onEmpChange(e) {
        debugger;
        var code = this.value();

        $.ajax({
            type: "GET",
            url: "/HrEmployee/CheckEmployeeCodeExist?code=" + code,

            success: function (response) {

                if (response != null) {
                    $("#FK_HrEmployeeId").val(response.id);
                    $("#employeeName").val(response.fullName);

                } else {
                    $("#FK_HrEmployeeId").val(null);
                    $("#employeeName").val("");
                    
                }

            }
        });
    }
})

function removeStStore(id) {
    
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
                url: "/StLookups/DeleteStStore?Id=" + id,
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

                        window.location ="../../StLookups/IndexStStore"
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