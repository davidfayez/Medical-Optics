$(document).ready(function () {
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#DateFrom').val(today);
    $('#DateTo').val(today);

    $('#DefBranches').change(function () {

        $("#supplierAutoComplete").data("kendoDropDownTree").value("0");
        $("#supplierAutoComplete").data("kendoDropDownTree").dataSource.read();


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
                    url:"/PayLookups/GetAllPaySupplierAutoCompleteSearchByCode",
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

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PayReports/GetSuppliersBalance",
                Type: "GET"
            },
            
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
                    supplierCode: { editable: false },
                    supplierNameAr: { editable: false },
                    lessThan30: { editable: false },
                    between30And60: { editable: false },
                    between60And90: { editable: false },
                    between90And120: { editable: false },
                    between120And180: { editable: false },
                    moreThan180: { editable: false },
                    balance: { editable: false }
                }
            }
        },
        aggregate: [
            { field: "lessThan30", aggregate: "sum" },
            { field: "between30And60", aggregate: "sum" },
            { field: "between60And90", aggregate: "sum" },
            { field: "between90And120", aggregate: "sum" },
            { field: "between120And180", aggregate: "sum" },
            { field: "moreThan180", aggregate: "sum" },
            { field: "balance", aggregate: "sum" },
        ]
    });

    $("#SupplierBalanceGrid").kendoGrid({
        excel: {
            fileName: "Supplier Balance Report.xlsx",
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

            { field: "supplierCode", title: Resources.SupplierCodeResource, width: Resources.CodeWidth },
            { field: "supplierNameAr", title: Resources.SupplierNameResource, width: Resources.NameWidth },
            { field: "lessThan30", title: Resources.LessThan30Resource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "between30And60", title: Resources.Between30And60Resource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "between60And90", title: Resources.Between60And90Resource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "between90And120", title: Resources.Between90And120Resource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "between120And180", title: Resources.Between120And180Resource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "moreThan180", title: Resources.MoreThan180Resource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "balance", title: Resources.BalanceResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
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
    var suppliersId = multiselect.value().join(", ");
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var supplierCategoryId = $("#FK_PaySupplierCategoryId").val();
    var supplierGroupId = $("#FK_PaySupplierGroupId").val();
    var supplierClassId = $("#FK_PaySupplierClassId").val();
    var supplierTypeId = $("#FK_PaySupplierType").val();
    var periodId = parseInt($("#FK_GlFinancialId").val());
    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");
    $('.exportExcel').fadeIn('slow');
    $('#SupplierBalanceGrid').data('kendoGrid').dataSource.read({ suppliersId: suppliersId, fK_DefBranchId: fK_DefBranchId, supplierCategoryId: supplierCategoryId, supplierGroupId: supplierGroupId, supplierClassId: supplierClassId, supplierTypeId: supplierTypeId, periodId: periodId, isTotalAccountZero: isTotalAccountZero});
});

$(".exportExcel").on('click', function () {
    $("#SupplierDataGrid").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {

    var multiselect = $("#supplierAutoComplete").data("kendoDropDownTree");
    var suppliersId = multiselect.value().join(", ");
    var supplierCategoryId = $("#FK_PaySupplierCategoryId").val();
    var supplierGroupId = $("#FK_PaySupplierGroupId").val();
    var supplierClassId = $("#FK_PaySupplierClassId").val();
    var supplierTypeId = $("#FK_PaySupplierType").val();
    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");
    var url = "/PayReports/SuppliersBalancePrint?suppliersId=" + suppliersId + "&fK_DefBranchId=" + $("#FK_DefBranchId").val() + "&supplierCategoryId=" + supplierCategoryId + "&supplierGroupId=" + supplierGroupId + "&supplierClassId=" + supplierClassId + "&supplierTypeId=" + supplierTypeId + "&periodId=" + parseInt($("#FK_GlFinancialId").val()) + "&isTotalAccountZero=" + isTotalAccountZero ;
    window.open(url, '_blank');
});