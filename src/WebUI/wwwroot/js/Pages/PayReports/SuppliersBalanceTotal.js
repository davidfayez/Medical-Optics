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

   
        $("#FK_PaySupplierId").val(0);
        $("#FK_PaySubSupplierId").val(0);
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
    var supplierCodeDataSource = new kendo.data.DataSource({

        //serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/PayLookups/GetAllPaySupplierAutoCompleteSearchByCode"
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    var categoryId = parseInt($("#FK_PaySupplierCategoryId").val()),
                        groupId = parseInt($("#FK_PaySupplierGroupId").val()),
                        classId = parseInt($("#FK_PaySupplierClassId").val()),
                        typeId = parseInt($("#FK_PaySupplierType").val()),
                        periodId = parseInt($("#FK_GlFinancialId").val());
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
                            periodId: periodId,
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
        ,
        schema: {
            model: {
                id: "id",
                fields: {

                    codeAndName: {
                        type: "string"
                    }
                }
            }
        }
    });

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



    //Grid
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PayReports/GetSuppliersBalanceTotal",
                Type: "GET"
            }
        },
        error: function (e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        pageSize: 10,
        schema: {
            model: {
                id: "accountId",
                parentId: "parentId",
                fields: {
                    accountId: { type: "number", nullable: false },
                    parentId: { field: "parentId", nullable: true },
                    accountCode: { type: "string", validation: { required: true } },
                    accountName: { type: "string", validation: { required: true } },


                }
                //expanded: true
            }
        },
        aggregate: [
            { field: "previousDebit", aggregate: "sum" },
            { field: "previousCredit", aggregate: "sum" },
            { field: "debit", aggregate: "sum" },
            { field: "credit", aggregate: "sum" }
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
            { field: "accountCode", title: Resources.Code, width: Resources.NameWidth },
            { field: "accountName", title: Resources.NameArResource, width: Resources.NameWidth, template: '#if(isMainAccount){#<span style="color:red">#: accountName# </span> #}else{#<span>#: accountName# </span>#}#', },
            {
                title: Resources.PreviousBalanceResources,
                headerAttributes: {
                    style: "text-align: center"
                }, columns: [{
                    field: "previousDebit",
                    title: Resources.DebitResource,
                    width: Resources.AmountWidth,
                    template: "#: kendo.toString(previousDebit, '0.00')#",
                    footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # "
                    
                   
                }, {
                    field: "previousCredit",
                    title: Resources.CreditResource,
                    width: Resources.AmountWidth,
                    template: "#: kendo.toString(previousCredit, '0.00')#",
                    footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " 
                    
                }]
            }, {
                title: Resources.CurrentBalanceResources,
                headerAttributes: {
                    style: "text-align: center"
                },
                columns: [{
                    field: "debit",
                    title: Resources.DebitResource,
                    width: Resources.AmountWidth,
                    template: "#: kendo.toString(debit, '0.00')#",
                    footerTemplate: Resources.Total + ": #: kendo.toString(sum, '0.00') # "
                }, {
                    field: "credit",
                    title: Resources.CreditResource,
                    width: Resources.AmountWidth,
                    template: "#: kendo.toString(credit, '0.00')#",
                    footerTemplate: Resources.Total + ": #: kendo.toString(sum, '0.00') # "
                }]
            }

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
    $('#SupplierBalanceGrid').data('kendoGrid').dataSource.read({ suppliersId: suppliersId, fK_DefBranchId: fK_DefBranchId, supplierCategoryId: supplierCategoryId, supplierGroupId: supplierGroupId, supplierClassId: supplierClassId, supplierTypeId: supplierTypeId, periodId: periodId, isTotalAccountZero: isTotalAccountZero });
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
    var periodId = parseInt($("#FK_GlFinancialId").val());

    var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");

    var url = "/PayReports/SuppliersBalanceTotalPrint?suppliersId=" + suppliersId + "&fK_DefBranchId=" + $("#FK_DefBranchId").val() + "&supplierCategoryId=" + supplierCategoryId + "&supplierGroupId=" + supplierGroupId + "&supplierClassId=" + supplierClassId + "&supplierTypeId=" + supplierTypeId + "&periodId=" + periodId + "&isTotalAccountZero=" + isTotalAccountZero ;

    window.open(url, '_blank');
});