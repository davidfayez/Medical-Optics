$(document).ready(function () {
    //var now = new Date(),
    //    today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    //$('#DateFrom').val(today);
    //$('#DateTo').val(today);

    $('#DefBranches').change(function () {

        $("#clientAutoComplete").data("kendoDropDownTree").value(0);
        $("#clientAutoComplete").data("kendoDropDownTree").dataSource.read();

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


        $("#clientAutoComplete").data("kendoDropDownTree").value("0");
        $("#clientAutoComplete").data("kendoDropDownTree").dataSource.read({ categoryId: e.dataItem.id });

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

       
        $("#clientAutoComplete").data("kendoDropDownTree").value("0");
        $("#clientAutoComplete").data("kendoDropDownTree").dataSource.read({ groupId: e.dataItem.id });

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

        $("#clientAutoComplete").data("kendoDropDownTree").value("0");
        $("#clientAutoComplete").data("kendoDropDownTree").dataSource.read({ classId: e.dataItem.id });
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

        $("#clientAutoComplete").data("kendoDropDownTree").value("0");
        $("#clientAutoComplete").data("kendoDropDownTree").dataSource.read({ typeId: e.dataItem.id });
    }
    $("#clientAutoComplete").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "codeAndName",
        dataValueField: "id",
        height: 300,
        checkboxes: true,
        checkAll: false,
        autoClose: false,
        dataSource: {
            type: "json",
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
                                code: "",
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
        }

    });

    $("#FK_RceSalesTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",

        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllSalesTypeForDDList",
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
        }
    });
 


    //Grid
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/RceReports/GetSalesMovementsDetails",
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
                    billNumber: { editable: false },
                    billDate: { type: "date", editable: false },
                    salesTypeName: { type: "string" },
                    glAccountCode: { type: "string" },
                    glAccountName: { type: "string" },
                    gross: { editable: false },
                    downPayment: { editable: false },
                    remaining: { editable: false },
                    taxValue: { editable: false },
                }
            }
        },
        aggregate: [
            { field: "gross", aggregate: "sum" },
            { field: "downPayment", aggregate: "sum" },
            { field: "remaining", aggregate: "sum" },
            { field: "taxValue", aggregate: "sum" },
        ]
    });

    $("#GridSalesMovementsDetails").kendoGrid({
        excel: {
            fileName: "Sales Movements Details.xlsx",
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
            { field: "billNumber", title: Resources.BillNumberResource, width: Resources.CodeWidth },
            { field: "billDate", title: Resources.BillDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "salesTypeName", title: Resources.SalesTypePageTitleResource, width: Resources.NameWidth },
            { field: "glAccountCode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "glAccountName", title: Resources.AccountNameAr, width: Resources.NameWidth },
            { field: "gross", title: Resources.GrossResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "downPayment", title: Resources.DownPaymentResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "remaining", title: Resources.RemainingResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "taxValue", title: Resources.TaxValueResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },

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
    var multiselect = $("#clientAutoComplete").data("kendoDropDownTree");
    var clientsId = multiselect.value().join(", "),
        salesType = parseInt($("#FK_RceSalesTypeId").val()),
        billNumber = $("#BillNumber").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();

    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var categoryId = $("#FK_RceClientCategoryId").val();
    var groupId = $("#FK_RceClientGroupId").val();
    var classId = $("#FK_RceClientClassId").val();
    var typeId = $("#FK_RceClientType").val();
    $('.exportExcel').fadeIn('slow');
    $('#GridSalesMovementsDetails').data('kendoGrid').dataSource.read({ clientsId: clientsId, salesType: salesType, billNumber: billNumber, dateFrom: dateFrom, dateTo: dateTo, branchId: fK_DefBranchId, clientCategoryId: categoryId, clientGroupId: groupId, clientClassId: classId, clientTypeId: typeId });
});

$(".exportExcel").on('click', function () {
    $("#GridSalesMovementsDetails").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    debugger;
    var multiselect = $("#clientAutoComplete").data("kendoDropDownTree");
    var clientsId = multiselect.value().join(", "),
        salesType = parseInt($("#FK_RceSalesTypeId").val()),
        billNumber = $("#BillNumber").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var categoryId = $("#FK_RceClientCategoryId").val();
    var groupId = $("#FK_RceClientGroupId").val();
    var classId = $("#FK_RceClientClassId").val();
    var typeId = $("#FK_RceClientType").val();
    var url = "/RceReports/SalesMovementsDetailsPrint?clientsId=" + clientsId + "&salesType=" + salesType +  "&billNumber=" + billNumber + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&branchId=" + fK_DefBranchId + "&clientCategoryId=" + categoryId + "&clientGroupId=" + groupId + "&clientClassId=" + classId + "&clientTypeId=" + typeId;
    window.open(url, '_blank').print();
});