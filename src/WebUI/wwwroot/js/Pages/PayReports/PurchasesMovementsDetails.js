$(document).ready(function () {


    $('#DefBranches').change(function () {

        $("#supplierAutoComplete").data("kendoDropDownTree").value("0");
        $("#supplierAutoComplete").data("kendoDropDownTree").dataSource.read();
       

        $("#FK_PaymentTypeId").data("kendoDropDownList").value("0");
        $("#FK_PaymentTypeId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierClassId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierCategoryId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierCategoryId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierGroupId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierGroupId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierType").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read();
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
        $("#FK_PaySupplierGroupId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierGroupId").data("kendoDropDownList").dataSource.read({ categoryId: e.dataItem.id });

        $("#FK_PaySupplierClassId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierType").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read();

        $("#supplierAutoComplete").data("kendoDropDownTree").value("0");
        $("#supplierAutoComplete").data("kendoDropDownTree").dataSource.read({ categoryId: e.dataItem.id });
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
        $("#FK_PaySupplierClassId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.read({ groupId: e.dataItem.id });

        $("#FK_PaySupplierType").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read();

        $("#supplierAutoComplete").data("kendoDropDownTree").value("0");
        $("#supplierAutoComplete").data("kendoDropDownTree").dataSource.read({ groupId: e.dataItem.id });
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
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            groupId: data.groupId
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
        $("#FK_PaySupplierType").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read({ classId: e.dataItem.id });


        $("#supplierAutoComplete").data("kendoDropDownTree").value("0");
        $("#supplierAutoComplete").data("kendoDropDownTree").dataSource.read({ classId: e.dataItem.id });

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
       

        $("#supplierAutoComplete").data("kendoDropDownTree").value("0");
        $("#supplierAutoComplete").data("kendoDropDownTree").dataSource.read({ typeId: e.dataItem.id });
    }
    //Supplier DDT

    $("#supplierAutoComplete").kendoDropDownTree({
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
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllPaySupplierAutoCompleteSearchByCode",
                },
                parameterMap: function (data, action) {


                    if (action === "read") {
                        var categoryId = parseInt($("#FK_PaySupplierCategoryId").val()),
                            groupId = parseInt($("#FK_PaySupplierGroupId").val()),
                            classId = parseInt($("#FK_PaySupplierClassId").val()),
                            typeId = parseInt($("#FK_PaySupplierType").val());

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
    $("#FK_PaymentTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/PayReports/GetAllPaymentsTypeForDDL",
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
 
    //Grid
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PayReports/GetPurchasesMovementsDetails",
                Type: "GET"
            }
        },
        error: function (e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        pageSize: 20,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false },
                    supplierName: { editable: false },
                    supplierCode: { editable: false },
                    periodName: { type: "string" },
                    billNumber: { editable: false },
                    billDate: { type: "date", editable: false },
                    paymentTypeName: { type: "string" },
                    glAccountCode: { type: "string" },
                    glAccountName: { type: "string" },
                    gross: { type: "number" },
                    downPayment: { type: "number" },
                    remaining: { type: "number" },
                    taxValue: { type: "number" },
                }
            }
        },
        aggregate: [
            { field: "gross", aggregate: "sum" },
            { field: "downPayment", aggregate: "sum" },
            { field: "remaining", aggregate: "sum" },
            { field: "taxValue", aggregate: "sum" }
        ]
    });

    $("#GridPurchasesMovementsDetails").kendoGrid({
        excel: {
            fileName: "Purchases Movements Details.xlsx",
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
            { field: "supplierName", title: Resources.SupplierNameResource, width: Resources.NameWidth },
            { field: "supplierCode", title: Resources.SupplierCodeResource, width: Resources.CodeWidth },
            { field: "periodName", title: Resources.FinancialPeriod, width: Resources.NameWidth },
            { field: "billNumber", title: Resources.BillNumberResource, width: Resources.CodeWidth },
            { field: "billDate", title: Resources.BillDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "paymentTypeName", title: Resources.PaymentTypeResource, width: Resources.TypeWidth },
            { field: "glAccountCode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "glAccountName", title: Resources.AccountNameAr, width: Resources.NameWidth },
            { field: "gross", title: Resources.GrossResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "downPayment", title: Resources.DownPaymentResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "remaining", title: Resources.RemainingResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "taxValue", title: Resources.TaxValueResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " }

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
    var multiselect = $("#supplierAutoComplete").data("kendoDropDownTree");
    var suppliersId = multiselect.value().join(", "),
        paymentType = parseInt($("#FK_PaymentTypeId").val()),
        billNumber = $("#BillNumber").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var supplierCategoryId = $("#FK_PaySupplierCategoryId").val();
    var supplierGroupId = $("#FK_PaySupplierGroupId").val();
    var supplierClassId = $("#FK_PaySupplierClassId").val();
    var supplierTypeId = $("#FK_PaySupplierType").val();

    $('.exportExcel').fadeIn('slow');
    $('#GridPurchasesMovementsDetails').data('kendoGrid').dataSource.read({ suppliersId: suppliersId, paymentType: paymentType, billNumber: billNumber, dateFrom: dateFrom, dateTo: dateTo, fK_DefBranchId: fK_DefBranchId, supplierCategoryId: supplierCategoryId, supplierGroupId: supplierGroupId, supplierClassId: supplierClassId, supplierTypeId: supplierTypeId });
});

$(".exportExcel").on('click', function () {
    $("#GridPurchasesMovementsDetails").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {

    var multiselect = $("#supplierAutoComplete").data("kendoDropDownTree");
    var suppliersId = multiselect.value().join(", "),
        paymentType = parseInt($("#FK_PaymentTypeId").val()),
        billNumber = $("#BillNumber").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var supplierCategoryId = $("#FK_PaySupplierCategoryId").val();
    var supplierGroupId = $("#FK_PaySupplierGroupId").val();
    var supplierClassId = $("#FK_PaySupplierClassId").val();
    var supplierTypeId = $("#FK_PaySupplierType").val();
    var url = "/PayReports/PurchasesMovementsDetailsPrint?suppliersId=" + suppliersId + "&paymentType=" + paymentType  + "&billNumber=" + billNumber + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fK_DefBranchId=" + fK_DefBranchId + "&supplierCategoryId=" + supplierCategoryId + "&supplierGroupId=" + supplierGroupId + "&supplierClassId=" + supplierClassId + "&supplierTypeId=" + supplierTypeId;
    window.open(url, '_blank');
});