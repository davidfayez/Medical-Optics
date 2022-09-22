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
    $("#InvoiceType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/PayReports/GetAllPayInvoiceTypeForDDL",
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
                url: "/RceReports/GetSalesMovements",
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
                    inviceDate: { type: "date", editable: false },
                    gross: { editable: false },
                    discount: { editable: false },
                    taxAmount: { editable: false },
                }
            }
        },
        aggregate: [
            { field: "gross", aggregate: "sum" },
            { field: "discount", aggregate: "sum" },
            { field: "taxAmount", aggregate: "sum" },
            ]
    });

    $("#GridSalesMovements").kendoGrid({
        excel: {
            fileName: "Sales Movements.xlsx",
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
            { field: "inviceDate", title: Resources.BillDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "gross", title: Resources.GrossResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "discount", title: Resources.DiscountResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "taxAmount", title: Resources.TaxAmountResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
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
    var clientsId = multiselect.value().join(", ");
        invoiceType = parseInt($("#InvoiceType").val()),

        serial = $("#Serial").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var categoryId = $("#FK_RceClientCategoryId").val();
    var groupId = $("#FK_RceClientGroupId").val();
    var classId = $("#FK_RceClientClassId").val();
    var typeId = $("#FK_RceClientType").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    $('.exportExcel').fadeIn('slow');
    $('#GridSalesMovements').data('kendoGrid').dataSource.read({ clientsId: clientsId, invoiceType: invoiceType, serial: serial, dateFrom: dateFrom, dateTo: dateTo, branchId: fK_DefBranchId, clientCategoryId: categoryId, clientGroupId: groupId, clientClassId: classId, clientTypeId: typeId });
});

$(".exportExcel").on('click', function () {
    $("#GridSalesMovements").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    var multiselect = $("#clientAutoComplete").data("kendoDropDownTree");
    var clientsId = multiselect.value().join(", ");
        invoiceType = parseInt($("#InvoiceType").val()),
        serial = $("#Serial").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var categoryId = $("#FK_RceClientCategoryId").val();
    var groupId = $("#FK_RceClientGroupId").val();
    var classId = $("#FK_RceClientClassId").val();
    var typeId = $("#FK_RceClientType").val();
    var url = "/RceReports/SalesMovementsPrint?clientsId=" + clientsId + "&invoiceType=" + invoiceType + "&serial=" + serial + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&branchId=" + fK_DefBranchId + "&clientCategoryId=" + categoryId + "&clientGroupId=" + groupId + "&clientClassId=" + classId + "&clientTypeId=" + typeId;
    window.open(url, '_blank').print();
});