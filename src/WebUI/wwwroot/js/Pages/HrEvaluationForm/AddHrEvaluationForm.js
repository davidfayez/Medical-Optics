
$(document).ready(function () {
    
    
    $("#FK_HrDepartmentId").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "nameAndCode",
        dataValueField: "id",
        height: 300,
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEvaluationForm/GetAllDepartmentforDataTreeList",
                },
                parameterMap: function (data, action) {
                    if (action === "read") {
                        console.log(data);

                        return {
                            //id: $("#FK_HrDepartmentId").text(),
                            //FK_HrDepartmentId: $("#FK_HrDepartmentId").val()
                        };


                    } else {
                        return data;
                    }
                }
            }
        }

    });

    $("#FK_HrManagementId").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "nameAndCode",
        dataValueField: "id",
        height: 300,
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEvaluationForm/GetAllManagementforDataTreeList",
                    data: function () {
                        return {};
                    }
                },
                parameterMap: function (data, action) {
                    if (action === "read") {
                        

                        return {
                            
                            FK_HrManagementId: $("#FK_HrManagementId").text(),
                            //FK_HrManagementId: $("#FK_HrManagementId").val()
                        };


                    } else {
                        console.log("I'm here2");
                        return data;
                    }
                }
            }
        }

    });

   

    function arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }
    

})







    

$("#btnSubmit").on('click', function () {
    var managements = $("#FK_HrManagementId").data("kendoDropDownTree");
    var jsonmanagementItems = JSON.parse(JSON.stringify(managements.value()));
    var Departments = $("#FK_HrDepartmentId").data("kendoDropDownTree");
    var jsonDepartmentItems = JSON.parse(JSON.stringify(Departments.value()));
    managements.value(jsonmanagementItems);
    Departments.value(jsonDepartmentItems);
    var data = {
        FK_HrManagementId: jsonmanagementItems,
        FK_HrDepartmentId: jsonDepartmentItems,
        FormNameAr: $("#FormNameAr").val(),
        FormNameEn: $("#FormNameEn").val(),
        Description: $("#Description").val(),
        IsActive: $("#rdActive").val(),
        FK_DefBranchId: parseInt($("#FK_DefBranchId").val())
    };
    console.log(data);


    if ($("#FK_HrEmployeeId").val() == 0)
        $("#employeeIdValidation").show();
    else
        $("#employeeIdValidation").hide();

    if ($("#FK_HrManagementId").val() == 0)
        $("#FK_HrManagementIdValidation").show();
    else
        $("#FK_HrManagementIdValidation").hide();

    if ($("#FK_HrDepartmentId").val() == 0)
        $("#FK_HrDepartmentIdValidation").show();
    else
        $("#FK_HrDepartmentIdValidation").hide();

    if ($("#mainForm").valid() && $("#FK_HrManagementId").val().length > 0) {
        $.ajax('/HrEvaluationForm/Create', {
            type: 'POST',
            data: data,
            dataType: "json"
        }).done(function (result) {
            //console.log(result);
            window.location.href = result.redirectToUrl
        });
       // $("#mainForm").submit();
    }
});