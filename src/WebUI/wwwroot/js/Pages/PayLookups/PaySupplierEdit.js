$(document).ready(function () {
    $('#DefBranches').change(function () {
         
        $("#FK_CbBankId").data("kendoDropDownList").value("0");
        $("#FK_CbBankId").data("kendoDropDownList").dataSource.read();

        $("#FK_DefCurrencyId").data("kendoDropDownList").value("0");
        $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierClassId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierCategoryId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierCategoryId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierGroupId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierGroupId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierType").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read();

        $("#FK_RepresentativeId").data("kendoDropDownList").value("0");
        $("#FK_RepresentativeId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaymentConditionId").data("kendoDropDownList").value("0");
        $("#FK_PaymentConditionId").data("kendoDropDownList").dataSource.read();

        $("#FK_TaxesId").data("kendoDropDownList").value("0");
        $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();

        $("#FK_CbDiscountTypeId").data("kendoDropDownList").value("0");
        $("#FK_CbDiscountTypeId").data("kendoDropDownList").dataSource.read();

        $("#FK_PayDeliveryConditionId").data("kendoDropDownList").value("0");
        $("#FK_PayDeliveryConditionId").data("kendoDropDownList").dataSource.read();

        //$("#FK_GlAccountId").val(0);
        //$("#FK_GlAccountId").data("kendoDropDownList").value("0");
        //$("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();
        $("#FK_GlAccountParentId").data("kendoDropDownTree").value("");
        $("#FK_GlAccountParentId").data("kendoDropDownTree").dataSource.read();

        $("#FK_BrokerAccountId").val(0);
        $("#FK_BrokerAccountId").data("kendoDropDownList").value("0");
        $("#FK_BrokerAccountId").data("kendoDropDownList").dataSource.read();

        $("#FK_CbCashAndBankAccountId").val(0);
        $("#FK_CbCashAndBankAccountId").data("kendoDropDownList").value("0");
        $("#FK_CbCashAndBankAccountId").data("kendoDropDownList").dataSource.read();

        $("#FK_CbCashAndBankAccountDefaultId").val(0);
        $("#FK_CbCashAndBankAccountDefaultId").data("kendoDropDownList").value("0");
        $("#FK_CbCashAndBankAccountDefaultId").data("kendoDropDownList").dataSource.read();
    });
    // kendoDropDownTree for Cb Cash And Bank Account
    editFirstLoad = true;
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/PayLookups/GetAllAccountsForDDLTree",
                Type: "GET",

            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                        subAccType: 6 //مورد
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

    function GetNextSubAccountCode() {
        //Get Next  SubAccount Code
        //Supplier SubAccount  type = 6
        if ($('#FK_GlAccountParentId').val() > 0) {
            $.ajax({
                type: "POST",
                url: "/GlAccount/GetNextSubAccountCode?parentId=" + $('#FK_GlAccountParentId').val() + "&subTypeId=" + 6 + "&defBranchId=" + $('#FK_DefBranchId').val(),
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (result) {

                    if (result != null) {
                        $("#SupplierCode").val(result);
                    } else {

                    }

                }
            });
        }

    }


    $("#FK_CbBankId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbBank/GetAllBanksForDDList",
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

    $("#FK_DefCurrencyId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
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

    $("#FK_PaySupplierCategoryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllSupplierCategoryForDDList",
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
        select: onSelectCategory
    });


    function onSelectCategory(e) {

        $("#FK_PaySupplierGroupId").data("kendoDropDownList").dataSource.read({ categoryId: e.dataItem.id });
        $("#FK_PaySupplierGroupId").data("kendoDropDownList").value("0");

        $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.read();
        $("#FK_PaySupplierClassId").data("kendoDropDownList").value("0");

        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read();
        $("#FK_PaySupplierType").data("kendoDropDownList").value("0");

    }

    $("#FK_PaySupplierGroupId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllSupplierGroupByCategoryForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.categoryId != undefined) {
                            return {
                                categoryId: data.categoryId,
                                fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                categoryId: $("#FK_PaySupplierCategoryId").val(),
                                fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }


                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectGroup
    });

    function onSelectGroup(e) {
        $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.read({ groupId: e.dataItem.id });
        $("#FK_PaySupplierClassId").data("kendoDropDownList").value("0");

        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read();
        $("#FK_PaySupplierType").data("kendoDropDownList").value("0");

    }


    $("#FK_PaySupplierClassId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllSupplierClassByGroupForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {

                        if (Object.keys(data).length > 0 && data.groupId != undefined) {
                            return {
                                groupId: data.groupId,
                                fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                groupId: $("#FK_PaySupplierGroupId").val(),
                                fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectClass
    });

    function onSelectClass(e) {
        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read({ classId: e.dataItem.id });
        $("#FK_PaySupplierType").data("kendoDropDownList").value("0");
    }


    $("#FK_PaySupplierType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllSupplierTypeByClassForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {

                        if (Object.keys(data).length > 0 && data.classId != undefined) {
                            return {
                                classId: data.classId,
                                fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                classId: $("#FK_PaySupplierClassId").val(),
                                fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        // select: onSelectType
    });
    //function onSelectType(e) {
    //    $("#FK_PaySupplierType").val(e.dataItem.id);
    //}



    $("#FK_RepresentativeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeeForDDList",
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

    $("#FK_PaymentConditionId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllPaymentConditionForDDList",
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

    $("#FK_TaxesId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Taxes/GetAllTaxesForDDList",
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
        select: onSelectTax

    });
    function onSelectTax(e) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var accId = e.dataItem.fK_GlAccountId;
        debugger;
        if (accId > 0) {

            $.ajax({
                type: "POST",
                url: "/Taxes/IsInDateRange?id=" + e.dataItem.id + "&today=" + date,
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (response) {
                    debugger;
                    if (response) {

                        $('#FK_GlAccountForTaxId').data("kendoDropDownTree").value(accId);
                        $("#TaxAmount").val((e.dataItem.amount).toString());

                    } else {
                        swal({
                            title: Resources.TaxTypeOutofDateRange,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });

                        $('#FK_TaxesId').data("kendoDropDownList").value(0);
                        $('#FK_GlAccountForTaxId').data("kendoDropDownTree").value(0);
                        $("#TaxAmount").val(0);



                    }
                }
            });

        }

    }
    $("#FK_CbDiscountTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbDiscountType/GetAllDiscountTypeForDDList",
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

    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET"
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });

    $("#FK_GlAccountForDiscountId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
        //change: onChangeDdlTree
    });
    taxdataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET"
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });
    $("#FK_GlAccountForTaxId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: taxdataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
        //change: onChangeDdlTree
    });

    $("#FK_PayDeliveryConditionId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllDeliveryConditionForDDList",
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

    disableFreezing();
    $("#rdActive").change(function () {
        disableFreezing();
    })
    $("#rdInactive").click(function () {
        disableFreezing();
    })
    function disableFreezing() {
        var state = $("input[name='IsActive']:checked").val();
        if (state == "True") {
            $("#FK_DefFreezingReasonId").attr("disabled", "disabled");
            $("#FreezingNotes").attr("disabled", "disabled");
            $("#frezzingReasonBtn").attr("disabled", "disabled");

        } else {
            $("#FK_DefFreezingReasonId").removeAttr("disabled");
            $("#FreezingNotes").removeAttr("disabled");
            $("#frezzingReasonBtn").removeAttr("disabled");

        }
    }


    

    //CashAndBank autocompleate
    $("#FK_CbCashAndBankAccountId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",
                },
                parameterMap: function (data, action) {
                    debugger
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
        select: onCashAndBankSelect
    });
    function onCashAndBankSelect(e) {
        $("#FK_CbCashAndBankAccountId").val(e.dataItem.id);
        // $("#CbCashAndBankAccountName").val(e.dataItem.accountNameAr);

    }


    //Default CashAndBank autocompleate
    $("#FK_CbCashAndBankAccountDefaultId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",
                },
                parameterMap: function (data, action) {
                    debugger
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
        select: onCashAndBankDefaultSelect
    });
    function onCashAndBankDefaultSelect(e) {
        $("#FK_CbCashAndBankAccountDefaultId").val(e.dataItem.id);
        // $("#CbCashAndBankDefaultAccountName").val(e.dataItem.accountNameAr);

    }

    //Account
    //$("#FK_GlAccountId").kendoDropDownList({
    //    filter: "contains",
    //    height: 300,
    //    dataTextField: "codeAndName",
    //    dataValueField: "id",
    //    dataSource: {
    //        type: "json",
    //        //serverFiltering: true,
    //        transport: {
    //            read: {
    //                url: "/GlAccount/GetAllAccountsForDDList",
    //            },
    //            parameterMap: function (data, action) {
    //                debugger
    //                if (action === "read") {
    //                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
    //                        return {
    //                            code: data.filter.filters[0].value,
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    } else {
    //                        return {
    //                            code: "",
    //                            defBranchId: parseInt($("#FK_DefBranchId").val()),
    //                        };
    //                    }

    //                } else {
    //                    return data;
    //                }
    //            }
    //        }
    //    },
    //    select: onSelectAccount
    //});
    //function onSelectAccount(e) {

    //    $("#FK_GlAccountId").val(e.dataItem.id);
    //    $("#GlAccountName").val(e.dataItem.accountNameAr);
    //}

    //BrokerAccount
    $("#FK_BrokerAccountId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/GlAccount/GetAllAccountsForDDList",
                },
                parameterMap: function (data, action) {
                    debugger
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
        select: onBrokerAccountSelect
    });
    function onBrokerAccountSelect(e) {

        $("#FK_BrokerAccountId").val(e.dataItem.id);
        //   $("#BrokerAccountName").val(e.dataItem.accountNameAr);

    }

    $("#btnEdit").click(function () {
        if ($("#FK_PaySupplierGroupId").val() != "0")
            $("#FK_PaySupplierGroupIdValid").text("")
        else
            $("#FK_PaySupplierGroupIdValid").text(Resources.Required)

        if ($("#FK_PaySupplierCategoryId").val() > 0)
            $("#FK_PaySupplierCategoryIdValid").text("")
        else
            $("#FK_PaySupplierCategoryIdValid").text(Resources.Required)

        if ($("#FK_RepresentativeId").val() > 0)
            $("#FK_RepresentativeIdValid").text("")
        else
            $("#FK_RepresentativeIdValid").text(Resources.Required)

        if ($("#FK_DefCurrencyId").val() > 0)
            $("#FK_DefCurrencyIdValid").text("")
        else
            $("#FK_DefCurrencyIdValid").text(Resources.Required)

        if ($("#FK_GlAccountParentId").val() > 0)
            $("#glAccountvalidation").hide();
        else
            $("#glAccountvalidation").show();

        //if ($("#FK_PaymentConditionId").val() > 0)
        //    $("#FK_PaymentConditionIdValid").text("")
        //else
        //    $("#FK_PaymentConditionIdValid").text(Resources.Required)
        //
        //if ($("#FK_CbCashAndBankAccountId").val() > 0)
        //    $("#FK_CbCashAndBankAccountIdValid").text("")
        //else
        //    $("#FK_CbCashAndBankAccountIdValid").text(Resources.Required)

        if ($("#mainFormEdit").valid() && $("#FK_PaySupplierGroupId").val() != "0" && $("#FK_PaySupplierCategoryId").val() > 0 && $("#FK_RepresentativeId").val() > 0 && $("#FK_DefCurrencyId").val() > 0 && $("#FK_GlAccountParentId").val() > 0 )
            $("#mainFormEdit").submit();
        else
            e.preventDefault();


    });


});


function removePaySupplier(id) {


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
                url: "/PayLookups/DeletePaySupplier?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        loadPaySupplierGrid();
                        //grid.refresh();
                        //grid.dataSource.filter(filters);
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
                },
                error: function (err, xqr, txt) { }
            });

        }, 3000);
    });
}


