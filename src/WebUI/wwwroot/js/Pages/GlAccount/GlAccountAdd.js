$().ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_ParentId").data("kendoDropDownTree").value("");
        $("#FK_ParentId").data("kendoDropDownTree").dataSource.read();


        $("#FK_GlAccountTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_GlAccountTypeId").data("kendoDropDownList").value(0);

        $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();
        $("#FK_DefCurrencyId").data("kendoDropDownList").value(0);


    });

    $("#FK_SubAccountTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/GlAccount/GetAllSubAccountTypeForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            //defBranchId: parseInt($("#FK_DefBranchId").val()),
                        };

                    } else {
                        return data;
                    }
                }
            }
        }
    });

    $("#FK_GlAccountTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/GlAccountType/GetAllAccountTypeForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val()),
                        };

                    } else {
                        return data;
                    }
                }
            }
        }
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
        }
    });

    parentAccountChange();

    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {
        if (this.value == "True") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingNote").val("");
        }
        else
            $(".disabled-input").removeAttr('disabled');
    });



    var costCenterDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CostCenter/GetAllAutoCompleteBySearch"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: $("#costCenterAutoComplete").text()
                        //  code: data.filter.filters[0].value
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

                    costCenterCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#costCenterAutoComplete").kendoAutoComplete({

        dataSource: costCenterDataSource,
        select: onSelect,
        change: onChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.CostCenterCodeResource + ' </span>' +
            '<span>' + Resources.CostCenterNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:190px">#: data.costCenterCode #</span>' +
            '<span>#: data.costCenterNameAr #</span>',
        dataTextField: "costCenterCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });

    function onSelect(e) {
        $("#CostCenterId").val(e.dataItem.id);
        $("#CostCenterName").val(e.dataItem.costCenterNameAr);
    }
    function onChange(e) {
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CostCenter/CheckCostCenterExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#CostCenterId").val(response.id);
                    $("#CostCenterName").val(response.costCenterNameAr);

                } else {
                    $("#CostCenterId").val(null);
                    $("#CostCenterName").val(null);
                    swal({
                        title: Resources.CostCenterCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    // kendoDropDownTree
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET",

            },
            requestEnd: function (response) {
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                    };
                } else {
                    return data;
                }
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren",
            }
        }
    });
    var counter = 0;
    var firstRequest = true;
    $("#FK_ParentId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        autoClose: false,
        dataBound: function (e) {
            if (firstRequest == true) {

                $("#iRefreshGLAccount").addClass("fa-spin");
                $("#FK_ParentId").data("kendoDropDownTree").enable(false);
                var ddt = e.sender;
                var dataSource = ddt.dataSource;
                var node = e.node;

                if (!node) {
                    var children = dataSource.data();

                    children.forEach(function (item, index) {
                        if (item.hasChildren) {
                            counter++;
                        }
                    });
                } else {
                    var children = ddt.treeview.dataItem(node).children.data();

                    children.forEach(function (item, index) {
                        if (item.hasChildren) {
                            counter++;
                        }
                    });

                    counter--;
                }

                if (counter === 0) {
                    // alert("Fully bound");
                    firstRequest = false;
                    $("#FK_ParentId").data("kendoDropDownTree").enable(true);
                    $("#iRefreshGLAccount").removeClass("fa-spin");
                }
            }

        },
        select: onChangeDdlTree
    });
    function onChangeDdlTree(e) {
        debugger
        if ($("#hdnRefrenceId").val() == 0) {
            parentAccountChange();
            var dropdowntreeFK_ParentId = $("#FK_ParentId").data("kendoDropDownTree");
            var item = dropdowntreeFK_ParentId.dataItem(e.node);

            GetNextSubAccountCode(item.id);
        }
        debugger
        var dropdowntreeAdd = $("#FK_ParentId").data("kendoDropDownTree");
        var item = dropdowntreeAdd.dataItem(e.node);
        $.ajax({
            type: "POST",
            url: "/GlAccount/CheckAccountHasTransactions?id=" + item.id,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (result) {
                debugger
                var fK_ParentId = $("#FK_ParentId").val();
                var prevFK_ParentId = $("#prevFK_ParentId").val();
                if (result) {

                    swal({
                        title: Resources.CantChooseAccountHasTransactions,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                    $("#FK_ParentId").data("kendoDropDownTree").value("");
                }

            }
        });

    }

    // Multi Select categories
    $("#multiCategories").kendoMultiSelect({
        placeholder: Resources.Choose,
        dataTextField: "categoryNameAr",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/GlAccountCategory/GetAllGlAccountCategory"
                }
            }
        },

    });

    // Multi Select categories
    $("#CostCenters").kendoMultiSelect({
        placeholder: Resources.Choose,
        dataTextField: "costCenterNameAr",
        dataValueField: "id",
        autoBind: false,
        enable: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllCostCenter"
                }
            }
        },

    });

});



var _validcode = false;
function validCode() {
    $("#mainForm").valid();
    var code = $("#AccountCode").val();
    if (code == "") {
        return false;
    }
    $.ajax({
        url: '/GlAccount/CodeValidate/' + code,
        success: (e) => {
            if (e == "true") {
                $("#validCode").text("");
                _validcode = true;
            } else {
                $("#validCode").text(e);
                _validcode = false;
            }
        }
    });

    return _validcode;
}

function chkIsCostCenterSupport(el) {
    if (isNaN($("#Id").val())) { //Create Page
        var multiselectCostCenters = $("#CostCenters").data("kendoMultiSelect");

        $("#CostCenters").data("kendoMultiSelect").value(null);
        //multiselectCostCenters.data("kendoMultiSelect").value(null);
        if (el.checked === true)
            multiselectCostCenters.enable(true);

        else
            multiselectCostCenters.enable(false);
    } else {//edit page

        var multiselectCostCenters = $("#CostCentersEdit").data("kendoMultiSelect");

        $("#CostCentersEdit").data("kendoMultiSelect").value(null);
        //multiselectCostCenters.data("kendoMultiSelect").value(null);
        if (el.checked === true)
            multiselectCostCenters.enable(true);

        else
            multiselectCostCenters.enable(false);
    }


}

function centerCodeIndexChanged() {
    var selectdVlaue = $('#CostCenterCode').val();
    $('#CostCenterName').val(selectdVlaue);
}

function centerNameIndexChanged() {
    var selectdVlaue = $('#CostCenterName').val();
    $('#CostCenterCode').val(selectdVlaue);
}

function parentAccountChange() {
    var accountId = $('#FK_ParentId').val();
    $.ajax({
        url: '/GlAccount/GetLevel',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("RequestVerificationToken", $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        data: { accountId: accountId },
        contentType: "application/json",
        success: function (result) {
            if (result.success == 'success') {
                $('#AccountLevel').val(result.level);
                $('#hdnAccountLevel').val(result.level)
            }
            else {
                $('#AccountLevel').val(0);
                $('#hdnAccountLevel').val(0)
            }
        }
    });



}
function GetNextSubAccountCode(parentId) {
    //Get Next SubAccount Code
    //  if ($('#FK_ParentId').val() > 0) {
    if (parentId > 0) {
        $.ajax({
            type: "POST",
            url: "/GlAccount/GetNextSubAccountCode?parentId=" + parentId + "&subTypeId=" + null + "&defBranchId=" + $('#FK_DefBranchId').val(),
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (result) {
                debugger
                if (result != null) {
                    $("#AccountCode").val(result);
                } else {

                }

            }
        });
    }

}
$("input[name='IsActive']").on('click', function () {

    if ($("input[name='IsActive']:checked").val() == "True") {
        $(".isActive").attr("disabled", "disabled");
        $(".isActive").val(null);
    }
    else {
        $(".isActive").removeAttr('disabled');
        $(".isActive").val(null);
    }

});

$("#btnSubmit").on('click', function () {
    $(this).attr("disabled", "disabled");
    var categories = $("#multiCategories").data("kendoMultiSelect").dataItems();

    //submit form if valid
    if ($("#FK_GlAccountTypeId").val() > 0)
        $("#FK_GlAccountTypeValidation").hide();
    else
        $("#FK_GlAccountTypeValidation").show();

    if ($("#FK_DefCurrencyId").val() > 0)
        $("#FK_DefCurrencyIdValidation").hide();
    else
        $("#FK_DefCurrencyIdValidation").show();

    if (categories.length == 0)
        $("#categoriesValidation").show();
    else
        $("#categoriesValidation").hide();

    $("#CostCentersValid").text("");
    if ($("#formGlAccountAdd").valid() && categories.length > 0 && $("#FK_GlAccountTypeId").val() > 0 && $("#FK_DefCurrencyId").val() > 0) {
        if (($("#IsCostCenterSupport").prop("checked") == true && $("#CostCenters").val().length > 0) || $("#IsCostCenterSupport").prop("checked") == false) {
            $("#formGlAccountAdd").submit();
            /* $(this).removeAttr('disabled');*/
        } else {
            $("#CostCentersValid").text(Resources.Required);
            $(this).removeAttr('disabled');
        }
    } else {
        $(this).removeAttr('disabled');
    }
});










