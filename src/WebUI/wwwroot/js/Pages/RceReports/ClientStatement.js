$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_RceClientId").val(0);
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


    var isClient = true;
    var checkUrl = "";
    $('#isSubClient').change(function () {

        if (this.checked) //عميل مؤقت
            isClient = false;
        else //عميل
            isClient = true

        if (isClient == true) {
            id = 'FK_RceClientId';
            checkUrl = "/RceLookups/GetAllRceClientAutoCompleteSearchByCode";
        }
        else {
            id = 'FK_RceSubClientId';
            checkUrl = "/RceLookups/GetAllSubClientForDDList";
        }
        $("#FK_RceClientId").val(null);
        $("#FK_RceSubClientId").val(null);

        $("#clientAutoComplete").data("kendoDropDownList").value(0);
        $("#clientAutoComplete").data("kendoDropDownList").dataSource.read();
    });


    if (isClient == true) {
        id = 'FK_RceClientId';
        checkUrl = "/RceLookups/GetAllRceClientAutoCompleteSearchByCode";
    }
    else {
        id = 'FK_RceSubClientId';
        checkUrl = "/RceLookups/GetAllSubClientForDDList";
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
                    url: checkUrl,
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

        if (isClient == true)
            $("#FK_RceClientId").val(e.dataItem.id);

        else
            $("#FK_RceSubClientId").val(e.dataItem.id);

    }

    $("#RceType").kendoDropDownList({
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
                url: "/RceReports/GetClientStatement",
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
                    //id: { editable: false },
                    //description: { editable: false },
                    //serial: { editable: false },
                    //glJournalVoucherSerial: { editable: false },
                    //inviceDate: { type: "date", editable: false },
                    //billDueDate: { type: "date", editable: false },
                    //debit: { editable: false },
                    //credit: { editable: false },
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

    $("#GridClientStatement").kendoGrid({
        excel: {
            fileName: "Client Statement.xlsx",
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
        if (isClient)
            var clientId = parseInt($("#FK_RceClientId").val());
        else
            var clientId = parseInt($("#FK_RceSubClientId").val());

        var type = $("#RceType").val(),
            dateFrom = $("#DateFrom").val(),
            fK_DefBranchId = parseInt($("#FK_DefBranchId").val()),
            dateTo = $("#DateTo").val();
        var isTotalAccountZero = $("#IsTotalAccountZero").prop("checked");

        if (isNaN(clientId) || clientId == 0) {
            swal({
                title: Resources.ChooseClientResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            $('.exportExcel').fadeIn('slow');
            $('#GridClientStatement').data('kendoGrid').dataSource.read({
                clientId: clientId, isClient: isClient, type: type, dateFrom: dateFrom, dateTo: dateTo, branchId: fK_DefBranchId, isTotalAccountZero: isTotalAccountZero }).then(function () {

                var firstItem = $('#GridClientStatement').data().kendoGrid.dataSource.data()[0];

                //set col reason  value
                firstItem["voucherDate"] = " ";
                firstItem["referenceDate"] = " ";
                var grid = $("#GridClientStatement").data("kendoGrid");
                grid.saveChanges();

            });
        }
    });

    $(".exportExcel").on('click', function () {
        $("#GridClientStatement").getKendoGrid().saveAsExcel();
    });

    $(".btnPrint").on('click', function () {
        if (isClient)
            var clientId = parseInt($("#FK_RceClientId").val());
        else
            var clientId = parseInt($("#FK_RceSubClientId").val());

        var type = $("#RceType").val(),
            fK_DefBranchId = parseInt($("#FK_DefBranchId").val()),
            isSubAccountSupport = $("#IsSubAccountSupport").prop("checked"),
            isTotalAccountZero = $("#IsTotalAccountZero").prop("checked"),
            dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val();
        if (isNaN(clientId) || clientId == 0) {
            swal({
                title: Resources.ChooseClientResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"

            });
        }

        else {
            var url = "/RceReports/ClientStatementPrint?clientId=" + clientId + "&isClient=" + isClient + "&type=" + type + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&branchId=" + fK_DefBranchId + "&isTotalAccountZero=" + isTotalAccountZero + "&IsSubAccountSupport=" + isSubAccountSupport ;
            window.open(url, '_blank').print();
        }
    });

});


function getFinalBalance() {

    var balance = 0.00;
    var gridReport = $("#GridClientStatement").data("kendoGrid")
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

    var grid = $("#GridClientStatement").data("kendoGrid");
    var counter = 1;
    grid.tbody.find("tr[role='row']").each(function () {

        $(this).find(".counter").text(counter);
        counter += 1;

    });
}
