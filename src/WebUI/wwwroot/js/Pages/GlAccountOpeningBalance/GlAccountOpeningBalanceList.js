$(document).ready(function () {


    // loadGlAccountOpeningBalanceGrid();
    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/GlAccountOpeningBalance/GetAll",
                type: "GET"
            }
        },
        schema: {
            model: {
                id: "id",
                parentId: "parentId",
                fields: {
                    id: { editable: false },
                    mainAccountName: { editable: false },
                    accountCode: { editable: false },
                    accountNameAr: { editable: false },
                    accountNameEn: { editable: false },
                    accountType: { editable: false }, //supplier 6 -  client 7
                    financialPeriodName: { editable: false },
                    p_Debit: { editable: true },
                    p_Credit: { editable: true }

                }
            }
        }
    });

    var grid = $("#GridGlAccountOpeningBalance").kendoTreeList({
        excel: {
            fileName: "Account Opening Balances.xlsx",
            allPages: Resources.GridAllPages,
            filterable: Resources.GridFilterable
        },
        dataSource: dataSource,
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
        columns: [

            { field: "accountCode", title: Resources.AccountCodeResource, width: Resources.NameWidth, expandable: true },
            { template: '#if(isMainAccount==true){#<span style="color:red">#: accountNameAr# </span> #}else{#<span>#: accountNameAr# </span>#}#', title: Resources.AccountNameArResource, width: Resources.NameWidth },
            // { template:'#if(isMainAccount==true){#<span style="color:red">#: accountNameEn# </span> #}else{#<span>#: accountNameEn# </span>#}#', title: Resources.AccountNameEnResource, width: Resources.NameWidth },
            { field: "mainAccountName", title: Resources.MainAccountNameResource, width: Resources.NameWidth },
            { field: "p_Debit", template: "#if(isMainAccount==true){# <input name='p_Debit' style='width:95%' value='#= p_Debit #' disabled/> #}else{# <input  pattern='[0-9]' title='No. must contain digits only' class='debit' value='#= p_Debit #' name='p_Debit' style='width:95%' />#}#", title: Resources.DebitResource, width: Resources.AmountWidth },
            { field: "p_Credit", template: "#if(isMainAccount==true){#<input name='p_Credit' style='width:95%' value='#= p_Credit #' disabled/> #}else{#<input   class='credit' value='#= p_Credit #' name='p_Credit' style='width:95%'/>#}#", title: Resources.CreditResource, width: Resources.AmountWidth },
            { width: Resources.DoubleActionWidth, template: "#if(isMainAccount==true){# #}else{#<button class='btn btn-success btn-sm btnSaveRow'><i class='fas fa-save'></i></button> <button class='btn btn-info btn-sm btnOpenDuration'><i class='fas fa-edit'></i></button> <button class='btn btn-warning btn-sm btnOpenDetails'><i class='fas fa-edit'></i></button>#}# " },
            // { width: Resources.DoubleActionWidth, template: "#if(isMainAccount==true){# #}else{#<button class='btn btn-success btn-sm btnSaveRow'><i class='fas fa-save'></i></button> #}#  #if(isMainAccount==true){# #}else{# #if(accountType==6 ||accountType==7 ){# <button class='btn btn-info btn-sm btnOpenDuration'><i class='fas fa-edit'></i></button> #}else{#  <button class='btn btn-warning btn-sm btnOpenDetails'><i class='fas fa-edit'></i></button>#}# #}#" },
            // { width: Resources.ActionWidth, template: "#if(isMainAccount==true){# #}else{#<button class='btn btn-success btn-sm btnSaveRow'><i class='fas fa-save'></i></button> #}#" },
            // { width: Resources.ActionWidth, template: "#if(isMainAccount==true){# #}else{# #if(accountType==6 ||accountType==7 ){# <button class='btn btn-info btn-sm btnOpenDuration'><i class='fas fa-edit'></i></button> #}else{#  <button class='btn btn-warning btn-sm btnOpenDetails'><i class='fas fa-edit'></i></button>#}# #}#" },
            // { width: Resources.ActionWidth, template: "#if(isMainAccount==true){# #}else{#<button class='btn btn-warning btn-sm btnOpenDetails'><i class='fas fa-edit'></i></button> #}#" },

            { field: "financialPeriodName", title: Resources.FinancialPeriodNameResource, width: Resources.NameWidth }
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
        excelExport: function (e) {
            var accountId = $("#accountName").val();
            var costCenterId = $("#costCenterName").val();
            if (accountId !== "")
                e.workbook.fileName = $("#accountName  option:selected").text();
            else if (costCenterId !== "")
                e.workbook.fileName = $("#costCenterName  option:selected").text();

            var sheet = e.workbook.sheets[0];
            //sheet.frozenRows = 2;
            sheet.mergedCells = ["A1:L1", "A2:G2", "A3:G3"];
            sheet.name = $("#Name").val();
            var now = new Date(),
                today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);

            var branch = getCookie("branchName");
            var FinancialPeriodName = $("#FK_GlFinancialPeriodId option:selected").text();

            var account = [{
                value: Resources.AccountName + " : " + $("#accountAutoComplete").val() + "            " + Resources.FinancialPeriodNameResource + " : " + FinancialPeriodName,
                textAlign: "right",
                background: "#FFFFFF",
                color: "#000000"
            }
            ];
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
            sheet.rows.splice(1, 0, { cells: account, type: "header", height: 40 });
            sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 40 });
            //sheet.rows.splice(sheet.rows.length, 0, { cells: myHeaders, type: "header", height: 70 });
        }
    });

    $('#GridGlAccountOpeningBalance').data('kendoTreeList').dataSource.page(1); // select current page
    grid.data("kendoTreeList").table.on("click", ".btnSaveRow", SaveRow);
    grid.data("kendoTreeList").table.on("click", ".btnOpenDetails", OpenDetails);
    grid.data("kendoTreeList").table.on("click", ".btnOpenDuration", OpenDuration);
    grid.data("kendoTreeList").table.on("change", ".debit", EditRow);
    grid.data("kendoTreeList").table.on("change", ".credit", EditRow);

    function loadGlAccountOpeningBalanceGrid() {

        var dataSource = new kendo.data.TreeListDataSource({
            transport: {
                read: {
                    url: "/GlAccountOpeningBalance/GetAll",
                    type: "GET"
                }
            },
            schema: {
                model: {
                    id: "id",
                    parentId: "parentId",
                    fields: {
                        id: { editable: false },
                        mainAccountName: { editable: false },
                        accountCode: { editable: false },
                        accountNameAr: { editable: false },
                        accountNameEn: { editable: false },
                        financialPeriodName: { editable: false },
                        p_Debit: { editable: true },
                        p_Credit: { editable: true }

                    }
                }
            }
        });

        var grid = $("#GridGlAccountOpeningBalance").kendoTreeList({
            excel: {
                fileName: "Account Opening Balances.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
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
            columns: [

                { field: "accountCode", title: Resources.AccountCodeResource, width: Resources.NameWidth, expandable: true },
                { template: '#if(isMainAccount==true){#<span style="color:red">#: accountNameAr# </span> #}else{#<span>#: accountNameAr# </span>#}#', title: Resources.AccountNameArResource, width: Resources.NameWidth },
                // { template:'#if(isMainAccount==true){#<span style="color:red">#: accountNameEn# </span> #}else{#<span>#: accountNameEn# </span>#}#', title: Resources.AccountNameEnResource, width: Resources.NameWidth },
                { field: "mainAccountName", title: Resources.MainAccountNameResource, width: Resources.NameWidth },
                { field: "p_Debit", template: "#if(isMainAccount==true){# <input name='p_Debit' style='width:95%' value='#= p_Debit #' disabled/> #}else{# <input  pattern='[0-9]' title='No. must contain digits only' class='debit' value='#= p_Debit #' name='p_Debit' style='width:95%' />#}#", title: Resources.DebitResource, width: Resources.AmountWidth },
                { field: "p_Credit", template: "#if(isMainAccount==true){#<input name='p_Credit' style='width:95%' value='#= p_Credit #' disabled/> #}else{#<input   class='credit' value='#= p_Credit #' name='p_Credit' style='width:95%'/>#}#", title: Resources.CreditResource, width: Resources.AmountWidth },
                { width: Resources.ActionWidth, template: "#if(isMainAccount==true){# #}else{#<button class='btn btn-success btn-sm btnSaveRow'><i class='fas fa-save'></i></button> #}#" },
                { width: Resources.ActionWidth, template: "#if(isMainAccount==true){# #}else{#<button class='btn btn-warning btn-sm btnOpenDetails'><i class='fas fa-edit'></i></button> #}#" },

                { field: "financialPeriodName", title: Resources.FinancialPeriodNameResource, width: Resources.NameWidth }
            ],
            //dataBound: function (e) {
            //    e.sender.items().each(function () {
            //        var dataItem = e.sender.dataItem(this);
            //        kendo.bind(this, dataItem);

            //        if (dataItem.isActive) {
            //            //$(this).addClass("k-state-selected");
            //        }
            //    });


            //},
            excelExport: function (e) {
                var accountId = $("#accountName").val();
                var costCenterId = $("#costCenterName").val();
                if (accountId !== "")
                    e.workbook.fileName = $("#accountName  option:selected").text();
                else if (costCenterId !== "")
                    e.workbook.fileName = $("#costCenterName  option:selected").text();

                var sheet = e.workbook.sheets[0];
                //sheet.frozenRows = 2;
                sheet.mergedCells = ["A1:L1", "A2:G2", "A3:G3"];
                sheet.name = $("#Name").val();
                var now = new Date(),
                    today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);

                var branch = getCookie("branchName");
                var FinancialPeriodName = $("#FK_GlFinancialPeriodId option:selected").text();

                var account = [{
                    value: Resources.AccountName + " : " + $("#accountAutoComplete").val() + "            " + Resources.FinancialPeriodNameResource + " : " + FinancialPeriodName,
                    textAlign: "right",
                    background: "#FFFFFF",
                    color: "#000000"
                }
                ];
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
                sheet.rows.splice(1, 0, { cells: account, type: "header", height: 40 });
                sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 40 });
                //sheet.rows.splice(sheet.rows.length, 0, { cells: myHeaders, type: "header", height: 70 });
            }
        });

        $('#GridGlAccountOpeningBalance').data('kendoTreeList').dataSource.page(1); // select current page
        grid.data("kendoTreeList").table.on("click", ".btnSaveRow", SaveRow);
        grid.data("kendoTreeList").table.on("click", ".btnOpenDetails", OpenDetails);
        grid.data("kendoTreeList").table.on("change", ".debit", EditRow);
        grid.data("kendoTreeList").table.on("change", ".credit", EditRow);

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

    function SaveRow() {

        var row = $(this).closest("tr"),
            grid = $("#GridGlAccountOpeningBalance").data("kendoTreeList"),
            dataItem = grid.dataItem(row);
        var debit = row.closest("tr").find('input[name$="p_Debit"]').val();
        var credit = row.closest("tr").find('input[name$="p_Credit"]').val();
        var fK_GlFinancialPeriodId = dataItem.fK_GlFinancialPeriodId;
        if (fK_GlFinancialPeriodId == 0) {
            swal({
                title: Resources.MustAddFinancialPeriodFirstResource,
                confirmButtonText: Resources.DoneResource,
                type: "warning"
            });
            return;
        }
        var FK_GlAccountId = dataItem.fK_GlAccountId;
        var matchedDebit = false;
        var matchedCredit = false;
        var branchId = parseInt($("#FK_DefBranchId").val());

        var data = {
            financialPeriodId: fK_GlFinancialPeriodId,
            accountId: FK_GlAccountId,
            debit: parseFloat(debit),
            credit: parseFloat(credit),
            branchId: branchId
        };
        if (!debit.match('[-+]?([0-9]*.[0-9]+|[0-9]+)'))
            matchedDebit = false;
        else
            matchedDebit = true;

        if (!credit.match('[-+]?([0-9]*.[0-9]+|[0-9]+)'))
            matchedCredit = false;

        else
            matchedCredit = true;


        if (matchedDebit && matchedCredit) {
            $.ajax({
                url: "/GlAccountOpeningBalance/SaveGridRow",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result) {
                        refreshGridAOB();

                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }
                    else {
                        swal({
                            title: Resources.DefaultErrorMessageResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                },
                error: function (err, xqr, txt) { }
            });
        }
        else
            $("#matchedMsg").show();



    }

    function EditRow() {
    
        var row = $(this).closest("tr"),
            grid = $("#GridGlAccountOpeningBalance").data("kendoTreeList"),
            dataItem = grid.dataItem(row);
        var debit = row.closest("tr").find('input[name$="p_Debit"]').val();
        var credit = row.closest("tr").find('input[name$="p_Credit"]').val();
        var fK_GlFinancialPeriodId = dataItem.fK_GlFinancialPeriodId;
        if (fK_GlFinancialPeriodId == 0) {
            swal({
                title: Resources.MustAddFinancialPeriodFirstResource,
                confirmButtonText: Resources.DoneResource,
                type: "warning"
            });
            return;
        }
        var FK_GlAccountId = dataItem.fK_GlAccountId;
        var matchedDebit = false;
        var matchedCredit = false;

        var data = {
            financialPeriodId: fK_GlFinancialPeriodId,
            accountId: FK_GlAccountId,
            debit: parseFloat(debit),
            credit: parseFloat(credit)
        };
        if (!debit.match('[-+]?([0-9]*.[0-9]+|[0-9]+)'))
            matchedDebit = false;
        else
            matchedDebit = true;

        if (!credit.match('[-+]?([0-9]*.[0-9]+|[0-9]+)'))
            matchedCredit = false;

        else
            matchedCredit = true;
        var treeData = grid.dataSource.data()

        if (matchedDebit && matchedCredit) {


            calcAllParentAccount(dataItem.parentId);

        }
        else
            $("#matchedMsg").show();



    }

    function OpenDetails() {

        var row = $(this).closest("tr"),
            grid = $("#GridGlAccountOpeningBalance").data("kendoTreeList"),
            dataItem = grid.dataItem(row);
        var fK_GlFinancialPeriodId = dataItem.fK_GlFinancialPeriodId;

        if (fK_GlFinancialPeriodId == 0) {
            swal({
                title: Resources.MustAddFinancialPeriodFirstResource,
                confirmButtonText: Resources.DoneResource,
                type: "warning"
            });
            return;
        }
        $("#balanceDetailModal").modal();
        var url = '/GlAccountOpeningBalance/DistributionOpeningBalances?accId=' + dataItem.fK_GlAccountId + '&fpId=' + dataItem.fK_GlFinancialPeriodId;
        var divBody = $('#modalBody');
        divBody.load(url);
        $("#balanceDetailModal").modal();
        // document.location = "../../GlAccountOpeningBalance/DistributionOpeningBalances?accId=" + dataItem.fK_GlAccountId + "&fpId=" + $("#FK_GlFinancialPeriodId").val()


    }

    function OpenDuration() {
        
        var row = $(this).closest("tr"),
            grid = $("#GridGlAccountOpeningBalance").data("kendoTreeList"),
            dataItem = grid.dataItem(row);
        var debitValue = row.closest("tr").find('input[name$="p_Debit"]').val();
        var creditValue = row.closest("tr").find('input[name$="p_Credit"]').val();
        var fK_GlFinancialPeriodId = dataItem.fK_GlFinancialPeriodId;

        if (fK_GlFinancialPeriodId == 0) {
            swal({
                title: Resources.MustAddFinancialPeriodFirstResource,
                confirmButtonText: Resources.DoneResource,
                type: "warning"
            });
            return;
        }
        $("#balanceDurationModal").modal();
        var url = "/GlAccountOpeningBalance/GetDurationsOpeningBalances?accId=" + dataItem.fK_GlAccountId + "&fpId=" + $("#FK_GlFinancialPeriodId").val() + "&accountCode=" + dataItem.accountCode + "&accountName=" + dataItem.accountNameAr;

        $("#dFK_DefBranchId").val(parseInt($("#FK_DefBranchId").val()));
        $("#dGlAccountId").val(dataItem.fK_GlAccountId);
        $("#dGlFinancialPeriodId").val($("#FK_GlFinancialPeriodId").val());
        $("#totalBalance").val("");

     

        if (debitValue > 0) {

            $("#DDebit").val(debitValue);
            $("#DCredit").val(null);
            $("#DDebit").attr('readonly', true);
            $("#DCredit").attr('readonly', true);
        } else if (creditValue > 0) {
            $("#DCredit").val(creditValue);
            $("#DDebit").val(null);
            $("#DDebit").attr('readonly', true);
            $("#DCredit").attr('readonly', true);
        } else {
            $("#DDebit").val(null);
            $("#DCredit").val(null);
            $("#DDebit").attr('readonly', false);
            $("#DCredit").attr('readonly', false);
        }



        var entryDate = new Date();
        var entryDateFormated = entryDate.getFullYear() + "-" + ("0" + (entryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + entryDate.getDate()).slice(-2);
        $("#EntryDate").val(entryDateFormated);
        $.ajax({
            type: "POST",
            url: url,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                if (response) {
                    debugger
                    var entryDate = new Date(response.entryDate);
                    var entryDateFormated = entryDate.getFullYear() + "-" + ("0" + (entryDate.getMonth() + 1)).slice(-2) + "-" + ("0" + entryDate.getDate()).slice(-2);

                    if (response.debit > 0 || response.credit > 0)
                        $("#EntryDate").val(entryDateFormated);

                    $("#dDescription").val(response.description);
                    $("#AccountCodeName").val(response.accountCodeName);
                    //$("#DDebit").val(response.debit);
                    //$("#DCredit").val(response.credit);
                    $("#DurationOne").val(response.durationOne);
                    $("#DurationTwo").val(response.durationTwo);
                    $("#DurationThree").val(response.durationThree);
                    $("#DurationFour").val(response.durationFour);
                    $("#DurationFive").val(response.durationFive);
                    $("#DurationSix").val(response.durationSix);

                    if (response.debit != null && response.debit > 0)
                        $("#totalBalance").val(response.debit);

                    if (response.credit != null && response.credit > 0)
                        $("#totalBalance").val(response.credit);

                } else {
                    swal({
                        title: Resources.ErrorMsgResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });

                }
            }
        });
    }


    function calcAllParentAccount(accountId) {
        var gridData = $('#GridGlAccountOpeningBalance').data("kendoTreeList").dataSource.data(),
            grid = $("#GridGlAccountOpeningBalance").data("kendoTreeList"),
            parentId = 0,
            credit = 0,
            debit = 0;
        for (var i = 0; i < gridData.length; i++) {

            for (var j = 0; j < gridData.length; j++) {

                if (gridData[j].parentId == accountId) {
                    var currentUid = gridData[j].uid;
                    var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
                    var rowcredit = $(currentRow).find('input[name$="p_Credit"]').val();
                    var rowdebit = $(currentRow).find('input[name$="p_Debit"]').val();
                    credit += parseFloat(rowcredit);
                    debit += parseFloat(rowdebit);

                }
                if (gridData[j].id == accountId && gridData[j].parentId > 0) {
                    parentId = gridData[j].parentId;
                }
            }

            for (var k = 0; k < gridData.length; k++) {

                if (gridData[k].id == accountId) {
                    var currentUid = gridData[k].uid;
                    var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
                    $(currentRow).find('input[name$="p_Credit"]').val(credit);
                    $(currentRow).find('input[name$="p_Debit"]').val(debit);

                }
            }
            credit = 0;
            debit = 0;
            accountId = parentId;

        }
    }
    dataSourceDdlTree = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllAccountsForDDLTree",
                Type: "GET"
            }
        },
        schema: {
            model: {
                id: "id",
                hasChildren: "hasChildren"
            }
        }
    });

    $("#accountsDDLTree").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        checkboxes: true,
        checkAll: true,
        autoClose: false
    });


    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: "/GlAccount/GetAllMainAccountsWithDescendants",
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
                        ids: $("#accountsDDLTree").data("kendoDropDownTree").value().join(", "),
                        date: $("#Date").val(),
                        isActive: isActive,
                        fK_DefBranchId: parseInt($("#FK_DefBranchId").val())
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
                    //Id: { editable: false },
                    id: { type: "number", nullable: false },
                    fK_ParentId: { field: "fK_ParentId", nullable: true },
                    accountCode: { type: "string", validation: { required: true } },
                    accountNameAr: { type: "string", validation: { required: true } },
                    accountNameEn: { type: "string", validation: { required: true } },
                    fK_CreatorId: { editable: false },
                    creationDateFormatted: { editable: false },
                    isActive: { editable: false },
                    //Children: { editable: false },

                },
                //expanded: true
            }
        }
    });


});

function SaveGridData() {

    var List = [];
    var matchedDebit = false;
    var matchedCredit = false;
    var gridData = $('#GridGlAccountOpeningBalance').data("kendoTreeList").dataSource.data(),
        grid = $("#GridGlAccountOpeningBalance").data("kendoTreeList");
    for (var i = 0; i < gridData.length; i++) {
        if (gridData[i].isMainAccount == false) {
            var fK_GlAccountId = gridData[i].fK_GlAccountId;
            var fK_GlFinancialPeriodId = gridData[i].fK_GlFinancialPeriodId;
            if (fK_GlFinancialPeriodId == 0) {
                swal({
                    title: Resources.MustAddFinancialPeriodFirstResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "warning"
                });
                break;
            }
            var currentUid = gridData[i].uid;
            var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
            var credit = $(currentRow).find('input[name$="p_Credit"]').val();
            var debit = $(currentRow).find('input[name$="p_Debit"]').val();

            if (!String(debit).match('[-+]?([0-9]*.[0-9]+|[0-9]+)')) {
                $("#matchedMsg").show();
                matchedDebit = false;
                break;
            }
            else {
                $("#matchedMsg").hide();
                matchedDebit = true;
            }
            if (!String(credit).match('[-+]?([0-9]*.[0-9]+|[0-9]+)')) {
                $("#matchedMsg").show();
                matchedCredit = false;
                break;
            }
            else {
                $("#matchedMsg").hide();
                matchedCredit = true;
            }
            var data = {
                financialPeriodId: fK_GlFinancialPeriodId,
                accountId: fK_GlAccountId,
                debit: parseFloat(debit),
                credit: parseFloat(credit)
            };

            List.push(data);
        }


    }
    if (matchedDebit && matchedCredit) {
        $.ajax({
            url: "/GlAccountOpeningBalance/SaveGrid",
            type: "Post",
            cache: false,
            processData: false,
            data: JSON.stringify(List),
            contentType: 'application/json',
            success: function (result) {

                if (result) {

                    refreshGridAOB();
                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });
                }
                else {
                    swal({
                        title: Resources.DefaultErrorMessageResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }
            },
            error: function (err, xqr, txt) { }
        });
    }
}

function refreshGridAOB() {
    $('#GridGlAccountOpeningBalance').data('kendoTreeList').dataSource.read();
}


$("#btnSearch").on('click', function () {

    //var accountId = parseInt($("#FK_GlAccountId").val());
    var accountId = $("#accountsDDLTree").data("kendoDropDownTree").value().join(", ");
    var financialPeriodId = parseInt($("#FK_GlFinancialPeriodId").val());
    var fK_DefBranchId = parseInt($("#FK_DefBranchId").val());
    $('#GridGlAccountOpeningBalance').data('kendoTreeList').dataSource.read({ accountId: accountId, financialPeriodId: financialPeriodId, fK_DefBranchId: fK_DefBranchId });


});

$(".exportExcel").on('click', function () {
    $("#GridGlAccountOpeningBalance").getKendoTreeList().saveAsExcel();
});

