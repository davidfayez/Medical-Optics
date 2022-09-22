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

    //Grid
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/RceReports/GetBillsPayable",
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
                    billDueDate: { type: "date", editable: false },
                    periodFromBillDate: { editable: false },
                    inviceDate: { editable: false },
                    remaining: { editable: false },
                    glJournalVoucherSerial: { editable: false },
                    serial: { editable: false },
                    gross: { editable: false }
                }
            }
        },
        aggregate: [
            { field: "remaining", aggregate: "sum" },
            { field: "gross", aggregate: "sum" },

        ]
    });

    $("#GridRceBillsPayable").kendoGrid({
        excel: {
            fileName: "Bills Payable Report.xlsx",
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
            { field: "billDueDate", title: Resources.BillDueDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
            { field: "invoiceDate", title: Resources.BillDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },

            { field: "remaining", title: Resources.InvoiceRamainigResource, width: Resources.AmountWidth, format: '{0:n2}', footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "gross", title: Resources.InvoiceGrossResource, width: Resources.AmountWidth, footerTemplate: Resources.Total + ": #: kendo.toString(sum, 'n2') # " },
            { field: "periodFromBillDate", title: Resources.InvoicePeriodFromResource, width: Resources.DateWidth },
            { field: "glJournalVoucherSerial", title: Resources.JournalSerialResource, width: Resources.CodeWidth },
            { field: "serial", title: Resources.InvoiceSerialResource, width: Resources.CodeWidth },

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
    var clientId = parseInt($("#FK_RceClientId").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    if (isNaN(clientId) || clientId == 0) {
        swal({
            title: Resources.ChooseClientResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else {
        $('.exportExcel').fadeIn('slow');
        $('#GridRceBillsPayable').data('kendoGrid').dataSource.read({ clientId: clientId, dateFrom: dateFrom, dateTo: dateTo, branchId: fK_DefBranchId });
    }
});

$(".exportExcel").on('click', function () {
    $("#GridRceBillsPayable").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    var clientId = parseInt($("#FK_RceClientId").val()),
        dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    if (isNaN(clientId) || clientId == 0) {
        swal({
            title: Resources.ChooseClientResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    } else {
        var url = "/RceReports/BillsPayablePrint?clientId=" + clientId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&branchId=" + fK_DefBranchId;
        window.open(url, '_blank').print();
    }
});