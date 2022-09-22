$(document).ready(function () {
    $('#DefBranches').change(function () {

        $("#RceClientAccountsDDLTree").data("kendoDropDownTree").value("");
        $("#RceClientAccountsDDLTree").data("kendoDropDownTree").dataSource.read();

    });
    // kendoDropDownTree
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/RceLookups/GetAllAccountsForDDLTree",
                Type: "GET"
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                        subAccType: 7 //عميل
                    };
                } else {
                    return data;
                }
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });

    $("#RceClientAccountsDDLTree").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        checkboxes: {
            checkChildren: true
        },
        checkAll: true,
        autoClose: false
    });

    //LIST 
    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/RceLookups/GetAllMainAccountsWithDescendants",
                dataType: "json",
                //dataType: "jsonp"
                Type: "GET"
            },
            parameterMap: function (data, action) {
                var isActive = $("#IsActive").val();
                if (isActive == "1")
                    isActive = true
                else if (isActive == "2")
                    isActive = false
                if (action === "read") {
                    return {
                        nameAr: $("#AccountNameAr").val(),
                        nameEn: $("#AccountNameEn").val(),
                        ids: $("#RceClientAccountsDDLTree").data("kendoDropDownTree").value().join(", "),
                        date: $("#Date").val(),
                        isActive: isActive,
                        fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        firstRequest: $("#hdnFirstRequest").val()
                    };
                } else {
                    return data;
                }
            }
        },
        //batch: true,
        schema: {
            model: {
                id: "id",
                parentId: "parentId",
                fields: {
                    id: { type: "number", nullable: false },
                    parentId: { field: "parentId", nullable: true },
                    // fK_ParentId: { field: "fK_ParentId", nullable: true },
                    accountCode: { type: "string", validation: { required: true } },
                    accountNameAr: { type: "string", validation: { required: true } },
                    accountNameEn: { type: "string", validation: { required: true } },
                    creationDate: { type: "date", editable: false },
                    isMainAccount: { editable: false },
                    isActive: { editable: false },
                },
                //expanded: true
            }
        }
    });

    var grid = $("#RceClientGrid").kendoTreeList({
        dataSource: dataSource,
        pageable: true,
        //reorderable: true,
        //toolbar: ["create","excel"],
        //toolbar: ["excel"],
        excel: {
            fileName: "Clients Accounts.xlsx",
            allPages: Resources.GridAllPages,
            filterable: Resources.GridFilterable
        },
        //editable: "incell",
        height: 540,
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
            pageSizes: [20, 40, 60, Resources.All],
            numeric: Resources.GridNumeric,
            refresh: Resources.GridRefresh,

        },
        //editable: true,
        columns: [
            { field: "accountCode", title: Resources.Code, width: Resources.NameWidth },
            { template: '#if(isMainAccount==true){#<span style="color:red">#: accountNameAr# </span> #}else{#<span>#: accountNameAr# </span>#}#', title: Resources.AccountNameArResource, width: Resources.NameWidth },

            //{ field: "accountNameAr", title: Resources.NameArResource, width: Resources.NameWidth },
            //{ field: "accountNameEn", title: Resources.NameEnResource, width: Resources.NameWidth },
            { width: Resources.CheckboxWidth, template: "#if( isActive  == true){#  <input type='checkbox' checked class= 'control-label i-check' disabled = 'disabled' /> #}else{ #<input type='checkbox' class= 'control-label i-check' disabled = 'disabled' />#}#", headerTemplate: Resources.StatusResource },
            { field: "creationDate", title: Resources.CreationDate, width: Resources.DateWidth, format: "{0:yyyy/MM/dd}" },
            { width: Resources.DoubleActionWidth, template: "#if(isMainAccount != true){ #<a  href='/RceLookups/EditRceClient/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> #}#" }
        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                var dataItem = e.sender.dataItem(this);
                kendo.bind(this, dataItem);

            });
            if (!hasRoleEdit)
                $(".btnEdit").addClass('disabled');

            if (!hasRoleDelete)
                $(".btnDelete").addClass('disabled');
        },
        excelExport: function (e) {
            var accountId = $("#accountName").val();
            var costCenterId = $("#costCenterName").val();
            if (accountId !== "")
                e.workbook.fileName = $("#accountName  option:selected").text();
            else if (costCenterId !== "")
                e.workbook.fileName = $("#costCenterName  option:selected").text();

            var workbook = e.workbook;
            var sheet = workbook.sheets[0];

            workbook.rtl = true;
            for (var i = 0; i < sheet.rows.length; i++) {
                sheet.rows[i].cells.reverse();
                for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
                    sheet.rows[i].cells[ci].hAlign = "right";
                }
            }

            for (var i = 0; i < sheet.columns.length; i++) {
                if (i < 3)
                    sheet.columns[i].autoWidth = true;
                else
                    sheet.columns[i].width = 35;

            }



            //sheet.frozenRows = 2;
            sheet.mergedCells = ["A1:D1", "A2:D2"];
            sheet.name = $("#Name").val();
            var now = new Date(),
                today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);

            var branch = getCookie("branchName");
            var myHeaders = [{
                value: Resources.Branch + " : " + branch + "       " + Resources.Date + " : " + today.toString('dd-MMM-yyyy'),
                textAlign: "right",
                background: "#FFFFFF",
                color: "#000000"
            }
            ];
            var title = [{
                value: $("#Name").val(),
                textAlign: "center",
                background: "#FFFFFF",
                color: "#000000"
            }];
            sheet.rows.splice(0, 0, { cells: title, type: "header", height: 40 });
            sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 40 });
        }
    });


    $('#RceClientGrid').data('kendoTreeList').dataSource.page(1); // select current page
    grid.data("kendoTreeList").table.on("click", ".btnDelete", removeRceClient);
    function removeRceClient() {

        //var deletee = stringify(resources.delete).serialize();

        var row = $(this).closest("tr"),
            grid = $("#RceClientGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
        swal({
            title: Resources.DeleteResource,
            text: Resources.DeleteConfirmResource,
            type: "info",
            showCancelButton: true,
            confirmButtonText: Resources.DeleteResource,
            cancelButtonText: Resources.CancelResource,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                $.ajax({
                    url: "/RceLookups/DeleteRceClient?Id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            loadRceClientGrid();
                            //grid.refresh();
                            //grid.dataSource.filter(filters);
                            swal({
                                title: Resources.DeleteSuccessResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            });
                        }
                        else {
                            swal({
                                title: Resources.DeleteFailedResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    },
                    error: function (err, xqr, txt) { }
                });

            }, 3000);
        });
    }


    $("#btnDataReview").on('click', function () {
        var nameAr = $("#AccountNameAr").val();
        var nameEn = $("#AccountNameEn").val();
        var accountIds = $("#RceClientAccountsDDLTree").data("kendoDropDownTree").value().join(", ");
        var date = $("#Date").val();
        var active = $("#IsActive").val();
        if (nameAr == '' && nameEn == '' && accountIds == '' && (active == true || active == '')) {
            $("#hdnFirstRequest").val('true');
        }
        else {
            $("#hdnFirstRequest").val('false');
        }
        RefreshGrid();
    });

    function RefreshGrid() {

        $('#RceClientGrid').data('kendoTreeList').dataSource.read();
    }
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    //$("#DefBranches").change(function () {
    //    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    //    $('#RceClientGrid').data('kendoGrid').dataSource.read({ fK_DefBranchId: fK_DefBranchId });
    //});

    //loadRceClientGrid();

    //function loadRceClientGrid() {
    //    var dataSource = new kendo.data.DataSource({
    //        transport: {
    //            read: {
    //                url: "/RceLookups/GetAllRceClient",
    //                Type: "GET"
    //            }
    //        },
    //        error: function (e) {
    //            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
    //        },
    //        pageSize: Resources.GridPageSize,
    //        schema: {
    //            model: {
    //                id: "id",
    //                fields: {
    //                    id: { editable: false },
    //                    clientCode: { editable: false },
    //                    clientNameAr: { editable: false },
    //                    clientNameEn: { editable: false },
    //                    description: { editable: false },
    //                    FK_CreatorId: { editable: false },
    //                    creationDate: { type: "date", editable: false },
    //                    lastModifiedDate: { type: "date", editable: false },
    //                    isActive: { editable: false },
    //                    isDeleted: { editable: false },

    //                }
    //            }
    //        }
    //    });


    //    var grid = $("#RceClientGrid").kendoGrid({
    //        excel: {
    //            fileName: "Supplier.xlsx",
    //            allPages: Resources.GridAllPages,
    //            filterable: Resources.GridFilterable
    //        },
    //        dataSource: dataSource,
    //        pageSize: 20,
    //        serverPaging: Resources.GridServerPaging,
    //        serverFiltering: Resources.GridServerFiltering,
    //        filterable: Resources.GridFilterable,
    //        height: Resources.GridHeight,
    //        groupable: Resources.GridGroupable
    //        ,
    //        sortable: Resources.GridSortable,
    //        resizable: Resources.GridResizable,
    //        noRecords: Resources.GridNoRecords,
    //        messages: {
    //            noRecords: Resources.GridNoRecordsMessage
    //        },
    //        pageable: {
    //            pageSizes: [20, 40, 60, Resources.All],
    //            numeric: Resources.GridNumeric,
    //            refresh: Resources.GridRefresh,

    //        },
    //        columns: [

    //            { field: "clientCode", title: Resources.CodeResource, width: Resources.CodeWidth },
    //            { field: "clientNameAr", title: Resources.NameArResource, width: Resources.NameWidth },
    //            { field: "clientNameEn", title: Resources.NameEnResource, width: Resources.NameWidth },

    //            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },

    //            {
    //                field: "creationDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
    //                filterable: {
    //                    operators: {
    //                        date: {
    //                            gte: Resources.IsAfterOrEqualTo,
    //                            lte: Resources.IsBeforeOrEqualTo
    //                        }
    //                    },
    //                    extra: false,
    //                    ui: function (element) {
    //                        element.kendoDatePicker({
    //                            format: '{0: dd/MM/yyyy}'
    //                        })
    //                    }
    //                }
    //            },
    //            { width: Resources.DoubleActionWidth, template: "<a  href='/RceLookups/EditRceClient/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete ' ><i class='fas fa-trash-alt'></i></a>" },

    //        ],
    //        dataBound: function (e) {
    //            e.sender.items().each(function () {
    //                var dataItem = e.sender.dataItem(this);
    //                kendo.bind(this, dataItem);

    //            });
    //            if (!hasRoleEdit)
    //                $(".btnEdit").addClass('disabled');

    //            if (!hasRoleDelete)
    //                $(".btnDelete").addClass('disabled');
    //        },
    //        //resizable: true
    //    });
    //    grid.data("kendoGrid").table.on("click", ".btnDelete", removeRceClient);
    //}


});
$(".exportExcel").on('click', function () {
    $("#RceClientGrid").getKendoGrid().saveAsExcel();
});