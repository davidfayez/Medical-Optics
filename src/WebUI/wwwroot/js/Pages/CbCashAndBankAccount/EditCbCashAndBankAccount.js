
$(document).ready(function () {
    $('#DefBranches,input[type=radio][name=AccountType]').change(function () {

        $("#FK_GlAccountParentId").data("kendoDropDownTree").value("");
        $("#FK_GlAccountParentId").data("kendoDropDownTree").dataSource.read();

        $("#FK_CashierId").data("kendoDropDownList").dataSource.read();
        $("#FK_CashierId").data("kendoDropDownList").value(0);

        $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();
        $("#FK_DefCurrencyId").data("kendoDropDownList").value(0);
    });

    // kendoDropDownTree for Cb Cash And Bank Account
    editFirstLoad = true;
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/CbCashAndBankAccount/GetAllAccountsForDDLTree",
                Type: "GET",

            },
            parameterMap: function (data, action) {
                subAccTypeId = $('input[name="AccountType"]:checked').val();

                if (subAccTypeId == 1)
                    subAccTypeId = 2;//صندوق
                else if (subAccTypeId == 2)
                    subAccTypeId = 3;//بنك
                else if (subAccTypeId == 3)
                    subAccTypeId = 4;//بطاقه ائتمان
                else if (subAccTypeId == 4)
                    subAccTypeId = 5;//تسوية

                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                        subAccType: subAccTypeId
                    };
                } else {
                    return data;
                }
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });

    $("#FK_GlAccountParentId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
        change: onChangeDdlTree
    });
    function onChangeDdlTree() {

        if (!editFirstLoad) {
            GetNextSubAccountCode();
        }
        editFirstLoad = false;

    }



    $("#FK_CashierId").kendoDropDownList({
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
        },
    });

    $("#FK_DefCurrencyId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",

        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/DefCurrency/GetAllCurrenciesForDDList",
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
    });
    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {

        if (this.value == "True") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingNotes").val("");
            $("#frezzingReasonBtn").attr("disabled", "disabled");

        }
        else {
            $("#frezzingReasonBtn").removeAttr("disabled");
            $(".disabled-input").removeAttr('disabled');

        }
    });

    //Active In Edit
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == undefined) {
        $(".disabled-input").removeAttr('disabled');
        $("#frezzingReasonBtn").removeAttr("disabled");

    }

    //Account Type
    var selectedVal = $('input[name="AccountType"]:checked').val();
    $("#FK_CbAccountTypeId").val(selectedVal);

    if (selectedVal == 3) {
        $("#Bank").hide();
        $("#CbCreditMachine").show();
    }
    else if (selectedVal == 2) {
        $("#CbCreditMachine").hide();
        $("#Bank").show();
    }
    else {
        $("#CbCreditMachine").hide();
        $("#Bank").hide();
    }


    $('input[type=radio][name=AccountType]').change(function () {
        if (this.value == 3) {
            $("#FK_CbAccountTypeId").val(this.value);
            $("#CbCreditMachine").show();
            $("#Bank").hide();
        }
        else if (this.value == 2) {
            $("#FK_CbAccountTypeId").val(this.value);
            $("#CbCreditMachine").hide();
            $("#Bank").show();
        }
        else {

            $("#FK_CbAccountTypeId").val(this.value);
            $("#CbCreditMachine").hide();
            $("#Bank").hide();
        }
    });


    $("#btnSubmit").on('click', function () {
        debugger;

        if ($("#FK_GlAccountParentId").val() == 0 || $("#FK_GlAccountParentId").val() == "")
            $("#glAccountvalidation").show();
        else
            $("#glAccountvalidation").hide();

        if ($("#FK_CashierId").val() == 0 || $("#FK_CashierId").val() == "")
            $("#fK_CashierIdValidation").show();
        else
            $("#fK_CashierIdValidation").hide();

        if ($("#FK_DefCurrencyId").val() == 0 || $("#FK_DefCurrencyId").val() == "")
            $("#fK_DefCurrencyIdValidation").show();
        else
            $("#fK_DefCurrencyIdValidation").hide();
        console.log($("#mainFormCbAccount").valid(), $("#FK_GlAccountParentId").val(), $("#FK_CashierId").val(), $("#FK_DefCurrencyId").val());

        if ($("#mainFormCbAccount").valid() && $("#FK_GlAccountParentId").val() > 0 && $("#FK_CashierId").val() > 0 && $("#FK_DefCurrencyId").val() > 0) {

            var listPersons = [];
            var gridData = $('#GridResponsiblePersons').data("kendoGrid").dataSource.data();

            if (gridData.length > 0) {
                for (var i = 0; i < gridData.length; i++) {

                    var person = {
                        Id: gridData[i].id,
                        ResponsibleName: gridData[i].responsibleName,
                        Department: gridData[i].department,
                        Job: gridData[i].job,
                        Mobile: gridData[i].mobile,
                        Phone: gridData[i].phone,
                        Fax: gridData[i].fax,
                        Email: gridData[i].email,
                    };
                    listPersons.push(person);
                }
            }



            var isActive = $("input[name='IsActive']:checked").val();
            if (isActive == "True")
                isActive = true;
            else
                isActive = false;


            var Obj = {
                Id: $("#CbCashAndBankAccountId").val(),
                CbCashAndBankAccountId: $("#CbCashAndBankAccountId").val(),
                AccountCode: $("#AccountCode").val(),
                AccountNameAr: $("#AccountNameAr").val(),
                AccountNameEn: $("#AccountNameEn").val(),
                FK_CbAccountTypeId: $("#FK_CbAccountTypeId").val(),
                FK_GlAccountParentId: $("#FK_GlAccountParentId").val(),
                FK_GlAccountId: $("#FK_GlAccountId").val(),
                FK_DefCurrencyId: $("#FK_DefCurrencyId").val(),
                FK_CreatorId: $("#FK_CreatorId").val(),
                Address: $("#Address").val(),
                Website: $("#Website").val(),
                FK_CashierId: $("#FK_CashierId").val(),
                Description: $("#Description").val(),
                FK_CbCheckFormArabicId: $("#FK_CbCheckFormArabicId").val(),
                FK_CbCheckFormEnglishId: $("#FK_CbCheckFormEnglishId").val(),
                BankAccountNumber: $("#BankAccountNumber").val(),
                IBAN: $("#IBAN").val(),
                SwiftCode: $("#SwiftCode").val(),
                BranchName: $("#BranchName").val(),
                BankCode: $("#BankCode").val(),
                FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
                FreezingNotes: $("#FreezingNotes").val(),
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                IsActive: isActive,
                FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                ResponsiblePersons: listPersons,
            };

            $.ajax({
                url: '/CbCashAndBankAccount/Edit',
                type: 'POST',
                data: { addEditCbCashAndBankAccountVM: Obj },
                success: function (result) {

                    if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            setTimeout(function () {

                                document.location = "/CbCashAndBankAccount/Index"
                            }, 1000);
                        });

                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                }
            })

        }
    });




    // Grid
    LoadGridResponsiblePersons();
    function LoadGridResponsiblePersons() {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/CbCashAndBankAccount/GetAllResponsiblePersons?id=" + $("#CbCashAndBankAccountId").val(),
                    Type: "GET"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }

            },
            //autoSync: true,
            batch: true,
            //pageSize: 20,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: true },
                        responsibleName: { type: "text", editable: false },
                        department: { type: "text", editable: false },
                        job: { type: "text" },
                        mobile: { type: "text" },
                        phone: { type: "text" },
                        fax: { type: "text" },
                        email: { type: "text" },
                    }
                }
            }
        });
        var grid = $("#GridResponsiblePersons").kendoGrid({
            dataSource: tempSource,
            navigatable: false,
            pageable: false,
            columns: [

                { field: "id", hidden: true, format: "{0:c}" },
                { field: "responsibleName", title: Resources.ResponsiblePersonName, format: "{0:c}", width: Resources.NameWidth },
                { field: "department", title: Resources.HisDepartment, width: Resources.NameWidth },
                { field: "job", width: Resources.NameWidth, title: Resources.JobTitle },
                { field: "mobile", width: Resources.PhoneWidth, title: Resources.Mobile },
                { field: "phone", width: Resources.PhoneWidth, title: Resources.Phone },
                { field: "fax", width: Resources.PhoneWidth, title: Resources.Fax },
                { field: "email", width: Resources.EmailWidth, title: Resources.Email },
                { width: "80px", template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
            ],
            editable: true,
            selectable: "multiple, cell",
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },

        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removePerson);
    }


    function removePerson() {

        var row = $(this).closest("tr"),
            grid = $("#GridResponsiblePersons").data("kendoGrid"),
            dataItem = grid.dataItem(row);
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
                var dataSource = $("#GridResponsiblePersons").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });

                }
                else {
                    swal({
                        title: Resources.DeleteFailedResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }, 1000);
        });
    }
    $("#btnAddNewPerson").on('click', function () {

        var responsibleName = $("#ResponsibleName").val().trim(),
            department = $("#Department").val().trim(),
            job = $("#Job").val().trim(),
            mobile = $("#Mobile").val().trim(),
            phone = $("#Phone").val().trim(),
            fax = $("#Fax").val().trim(),
            email = $("#Email").val().trim();

        if (responsibleName == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.ResponsiblePersonName,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (department == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.HisDepartment,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (job == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.JobTitle,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            tempSource.insert(0, {
                id: 0,
                responsibleName: responsibleName,
                department: department,
                job: job,
                mobile: mobile,
                phone: phone,
                fax: fax,
                email: email,
            });

            $("#ResponsibleName").val("");
            $("#Department").val("");
            $("#Job").val("");
            $("#Mobile").val("");
            $("#Phone").val("");
            $("#Fax").val("");
            $("#Email").val("");
        }


    });

});

function onCashSelect(e) {

    var item = e.dataItem;
    $("#FK_ParentId").val(e.dataItem.id);
    $("#cashBankAccountName").val(e.dataItem.accountNameAr);


}
function onCashChange(e) {

    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                $("#FK_ParentId").val(response.id);
                $("#cashBankAccountName").val(response.accountNameAr);
            } else {
                $("#FK_ParentId").val(null);
                $("#cashBankAccountName").val("");

                swal({
                    title: Resources.AccountCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}


function ChangeIsActive(e) {
    if (e.checked === true) {
        $(".disabled-input").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#FreezingNotes").val("");
        $("#frezzingReasonBtn").attr("disabled", "disabled");

    }
    else {
        $("#frezzingReasonBtn").removeAttr("disabled");
        $(".disabled-input").removeAttr('disabled');

    }

}

function GetNextSubAccountCode() {
    //Get Next SubAccount Code

    var accountType = $('input[name="AccountType"]:checked').val();

    if (accountType == 1)
        accountType = 2;
    else if (accountType == 2)
        accountType = 3;
    else if (accountType == 3)
        accountType = 4;
    else if (accountType == 4)
        accountType = 5;

    if ($('#FK_GlAccountParentId').val() > 0) {
        $.ajax({
            type: "POST",
            url: "/GlAccount/GetNextSubAccountCode?parentId=" + $('#FK_GlAccountParentId').val() + "&subTypeId=" + accountType + "&defBranchId=" + $('#FK_DefBranchId').val(),
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (result) {

                if (result != null) {
                    $("#AccountCode").val(result);
                } else {

                }

            }
        });
    }

}




function removeAccount(id) {

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
                url: "/CbCashAndBankAccount/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/CbCashAndBankAccount/Index'
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

