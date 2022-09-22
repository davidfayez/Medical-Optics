$(document).ready(function () {
    var url = "/HrEmployee/GetEmployeeByDepartment/" + $("#FK_HrDepartmentId").val();
    // kendoDropDownTree
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

    $('#DefBranches').change(function () {

        $("#FK_CbBillCounterId").data("kendoDropDownList").value("0");
        $("#FK_CbBillCounterId").data("kendoDropDownList").dataSource.read();

        $("#FK_CostCenterId").data("kendoDropDownList").value("0");
        $("#FK_CostCenterId").data("kendoDropDownList").dataSource.read();

        $("#FK_HrDepartmentId").data("kendoDropDownList").value("0");
        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();

        $("#FK_CbCreditMachine").data("kendoDropDownList").value("0");
        $("#FK_CbCreditMachine").data("kendoDropDownList").dataSource.read();
    });

    $("#FK_CbCreditMachine").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCreditMachine/GetAllCreditMachineForDDList",
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

    $("#FK_CbBillCounterId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbBillCounter/GetAllBillCounterForDDList",
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

    $("#FK_HrDepartmentId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrDepartment/GetAllForDDList",
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
        select: onSelectDepartment

    });
    function onSelectDepartment(e) {
        url = "/HrEmployee/GetEmployeeByDepartment/" + e.dataItem.id;
        $("#FK_HrEmployeeId").kendoDropDownList({
            filter: "contains",
            height: 300,
            dataTextField: "codeAndName",
            dataValueField: "id",
            dataSource: {
                type: "json",
                //serverFiltering: true,
                transport: {
                    read: {
                        url: url,
                    },
                    parameterMap: function (data, action) {

                        if (action === "read") {
                            return {
                                //fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            };


                        } else {
                            return data;
                        }
                    }
                }
            },

        });
    }

    $("#FK_HrEmployeeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: url,
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            //fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    $("#FK_CostCenterId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",

        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllCostCentersForDDList",
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
    });
    

    $("#accountsDDLTree").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false
    });

    $("#FK_HrDepartmentId").change(function () {
        var id = $("#FK_HrDepartmentId").val();
        $.ajax({
            url: "/HrEmployee/GetEmployeeByDepartment/"+id,
            success: function (data) {
                var empData=""
                for (var i = 0; i < data.length; i++) {
                    empData+="<option value="+data[i].id+">"+data[i].fullName+"</option>"
                }
                $("#FK_HrEmployeeId").html(empData)
            }
        })
    })

    var accountCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CbCashAndBankAccount/GetAllAutoCompleteSearchByCode"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters[0].value
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

                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });

    
    $("#accountAutoComplete").kendoAutoComplete({

        dataSource: accountCodeDataSource,
        select: onSelect,
        change: onChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.AccountCodeResource + ' </span>' +
            '<span>' + Resources.AccountNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.accountCode #</span>' +
            '<span>#: data.accountNameAr #</span>',
        dataTextField: "accountCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });

    $("#btnSave").click(function () {
        debugger;
        var FK_GlAccountId = $("#accountsDDLTree").data("kendoDropDownTree").value();
        if (FK_GlAccountId == "")
            $("#GlAccountId").text(Resources.Required)
        else {
            $("#GlAccountId").text("")
            $("#FK_GlAccountId").val(parseInt(FK_GlAccountId));
        }

        if ($("#FK_CbCreditMachine").val() != "0")
            $("#FK_CbCreditMachineValid").text("")
        else
            $("#FK_CbCreditMachineValid").text(Resources.Required)

        if ($("#FK_HrDepartmentId").val() != "0")
            $("#FK_HrDepartmentIdValid").text("")
        else
            $("#FK_HrDepartmentIdValid").text(Resources.Required)

        if ($("#FK_HrEmployeeId").val() != "")
            $("#FK_HrEmployeeIdValid").text("")
        else
            $("#FK_HrEmployeeIdValid").text(Resources.Required)

        if ($("#FK_CostCenterId").val() != "0")
            $("#FK_CostCenterIdValid").text("")
        else
            $("#FK_CostCenterIdValid").text(Resources.Required)

        if ($("#FK_CbBillCounterId").val() != "0")
            $("#FK_CbBillCounterIdValid").text("")
        else
            $("#FK_CbBillCounterIdValid").text(Resources.Required)

        if ($("#mainForm").valid() && $("#FK_GlAccountId").val() != "0" && $("#FK_CbCreditMachine").val() != "0" && $("#FK_HrDepartmentId").val() != "0" && $("#FK_HrEmployeeId").val() != "0" && $("#FK_CostCenterId").val() != "0" && $("#FK_CbBillCounterId").val() != "0")
            $("#mainForm").submit();
        else
            e.preventDefault();

            
    });
});
function onSelect(e) {
    $("#FK_CbCashAndBankAccountId").val(e.dataItem.id);
}
function onChange(e) {
    debugger;
    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                console.log(response);
                $("#FK_CbCashAndBankAccountId").val(response.id);

            } else {
                $("#FK_CbCashAndBankAccountId").val(null);
                swal({
                    title: Resources.AccountCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}