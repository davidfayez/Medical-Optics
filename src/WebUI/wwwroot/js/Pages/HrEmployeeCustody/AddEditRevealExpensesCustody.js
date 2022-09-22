$(document).ready(function () {
    $("#DefBranches").change(function () {

        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").dataSource.read();
        $("#FK_HrEmployeeCustodyId").data("kendoDropDownList").value(0);

        $("#FK_DistractedToId").data("kendoDropDownList").dataSource.read();
        $("#FK_DistractedToId").data("kendoDropDownList").value(0);

        $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();
        $("#FK_TaxesId").data("kendoDropDownList").value(0);


        $("#FK_PaySupplierId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierId").data("kendoDropDownList").dataSource.read();
        loadCustodyDetailGrid(0);
    });
    var supplierCodeDataSource = new kendo.data.DataSource({

        //serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/PayLookups/GetAllSuppliersForDDLList",
            },
            parameterMap: function (data, action) {

                if (action === "read") {
                    if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };
                    } else {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
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
    $("#FK_PaySupplierId").kendoDropDownList({

        dataSource: supplierCodeDataSource,
        //placeholder: Resources.AutocompleateChoose,
        /*   select: onSelectSupplier,*/
        //change: onChangeSupplier,
        //placeholder: Resources.AutocompleateChoose,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
    $('#addAnotherSupplier').click(function () {

        if ($('#SupplierName').is('[readonly]')) {
            $("#SupplierName").attr("readonly", false);
            $("#SupplierNumber").attr("readonly", false);

            $("#SupplierName").val("");
            $("#SupplierNumber").val("");

            $(this).removeClass("text-success");
            $(this).addClass("text-danger");
            $("#FK_PaySupplierId").data("kendoDropDownList").enable(false);
        } else {
            $("#SupplierName").attr("readonly", true);
            $("#SupplierNumber").attr("readonly", true);

            $("#SupplierName").val("");
            $("#SupplierNumber").val("");
            $(this).removeClass("text-danger");
            $(this).addClass("text-success");
            $("#FK_PaySupplierId").data("kendoDropDownList").enable(true);

        }
        $("#FK_PaySupplierId").data("kendoDropDownList").value("0");
    });
    $("#AllAcounts").change(function () {

        var dataSource = $("#accountAutoComplete").data("kendoDropDownList").dataSource;
        if ($("#AllAcounts").is(':checked')) {
            debugger;
            dataSource.transport.options.read.url = "/GlAccount/GetAllAccountsForDDList";
        }
        else {
            dataSource.transport.options.read.url = "/GlAccount/GetOperatingExpenseAccountsForDDList";
        }
        dataSource.read();
        $("#accountAutoComplete").data("kendoDropDownList").refresh();


    });

    $("#FK_HrEmployeeCustodyId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployeeCustody/GetAllHrEmployeeCustodyForDDList",
                },
                parameterMap: function (data, action) {


                    if (action === "read") {
                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val()),
                            employeeId: parseInt($("#EmployeeId").val()),
                        };

                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectEmployeeCustody
    });

    function onSelectEmployeeCustody(e) {

        var FK_DistractedToId = parseInt(e.dataItem.fK_HrEmployeeId);
        var FK_GlAccountId = parseInt(3807);
        $("#CustodyName").val(e.dataItem.custodyName);
        $("#FK_CbCustodyTypeId").val(e.dataItem.fK_CbCustodyTypeId);
        $("#TotalCustody").val(e.dataItem.totalAmount);
        $("#FK_HrEmployeeId").val(e.dataItem.fK_HrEmployeeId);

        $("#AccountStatementSerial").val(e.dataItem.accountStatementSerial);
        debugger

        $("#FK_AccountStatementId").val(e.dataItem.fK_AccountStatementId);
        //if (parseInt(e.dataItem.fK_CbCustodyTypeId) == 2) {

        //    $.ajax({
        //        url: "/CbExchangeBond/GetTotalDebitByGlAccountAndDistracted?FK_DistractedToId=" + FK_DistractedToId + "&FK_GlAccountId=" + FK_GlAccountId,
        //        type: "Get",
        //        contentType: false,
        //        processData: false,
        //        success: function (data) {
        //            //alert(data);
        //            debugger;

        //        }
        //    });
        //}
        loadCustodyDetailGrid(e.dataItem.id);
    }


    $("#FK_DistractedToId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrEmployee/GetAllEmployeeForDDList",
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
        select: onSelectEmployee

    });
    function onSelectEmployee(e) {

        var x = e.dataItem.codeAndName;
        if (e.dataItem.id == 0)
            $("#FK_TaxesId").data("kendoDropDownList").enable(true);
        else {

            /*   if (parseInt($("#FK_GlAccountId").val()) > 0) {*/
            $("#FK_TaxesId").data("kendoDropDownList").value("0");
            $('#TaxPercentage').val('');
            $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();
            $("#FK_TaxesId").data("kendoDropDownList").enable(false);
            /* }*/

        }

    }
    //Tax 

    $("#FK_TaxesId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/Taxes/GetAllTaxesForDDList",
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
        select: onSelectTaxes

    });
    function onSelectTaxes(e) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        if (e.dataItem.id == 0) {
            $('#TotalTaxAmount').attr('readonly', true);
            $("#IsAmountIncluldeTax").prop('checked', false);
            $('#IsAmountIncluldeTax').prop("disabled", true);

            $("#FK_DistractedToId").data("kendoDropDownList").enable(true);

        }
        else {
            $('#TotalTaxAmount').attr('readonly', false);
            $('#IsAmountIncluldeTax').prop("disabled", false);

            $("#FK_DistractedToId").data("kendoDropDownList").value("0");
            $("#FK_DistractedToId").data("kendoDropDownList").enable(false);
        }

        $.ajax({
            type: "POST",
            url: "/Taxes/IsInDateRange?id=" + e.dataItem.id + "&today=" + date,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger;
                if (response) {
                    $("#FK_AppliedGlAccountId").val(e.dataItem.fK_GlAccountId);
                    $("#TaxPercentage").val(e.dataItem.amount);
                    $("#TaxName").val(e.dataItem.taxNameAr);

                } else {
                    swal({
                        title: Resources.TaxTypeOutofDateRange,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });

                    $('#FK_TaxesId').data("kendoDropDownList").value(0);
                    $("#FK_AppliedGlAccountId").val(null);
                    $("#TaxPercentage").val("");
                    $("#TaxName").val("");
                }
            }
        });
        $('#TotalTaxAmount').val(0);
        $('#AmountBeforeTax').val(0);
    }
    //Account

    $("#accountAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/GlAccount/GetOperatingExpenseAccountsForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                code: data.filter.filters[0].value,
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                code: "",
                                defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }

            }
        },
        dataBound: function (e) {
            if (this.dataSource.total() > 0)
                this.select(0);
        },
        select: onSelectAccount
    });

    function onSelectAccount(e) {


        $.ajax({
            type: "POST",
            url: "/GlAccount/IsMainAccount?id=" + e.dataItem.id,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger;
                if (response) {
                    $("#FK_GlAccountId").val(0);
                    $("#accountAutoComplete").data("kendoDropDownList").value(0);
                    swal({
                        title: Resources.NoTansactionCanMadeOnMainAccounts,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                } else {
                    $("#FK_GlAccountId").val(e.dataItem.id);

                }
            }
        });
    }

    //currency
    var FK_PrimaryCurrencyId = 1;
    var PrimaryCurrencyFactor = 1;

    $.ajax({
        url: "/GlJournalVoucher/GetPrimaryCurrency",
        type: "Get",
        contentType: false,
        processData: false,
        success: function (data) {

            FK_PrimaryCurrencyId = data.id;
            PrimaryCurrencyFactor = data.defaultFactor;
        }
    });


    $('#IsAmountIncluldeTax').change(function () {

        $("#TotalTaxAmount").val(0);
        var amountBeforeTax = parseFloat($("#AmountBeforeTax").val()),
            taxPercentage = parseFloat($("#TaxPercentage").val());
        var result = 0;

        if ($("#IsAmountIncluldeTax").prop("checked") == true && amountBeforeTax > 0) {
            var debitWithoutTax = parseFloat(amountBeforeTax / (1 + (taxPercentage / 100))).toFixed(2);
            result = parseFloat(amountBeforeTax - debitWithoutTax).toFixed(2);
        }


        else {
            result = amountBeforeTax * (taxPercentage / 100).toFixed(2);
        }
        //  SetTaxValue();
        $("#TotalTaxAmount").val(result);
    });

    //get tax amount 
    $("#AmountBeforeTax").change(function () {
        debugger
        $("#TotalTaxAmount").val(0);
        var amountBeforeTax = parseFloat($(this).val()),
            taxPercentage = parseFloat($("#TaxPercentage").val());
        var result = 0;

        if ($("#IsAmountIncluldeTax").prop("checked") == true && amountBeforeTax > 0) {
            var debitWithoutTax = parseFloat(amountBeforeTax / (1 + (taxPercentage / 100))).toFixed(2);
            result = parseFloat(amountBeforeTax - debitWithoutTax).toFixed(2);
        }


        else {
            result = amountBeforeTax * (taxPercentage / 100).toFixed(2);
        }
        //  SetTaxValue();
        $("#TotalTaxAmount").val(result);

    });

    //Grid
    loadCustodyDetailGrid($("#FK_HrEmployeeCustodyId").val());
    function loadCustodyDetailGrid(id) {
        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/HrEmployeeCustody/GetRevealExpensesCustodyDetails?id=" + id,
                    Type: "GET"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }

            },
            //autoSync: true,
            batch: true,
            /*      scrollable: true,*/
            //sortable: true,
            //reorderable: true,
            //groupable: true,

            //pageSize: 20,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: true },
                        billNumber: { editable: false },
                        billDate: { type: "date", editable: false },
                        supplierNumber: { editable: false },
                        supplierName: { editable: false },
                        supplierCodeName: { editable: false },
                        fK_PaySupplierId: { editable: false },
                        quantity: { editable: false },
                        unit: { editable: false },
                        description: { editable: false },
                        amountBeforeTax: { editable: false },
                        tax: { editable: false },
                        amountAfterTax: { editable: false },
                        hdnAttachmentIds: { editable: false },

                        fK_HrEmployeeId: { validation: { required: true } },
                        fK_GlAccountForTaxId: { validation: { required: true } },
                        fK_TaxesId: { validation: { required: true } },
                        fK_AppliedGlAccountId: { validation: { required: true } },
                        associatedRowKey: { validation: { required: true } },
                        fK_GlAccountId: { validation: { required: true } },
                        //serial: { type: "number" },
                        taxName: { type: "text" },
                        taxPercentage: { type: "number" },
                        //totalTaxAmount: { type: "number" },
                        amountIncluldeTax: { type: "number" },
                        debit: { type: "number" },
                        credit: { type: "number" },
                        description: { type: "text" },
                        accountName: { type: "text" },
                        employeeName: { type: "text" },
                        fK_DefCurrencyId: { defaultValue: { id: "", currencyNameAr: "" } },
                        currencyFactor: { validation: { required: true } },
                        fK_CostCenterId: { defaultValue: { id: "", costCenterCode: "" } },
                    }
                }
            }
        });
        var custodyDetailGrid = $("#custodyDetailGrid").kendoGrid({
            dataSource: tempSource,
            excel: {
                fileName: "Reveal Expenses Custody.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            /*  scrollable: true,*/
            //sortable: true,
            //reorderable: true,
            //groupable: true,
            /*     resizable: true,*/
            pageable: false,
            columns: [
                { field: "hdnAttachmentIds", hidden: true, format: "{0:c}" },
                { field: "fK_HrEmployeeId", hidden: true, format: "{0:c}" },
                { field: "fK_GlAccountForTaxId", hidden: true, format: "{0:c}" },
                { field: "debit", hidden: true },
                { field: "credit", hidden: true },
                { field: "fK_TaxesId", hidden: true, format: "{0:c}" },
                { field: "taxName", hidden: true },
                { field: "accountName", hidden: true },
                { field: "employeeName", hidden: true },
                { field: "fK_AppliedGlAccountId", hidden: true, format: "{0:c}" },
                { field: "associatedRowKey", hidden: true },
                { field: "fK_GlAccountId", hidden: true, format: "{0:c}" },
                { field: "supplierName", hidden: true },
                { field: "supplierNumber", hidden: true },
                /*  { field: "taxPercentage", hidden: true, title: Resources.TaxValueResource },*/
                { field: "amountIncluldeTax", hidden: true, title: Resources.AmountIncluldeTax },
                // { field: "serial", title: Resources.DetectionNumber, width: Resources.CodeWidth },
                {
                    field: "description", title: Resources.Account, width: Resources.NameWidth,
                    template: "#: accountName != null ?accountName : '' # #: employeeName != null ? employeeName : '' # #: taxName != null ? taxName : '' # - #: description#"
                },
                { field: "billNumber", title: Resources.InvoiceSerialResource, width: Resources.CodeWidth },
                { field: "billDate", format: "{0:yyyy/MM/dd}", width: Resources.DateWidth, title: Resources.BillDateResource },
                { field: "supplierCodeName", title: Resources.Supplier, width: Resources.CodeWidth },
                { field: "quantity", title: Resources.Quantity, width: Resources.CodeWidth },
                //{ field: "unit", title: Resources.Unit, width: Resources.CodeWidth },

                { field: "amountBeforeTax", title: Resources.AmountBeforeTax, width: Resources.InputNumberWidth },
                { field: "tax", title: Resources.Tax, width: Resources.CodeWidth },
                { field: "amountAfterTax", title: Resources.AmountAfterTax, width: Resources.InputNumberWidth },
                { width: Resources.DoubleActionWidth, template: "<button type='button' class='btn btn-success btn-sm btnFiles'><i class='fas fa-paperclip'></i></button> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },
                /*  { width: Resources.ActionWidth, template: "" }*/
            ],
            editable: false,
            selectable: "multiple, cell",
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.fK_TaxesId > 0 && dataItem.credit == 0 && dataItem.debit == 0) {
                        var $row = $('#custodyDetailGrid').find("[data-uid='" + dataItem.uid + "']");
                        $row.hide();
                    }
                })

            },

        });
        custodyDetailGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
        custodyDetailGrid.data("kendoGrid").table.on("click", ".btnFiles", ShowFiles);

        tempSource.fetch(function () {
            var grid = $("#custodyDetailGrid").data("kendoGrid");
            grid.tbody.find("tr[role='row']").each(function () {
                debugger;
                var model = grid.dataItem(this);
                if (model.fK_AppliedGlAccountId > 0) {
                    debugger;
                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnFiles").addClass("k-state-disabled");

                }

            });
            getTotalBalance();
        });
    }

    $("#btnAddNewDetail").on('click', function () {

        var FK_TaxesId = parseInt($("#FK_TaxesId").val()),
            accountAutoComplete = parseInt($("#accountAutoComplete").val()),
            FK_DistractedToId = parseInt($("#FK_DistractedToId").val()),
            FK_GlAccountId = $("#FK_GlAccountId").val(),
            FK_PaySupplierId = parseInt($("#FK_PaySupplierId").val()),
            SupplierName = $("#SupplierName").val(),
            SupplierNumber = $("#SupplierNumber").val(),
            TaxName = $("#TaxName").val(),
            FK_AppliedGlAccountId = parseInt($("#FK_AppliedGlAccountId").val()),
            TaxPercentage = parseFloat($("#TaxPercentage").val()),
            AmountBeforeTax = parseFloat($("#AmountBeforeTax").val()),
            FK_CostCenterId = parseInt($("#FK_CostCenterId").val()),
            FK_HrEmployeeId = parseInt($("#FK_HrEmployeeId").val()),
            FK_DefCurrencyId = FK_PrimaryCurrencyId,
            CurrencyFactor = PrimaryCurrencyFactor,
            Tax = parseFloat($("#TotalTaxAmount").val()).toFixed(2),
            AccountName = $("#accountAutoComplete").data("kendoDropDownList").text(),
            EmployeeName = $("#FK_DistractedToId").data("kendoDropDownList").text(),
            SupplierCodeName = $("#SupplierName").val() + "--" + $("#SupplierNumber").val(),

            AmountIncluldeTax = parseFloat(0);
        if (Tax == "NaN")
            Tax = 0;
        AmountAfterTax = parseFloat(Tax) + AmountBeforeTax;

        debugger;
        if (accountAutoComplete != 0)
            FK_GlAccountId = accountAutoComplete;
        if (FK_PaySupplierId != 0)
            SupplierCodeName = $("#FK_PaySupplierId").data("kendoDropDownList").text();

        if (FK_DistractedToId == 0)
            EmployeeName = null;

        if ($("#FK_HrEmployeeCustodyId").val() == "0") {

            swal({
                title: Resources.Choose + " " + Resources.CustodySerial,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (FK_GlAccountId == "" || FK_GlAccountId == "0") {

            swal({
                title: Resources.Choose + " " + Resources.Account,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

        else if (SupplierName == "" && FK_PaySupplierId == 0) {

            swal({
                title: Resources.EnterRequiredResource + " " + Resources.Supplier + " " + Resources.Or + " " + Resources.Choose + " " + Resources.Supplier,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        if ($("#mainForm").valid() && (SupplierName != "" || FK_PaySupplierId != 0)) {
            debugger
            var totalRecords = $("#custodyDetailGrid").data("kendoGrid").dataSource.data().length;
            var grid = $("#custodyDetailGrid").data("kendoGrid");
            var data = grid.dataSource.data();

            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;


            if (FK_TaxesId != 0) {

                if ($("#IsAmountIncluldeTax").prop("checked") == true && AmountBeforeTax > 0) {

                    AmountIncluldeTax = parseFloat(AmountBeforeTax);
                    AmountAfterTax = parseFloat(parseFloat(AmountBeforeTax) - parseFloat($("#TotalTaxAmount").val())).toFixed(2);
                }


                tempSource.insert(totalRecords, {
                    id: 0,
                    employeeName: EmployeeName,
                    accountName: AccountName,
                    fK_DistractedToId: FK_DistractedToId == 0 ? null : FK_DistractedToId,
                    billNumber: $("#BillNumber").val(),
                    billDate: new Date($("#BillDate").val()),
                    supplierNumber: $("#SupplierNumber").val(),
                    supplierName: $("#SupplierName").val(),
                    supplierCodeName: SupplierCodeName,
                    fK_PaySupplierId: FK_PaySupplierId,
                    quantity: $("#Quantity").val(),
                    unit: $("#Unit").val(),
                    description: $("#Description").val(),
                    amountBeforeTax: AmountBeforeTax * parseFloat($("#Quantity").val()),
                    tax: null,
                    fK_TaxesId: FK_TaxesId,
                    taxName: "",
                    taxPercentage: null,
                    amountAfterTax: AmountAfterTax * parseFloat($("#Quantity").val()),
                    hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                    fK_GlAccountId: FK_GlAccountId,
                    debit: AmountAfterTax * parseFloat($("#Quantity").val()),
                    credit: 0,
                    fK_DefCurrencyId: FK_DefCurrencyId,
                    currencyFactor: CurrencyFactor,
                    //FK_CostCenterId: FK_CostCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,

                });


                var Grid = $("#custodyDetailGrid").data("kendoGrid");
                var GridData = Grid.dataSource.view();
                GridData[totalRecords].associatedRowKey = GridData[totalRecords].uid;
                var Uid = GridData[totalRecords].uid;
                var TotalTaxAmount = parseFloat($("#TotalTaxAmount").val()).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");// parseFloat($("#TotalTaxAmount").val()).toFixed(2);
                //tax row
                tempSource.insert(totalRecords, {

                    id: 0,
                    employeeName: EmployeeName,
                    accountName: null,
                    fK_DistractedToId: FK_DistractedToId,

                    billNumber: $("#BillNumber").val(),
                    billDate: new Date($("#BillDate").val()),
                    supplierNumber: $("#SupplierNumber").val(),
                    supplierName: $("#SupplierName").val(),

                    quantity: $("#Quantity").val(),
                    unit: $("#Unit").val(),
                    description: $("#Description").val(),
                    amountBeforeTax: null,
                    tax: Tax,
                    amountAfterTax: null,
                    hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                    fK_GlAccountId: FK_AppliedGlAccountId,
                    fK_AppliedGlAccountId: FK_AppliedGlAccountId,
                    fK_TaxesId: FK_TaxesId,
                    taxName: TaxName,
                    associatedRowKey: Uid,
                    taxPercentage: TaxPercentage,
                    /*  amountIncluldeTax: 0,*/
                    debit: Tax,
                    credit: 0,
                    fK_DefCurrencyId: FK_DefCurrencyId,
                    currencyFactor: CurrencyFactor,
                    fK_HrEmployeeId: FK_HrEmployeeId,

                });
            }
            else {
                tempSource.insert(totalRecords, {
                    id: 0,
                    employeeName: EmployeeName,
                    accountName: AccountName,
                    fK_DistractedToId: FK_DistractedToId,

                    billNumber: $("#BillNumber").val(),
                    billDate: new Date($("#BillDate").val()),
                    supplierNumber: $("#SupplierNumber").val(),
                    supplierName: $("#SupplierName").val(),
                    fK_PaySupplierId: FK_PaySupplierId,
                    supplierCodeName: SupplierCodeName,
                    quantity: $("#Quantity").val(),
                    unit: $("#Unit").val(),
                    description: $("#Description").val(),
                    amountBeforeTax: AmountBeforeTax * parseFloat($("#Quantity").val()),
                    tax: null,
                    amountAfterTax: AmountAfterTax * parseFloat($("#Quantity").val()),
                    hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                    taxName: "",
                    taxPercentage: null,
                    fK_GlAccountId: FK_GlAccountId,
                    debit: AmountBeforeTax * parseFloat($("#Quantity").val()),
                    credit: null,
                    fK_DefCurrencyId: FK_DefCurrencyId,
                    currencyFactor: CurrencyFactor,
                    //FK_CostCenterId: FK_CostCenterId,
                    fK_HrEmployeeId: FK_HrEmployeeId,
                });
            }

            var grid = $("#custodyDetailGrid").data("kendoGrid");
            //grid.dataSource.sync();
            //tempSource.sync();
            //tempSource.read();
            //grid.refresh();

            grid.tbody.find("tr[role='row']").each(function () {

                var model = grid.dataItem(this);
                debugger;
                if (model.fK_AppliedGlAccountId > 0) {

                    $(this).find(".btnDelete").addClass("k-state-disabled");
                    $(this).find(".btnFiles").addClass("k-state-disabled");
                }

                //grid.dataSource.read();
                //grid.refresh();

            });

            getTotalBalance();
            ClearFormDetails();
        }

    });

    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#custodyDetailGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var dataSource = grid.dataSource;
        var data = grid.dataSource.data();
        var res = $.grep(data, function (d) {
            return d.associatedRowKey == dataItem.associatedRowKey;
        });
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
                if (dataItem.id == "") {
                    //var dataSource = $("#custodyDetailGrid").data("kendoGrid").dataSource;
                    if (dataSource.remove(dataItem)) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        for (var i = 0; i < res.length; i++) {
                            if (res[i].associatedRowKey == dataItem.uid) {
                                dataSource.remove(res[i]);
                            }


                        }
                        getTotalBalance();
                        grid.tbody.find("tr[role='row']").each(function () {

                            var model = grid.dataItem(this);

                            if (model != undefined && model.fK_TaxesId > 0) {
                                $(this).find(".btnDelete").addClass("k-state-disabled");
                                $(this).find(".btnEdit").addClass("k-state-disabled");

                            }
                        });
                    }
                    else {
                        swal({
                            title: Resources.DeleteFailedResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                } else {
                    $.ajax({
                        url: "/HrEmployeeCustody/DeleteDetail?id=" + dataItem.id + "&associatedRowKey=" + dataItem.associatedRowKey,
                        type: "Get",
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {

                            if (result) {
                                dataSource.remove(dataItem)
                                swal({
                                    title: Resources.DeleteSuccessResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                }, function () {

                                    for (var i = 0; i < res.length; i++) {
                                        if (res[i].associatedRowKey == dataItem.associatedRowKey) {
                                            dataSource.remove(res[i]);
                                        }


                                    }
                                    grid.tbody.find("tr[role='row']").each(function () {

                                        var model = grid.dataItem(this);

                                        if (model != undefined && model.fK_TaxesId > 0) {
                                            $(this).find(".btnDelete").addClass("k-state-disabled");
                                            $(this).find(".btnEdit").addClass("k-state-disabled");

                                        }
                                    });

                                    //tempSource.fetch(function () {
                                    //    var grid = $("#custodyDetailGrid").data("kendoGrid");
                                    //    var data = grid.dataSource.data();
                                    //    var res = $.grep(data, function (d) {
                                    //        return d.AssociatedRowKey == uid;
                                    //    });
                                    //    for (var i = 0; i < res.length; i++) {

                                    //        if (res[i].fK_TaxesId > 0) {
                                    //            $(this).find(".btnDelete").addClass("k-state-disabled");
                                    //            $(this).find(".btnEdit").addClass("k-state-disabled");

                                    //        }
                                    //    }
                                    //    ///grid.tbody.find("tr[role='row']").each(function () {
                                    //    ///    ;
                                    //    ///    var model = grid.dataItem(this);
                                    //    ///    if (model.fK_TaxesId > 0) {
                                    //    ///        $(this).find(".btnDelete").addClass("k-state-disabled");
                                    //    ///        $(this).find(".btnEdit").addClass("k-state-disabled");
                                    //    ///
                                    //    ///    }
                                    //    ///});

                                    //});
                                    loadCustodyDetailGrid($("#FK_HrEmployeeCustodyId").val());
                                    getTotalBalance();
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
                }


            }, 3000);
        });
    }

    function ShowFiles() {

        var row = $(this).closest("tr"),
            grid = $("#custodyDetailGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        debugger
        var modulePage = $('#hdnModulePage').val();
        var refrenceId = $('#hdnRefrenceId').val();
        var ids = dataItem.hdnAttachmentIds;
        var url = '/Attachment/Get?modulePage=' + modulePage + '&refId=' + refrenceId + '&attachmentIds=' + ids + '&redirect=' + "ViewOnly";
        var divAttachmentInvoiceList = $('#divAttachmentInvoiceList');
        divAttachmentInvoiceList.load(url);
        $("#Attach-file-Details").modal('toggle');
    }

    function getTotalBalance() {
        debugger;
        var amountAfterTax = 0;
        var TotalCustody = parseFloat($("#TotalCustody").val());

        var grid = $("#custodyDetailGrid").data("kendoGrid");
        var gridData = grid.dataSource.view();

        for (var i = 0; i < gridData.length; i++) {
            if (gridData[i].amountAfterTax != null)
                amountAfterTax += parseFloat(gridData[i].amountAfterTax.toString().replace(/\,/g, ''));

        }

        $("#TotalExpense").val(amountAfterTax.toFixed(2));
        $("#TotalBalance").val(TotalCustody - amountAfterTax.toFixed(2));
    }

    function ClearFormDetails() {

        $("#DocumentNumber").val("");
        $("#BillNumber").val("");
        $("#SupplierNumber").val("");
        $("#SupplierName").val("");
        $("#SalesmanName").val("");
        $("#TotalTaxAmount").val("");
        $("#FK_TaxesId").data("kendoDropDownList").value(0);
        $("#FK_PaySupplierId").data("kendoDropDownList").value(0);
        $("#IsAmountIncluldeTax").prop('checked', false);
        $('#TotalTaxAmount').attr('readonly', true);
        $('#IsAmountIncluldeTax').prop("disabled", true);
        //$("#IsAmountIncluldeTax").prop("checked") == false;
        $("#FK_TaxesId").data("kendoDropDownList").enable(true);

        $("#Quantity").val("");
        $("#Unit").val("");
        $("#Description").val("");
        $("#AmountBeforeTax").val("");
        $("#Tax").val("");
        $("#AmountAfterTax").val("");
        $("#hdnAttachmentIds").val("0");
        $("#FK_DistractedToId").data("kendoDropDownList").value(0);
        $("#FK_DistractedToId").data("kendoDropDownList").enable(true);
        var url = '/Attachment/Get?modulePage=' + $('#hdnModulePage').val() + '&refId=' + 0 + '&attachmentIds=' + 0;
        var divAttachmentList = $('#divAttachmentList');
        divAttachmentList.load(url);
    }

    $("#btnSave").click(function () {


        var table = $("#custodyDetailGrid").data("kendoGrid").dataSource.data();
        if ($("#AccountStatementSerial").val() == "") {

            swal({
                title: Resources.EnterRequiredResource + " " + Resources.DetectionNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if ($("#FK_HrEmployeeCustodyId").val() == "0") {

            swal({
                title: Resources.Choose + " " + Resources.CustodySerial,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if (table.length > 0 && $("#AccountStatementSerial").val() != "") {
            var custodyDetail = [];
            for (var i = 0; i < table.length; i++) {
                var billDate = new Date(table[i].billDate);
                var billDateFormated = billDate.getFullYear() + "-" + ("0" + (billDate.getMonth() + 1)).slice(-2) + "-" + ("0" + billDate.getDate()).slice(-2);
                if (table[i].associatedRowKey == undefined)
                    table[i].associatedRowKey = null;

                var detail = {
                    Id: table[i].id,
                    FK_DistractedToId: table[i].fK_DistractedToId,
                    BillNumber: table[i].billNumber,
                    BillDate: billDateFormated,
                    SupplierNumber: table[i].supplierNumber,
                    SupplierName: table[i].supplierName,
                    FK_PaySupplierId: table[i].fK_PaySupplierId,
                    Quantity: table[i].quantity,
                    Unit: table[i].unit,
                    Description: table[i].description,
                    AmountBeforeTax: table[i].amountBeforeTax,
                    AssociatedRowKey: table[i].associatedRowKey,
                    Tax: table[i].tax,
                    TaxName: table[i].taxName,
                    TaxPercentage: parseFloat(table[i].taxPercentage),
                    FK_TaxesId: parseInt(table[i].fK_TaxesId),
                    FK_GlAccountId: parseInt(table[i].fK_GlAccountId),
                    FK_AppliedGlAccountId: parseInt(table[i].fK_AppliedGlAccountId),
                    Debit: table[i].debit,
                    AmountAfterTax: table[i].amountAfterTax,
                    hdnAttachmentIds: table[i].hdnAttachmentIds,
                }
                custodyDetail.push(detail);
            }
            debugger;
            var obj = {
                Id: $("#FK_HrEmployeeCustodyId").val(),
                AccountStatementSerial: $("#AccountStatementSerial").val(),
                FK_AccountStatementId: $("#FK_AccountStatementId").val(),
                FK_DefBranchId: $("#FK_DefBranchId").val(),
                FK_HrEmployeeCustodyId: parseInt($("#FK_HrEmployeeCustodyId").val()),
                TotalExpense: parseFloat($("#TotalExpense").val()),
                TotalCustody: parseFloat($("#TotalCustody").val()),
                TotalBalance: parseFloat($("#TotalBalance").val()),
                //IsClosed : false,
                Details: custodyDetail
            }

            $.ajax({
                url: '/HrEmployeeCustody/SaveRevealExpensesCustody',
                type: 'POST',
                data: { custodyDetails: obj },
                success: function (result) {
                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            /* loadCustodyDetailGrid($("#FK_HrEmployeeCustodyId").val());*/

                            setTimeout(function () {
                                document.location = "../../HrEmployeeCustody/RevealExpensesCustody?id=" + $("#FK_HrEmployeeCustodyId").val()

                            }, 1000);
                        });

                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }
                }
            })
        }
    })

    $("#btnSaveAndClose").click(function () {
        var openedPeriodCount = 0;
        $.ajax({
            url: "/GlFinancialPeriod/GetOpenPeriodsCount",
            type: "Get",
            contentType: false,
            processData: false,
            success: function (result) {

                openedPeriodCount = result;

                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

                $.ajax({
                    url: "/GlFinancialPeriod/IsDateInOpenPeriod?date=" + date,
                    type: "Get",
                    contentType: false,
                    processData: false,
                    success: function (result) {

                        if (result && openedPeriodCount > 1) {
                            swal({
                                title: Resources.WarningResource,
                                text: Resources.ThereIsMoreThanOneFinancialPeriodOpen,
                                type: "info",
                                showCancelButton: true,
                                confirmButtonText: Resources.ContinueResource,
                                cancelButtonText: Resources.CancelResource,
                                closeOnConfirm: true,
                                showLoaderOnConfirm: true
                            }, function () {
                                setTimeout(function () {
                                    saveClose();
                                }, 3000);
                            });
                        }
                        else if (!result) {
                            swal({
                                title: Resources.OutsideOpenPeriods,
                                confirmButtonText: Resources.CancelResource,
                                type: "error"
                            }, function () {
                            });

                        } else {
                            saveClose();
                        }
                    }
                });
            }
        });


    })

    function saveClose() {

        var FK_DefCurrencyId = 1;
        var CurrencyFactor = 1;

        $.ajax({
            url: "/GlJournalVoucher/GetPrimaryCurrency",
            type: "Get",
            contentType: false,
            processData: false,
            success: function (data) {

                FK_DefCurrencyId = data.id;
                CurrencyFactor = data.defaultFactor;
            }
        });

        var table = $("#custodyDetailGrid").data("kendoGrid").dataSource.data();
        if ($("#AccountStatementSerial").val() == "") {

            swal({
                title: Resources.EnterRequiredResource + " " + Resources.DetectionNumber,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if ($("#FK_HrEmployeeCustodyId").val() == "0") {

            swal({
                title: Resources.Choose + " " + Resources.CustodySerial,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }
        if (table.length > 0 && $("#AccountStatementSerial").val() != "") {

            $.ajax({
                type: "POST",
                url: "/CbExchangeBond/GetCbExchangeBondByRefId?id=" + parseInt($('#FK_HrEmployeeCustodyId').val()) + "&moduleId=" + parseInt($('#hdnModule').val()) + "&pageId=" + parseInt($('#hdnModulePageHrEmployeeCustody').val()),
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (result) {

                    debugger
                    if (result != null) {

                        var custodyDetail = [];
                        for (var i = 0; i < table.length; i++) {
                            var billDate = new Date(table[i].billDate);
                            var billDateFormated = billDate.getFullYear() + "-" + ("0" + (billDate.getMonth() + 1)).slice(-2) + "-" + ("0" + billDate.getDate()).slice(-2);

                            var detail = {
                                Id: table[i].id,
                                FK_DistractedToId: table[i].fK_DistractedToId,
                                BillNumber: table[i].billNumber,
                                BillDate: billDateFormated,
                                SupplierNumber: table[i].supplierNumber,
                                SupplierName: table[i].supplierName,
                                FK_PaySupplierId: table[i].fK_PaySupplierId,
                                Quantity: table[i].quantity,
                                Unit: table[i].unit,
                                Description: table[i].description,
                                AmountBeforeTax: table[i].amountBeforeTax,
                                AssociatedRowKey: table[i].associatedRowKey,
                                Tax: table[i].tax,
                                TaxName: table[i].taxName,
                                TaxPercentage: parseFloat(table[i].taxPercentage),
                                FK_TaxesId: parseInt(table[i].fK_TaxesId),
                                FK_GlAccountId: parseInt(table[i].fK_GlAccountId),
                                FK_AppliedGlAccountId: parseInt(table[i].fK_AppliedGlAccountId),
                                Debit: table[i].debit,
                                AmountAfterTax: table[i].amountAfterTax,
                                hdnAttachmentIds: table[i].hdnAttachmentIds,
                            }
                            custodyDetail.push(detail);
                        }

                        var List = [];
                        var gridData = $('#custodyDetailGrid').data("kendoGrid").dataSource.data();
                        for (var i = 0; i < gridData.length; i++) {
                            var referenceDate = new Date(gridData[i].billDate);
                            var referenceDateFormated = referenceDate.getFullYear() + "-" + ("0" + (referenceDate.getMonth() + 1)).slice(-2) + "-" + ("0" + referenceDate.getDate()).slice(-2);

                            if (gridData[i].Notes == undefined)
                                gridData[i].Notes = null;
                            if (gridData[i].Description == undefined)
                                gridData[i].Description = null;
                            var data = {
                                FK_GlAccountId: parseInt(gridData[i].fK_GlAccountId),
                                FK_AppliedGlAccountId: parseInt(gridData[i].fK_AppliedGlAccountId),
                                AccountCode: "",
                                AccountName: "",
                                CostCenterName: "",
                                FK_TaxesId: gridData[i].fK_TaxesId,
                                FK_AppliedGlAccountId: parseInt(gridData[i].fK_AppliedGlAccountId),
                                TaxPercentage: gridData[i].taxPercentage,
                                TaxName: gridData[i].taxName,
                                FK_TaxesId: parseInt(gridData[i].fK_TaxesId),
                                AssociatedRowKey: gridData[i].associatedRowKey,
                                //AmountIncluldeTax: gridData[i].amountIncluldeTax,
                                FK_DefCurrencyId: parseInt(FK_DefCurrencyId),
                                //FK_CostCenterId: parseInt(gridData[i].fK_CostCenterId),
                                ReferenceNumber: $("#AccountStatementSerial").val(),
                                ReferenceDate: referenceDateFormated,
                                CurrencyFactor: CurrencyFactor,
                                Debit: parseFloat(gridData[i].debit),
                                Credit: parseFloat(gridData[i].credit),
                                FK_HrEmployeeId: parseInt(gridData[i].fK_HrEmployeeId),
                                FK_CreatorId: parseInt($("#FK_CreatorId").val()),
                                FK_CustodyId: parseInt($("#FK_HrEmployeeCustodyId").val()),
                                Notes: null,
                                Description: gridData[i].description,
                            }

                            List.push(data);

                        }
                        debugger

                        var creditSide = GetVoucherCreditSide(result);
                        var creditItem = {
                            FK_GlAccountId: parseInt(creditSide.FK_GlAccountId),
                            AccountCode: "",
                            AccountName: "",
                            CostCenterName: "",

                            FK_CostCenterId: isNaN(parseInt(creditSide.FK_CostCenterId)) ? null : parseInt(creditSide.FK_CostCenterId),
                            FK_DefCurrencyId: isNaN(parseInt(creditSide.FK_DefCurrencyId)) ? null : parseInt(creditSide.FK_DefCurrencyId),
                            ReferenceNumber: creditSide.ReferenceNumber,
                            ReferenceDate: creditSide.ReferenceDate,
                            CurrencyFactor: creditSide.CurrencyFactor,
                            Debit: parseFloat(0),
                            Credit: parseFloat(creditSide.Credit),
                            FK_HrEmployeeId: isNaN(parseInt(creditSide.FK_HrEmployeeId)) ? null : parseInt(creditSide.FK_HrEmployeeId),
                            FK_CustodyId: parseInt($("#FK_HrEmployeeCustodyId").val()),
                            Notes: null,
                            Description: creditSide.Description,
                        }

                        List.push(creditItem);

                        var JournalObj = {
                            //Id: parseInt($('#Id').val()),
                            /* Serial: parseInt(custodyDetail[0].Serial),*/
                            //VoucherDate: new Date($("#VoucherDate").val()),
                            VoucherDate: new Date(),
                            FK_GlJournalVoucherCategoryId: String(1),
                            //FK_GlJournalVoucherCategoryId: String($("#FK_GlJournalVoucherCategoryId").val()),
                            IsPosted: true,
                            ListDetails: List,
                            CurrencyFactor: CurrencyFactor,
                            FK_DefCurrencyId: FK_DefCurrencyId,
                            BranchId: parseInt($("#FK_DefBranchId").val()),
                            CreatorId: parseInt($("#FK_CreatorId").val()),
                            //hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                            Categories: [],
                            Currencies: []
                        };

                        var obj = {
                            Id: $("#FK_HrEmployeeCustodyId").val(),
                            AccountStatementSerial: $("#AccountStatementSerial").val(),
                            FK_AccountStatementId: $("#FK_AccountStatementId").val(),
                            FK_DefBranchId: $("#FK_DefBranchId").val(),
                            journalVoucherDetailVM: JournalObj,
                            FK_HrEmployeeCustodyId: parseInt($("#FK_HrEmployeeCustodyId").val()),
                            TotalExpense: parseFloat($("#TotalExpense").val()),
                            TotalCustody: parseFloat($("#TotalCustody").val()),
                            TotalBalance: parseFloat($("#TotalBalance").val()),
                            //IsClosed : true,
                            /*  Serial: parseInt(custodyDetail[0].Serial),*/
                            Details: custodyDetail
                        }

                        $.ajax({
                            url: '/HrEmployeeCustody/SaveRevealExpensesCustody',
                            type: 'POST',
                            data: { custodyDetails: obj },
                            success: function (result) {
                                debugger
                                if (result > 0) {

                                    if (creditSide.Redirect == "Index") {
                                        swal({
                                            title: Resources.SavedSuccessfullyResource,
                                            confirmButtonText: Resources.DoneResource,
                                            type: "success"
                                        }, function () {
                                            setTimeout(function () {
                                                //document.location = "../../HrEmployeeCustody/RevealExpensesCustody?id=" + $("#FK_HrEmployeeCustodyId").val()
                                                document.location = "../../HrEmployeeCustody/Index"

                                            }, 1000);
                                        });
                                    }
                                    else if (creditSide.Redirect == "CbReceiptBond") {
                                        swal({
                                            title: Resources.SavedSuccessfullyResource + " / " + Resources.DoYouWantToMakeCbReceiptBond,
                                            confirmButtonText: Resources.Add,
                                            showCancelButton: true,
                                            cancelButtonText: Resources.CloseResource,
                                            type: "success"
                                        }, function (inputValue) {
                                            debugger
                                            if (inputValue === false) {
                                                setTimeout(function () { document.location = "../../HrEmployeeCustody/Index" }, 1000);
                                            } else {
                                                setTimeout(function () {
                                                    document.location = "../../CbReceiptBond/Create?refId=" + result + "&refType=" + $("#hdnModule").val() + "&pageId=" + $("#hdnModulePageHrEmployeeCustody").val() + "&amount=" + creditSide.RedirectAmount + "&accId=" + creditSide.FK_GlAccountId + "&costCenterId=" + creditSide.FK_CostCenterId + "&empId=" + creditSide.FK_HrEmployeeId
                                                }, 1000);
                                            }

                                        });
                                    }
                                    else if (creditSide.Redirect == "CbExchangeBond") {
                                        swal({
                                            title: Resources.SavedSuccessfullyResource + " / " + Resources.DoYouWantToMakeCbExchangeBond,
                                            confirmButtonText: Resources.Add,
                                            showCancelButton: true,
                                            cancelButtonText: Resources.CloseResource,
                                            type: "success"
                                        }, function (inputValue) {
                                            debugger
                                            if (inputValue === false) {
                                                setTimeout(function () { document.location = "../../HrEmployeeCustody/Index" }, 1000);
                                            } else {
                                                setTimeout(function () {
                                                    document.location = "../../CbExchangeBond/Create?refId=" + result + "&refType=" + $("#hdnModule").val() + "&pageId=" + $("#hdnModulePageHrEmployeeCustody").val() + "&amount=" + creditSide.RedirectAmount + "&accId=" + creditSide.FK_GlAccountId + "&costCenterId=" + creditSide.FK_CostCenterId + "&empId=" + creditSide.FK_HrEmployeeId + "&toAccCreditOrDebit=" + creditSide.RedirectToAccCreditOrDebit
                                                }, 1000);
                                            }

                                        });
                                    }


                                }
                                else {
                                    swal({
                                        title: Resources.ErrorMsgResource,
                                        confirmButtonText: Resources.DoneResource,
                                        type: "success"
                                    });
                                }
                            }
                        })



                    }
                    else {
                        swal({
                            title: Resources.ThereAreNoExchangeBondsForThisCustody,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }

                }
            });

        }
    }

    function GetVoucherCreditSide(cbExchangeBondForCurrentCustody) {

        var custodyType = $("#FK_CbCustodyTypeId").val(), //مستديمة = 2   نوع العهدة  مؤقتة = 1
            totalCustody = parseFloat($("#TotalCustody").val()), // اجمالى العهدة
            totalExpense = parseFloat($("#TotalExpense").val()); //اجمالى كشف المصاريف

        var creditItem = {
            FK_GlAccountId: parseInt(cbExchangeBondForCurrentCustody.fK_GlAccountId),
            AccountCode: "",
            AccountName: "",
            CostCenterName: "",

            FK_CostCenterId: isNaN(parseInt(cbExchangeBondForCurrentCustody.fK_CostCenterId)) ? null : parseInt(cbExchangeBondForCurrentCustody.fK_CostCenterId),
            FK_DefCurrencyId: isNaN(parseInt(cbExchangeBondForCurrentCustody.fK_DefCurrencyId)) ? null : parseInt(cbExchangeBondForCurrentCustody.fK_DefCurrencyId),
            ReferenceNumber: cbExchangeBondForCurrentCustody.serial,
            ReferenceDate: cbExchangeBondForCurrentCustody.bondDate,
            CurrencyFactor: cbExchangeBondForCurrentCustody.currencyFactor,
            Debit: parseFloat(0),
            Credit: parseFloat(0),
            FK_HrEmployeeId: isNaN(parseInt(cbExchangeBondForCurrentCustody.fK_DistractedToId)) ? null : parseInt(cbExchangeBondForCurrentCustody.fK_DistractedToId),
            FK_CustodyId: parseInt($("#FK_HrEmployeeCustodyId").val()),
            Notes: null,
            Description: cbExchangeBondForCurrentCustody.description,
            Redirect: "Index",
            RedirectAmount: 0,
            RedirectToAccCreditOrDebit: null,
        }

        if (custodyType == 1) { //تسوية العهدة المؤقتة

            if (totalExpense == totalCustody) {  // case 1 >>  if total Custody equal total Expense
                creditItem.Credit = totalExpense;
                creditItem.Redirect = "Index";
                creditItem.RedirectAmount = 0;
            }
            else if (totalExpense < totalCustody) {
                creditItem.Credit = totalExpense;
                creditItem.Redirect = "CbReceiptBond";
                creditItem.RedirectAmount = totalCustody - totalExpense;
            }
            else if (totalExpense > totalCustody) {
                creditItem.Credit = totalCustody;
                creditItem.Redirect = "CbExchangeBond";
                creditItem.RedirectAmount = totalExpense - totalCustody;
            }



        }
        else if (custodyType == 2) { //تسوية العهدة المستديمة

            if (totalExpense == totalCustody) {  // case 1 >>  if total Custody equal total Expense
                creditItem.Credit = totalExpense;
                creditItem.Redirect = "CbExchangeBond";
                creditItem.RedirectAmount = totalExpense;
            }
            else if (totalCustody < totalExpense) {
                creditItem.Credit = totalExpense;
                creditItem.Redirect = "CbExchangeBond";
                creditItem.RedirectAmount = totalExpense;
            }
            else if (totalCustody > totalExpense) {
                creditItem.Credit = totalExpense;
                creditItem.Redirect = "CbExchangeBond";
                creditItem.RedirectAmount = totalExpense;
                creditItem.RedirectToAccCreditOrDebit = "Credit";
            }



        }

        return creditItem;

    }

    $(".btnExport").on('click', function () {
        $("#custodyDetailGrid").getKendoGrid().saveAsExcel();
    });

    $(".btnPrint").on('click', function () {

        if ($("#FK_HrEmployeeCustodyId").val() == "0") {

            swal({
                title: Resources.Choose + " " + Resources.CustodySerial,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if ($("#FK_AccountStatementId").val() == "") {
            swal({
                title: Resources.DetectionDataMustAdded,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (parseInt($("#FK_AccountStatementId").val()) > 0) {
            var url = "/HrEmployeeCustody/RevealExpensesCustodyPrint?id=" + $("#FK_HrEmployeeCustodyId").val() + "&accStatementId=" + parseInt($("#FK_AccountStatementId").val());
            window.open(url, '_blank').print();
        } else {
            swal({
                title: Resources.ErrorMsgResource,
                confirmButtonText: Resources.DoneResource,
                type: "success"
            });
        }

    });

}) 
