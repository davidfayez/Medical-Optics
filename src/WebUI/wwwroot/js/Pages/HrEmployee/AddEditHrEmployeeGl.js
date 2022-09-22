$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_HrBloodTypeId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrBloodTypeId").data("kendoDropDownList").value(0);

        $("#FK_NationalityId").data("kendoDropDownList").dataSource.read();
        $("#FK_NationalityId").data("kendoDropDownList").value(0);

        $("#FK_DefReligionId").data("kendoDropDownList").dataSource.read();
        $("#FK_DefReligionId").data("kendoDropDownList").value(0);

        $("#FK_SocialStatusId").data("kendoDropDownList").dataSource.read();
        $("#FK_SocialStatusId").data("kendoDropDownList").value(0);

        $("#FK_HrManagementId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrManagementId").data("kendoDropDownList").value(0);

        $("#FK_HrDepartmentId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrDepartmentId").data("kendoDropDownList").value(0);

        $("#FK_HrClinicId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrClinicId").data("kendoDropDownList").value(0);

        $("#FK_CostCenterId").data("kendoDropDownList").dataSource.read();
        $("#FK_CostCenterId").data("kendoDropDownList").value(0);

        $("#FK_DepartmentManagerId").data("kendoDropDownList").dataSource.read();
        $("#FK_DepartmentManagerId").data("kendoDropDownList").value(0);

        $("#FK_ManagingDirectorId").data("kendoDropDownList").dataSource.read();
        $("#FK_ManagingDirectorId").data("kendoDropDownList").value(0);

        $("#FK_GeneralManagerId").data("kendoDropDownList").dataSource.read();
        $("#FK_GeneralManagerId").data("kendoDropDownList").value(0);

        $("#FK_HumanResourcesManagerId").data("kendoDropDownList").dataSource.read();
        $("#FK_HumanResourcesManagerId").data("kendoDropDownList").value(0);

    });

    // ddls

    $("#FK_HrBloodTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrBloodTypeForDDList",
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
    var bloodDropDownList = $("#FK_HrBloodTypeId").data("kendoDropDownList");
    bloodDropDownList.value("12");
   

    $("#FK_NationalityId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/DefNationality/GetAllForDDList",
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

    $("#FK_DefReligionId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/DefReligion/GetAllForDDList",
                },
                
            }
        },

    });
    var religionDropDownList = $("#FK_DefReligionId").data("kendoDropDownList");
    religionDropDownList.value("1");

    $("#FK_SocialStatusId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllSocialStatusForDDList",
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

    var socialStatusDropDownList = $("#FK_SocialStatusId").data("kendoDropDownList");
    socialStatusDropDownList.value("1");

    $("#FK_HrManagementId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrManagementForDDList",
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
            // serverFiltering: true,
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

    });

    $("#FK_HrClinicId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrLookups/GetAllHrClinicForDDList",
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

    $("#FK_CostCenterId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",

        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/CostCenter/GetAllCostCentersForDDList",
                },
                parameterMap: function (data, action) {
                    debugger
                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                // code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                // code: "",
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

    $("#FK_DepartmentManagerId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllDepartmentManagersForDDList",
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
        },

    });

    $("#FK_ManagingDirectorId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllManagingDirectorsForDDList",
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
        },

    });

    $("#FK_HumanResourcesManagerId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllHumanResourcesManagersForDDList",
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
        },

    });

    $("#FK_GeneralManagerId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllGeneralManagersForDDList",
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
        },

    });

    $("#FK_DirectorGeneralId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        dataSource: {
            type: "json",
            // serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllDirectorGeneralsForDDList",
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
        },

    });
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);


    //var costCenterDataSource = new kendo.data.DataSource({

    //    serverFiltering: true,
    //    type: "json",
    //    transport: {
    //        read: {
    //            url: "/CostCenter/GetAllAutoCompleteBySearch"
    //        },
    //        parameterMap: function (data, action) {
    //            if (action === "read") {
    //                return {
    //                    code: $("#costCenterAutoComplete").val()
    //                };
    //            } else {
    //                return data;
    //            }
    //        }
    //    }
    //    ,
    //    schema: {
    //        model: {
    //            id: "id",
    //            fields: {

    //                costCenterCode: {
    //                    type: "string"
    //                }
    //            }
    //        }
    //    }
    //});
    //$("#costCenterAutoComplete").kendoAutoComplete({

    //    dataSource: costCenterDataSource,
    //    select: onSelectCostCenter,
    //    change: onChangeCostCenter,
    //    headerTemplate: '<div class="dropdown-header k-widget k-header">' +
    //        '<span style="margin-left:30px">' + Resources.CostCenterCodeResource + ' </span>' +
    //        '<span>' + Resources.CostCenterNameResource + '</span>' +

    //        '</div>',
    //    template: '<span style="margin-left:150px">#: data.costCenterCode #</span>' +
    //        '<span>#: data.costCenterNameAr #</span>',
    //    dataTextField: "costCenterCode",
    //    dataValueField: "id",
    //    filter: "contains",
    //    minLength: 1
    //});

    //function onSelectCostCenter(e) {
    //    $("#FK_CostCenterId").val(e.dataItem.id);
    //    $("#CostCenterName").val(e.dataItem.costCenterNameAr);
    //}
    //function onChangeCostCenter(e) {
    //    var code = this.value();

    //    $.ajax({
    //        type: "POST",
    //        url: "/CostCenter/CheckCostCenterExist?code=" + code,
    //        data: "name=John&location=Boston",
    //        dataType: "json",
    //        success: function (response) {

    //            if (response != null) {
    //                $("#FK_CostCenterId").val(response.id);
    //                $("#CostCenterName").val(response.costCenterNameAr);

    //            } else {
    //                $("#FK_CostCenterId").val(null);
    //                $("#CostCenterName").val(null);
    //                swal({
    //                    title: Resources.CostCenterCodeNotFoundResource,
    //                    confirmButtonText: Resources.DoneResource,
    //                    type: "error"
    //                });
    //            }

    //        }
    //    });
    //}


    ////Tax GLAccount autocompleate
    //var accountCodeDataSource = new kendo.data.DataSource({

    //    serverFiltering: true,
    //    type: "json",
    //    transport: {
    //        read: {
    //            url: "/GlAccount/GetAllAutoCompleteBySearch"
    //        },
    //        parameterMap: function (data, action) {
    //            if (action === "read") {
    //                return {
    //                    code: $("#accountCodeAutoComplete").val()
    //                };
    //            } else {
    //                return data;
    //            }
    //        }
    //    }
    //    ,
    //    schema: {
    //        model: {
    //            id: "url",
    //            fields: {
    //                id: {
    //                    type: "int"
    //                },
    //                accountCode: {
    //                    type: "string"
    //                }
    //            }
    //        }
    //    }
    //});

    //$("#accountCodeAutoComplete").kendoAutoComplete({
    //    minLength: 1,
    //    dataTextField: "accountCode",
    //    filter: "contains",
    //    headerTemplate: '<div class="dropdown-header k-widget k-header">' +
    //        '<span style="margin-left:100px">' + Resources.AccountCodeResource + ' </span>' +
    //        '<span>' + Resources.AccountNameResource + '</span>' +
    //        '</div>',
    //    template: '<span style="margin-left:130px" >#: data.accountCode #</span>' +
    //        '<span>#: data.accountNameAr #</span>',
    //    dataSource: accountCodeDataSource,
    //    select: onSelectAccount,
    //    change: onChangeAccount,
    //    height: 400
    //}).data("kendoAutoComplete");
    //function onSelectAccount(e) {

    //    $("#FK_GlAccountId").val(e.dataItem.id);
    //    $("#AccountName").val(e.dataItem.accountNameAr);

    //}
    //function onChangeAccount(e) {

    //    var code = this.value();

    //    $.ajax({
    //        type: "POST",
    //        url: "/GlAccount/CheckAccountCodeExist?code=" + code,
    //        data: "name=John&location=Boston",
    //        dataType: "json",
    //        success: function (response) {

    //            if (response != null) {
    //                $("#FK_GlAccountId").val(response.accountId);
    //                $("#AccountName").val(response.accountNameAr);
    //            } else {
    //                $("#FK_GlAccountId").val(null);
    //                $("#AccountName").val(null);
    //                swal({
    //                    title: Resources.AccountCodeNotFoundResource,
    //                    confirmButtonText: Resources.DoneResource,
    //                    type: "error"
    //                });
    //            }

    //        }
    //    });

    //}

    // Account 


    $("#accountCodeAutoComplete").kendoDropDownList({
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
        select: onSelectAccount
    });

    function onSelectAccount(e) {
        $("#FK_GlAccountId").val(e.dataItem.id);
        //    $("#AccountName").val(e.dataItem.accountNameAr);

    }


    // CostCenter 

    $("#costCenterAutoComplete").kendoDropDownList({
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
        select: onSelectCostCenter
    });

    function onSelectCostCenter(e) {
        $("#FK_CostCenterId").val(e.dataItem.id);
        //$("#CostCenterName").val(e.dataItem.costCenterNameAr);
    }

    if ($("#customControlValidation10").is(':checked')) {
        $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
        $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(true);
        $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(true);
        $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(true);
        $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(true);
    }
    else if ($("#customControlValidation11").is(':checked')) {
        $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
        $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(true);
        $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(true);
        $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(false);
        $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
    }
    else if ($("#customControlValidation30").is(':checked')) {
        $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
        $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(true);
        $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(false);
        $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(false);
        $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
    }
    else if ($("#customControlValidation31").is(':checked')) {
        $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
        $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(true);
        $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(true);
        $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(true);
        $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
    }
    else if ($("#customControlValidation32").is(':checked')) {
        $("#FK_GeneralManagerId").data("kendoDropDownList").enable(false);
        $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(false);
        $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(false);
        $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(false);
        $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
    }
    else if ($("#customControlValidation33").is(':checked')) {
        $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
        $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(false);
        $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(false);
        $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(false);
        $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
    }

    $("#addConnectingData").on('click', function () {
        debugger;
        var employeeId = $("#EmployeeId").val();
        var FK_CostCenterId = parseInt($("#FK_CostCenterId").val());
        var FK_GlAccountId = parseInt($("#FK_GlAccountId").val());


        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (isNaN(FK_CostCenterId) || FK_CostCenterId == 0) {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.CostCenterCodeResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (isNaN(FK_GlAccountId) || FK_GlAccountId == 0) {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.AccountCodeResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {

            debugger
            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                FK_CostCenterId: FK_CostCenterId,
                FK_GlAccountId: FK_GlAccountId,
            }

            $.ajax({
                url: "/HrEmployee/CreateGlAccountData",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {
                    
                    if (response != null) {
                        debugger

                        //$("#accountCodeAutoComplete").val(response.accountCode);
                        //$("#FK_GlAccountId").val(response.fK_GlAccountId);
                        //$("#AccountName").val(response.accountName);

                        //$("#FK_CostCenterId").val(response.fK_CostCenterId);
                        //$("#costCenterAutoComplete").val(response.costCenterCode);
                        //$("#CostCenterName").val(response.costCenterName);


                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }

                }
            });


        }


    });

    $("#btnSubmit").on('click', function () {
        debugger
        if ($("#FK_HrBloodTypeId").val() == 0)
            $("#bloodIdValidation").show();
        else
            $("#bloodIdValidation").hide();

        if ($("#FK_NationalityId").val() == 0)
            $("#nationalityIdValidation").show();
        else
            $("#nationalityIdValidation").hide();

        if ($("#FK_DefReligionId").val() == 0)
            $("#religionIdValidation").show();
        else
            $("#religionIdValidation").hide();

        if ($("#FK_SocialStatusId").val() == 0)
            $("#socialStatusIdValidation").show();
        else
            $("#socialStatusIdValidation").hide();

        if ($("#FK_HrManagementId").val() == 0)
            $("#managementIdValidation").show();
        else
            $("#managementIdValidation").hide();

        if ($("#FK_HrDepartmentId").val() == 0)
            $("#departmentIdValidation").show();
        else
            $("#departmentIdValidation").hide();

        if ($("#FK_CostCenterId").val() == 0)
            $("#costCenterIdValidation").show();
        else
            $("#costCenterIdValidation").hide();

        if ($("#FK_HrClinicId").val() == 0)
            $("#FK_HrClinicId").val(null);

        if ($("#formCreateEmployee").valid() && parseInt($("#FK_HrBloodTypeId").val()) > 0 && parseInt($("#FK_NationalityId").val()) > 0 && parseInt($("#FK_DefReligionId").val()) > 0 && parseInt($("#FK_SocialStatusId").val()) > 0 && parseInt($("#FK_HrManagementId").val()) > 0 && parseInt($("#FK_HrDepartmentId").val()) > 0 && parseInt($("#FK_CostCenterId").val()) > 0) {
            debugger
            $("#formCreateEmployee").submit();
        }
    });

    $('input[type=radio][name=RoleId]').change(function () {
        if ($("#customControlValidation10").is(':checked')) {
            $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
            $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(true);
            $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(true);
            $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(true);
            $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(true);
        }
        else if ($("#customControlValidation11").is(':checked')) {
            $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
            $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(true);
            $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(true);
            $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(false);
            $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
        }
        else if ($("#customControlValidation30").is(':checked')) {
            $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
            $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(true);
            $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(false);
            $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(false);
            $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
        }
        else if ($("#customControlValidation31").is(':checked')) {
            $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
            $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(true);
            $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(true);
            $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(true);
            $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
        }
        else if ($("#customControlValidation32").is(':checked')) {
            $("#FK_GeneralManagerId").data("kendoDropDownList").enable(false);
            $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(false);
            $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(false);
            $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(false);
            $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
        }
        else if ($("#customControlValidation33").is(':checked')) {
            $("#FK_GeneralManagerId").data("kendoDropDownList").enable(true);
            $("#FK_DirectorGeneralId").data("kendoDropDownList").enable(false);
            $("#FK_ManagingDirectorId").data("kendoDropDownList").enable(false);
            $("#FK_DepartmentManagerId").data("kendoDropDownList").enable(false);
            $("#FK_HumanResourcesManagerId").data("kendoDropDownList").enable(false);
        }
    });
});