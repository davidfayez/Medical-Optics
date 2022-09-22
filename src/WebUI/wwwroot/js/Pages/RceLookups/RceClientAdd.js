$(document).ready(function () {
    // kendoDropDownTree for Cb Cash And Bank Account

    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/RceLookups/GetAllAccountsForDDLTree",
                Type: "GET",

            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                        subAccType: 7 //عميل
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

        GetNextSubAccountCode();

    }

    function GetNextSubAccountCode() {
        //Get Next  SubAccount Code
        //Client SubAccount  type = 6
        if ($('#FK_GlAccountParentId').val() > 0) {
            $.ajax({
                type: "POST",
                url: "/GlAccount/GetNextSubAccountCode?parentId=" + $('#FK_GlAccountParentId').val() + "&subTypeId=" + 7 + "&defBranchId=" + $('#FK_DefBranchId').val(),
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (result) {

                    if (result != null) {
                        $("#ClientCode").val(result);
                    } else {

                    }

                }
            });
        }

    }

    $('#DefBranches').change(function () {


        $("#FK_GlAccountParentId").data("kendoDropDownTree").value("");
        $("#FK_GlAccountParentId").data("kendoDropDownTree").dataSource.read();

        $("#FK_CbBankId").data("kendoDropDownList").value("0");
        $("#FK_CbBankId").data("kendoDropDownList").dataSource.read();

        $("#FK_DefCurrencyId").data("kendoDropDownList").value("0");
        $("#FK_DefCurrencyId").data("kendoDropDownList").dataSource.read();

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

        $("#FK_BrokerAccountId").data("kendoDropDownList").value("0");
        $("#FK_BrokerAccountId").data("kendoDropDownList").dataSource.read();


        $("#FK_CbCashAndBankAccountId").data("kendoDropDownList").value("0");
        $("#FK_CbCashAndBankAccountId").data("kendoDropDownList").dataSource.read();


        $("#FK_CbCashAndBankAccountDefaultId").data("kendoDropDownList").value("0");
        $("#FK_CbCashAndBankAccountDefaultId").data("kendoDropDownList").dataSource.read();


        $("#FK_RceClientType").data("kendoDropDownList").value("0");
        $("#FK_RceClientType").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientClassId").data("kendoDropDownList").value("0");
        $("#FK_RceClientClassId").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientCategoryId").data("kendoDropDownList").value("0");
        $("#FK_RceClientCategoryId").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientGroupId").data("kendoDropDownList").value("0");
        $("#FK_RceClientGroupId").data("kendoDropDownList").dataSource.read();

        $("#ClientCode").val("");
    });

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
        }
    });




    $("#FK_RceClientCategoryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientCategoryForDDList",
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
        $("#FK_RceClientGroupId").data("kendoDropDownList").dataSource.read({ categoryId: e.dataItem.id });
    }
    $("#FK_RceClientGroupId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientGroupByCategoryForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            categoryId: data.categoryId
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectGroup
    });
    function onSelectGroup(e) {
        $("#FK_RceClientClassId").data("kendoDropDownList").dataSource.read({ groupId: e.dataItem.id });
    }
    $("#FK_RceClientClassId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientClassByGroupForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            groupId: parseInt(data.groupId)
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectClass
    });
    function onSelectClass(e) {
        $("#FK_RceClientType").data("kendoDropDownList").dataSource.read({ classId: e.dataItem.id });
    }

    $("#FK_RceClientType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientTypeByClassForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            classId: data.classId
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });
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
        }
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
        }
    });
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


    $("#btnSave").click(function (e) {
        debugger;


        if ($("#FK_GlAccountParentId").val() > 0)
            $("#glAccountvalidation").hide();
        else
            $("#glAccountvalidation").show();

        if ($("#FK_RceClientType").val() == 0)
            $("#FK_RceClientType").val(null);

        if ($("#FK_RceClientClassId").val() == 0)
            $("#FK_RceClientClassId").val(null)
        //if ($("#FK_RceClientType").val() > 0)
        //    $("#FK_RceClientTypeIdValid").text("")
        //else
        //    $("#FK_RceClientTypeIdValid").text(Resources.Required)
        //if ($("#FK_RceClientClassId").val() > 0)
        //    $("#FK_RceClientClassIdValid").text("")
        //else
        //    $("#FK_RceClientClassIdValid").text(Resources.Required)
        if ($("#FK_RceClientCategoryId").val() > 0)
            $("#FK_RceClientCategoryIdValid").text("")
        else
            $("#FK_RceClientCategoryIdValid").text(Resources.Required)

        if ($("#FK_RceClientGroupId").val() > 0)
            $("#FK_RceClientGroupIdValid").text("")
        else
            $("#FK_RceClientGroupIdValid").text(Resources.Required)

        if ($("#FK_RepresentativeId").val() > 0)
            $("#FK_RepresentativeIdValid").text("")
        else
            $("#FK_RepresentativeIdValid").text(Resources.Required)

        if ($("#FK_DefCurrencyId").val() > 0)
            $("#FK_DefCurrencyIdValid").text("")
        else
            $("#FK_DefCurrencyIdValid").text(Resources.Required)

        //if ($("#FK_PaymentConditionId").val() > 0)
        //    $("#FK_PaymentConditionIdValid").text("")
        //else
        //    $("#FK_PaymentConditionIdValid").text(Resources.Required)

        //if ($("#FK_CbCashAndBankAccountId").val() > 0)
        //    $("#FK_CbCashAndBankAccountIdValid").text("")
        //else
        //    $("#FK_CbCashAndBankAccountIdValid").text(Resources.Required)

        //if ($("#FK_CbCashAndBankAccountDefaultId").val() > 0)
        //    $("#FK_CbCashAndBankAccountDefaultIdValid").text("")
        //else
        //    $("#FK_CbCashAndBankAccountDefaultIdValid").text(Resources.Required)

        if ($("#mainForm").valid() && $("#FK_GlAccountParentId").val() > 0 && $("#FK_DefCurrencyId").val() > 0 && $("#FK_RepresentativeId").val() > 0 && $("#FK_RceClientCategoryId").val() > 0 && $("#FK_RceClientGroupId").val() > 0)
            $("#mainForm").submit();
        else
            e.preventDefault();


    });

});