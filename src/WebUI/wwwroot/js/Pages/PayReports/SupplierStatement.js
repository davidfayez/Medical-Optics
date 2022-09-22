$(document).ready(function () {
    console.log($("#DateTo").val());
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

    var isSupplier = true;
    var supplierCodeDataSource = new kendo.data.DataSource({

        //serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: function () {

                    if (isSupplier == true)
                        return "/PayLookups/GetAllPaySupplierAutoCompleteSearchByCode";
                    else
                        return "/PayLookups/GetAllPaySubSupplierAutoCompleteSearchByCode";
                }
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

    $('#isSubSupplier').change(function () {
        debugger
        if (this.checked) //مورد مؤقت
            isSupplier = false;
        else //مورد
            isSupplier = true

        $("#supplierAutoComplete").data("kendoDropDownList").value("0");
        $("#supplierAutoComplete").data("kendoDropDownList").dataSource.read();
        $("#FK_PaySupplierId").val(null);
        $("#FK_PaySubSupplierId").val(null);


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
        debugger
        if (isSupplier == true)
            $("#FK_PaySupplierId").val(e.dataItem.id);

        else
            $("#FK_PaySubSupplierId").val(e.dataItem.id);




    }
    function onChangeSupplier(e) {

        var code = this.value();
        var id = "";
        var checkUrl = "";
        if (isSupplier == false) {
            id = 'FK_PaySubSupplierId';
            checkUrl = "/PayLookups/CheckSubSupplierCodeExist?code=";
        }
        else {

            id = 'FK_PaySupplierId';
            checkUrl = "/PayLookups/CheckSupplierCodeExist?code=";
        }
        $.ajax({
            type: "Get",
            url: checkUrl + code,
            success: function (response) {
                debugger
                if (response != null) {
                    $("#" + id + "").val(response.id);


                } else {
                    $("#" + id + "").val(null);


                    swal({
                        title: Resources.SupplierCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    $("#PayType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/PayReports/GetAllNoticeTypeForDDL",
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
                url: "/PayReports/GetSupplierStatement",
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
                    description: { editable: false },
                    serial: { editable: false },
                    referenceNumber: { editable: false },
                    glJournalVoucherSerial: { editable: false },
                    invoiceDate: { type: "date", editable: false },
                    dueDate: { type: "date", editable: false },
                    voucherDate: { type: "date", editable: false },
                    referenceDate: { type: "date", editable: false },
                    debit: { editable: false },
                    credit: { editable: false },
                    balance: { type: "number" }
                }
            }
        },
        change: function (e) {
            var total = getFinalBalance();
            var span = $("#finalBalance");

            span.html(total.toString());
        },
        aggregate: [
            { field: "debit", aggregate: "sum" },
            { field: "credit", aggregate: "sum" },
            { field: "balance", aggregate: "sum" }
        ]
    });

    $("#GridSupplierStatement").kendoGrid({
        excel: {
            fileName: "Supplier Statement.xlsx",
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
            { width: Resources.InputNumberWidth, template: "<span class='counter'> </span>", title: Resources.Serial },
            { field: "description", title: Resources.DescriptionResource, width: Resources.DescriptionWidth },
            { field: "serial", title: Resources.BillBondNumberResource, width: Resources.CodeWidth },
            { field: "voucherDate", title: Resources.BillDateResource, format: "{0:yyyy/MM/dd}", width: Resources.CodeWidth },
            { field: "referenceNumber", title: Resources.BondSerialResource, width: Resources.CodeWidth },
            { field: "referenceDate", title: Resources.BondDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "dueDate", title: Resources.BillDueDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },

            { field: "debit", title: Resources.DebitResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.TotalDebit + ": #: kendo.toString(sum, 'n2') # " },
            { field: "credit", title: Resources.CreditResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.TotalCredit + ": #: kendo.toString(sum, 'n2') # " },
            { field: "balance", title: Resources.BalanceResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.BalanceResource + ": <span id='finalBalance'> #: window.getFinalBalance()#</span>" },

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

    $("#btnDataReview").on('click', function () {
        if (isSupplier)
            var supplierId = parseInt($("#FK_PaySupplierId").val());
        else
            var supplierId = parseInt($("#FK_PaySubSupplierId").val());

        var type = $("#PayType").val(),
            dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val(),
            fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        
        if ((isNaN(supplierId) || supplierId == 0)) {
            swal({
                title: Resources.ChooseSupplierResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            $('.exportExcel').fadeIn('slow');
            $('#GridSupplierStatement').data('kendoGrid').dataSource.read({ supplierId: supplierId, isSupplier: isSupplier, type: type, dateFrom: dateFrom, dateTo: dateTo, fK_DefBranchId: fK_DefBranchId}).then(function () {

                var firstItem = $('#GridSupplierStatement').data().kendoGrid.dataSource.data()[0];

                //set col reason  value
                firstItem["voucherDate"] = " ";
                firstItem["referenceDate"] = " ";
                var grid = $("#GridSupplierStatement").data("kendoGrid");
                grid.saveChanges();

            });
        }
    });

    $(".exportExcel").on('click', function () {
        $("#GridSupplierStatement").getKendoGrid().saveAsExcel();
    });

    $(".btnPrint").on('click', function () {
        var supplierId = parseInt($("#FK_PaySupplierId").val()),
            type = $("#PayType").val(),
            dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val(),
            isSubAccountSupport = $("#IsSubAccountSupport").prop("checked"),
            isTotalAccountZero = $("#IsTotalAccountZero").prop("checked"),
            fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
        if (isNaN(supplierId) || supplierId == 0) {
            swal({
                title: Resources.ChooseSupplierResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

        else {
            var url = "/PayReports/SupplierStatementPrint?supplierId=" + supplierId + "&isSupplier=" + isSupplier + "&type=" + type + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&fK_DefBranchId=" + fK_DefBranchId + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport ;
            window.open(url, '_blank');
        }
    });

});
function getFinalBalance() {

    var balance = 0.00;
    var gridReport = $("#GridSupplierStatement").data("kendoGrid")
    // var gridData = gridReport.dataSource.view();
    var gridData = gridReport.dataSource._data;
    if (gridData != null && gridData != undefined) {
        var lastRowIdx = gridData.length - 1;
        if (lastRowIdx >= 0) {
            balance = gridData[lastRowIdx].balance;
        }
    }
    setGridSerial();
    return numberWithCommas(parseFloat(balance).toFixed(2));
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function setGridSerial() {

    var grid = $("#GridSupplierStatement").data("kendoGrid");
    var counter = 1;
    grid.tbody.find("tr[role='row']").each(function () {

        $(this).find(".counter").text(counter);
        counter += 1;

    });
}
