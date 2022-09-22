$(document).ready(function () {
    var now = new Date(),
        today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    $('#DateFrom').val(today);
    $('#DateTo').val(today);

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

    //Grid
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/RceReports/GetClientData",
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
                    clientCode: { editable: false },
                    clientNameAr: { editable: false },
                    transactionStartDate: { type: "date", editable: false },
                    address: { editable: false },
                    rceClientCategoryName: { editable: false },
                    rceClientClassName: { editable: false },
                    rceClientTypeName: { editable: false }
                }
            }
        }
    });

    $("#ClientDataGrid").kendoGrid({
        excel: {
            fileName: "Client Report.xlsx",
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

            { field: "clientCode", title: Resources.ClientCodeResource, width: Resources.CodeWidth },
            { field: "clientNameAr", title: Resources.ClientNameResource, width: Resources.NameWidth },
            { field: "address", title: Resources.AddressResource, width: Resources.AddressWidth },
            { field: "rceClientCategoryName", title: Resources.ClientCategoryResource, width: Resources.NameWidth },
            { field: "rceClientClassName", title: Resources.ClientClassResource, width: Resources.NameWidth },
            { field: "rceClientTypeName", title: Resources.ClientTypeResource, width: Resources.NameWidth },
            { field: "transactionStartDate", title: Resources.TransactionStartDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth },
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
        address = $("#ClientAddress").val(),
        classId = $("#FK_RceClientClassId").val(),
        typeId = $("#FK_RceClientType").val(),
        categoryId = $("#FK_RceClientCategoryId").val(),
        groupId = $("#FK_RceClientGroupId").val(),
        isTemporary = $("#IsTemporary").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    $('.exportExcel').fadeIn('slow');
    $('#ClientDataGrid').data('kendoGrid').dataSource.read({ clientsId: clientsId, address: address, isTemp: isTemporary, classId: classId, typeId: typeId, categoryId: categoryId, branchId: fK_DefBranchId, groupId:groupId });
});

$(".exportExcel").on('click', function () {
    $("#ClientDataGrid").getKendoGrid().saveAsExcel();
});

$(".btnPrint").on('click', function () {
    var multiselect = $("#clientAutoComplete").data("kendoDropDownTree");
    var clientsId = multiselect.value().join(", "),
        address = $("#ClientAddress").val(),
        classId = $("#FK_RceClientClassId").val(),
        typeId = $("#FK_RceClientType").val(),
        categoryId = $("#FK_RceClientCategoryId").val(),
        groupId = $("#FK_RceClientGroupId").val(),
        isTemporary = $("#IsTemporary").val();
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    var url = "/RceReports/ClientDataPrint?clientsId=" + clientsId + "&address=" + address + "&isTemp=" + isTemporary + "&classId=" + classId + "&typeId=" + typeId + "&categoryId=" + categoryId + "&branchId=" + fK_DefBranchId + "&groupId=" + groupId;
    window.open(url, '_blank').print();
});