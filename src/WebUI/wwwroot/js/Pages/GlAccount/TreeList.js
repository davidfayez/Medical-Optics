$(document).ready(function () {
    $('#DefBranches').change(function () {

        $("#accountsDDLTree").data("kendoDropDownTree").value("");
        $("#accountsDDLTree").data("kendoDropDownTree").dataSource.read();

    });

    /** Begin Kendo Dropdown Tree (GLAccount)*/
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET"
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    return {
                        id: data.id,
                        defBranchId: parseInt($("#FK_DefBranchId").val()),
                    };
                } else {
                    return data;
                }
            }
        },
        requestEnd: function (response) {
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });
    var counter = 0;
    var firstRequest = true;
    $("#accountsDDLTree").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        checkboxes: {
            checkChildren: true,
        },
        checkAll: true,
        autoClose: false,
        dataBound: function (e) {
            if (firstRequest == true) {

                $("#iRefreshGLAccount").addClass("fa-spin");
                $("#accountsDDLTree").data("kendoDropDownTree").enable(false);
                var ddt = e.sender;
                var dataSource = ddt.dataSource;
                var node = e.node;

                if (!node) {
                    var children = dataSource.data();

                    children.forEach(function (item, index) {
                        if (item.hasChildren) {
                            counter++;
                        }
                    });
                } else {
                    var children = ddt.treeview.dataItem(node).children.data();

                    children.forEach(function (item, index) {
                        if (item.hasChildren) {
                            counter++;
                        }
                    });

                    counter--;
                }

                if (counter === 0) {
                    // alert("Fully bound");
                    firstRequest = false;
                    $("#accountsDDLTree").data("kendoDropDownTree").enable(true);
                    $("#iRefreshGLAccount").removeClass("fa-spin");
                }
            }

        }
    });


    /**   End Kendo Dropdown Tree (GLAccount)  */




    /** Begin Tree List (GlAccount) */

    var dataSource = new kendo.data.TreeListDataSource({
        type:"json",
        transport: {
            read: {
                url: "/GlAccount/GetAllMainAccountsWithDescendants",
                dataType: "json",
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
                        ids: $("#accountsDDLTree").data("kendoDropDownTree").value().join(", "),
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
                parentId: "fK_ParentId",
                fields: {
                    id: { type: "number", nullable: false },
                    fK_ParentId: { field: "fK_ParentId", nullable: true },
                    accountCode: { type: "string", validation: { required: true } },
                    accountNameAr: { type: "string", validation: { required: true } },
                    description: { type: "string", validation: { required: true } },
                    fK_CreatorId: { editable: false },
                    creationDateFormatted: { editable: false },
                    isActive: { editable: false },

                },
                //expanded: true
            }
        }
    });

    var treeList = $("#gridGlAccountWithDescendants").kendoTreeList({
        dataSource: dataSource,
        pageable: true,
        //reorderable: true,
        //toolbar: ["create","excel"],
        //toolbar: ["excel"],
        excel: {
            fileName: "Gl Accounts.xlsx",
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
            {
                template: '#if(isMainAccount==true){#<span style="color:red">#: accountNameAr# </span> #}else{#<span>#: accountNameAr# </span>#}#', title: Resources.AccountNameArResource, width: Resources.NameWidth},


            { width: Resources.DoubleActionWidth, template: "<a  href='/GlAccount/Edit/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>", attributes: { 'class': 'k-text-left', style: 'text-align: left' } },

           
            { field: "accountCategory", title: Resources.AccountCategory, width: Resources.NameWidth},
            { field: "glAccountTypeName",title: Resources.CbAccountTypeResource, width: Resources.NameWidth },

            { width: Resources.DateWidth, template: "#if( isMainAccount  == true){#  <input type='checkbox' checked class= 'control-label i-check' disabled = 'disabled' /> #}else{ #<input type='checkbox' class= 'control-label i-check' disabled = 'disabled' />#}#", headerTemplate: Resources.IsMainResources },

            { width: Resources.DateWidth, template: "#if( isVisibleTaxReturn  == true){#  <input type='checkbox' checked class= 'control-label i-check' disabled = 'disabled' /> #}else{ #<input type='checkbox' class= 'control-label i-check' disabled = 'disabled' />#}#", headerTemplate: Resources.IsVisibleTaxReturnResources },

            { width: Resources.DateWidth, template: "#if( isVisibleInEstimatedBudget  == true){#  <input type='checkbox' checked class= 'control-label i-check' disabled = 'disabled' /> #}else{ #<input type='checkbox' class= 'control-label i-check' disabled = 'disabled' />#}#", headerTemplate: Resources.IsVisibleInEstimatedBudgetResource },

            { width: Resources.CheckboxWidth, template: "#if( isActive  == true){#  <input type='checkbox' checked class= 'control-label i-check' disabled = 'disabled' /> #}else{ #<input type='checkbox' class= 'control-label i-check' disabled = 'disabled' />#}#", headerTemplate: Resources.StatusResource },
            { field: "creationDateFormatted", title: Resources.CreationDate, width: Resources.DateWidth },

          

        ],
        dataBound: function (e) {
            e.sender.items().each(function () {
                // var dataItem = e.sender.dataItem(this);
                // kendo.bind(this, dataItem);

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


    $('#gridGlAccountWithDescendants').data('kendoTreeList').dataSource.page(1); // select current page
    treeList.data("kendoTreeList").table.on("click", ".btnDelete", DeleteAccount);
    //treeList.data("kendoTreeList").table.on("click", ".btnEdit", EditAccount);

    function DeleteAccount() {
        var row = $(this).closest("tr"),
            treeList = $("#gridGlAccountWithDescendants").data("kendoTreeList"),
            dataItem = treeList.dataItem(row);
       

        $.ajax({
            url: "/GlAccount/IsAccountInUse?id=" + dataItem.id,
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {

                if (result) {
                    swal({
                        title: Resources.AccountIsInUseErrorMsg,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }
                else {
                    $.ajax({
                        url: "/GlAccount/CheckAccountCanEditDelete?id=" + dataItem.id,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {

                            if (result.isGlAccount) {
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
                                            url: "/GlAccount/Delete?id=" + dataItem.id,
                                            type: "Get",
                                            contentType: 'application/json; charset=utf-8',
                                            success: function (result) {

                                                if (result) {
                                                    RefreshGrid();

                                                    swal({
                                                        title: Resources.DeleteSuccessResource,
                                                        confirmButtonText: Resources.DoneResource,
                                                        type: "success",
                                                    }, function () { });
                                                }
                                                else {
                                                    swal({
                                                        title: Resources.AccountDeleteError,
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
                            else if (!result.isGlAccount && result.accType == "CashBank") {
                                swal({
                                    title: Resources.DeleteResource,
                                    text: Resources.CashBankEditDeleteMessage,
                                    type: "info",
                                    showCancelButton: true,
                                    confirmButtonText: Resources.DeleteResource,
                                    cancelButtonText: Resources.CancelResource,
                                    closeOnConfirm: true,
                                    showLoaderOnConfirm: true
                                }, function () {
                                    setTimeout(function () {
                                        window.open("/CbCashAndBankAccount/Edit?id=" + result.id, '_blank');
                                    }, 1000);
                                });
                            }
                        },
                        error: function (err, xqr, txt) { }
                    });
                }
            },
            error: function (err, xqr, txt) { }
        });


    }

    function EditAccount() {
        var row = $(this).closest("tr"),
            treeList = $("#gridGlAccountWithDescendants").data("kendoTreeList"),
            dataItem = treeList.dataItem(row);
        $.ajax({
            url: "/GlAccount/CheckAccountCanEditDelete?id=" + dataItem.id,
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
               
                if (result.isGlAccount) {
                    document.location = "/GlAccount/Edit?id=" + dataItem.id;
                }
                else if (!result.isGlAccount && result.accType == "CashBank") {
                    swal({
                        title: Resources.Edit,
                        text: Resources.CashBankEditDeleteMessage,
                        type: "info",
                        showCancelButton: true,
                        confirmButtonText: Resources.Edit,
                        cancelButtonText: Resources.CancelResource,
                        closeOnConfirm: true,
                        showLoaderOnConfirm: true
                    }, function () {
                        setTimeout(function () {
                            window.open("/CbCashAndBankAccount/Edit?id=" + result.id, '_blank');
                        }, 1000);
                    });
                }
            },
            error: function (err, xqr, txt) { }
        });

    }

});

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

$(".exportExcel").on('click', function () {
    $("#gridGlAccountWithDescendants").getKendoTreeList().saveAsExcel();
});

$("#btnDataReview").on('click', function () {
    var nameAr = $("#AccountNameAr").val();
    var nameEn = $("#AccountNameEn").val();
    var accountIds = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");
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
    // dataSource.filter({ field: "nameAr", operator: "startswith", value: "أ" });
    $('#gridGlAccountWithDescendants').data('kendoTreeList').dataSource.read();

}