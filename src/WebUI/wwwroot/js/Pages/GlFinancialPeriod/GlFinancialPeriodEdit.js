$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#EmployeesId").data("kendoDropDownTree").dataSource.read();
        $("#EmployeesId").data("kendoDropDownTree").value(0);

    });
    $("#FinancialPeriodCode").blur(function () {
        validCode();
    });


    var employeesTree = $("#EmployeesId").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "codeAndName",
        dataValueField: "id",
        height: 200,
        checkboxes: true,
        checkAll: true,
        autoClose: false,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetBranchEmployesAndAllAccountManagers",
                },
                parameterMap: function (data, action) {
                    if (action === "read") {
                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val())
                        };
                    } else {
                        return data;
                    }
                }
            }
        }

    });

    if ($("#hiddenId").val() != "0")
        employeesTree.data("kendoDropDownTree").value(empIds);

});

//var _validcode = false;
//function validCode() {

//    var code = $("#FinancialPeriodCode").val();
//    if (code == "") {
//        return false;
//    }
//    $.ajax({
//        url: '/GlFinancialPeriod/CodeValidate/' + code,
//        success: (e) => {
//            if (e == "true") {
//                $("#validCode").text("");
//                _validcode = true;
//            } else {
//                $("#validCode").text(e);
//                _validcode = false;
//            }
//        }
//    });

//    return _validcode;
//}

function removeGlFinancialPeriodEdit(id) {
    $.ajax({
        type: "Get",
        url: "/GlFinancialPeriod/CheckIsUsed?id=" + id,
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response) {
                swal({
                    title: Resources.UesdFinancialPeriodResource,
                    confirmButtonText: Resources.CancelResource,
                    type: "error"
                });
            } else {
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
                            url: "/GlFinancialPeriod/RemoveGlFinancialPeriod?id=" + id,
                            type: "Get",
                            contentType: 'application/json; charset=utf-8',
                            success: function (result) {

                                if (result) {
                                    swal({
                                        title: Resources.DeleteSuccessResource,
                                        confirmButtonText: Resources.DoneResource,
                                        type: "success"
                                    }, function () {
                                        window.location.href = '/GlFinancialPeriod/Index'
                                    });
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

        }
    });

}

$("#submitFinancialPeriod").on('click', function () {
    debugger
    var isOpen = $("input[name='isOpen']:checked").val();
    if ($("#financialPeriodForm").valid()) {
        if (isOpen == "True") {
            $.ajax({
                url: "/GlFinancialPeriod/CheckIsOpen/",
                type: "post",
                contentType: 'application/json',

                success: function (result) {

                    if (result)
                        $("#financialPeriodForm").submit();
                    else
                        $('#confirmModal').modal('toggle');

                },
            });
        }
        else
            $("#financialPeriodForm").submit();
    }

});


$("#submitFinancialPeriodEdit").on('click', function () {

    if ($("#financialPeriodEditForm").valid()) {
        var id = $("#hiddenId").val();
        var isOpen = $("input[name='isOpen']:checked").val();
        if (isOpen == "True") {
            $.ajax({
                url: "/GlFinancialPeriod/CheckIsOpen?id=" + id,
                type: "post",
                contentType: 'application/json',

                success: function (result) {
                    
                    if (result) {
                        $("#financialPeriodEditForm").submit();
                    }
                    else
                        $('#confirmModal').modal('toggle');

                },
            });
        }
        else
            $("#financialPeriodEditForm").submit();


    }

});


$("#btnClose").on('click', function () {

    $("#continueOption").val("CloseAll");
    if ($("#hiddenId").val() == "0")
        $("#financialPeriodForm").submit();
    else
        $("#financialPeriodEditForm").submit();
});

$("#btnContinue").on('click', function () {

    $("#continueOption").val("Continue");
    if ($("#hiddenId").val() == "0")
        $("#financialPeriodForm").submit();
    else
        $("#financialPeriodEditForm").submit();

});