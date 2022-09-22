$(document).ready(function () {

    $("#ckbCheckAll").click(function () {
        $(".custom-control-input:not(#showAllUsers)").prop('checked', $(this).prop('checked'));
    });
       
    $("#showAllUsers").click(function () {
        var checked = $(this).prop('checked');

        $('.custom-control-input:not(#showAllUsers)').each(function () {
            $(this).prop('checked', false);
        });

        if (checked == true) {
            $("#usersList").data("kendoDropDownList").value("");
            $("#usersList").data("kendoDropDownList").dataSource.read({ fK_DefBranchId: null });
        }
        else {
            var branchId = $("#branchesList").val();
            if (branchId == null || branchId == "")
                branchId = $("#FK_DefBranchId").val();
            $("#usersList").data("kendoDropDownList").dataSource.read({ fK_DefBranchId: parseInt(branchId) });

        }
        debugger;
    });

    $("body").delegate(".custom-control-input", "click", function () {

        debugger;
        //uncheck "select all", if one of the listed checkbox item is unchecked
        if (false == $(this).prop("checked")) { //if this item is unchecked
            $("#ckbCheckAll").prop('checked', false); //change "select all" checked status to false
        }
        //check "select all" if all checkbox items are checked
        if ($('.custom-control-input:checked').length == ($('.custom-control-input').length - 1)) {
            $("#ckbCheckAll").prop('checked', true);
        }
    });

    $("#branchesList").kendoDropDownList({
        filter: "contains",
        //optionLabel: Resources.ChoseBranch,
        dataTextField: "branchNameAr",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    url: "/Role/GetAllBranches",
                }
            }
        },
        select: onSelectBranch
    });
    function onSelectBranch(e) {

        $("#usersList").data("kendoDropDownList").value("");
        $("#usersList").data("kendoDropDownList").dataSource.read({ fK_DefBranchId: e.dataItem.id });
    }

    $("#branchesList").data("kendoDropDownList").value($("#FK_DefBranchId").val());


    $("#usersList").kendoDropDownList({
        filter: "contains",
        optionLabel: Resources.ChoseUser,
        dataTextField: "employeeName",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    url: "/Role/GetAllUsersByBranchId",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt(data.fK_DefBranchId),
                        };


                    } else {
                        return data;
                    }
                }
            }
        }
    });
    $("#usersList").data("kendoDropDownList").dataSource.read({ fK_DefBranchId: parseInt($("#FK_DefBranchId").val()) });



    $("#modulesList").kendoDropDownList({
        filter: "contains",
        optionLabel: Resources.ChoseModule,
        dataTextField: "moduleNameAr",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    url: "/Role/GetAllSecModules",
                }
            }
        }
    });

    $("#usersList").on('change', function () {
        var branchId = $("#branchesList").val();
        if (branchId == null || branchId == "")
            branchId = $("#FK_DefBranchId").val();
        
        $("#ckbCheckAll").prop('checked', false);
        $('input[type=checkbox]').each(function () {
            $(this).prop('checked', false);
        });
        $.ajax({
            url: "/Role/GetRolesByUserId?userId=" + $("#usersList").val() + "&&branchId=" + branchId,
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {

                $('input[type=checkbox]').each(function () {
                    for (var i = 0; i < data.length; i++) {
                        if ($(this).attr('id') == data[i]) {
                            $(this).prop('checked', true);
                        }
                    }

                });

            }
        });
    });

    $("#branchesList").on('change', function () {

        debugger;
        $("#ckbCheckAll").prop('checked', false);
        $('input[type=checkbox]').each(function () {
            $(this).prop('checked', false);
        });
        $.ajax({
            url: "/Role/GetRolesByUserId?userId=" + $("#usersList").val() + "&&branchId=" + $("#branchesList").val(),
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                $('input[type=checkbox]').each(function () {
                    for (var i = 0; i < data.length; i++) {
                        if ($(this).attr('id') == data[i]) {
                            $(this).prop('checked', true);
                        }
                    }

                });
                console.log(data);
            }
        });
    });

    $("#modulesList").on('change', function () {
        $("#ckbCheckAll").prop('checked', false);

        $.ajax({
            url: "/Role/GetRolesByModuleId?moduleId=" + $("#modulesList").val(),
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {
                $('#roles').empty();
                var userId = $("#usersList").val();
                var branchId = $("#branchesList").val();
                var d = data;
                for (var i = 0; i < data.length; i++) {
                    $('#roles').append('<div class="col-xl-4 col-lg-4 "> <div class="custom-control custom-checkbox my-1 mr-sm-2"><input type="checkbox" id="' + data[i].name + '" class="custom-control-input" formtarget="' + data[i].fK_SecModuleId + '" /><label name="' + data[i].name + '" for="' + data[i].name + '" class="custom-control-label">' + data[i].nameAr + '</label></div></div>');
                }
                if (userId != null && branchId != null) {
                    $('input[type=checkbox]').each(function () {
                        $(this).prop('checked', false);
                    });
                    $.ajax({
                        url: "/Role/GetRolesByUserId?userId=" + $("#usersList").val() + "&&branchId=" + $("#branchesList").val(),
                        type: "Get",
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            $('input[type=checkbox]').each(function () {
                                for (var i = 0; i < data.length; i++) {
                                    if ($(this).attr('id') == data[i]) {
                                        $(this).prop('checked', true);
                                    }
                                }

                            });
                            console.log(data);
                        }
                    });
                }
            }
        });
    });
});

function AsignRole() {
    var UserListId = $("#usersList").val();
    var BranchId = $("#branchesList").val();
    var ModuleId = $("#modulesList").val();
    var RoleList = [];
    
    $('input[type=checkbox]').each(function () {
        
        if ($(this).is(':checked') && String($(this).attr('id')) != "ckbCheckAll" && String($(this).attr('id')) != "showAllUsers") {
            var FK_SecModuleId = parseInt($(this).attr('formtarget'));
            if (isNaN(FK_SecModuleId))
                FK_SecModuleId = null;
            var data = {
                Id: "",
                Name: String($(this).attr('id')),
                NameAr: "",
                FK_SecModuleId: FK_SecModuleId
            }
            RoleList.push(data);
        }
    });

    if (/*RoleList.length == 0 ||*/ UserListId == "") {

        swal({
            title: Resources.UserOrRoleNotExistResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () { });
    }
    else if (BranchId == null) {
        swal({
            title: Resources.CompanyBranchNotExistResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () { });
    }
    else {
        var UserList = {
            Id: String(UserListId)
        }
        var Obj = {

            UserListId: UserList,
            RoleListId: RoleList,
            branchId: BranchId,
            ModuleId: ModuleId
        };
        debugger;
        $.ajax({
            url: "/Role/AsignRole",
            type: "Post",
            data: JSON.stringify(Obj),
            contentType: 'application/json',
            success: function (result) {
                if (result) {

                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    }, function () {

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
        });
    }
    console.log(UserList);
    console.log(RoleList);

}