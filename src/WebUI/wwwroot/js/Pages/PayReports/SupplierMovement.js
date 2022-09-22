$(document).ready(function () {
    //var now = new Date(),
    //    today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    //$('#DateFrom').val(today);
    //$('#DateTo').val(today);

    $('#DefBranches').change(function () {

        $("#FK_PaySupplierId").val(0);
        $("#FK_PaySubSupplierId").val(0);
        $("#supplierAutoComplete").data("kendoDropDownList").value("0");
        $("#supplierAutoComplete").data("kendoDropDownList").dataSource.read();


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

      
        $("#FK_PaySupplierId").val(0);
        $("#FK_PaySubSupplierId").val(0);
        $("#supplierAutoComplete").data("kendoDropDownList").value("0");
        $("#supplierAutoComplete").data("kendoDropDownList").dataSource.read({ categoryId: e.dataItem.id });
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
        $("#supplierAutoComplete").data("kendoDropDownList").value("0");
        $("#supplierAutoComplete").data("kendoDropDownList").dataSource.read({ groupId: e.dataItem.id });
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

        $("#FK_PaySupplierId").val(0);
        $("#FK_PaySubSupplierId").val(0);
        $("#supplierAutoComplete").data("kendoDropDownList").value("0");
        $("#supplierAutoComplete").data("kendoDropDownList").dataSource.read({ classId: e.dataItem.id });

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
    
        $("#FK_PaySupplierId").val(0);
        $("#FK_PaySubSupplierId").val(0);
        $("#supplierAutoComplete").data("kendoDropDownList").value("0");
        $("#supplierAutoComplete").data("kendoDropDownList").dataSource.read({ typeId: e.dataItem.id });
    }

    var supplierCodeDataSource = new kendo.data.DataSource({

        // serverFiltering: true,
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
    $("#supplierAutoComplete").kendoDropDownList({

        dataSource: supplierCodeDataSource,
        select: onSelectSupplier,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
    function onSelectSupplier(e) {
        
        $("#FK_PaySupplierId").val(e.dataItem.id);


    }
    function onChangeSupplier(e) {

        var code = this.value();

        $.ajax({
            type: "GET",
            url: "/PayLookups/CheckSupplierCodeExist?code=" + code,

            success: function (response) {
                debugger
                if (response != null) {
                    $("#FK_PaySupplierId").val(response.id);
                  

                } else {
                    $("#FK_PaySupplierId").val(null);
                  
                    swal({
                        title: Resources.SupplierCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    $("#paybondtype").kendoDropDownList({
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
                url: "/PayReports/GetSupplierMovement",
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
                    supplierName: { editable: false },
                    supplierCode: { editable: false },
                    periodName: { type: "string" },
                    serial: { editable: false },
                    bondDate: { type: "date", editable: false },
                    cashAmount: { editable: false },
                    debit: { editable: false },
                    credit: { editable: false },
                }
            }
        },
        aggregate: [
            { field: "cashAmount", aggregate: "sum" },
            { field: "debit", aggregate: "sum" },
            { field: "credit", aggregate: "sum" }

        ]
    });

    $("#GridSupplierMovement").kendoGrid({
        excel: {
            fileName: "Movement Statement.xlsx",
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
            { field: "periodName", title: Resources.FinancialPeriod, width: Resources.TypeWidth },
            { field: "serial", title: Resources.BondSerialResource, width: Resources.CodeWidth },
            { field: "bondDate", title: Resources.BondDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "cashAmount", title: Resources.CashAmountResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "debit", title: Resources.DebitResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "credit", title: Resources.CreditResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
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
        //excelExport: function (e) {
        //    var accountId = $("#accountName").val();
        //    var costCenterId = $("#costCenterName").val();
        //    if (accountId !== "")
        //        e.workbook.fileName = $("#accountName  option:selected").text();
        //    else if (costCenterId !== "")
        //        e.workbook.fileName = $("#costCenterName  option:selected").text();
        //}
    });



});

$("#btnDataReview").on('click', function () {
    var supplierId = parseInt($("#FK_PaySupplierId").val()),
        bondType = parseInt($("#paybondtype").val()),

        serial = $("#Serial").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var supplierCategoryId = $("#FK_PaySupplierCategoryId").val();
    var supplierGroupId = $("#FK_PaySupplierGroupId").val();
    var supplierClassId = $("#FK_PaySupplierClassId").val();
    var supplierTypeId = $("#FK_PaySupplierType").val();
    debugger
    //if (isNaN(supplierId) || supplierId == 0) {
    //    swal({
    //        title: $("#ChooseSupplierResource").text(),
    //        confirmButtonText: $("#DoneResource").text(),
    //        type: "error"
    //    });
    //}
    //else if (isNaN(bondType) || bondType == 0) {

    //    swal({
    //        title: $("#PayBondTypeRequiredResource").text(),
    //        confirmButtonText: $("#DoneResource").text(),
    //        type: "error"
    //    });
    //}
    //else {
    $('.exportExcel').fadeIn('slow');
    $('#GridSupplierMovement').data('kendoGrid').dataSource.read({ supplierId: supplierId, bondType: bondType, serial: serial, dateFrom: dateFrom, dateTo: dateTo, fK_DefBranchId: fK_DefBranchId, supplierCategoryId: supplierCategoryId, supplierGroupId: supplierGroupId, supplierClassId: supplierClassId, supplierTypeId: supplierTypeId});
    //}
});

$(".exportExcel").on('click', function () {
    $("#GridSupplierMovement").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    debugger;
    var supplierId = parseInt($("#FK_PaySupplierId").val()),
        bondType = parseInt($("#paybondtype").val()),

        serial = $("#Serial").val(),
        //status = parseInt($("#status").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var supplierCategoryId = $("#FK_PaySupplierCategoryId").val();
    var supplierGroupId = $("#FK_PaySupplierGroupId").val();
    var supplierClassId = $("#FK_PaySupplierClassId").val();
    var supplierTypeId = $("#FK_PaySupplierType").val();
    var url = "/PayReports/SupplierMovementPrint?supplierId=" + supplierId + "&bondType=" + bondType  + "&serial=" + serial + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fK_DefBranchId=" + fK_DefBranchId + "&supplierCategoryId=" + supplierCategoryId + "&supplierGroupId=" + supplierGroupId + "&supplierClassId=" + supplierClassId + "&supplierTypeId=" + supplierTypeId;
    window.open(url, '_blank');
});