$(document).ready(function () {
    //var now = new Date(),
    //    today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    //$('#DateFrom').val(today);
    //$('#DateTo').val(today);

    $('#DefBranches').change(function () {

   
        $("#clientAutoComplete").data("kendoDropDownList").value(0);
        $("#clientAutoComplete").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientCategoryId").data("kendoDropDownList").value("0");
        $("#FK_RceClientCategoryId").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientGroupId").data("kendoDropDownList").value("0");
        $("#FK_RceClientGroupId").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientClassId").data("kendoDropDownList").value("0");
        $("#FK_RceClientClassId").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientType").data("kendoDropDownList").value("0");
        $("#FK_RceClientType").data("kendoDropDownList").dataSource.read();
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
        $("#FK_RceClientGroupId").data("kendoDropDownList").value("0");
        $("#FK_RceClientGroupId").data("kendoDropDownList").dataSource.read({ categoryId: e.dataItem.id });


        $("#FK_RceClientClassId").data("kendoDropDownList").value("0");
        $("#FK_RceClientClassId").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientType").data("kendoDropDownList").value("0");
        $("#FK_RceClientType").data("kendoDropDownList").dataSource.read();

      
        $("#FK_RceClientId").val(0);
        $("#clientAutoComplete").data("kendoDropDownList").value("0");
        $("#clientAutoComplete").data("kendoDropDownList").dataSource.read({ categoryId: e.dataItem.id });

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

        $("#FK_RceClientClassId").data("kendoDropDownList").value("0");
        $("#FK_RceClientClassId").data("kendoDropDownList").dataSource.read({ groupId: e.dataItem.id });

        $("#FK_RceClientType").data("kendoDropDownList").value("0");
        $("#FK_RceClientType").data("kendoDropDownList").dataSource.read();

       
        $("#FK_RceClientId").val(0);
        $("#clientAutoComplete").data("kendoDropDownList").value("0");
        $("#clientAutoComplete").data("kendoDropDownList").dataSource.read({ groupId: e.dataItem.id });

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
        $("#FK_RceClientType").data("kendoDropDownList").value("0");
        $("#FK_RceClientType").data("kendoDropDownList").dataSource.read({ classId: e.dataItem.id });

        $("#FK_RceClientId").val(0);
        $("#clientAutoComplete").data("kendoDropDownList").value("0");
        $("#clientAutoComplete").data("kendoDropDownList").dataSource.read({ classId: e.dataItem.id });
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
        select: onSelectType
    });
    function onSelectType(e) {

        $("#FK_RceClientId").val(0);
        $("#clientAutoComplete").data("kendoDropDownList").value("0");
        $("#clientAutoComplete").data("kendoDropDownList").dataSource.read({ typeId: e.dataItem.id });
    }

    $("#clientAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllRceClientAutoCompleteSearchByCode",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        var categoryId = parseInt($("#FK_RceClientCategoryId").val()),
                            groupId = parseInt($("#FK_RceClientGroupId").val()),
                            classId = parseInt($("#FK_RceClientClassId").val()),
                            typeId = parseInt($("#FK_RceClientType").val());

                        if (Object.keys(data).length > 0) {

                            if (data.categoryId != undefined)
                                categoryId = data.categoryId;

                            if (data.groupId != undefined)
                                groupId = data.groupId;

                            if (data.classId != undefined)
                                classId = data.classId;

                            if (data.typeId != undefined)
                                typeId = data.typeId;

                            return {
                                code: "",//data.filter.filters[0].value,
                                fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                                categoryId: categoryId,
                                groupId: groupId,
                                classId: classId,
                                typeId: typeId,
                            };
                        } else {
                            return {
                                code: "",
                                fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                                categoryId: categoryId,
                                groupId: groupId,
                                classId: classId,
                                typeId: typeId,

                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectRceClient
    });

    function onSelectRceClient(e) {
        $("#FK_RceClientId").val(e.dataItem.id);

    }
    $("#FK_GlFinancialPeriodId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayRecurringBond/GetAllFinancialPeriodsForDDL",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    $("#rcebondtype").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/PayReports/GetAllPayBondTypeForDDL",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });
    //Grid
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/RceReports/GetClientMovement",
                Type: "GET"
            }
        },
        error: function (e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        pageSize: 10,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false },
                    clientName: { editable: false },
                    clientCode: { editable: false },
                    periodName: { type: "string" },
                    serial: { editable: false },
                    bondDate: { type: "date", editable: false },
                    cashAmount: { editable: false },
                    debit: { editable: false },
                    credit: { editable: false },
                }
            }
        }
    });

    $("#GridClientMovement").kendoGrid({
        excel: {
            fileName: "Client Movement.xlsx",
            allPages: Resources.GridAllPages,
            filterable: Resources.GridFilterable
        },
        dataSource: dataSource,
        pageSize: 20,
        serverPaging: Resources.GridServerPaging,
        serverFiltering: Resources.GridServerFiltering,
        filterable: Resources.GridFilterable,
        height: Resources.GridHeight,
        groupable: Resources.GridGroupable
        ,
        sortable: Resources.GridSortable,
        resizable: Resources.GridResizable,
        noRecords: Resources.GridNoRecords,
        messages: {
            noRecords: Resources.GridNoRecordsMessage
        },
        pageable: {
            pageSizes: [10, 20, 50, Resources.All],
            numeric: Resources.GridNumeric,
            refresh: Resources.GridRefresh,

        },
        columns: [
            { field: "clientName", title: Resources.ClientNameResource, width: Resources.NameWidth },
            { field: "clientCode", title: Resources.ClientCodeResource, width: Resources.CodeWidth },
            { field: "periodName", title: Resources.FinancialPeriod, width: Resources.NameWidth },
            { field: "serial", title: Resources.BondSerialResource, width: Resources.CodeWidth },
            { field: "bondDate", title: Resources.BondDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "cashAmount", title: Resources.CashAmountResource, width: Resources.AmountWidth },
            { field: "debit", title: Resources.DebitResource, width: Resources.AmountWidth },
            { field: "credit", title: Resources.CreditResource, width: Resources.AmountWidth },
        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);
                if (dataItem.isActive) {
                    //$(this).addClass("k-state-selected");
                }
            });
        },
    });



});

$("#btnDataReview").on('click', function () {
    var clientId = parseInt($("#FK_RceClientId").val()),
        bondType = parseInt($("#rcebondtype").val()),
        financialPeriodId = parseInt($("#FK_GlFinancialPeriodId").val()),
        serial = $("#Serial").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var categoryId = $("#FK_RceClientCategoryId").val();
    var groupId = $("#FK_RceClientGroupId").val();
    var classId = $("#FK_RceClientClassId").val();
    var typeId = $("#FK_RceClientType").val();
    $('.exportExcel').fadeIn('slow');
    $('#GridClientMovement').data('kendoGrid').dataSource.read({ clientId: clientId, bondType: bondType, financialPeriodId: financialPeriodId, serial: serial, dateFrom: dateFrom, dateTo: dateTo, branchId: fK_DefBranchId, clientCategoryId: categoryId, clientGroupId: groupId, clientClassId: classId, clientTypeId: typeId });
    //}
});

$(".exportExcel").on('click', function () {
    $("#GridClientMovement").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    debugger;
    var clientId = parseInt($("#FK_RceClientId").val()),
        bondType = parseInt($("#rcebondtype").val()),
        financialPeriodId = parseInt($("#FK_GlFinancialPeriodId").val()),
        serial = $("#Serial").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var categoryId = $("#FK_RceClientCategoryId").val();
    var groupId = $("#FK_RceClientGroupId").val();
    var classId = $("#FK_RceClientClassId").val();
    var typeId = $("#FK_RceClientType").val();
    var url = "/RceReports/ClientMovementPrint?clientId=" + clientId + "&bondType=" + bondType + "&financialPeriodId=" + financialPeriodId + "&serial=" + serial + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&branchId=" + fK_DefBranchId + "&clientCategoryId=" + categoryId + "&clientGroupId=" + groupId + "&clientClassId=" + classId + "&clientTypeId=" + typeId;
    window.open(url, '_blank').print();
});