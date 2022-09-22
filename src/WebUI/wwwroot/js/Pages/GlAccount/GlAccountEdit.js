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

    editFirstLoad = true;
    //Active In Edit
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == "False") {
        $(".disabled-input").removeAttr('disabled');
    }
    //if (!$('#isActive').is(':checked'))
    //    $(".isActive").removeAttr('disabled');

    var isCostCenterSupport = document.getElementById("IsCostCenterSupport").checked; //$('#IsCostCenterSupport').val();
    /*    console.log(isCostCenterSupport);*/
    if (isCostCenterSupport) {
        $(".disabled-input-cost").removeAttr('disabled');
    }
    else {
        $(".disabled-input-cost").attr("disabled", "disabled");
    }
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
                        code: $("#costCenterAutoCompleteEdit").text()
                        //code: data.filter.filters[0].value
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
    $("#costCenterAutoCompleteEdit").kendoAutoComplete({

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
                Type: "GET"
            },

            parameterMap: function (data, action) {

                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val())
                    };
                } else {
                    return data;
                }
            }
        },
        requestEnd: function (response) {
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
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
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
        dataBound: function (e) {
            if (firstRequest == true) {

                $("#iRefreshGLAccount").addClass("fa-spin");
                $("#FK_ParentId").data("kendoDropDownTree").enable(false);
                $("#btnSubmitEdit").attr("disabled", "disabled");
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
                    $("#btnSubmitEdit").removeAttr('disabled');
                    $("#iRefreshGLAccount").removeClass("fa-spin");
                }
            }

        },
        select: onSelectDdlTree
        //change: onChangeDdlTree
    });
    function onChangeDdlTree() {
        debugger
        if (!editFirstLoad) {
            parentAccountChange();
            GetNextSubAccountCode();
        }
        editFirstLoad = false;
    }
    function onSelectDdlTree(e) {
        debugger
        var dropdowntree = $("#FK_ParentId").data("kendoDropDownTree");
        var item = dropdowntree.dataItem(e.node);
        parentAccountChange();
        GetNextSubAccountCode(item.id);



        var currentAccId = parseInt($("#Id").val());
        if (currentAccId == item.id) {

            dropdowntree.close();
            swal({
                title: Resources.CantChooseThisAccount,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {
                $("#FK_ParentId").data("kendoDropDownTree").value("");
            });
        } else {
            $.ajax({
                type: "POST",
                url: "/GlAccount/CheckAccountHasTransactions?id=" + item.id,
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (result) {

                    var fK_ParentId = $("#FK_ParentId").val();
                    var prevFK_ParentId = $("#prevFK_ParentId").val();
                    if (result) {

                        swal({
                            title: Resources.CantChooseAccountHasTransactions,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                        $("#FK_ParentId").data("kendoDropDownTree").value(prevFK_ParentId);
                    }

                }
            });
        }
    }

    // Multi Select categories
    var multiCategories = $("#multiCategoriesEdit").kendoMultiSelect({
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

    multiCategories.data("kendoMultiSelect").value(catIds);

    // Multi Select categories
    var costCenters = $("#CostCentersEdit").kendoMultiSelect({
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

    costCenters.data("kendoMultiSelect").value(ccIds);

    if (ccIds.length > 0) {
        $("#CostCentersEdit").data("kendoMultiSelect").enable(true);
        $("#IsCostCenterSupport").attr("checked", true);
    }


});

function GetNextSubAccountCode(parentId) {
    //Get Next SubAccount Code
   // if ($('#FK_ParentId').val() > 0) {
    if (parentId > 0) {
        $.ajax({
            type: "POST",
            url: "/GlAccount/GetNextSubAccountCode?parentId=" + parentId + "&subTypeId=" + null + "&defBranchId=" + $('#FK_DefBranchId').val(),
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

$("#btnSubmitEdit").on('click', function () {
    $(this).attr("disabled", "disabled");
    var categories = $("#multiCategoriesEdit").data("kendoMultiSelect").dataItems();

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
        $("#categoriesValidationEdit").show();
    else
        $("#categoriesValidationEdit").hide();


    if ($("#formGlAccountEdit").valid() && categories.length > 0 && $("#FK_GlAccountTypeId").val() > 0 && $("#FK_DefCurrencyId").val() > 0) {
        if (($("#IsCostCenterSupport").prop("checked") == true && $("#CostCentersEdit").val().length > 0) || $("#IsCostCenterSupport").prop("checked") == false) {

            $.ajax({
                type: "POST",
                url: "/GlAccount/CheckAccountHasTransactions?id=" + $('#Id').val(),
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (result) {

                    var fK_ParentId = $("#FK_ParentId").val();
                    var prevFK_ParentId = $("#prevFK_ParentId").val();
                    var prevIsMainAccount = $("#prevIsMainAccount").val();
                    var currentIsMainAccount = $("input[name='IsMainAccount']:checked").val();
                    debugger
                    if ((prevIsMainAccount == "False" && currentIsMainAccount == "True" && result) || (prevFK_ParentId > 0 && fK_ParentId == "" && result)) {

                        swal({
                            title: Resources.AccountHasTransactionsErrorMsg,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });

                        $("#IsMainAccount1").prop('checked', true);
                        $("#FK_ParentId").data("kendoDropDownTree").value(prevFK_ParentId);
                        $("#btnSubmitEdit").removeAttr('disabled');
                    }
                    else {
                        $("#formGlAccountEdit").submit();
                    }

                }
            });



        }
        else {
            $("#CostCentersValid").text(Resources.Required);
            $(this).removeAttr('disabled');
        }
    } else {
        $(this).removeAttr('disabled');
    }

});