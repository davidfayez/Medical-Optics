$(document).ready(function () {
    var costCenterName;
    
    var PrimaryCurrency_Id = parseInt($("#PrimaryCurrency_Id").val());
    var PrimaryCurrency_CurrencyNameAr = $("#PrimaryCurrency_CurrencyNameAr").val();
    var PrimaryCurrency_DefaultFactor = $("#PrimaryCurrency_DefaultFactor").val();
    var PrimaryCurrency_Code = $("#PrimaryCurrency_Code").val();
    var fisrtEdit = true;
    LoadGridVoucher();
    function LoadGridVoucher() {
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "//",
                    dataType: "jsonp"
                },
                update: {
                    url: "/Products/Update",
                    dataType: "jsonp"
                },
                destroy: {
                    url: "/Products/Destroy",
                    dataType: "jsonp"
                },
                create: {
                    url: "/Products/Create",
                    dataType: "jsonp",
                    change: function () {
                    },

                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }
            },
            batch: true,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        FK_GlAccountId: { validation: { required: true } },
                        AccountCode: { validation: { required: true } },
                        AccountName: { validation: { required: true, message: Resources.Required } },
                        Debit: { type: "number", validation: { required: true, min: 1, message: Resources.Required } },
                        Credit: { type: "number", validation: { required: true, min: 1, message: Resources.Required } },
                        Description: { type: "text" },
                        ReferenceNumber: { type: "number", validation: { min: 0, required: true, message: Resources.Required } },
                        FK_DefCurrencyId: { defaultValue: { id: PrimaryCurrency_Id, currencyNameAr: "" + PrimaryCurrency_CurrencyNameAr +"" } },
                        CurrencyFactor: { validation: { required: true } },
                        FK_CostCenterId: { defaultValue: { id: "", costCenterCode: "" } },
                        CostCenterCode: { defaultValue: { id: "", costCenterCode: "" } },
                        CostCenterName: { type: "text", validation: { required: true }, message: Resources.Required },
                        Notes: { type: "text", validation: { required: true } },


                    }
                }
            }
        });
        var grid = $("#GlJournalVoucherDetailgrid").kendoGrid({
            dataSource: dataSource,
            pageable: false,
            toolbar: [{ name: "create", text: "اضافة جديد" },],
            columns: [
                { field: "FK_GlAccountId", hidden: true, format: "{0:c}", width: 120 },
                { field: "AccountCode", editor: accountCodeAutoCompleteEditor, title: Resources.AccountCodeResource, format: "{0:c}", width: Resources.InputNumberWidth },
                { field: "AccountName", title: Resources.AccountNameResource, width: Resources.NameWidth },
                { field: "Debit", title: Resources.Debit, width: Resources.InputNumberWidth, editor: getTotalDebit },
                { field: "Credit", title: Resources.Credit, width: Resources.InputNumberWidth, editor: getTotalCredit },
                { field: "Description", width: Resources.DescriptionWidth, title: Resources.Description },
                { field: "ReferenceNumber", width: Resources.InputNumberWidth, title: Resources.ReferenceNumber },
                { field: "FK_DefCurrencyId",hidden:true, width: Resources.InputNumberWidth, title: Resources.Currency, editor: currenciesDropDownEditor, template: "#=FK_DefCurrencyId.currencyNameAr#" },
                { field: "CurrencyFactor",hidden:true, width: Resources.InputNumberWidth, title: Resources.CurrencyFactor },
                { field: "FK_CostCenterId", hidden: true, width: 140, title: Resources.CostCenterCode },
                { field: "CostCenterCode", width: Resources.InputNumberWidth, title: Resources.CostCenterCode, editor: costCenterCodeDropDownEditor, template: "#=CostCenterCode#" },
                { field: "CostCenterName", width: Resources.NameWidth, title: Resources.CostCenterName },
                { field: "Notes",hidden:true, width: Resources.NoteWidth, title: Resources.Notes },
                { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },
            ],
            editable: true,
            selectable: "multiple, cell",
            edit: function (e) {
                //debugger;
                if ($(e.container).index() == 8 || $(e.container).index() == 11 || $(e.container).index() == 2)
                    $('#GlJournalVoucherDetailgrid').data("kendoGrid").closeCell();
                if (fisrtEdit) {
                    if (e.model.isNew()) {
                        fisrtEdit = false;
                        var gridData = e.sender.dataSource.data();
                        var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid");
                        var currentUid = gridData[0].uid;
                        var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
                        var dataitem = grid.dataItem(currentRow);
                        dataitem.set("FK_CostCenterId", 0);
                        dataitem.set("CostCenterCode", "");
                        //var kendoDate = $("#datetimepicker").data("kendoDatePicker");
                        dataitem.set('CurrencyFactor', 1);
                    }
                }



            },
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAccount);
    }
    $('.k-grid-add').on('click', function () {
        fisrtEdit = true;
    });

    var accountCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/GlAccount/GetAllAutoCompleteBySearch"
            },
            parameterMap: function (data, action) {
                if (action === "read") {
                    return {
                        code: data.filter.filters[0].value
                    };
                } else {
                    return data;
                }
            }
        }
        ,
        schema: {
            model: {
                id: "url",
                fields: {
                    id: {
                        type: "int"
                    },
                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    function accountCodeAutoCompleteEditor(container, options) {
        $('<input required class="aCode" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoAutoComplete({
                dataSource: accountCodeDataSource,
                select: onSelect,
                change: onChange,
                headerTemplate: '<div class="dropdown-header k-widget k-header">' +
                    '<span style="margin-left:70px">' + Resources.AccountCodeResource + ' </span>' +
                    '<span>' + Resources.AccountNameResource + '</span>' +
                    '</div>',
                template: '<span style="margin-left:70px">#: data.accountCode #</span>' +
                    '<span>#: data.accountNameAr #</span>',
                dataTextField: "accountCode",
                filter: "contains",
                value: "id",
                minLength: 1,
                placeholder: Resources.AutocompleateChoose
            });
    }

    function onSelect(e) {
        debugger;
        var x = e.dataItem;
        var y = e.sender;
        grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid");
        var dataItem = grid.dataItem(this.element.closest("tr"));
        dataItem.set('AccountName', e.dataItem.accountNameAr);
        dataItem.set('FK_GlAccountId', e.dataItem.accountId);
        dataItem.set('FK_CostCenterId', e.dataItem.fK_CostCenterId);
        dataItem.set('CostCenterName', e.dataItem.costCenterName);
        dataItem.set("CostCenterCode", e.dataItem.costCenterCode);
        
        
    }
    function onChange(e) {
        debugger;
        var code = this.value();
        var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid");
        var dataItem = grid.dataItem(this.element.closest("tr"));
        $.ajax({
            type: "POST",
            url: "/GlAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger;
                if (response != null) {
                    dataItem.set('AccountName', response.accountNameAr);
                    dataItem.set('FK_GlAccountId', response.accountId);

                } else {
                    dataItem.set('AccountName', null);
                    dataItem.set('FK_GlAccountId', null);
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }
    function removeAccount() {

        var row = $(this).closest("tr"),
            grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
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
                var dataSource = $("#GlJournalVoucherDetailgrid").data("kendoGrid").dataSource;
                if (dataSource.remove(dataItem)) {
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
            }, 1000);
        });
    }

});
function costCenterCodeDropDownEditor(container, options) {
    $('<input required name="' + options.field + '" readonly/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataTextField: "costCenterCode",
            dataValueField: "value",
            dataSource: {
                type: "jsonp",
                transport: {
                    read: "/GlJournalVoucher/GetAllCostCenter"
                }
            },
            select: function (e) {

                var item = e.dataItem;
                var row = $(this).closest("tr");

                var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid"),
                    dataItem = grid.dataItem(this.element.closest("tr"));
                dataItem.set("value", e.sender.value());
                dataItem.set('FK_CostCenterId', item.id);
            },
            change: function (e) {
                var item = e.sender.dataItem();
                var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid"),
                    dataItem = grid.dataItem(this.element.closest("tr"));
                dataItem.set('CostCenterName', item.costCenterNameAr);
                dataItem.set('value', e.sender.value());
                dataItem.set('FK_CostCenterId', item.id);
            }
        });
}

function currenciesDropDownEditor(container, options) {
    $('<input required name="' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataTextField: "currencyNameAr",
            dataValueField: "id",
            dataSource: {
                type: "jsonp",
                transport: {
                    read: "/GlJournalVoucher/GetAllCurrencies"
                }
            },
            change: function (e) {
                //var kendoDate = $("#datetimepicker").data("kendoDatePicker");
                var voucherDate = new Date($("#VoucherDate").val());
                var item = e.sender.dataItem();
                var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid"),
                    dataItem = grid.dataItem(this.element.closest("tr"));
                $.ajax({
                    url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + item.id + "&period=" + voucherDate /*voucherDate.toUTCString()*/,
                    type: "Get",
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.hasOwnProperty("factor"))
                            dataItem.set('CurrencyFactor', data.factor);
                        else
                            dataItem.set('CurrencyFactor', data.defaultFactor);
                    }
                });

            }
        });
}

function saveVoucher() {
    debugger;
    if ($("#formVoucher").valid()) {
        var List = [];
        var gridData = $('#GlJournalVoucherDetailgrid').data("kendoGrid").dataSource.data();
        for (var i = 0; i < gridData.length; i++) {

            if (gridData[i].Notes == undefined)
                gridData[i].Notes = null;
            if (gridData[i].Description == undefined)
                gridData[i].Description = null;
            var data = {
                FK_GlAccountId: parseInt(gridData[i].FK_GlAccountId),
                AccountCode: "",
                AccountName: "",
                CostCenterName: "",
                FK_DefCurrencyId: parseInt(gridData[i].FK_DefCurrencyId.id),
                FK_CostCenterId: parseInt(gridData[i].FK_CostCenterId),
                ReferenceNumber: String(gridData[i].ReferenceNumber),
                CurrencyFactor: parseFloat(gridData[i].CurrencyFactor),
                Debit: parseFloat(gridData[i].Debit),
                Credit: parseFloat(gridData[i].Credit),
                Notes: gridData[i].Notes,
                Description: gridData[i].Description,
            }

            List.push(data);

        }
        //var datepicker = $("#datetimepicker").data("kendoDatePicker");
        //var value = datepicker.value();
        //alert(new Date(value.toUTCString()));
        var isPosted = $("input[name='IsPosted']:checked").val();
        if (isPosted == "true")
            isPosted = true;
        else
            isPosted = false;
        var Obj = {
            Id: parseInt($('#Id').val()),
            VoucherCode: $("#VoucherCode").val(),
            VoucherDate: new Date($("#VoucherDate").val()),
            Serial: $("#Serial").val(),
            FK_GlJournalVoucherCategoryId: String($("#FK_GlJournalVoucherCategoryId").val()),
            IsPosted: isPosted,
            ListDetails: List,
            Categories: []
        };

        if (List.length == 0) {

            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {
            });

        }
        else if ($("#VoucherCode").val() == "") {
            swal({
                title: Resources.NoCodingCreatedResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {
            });
        }
        else if (parseInt($("#TotalDebit").val()) != parseInt($("#TotalCredit").val())) {
            swal({
                title: Resources.TotalDebitNotEqualTotalCreditResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {

            });
        }
        else if (String($("#FK_GlJournalVoucherCategoryId").val())=="") {
            swal({
                title: Resources.GlJournalVoucherCategoryNotExistResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {

            });
        }
        else {
            var listValid = true;
            for (var i = 0; i < List.length; i++) {
                if (isNaN(List[i].FK_CostCenterId))
                    List[i].FK_CostCenterId = null;
                var accountId = List[i].FK_GlAccountId;
                var currencyId = List[i].FK_DefCurrencyId;
                var currencyFactor = List[i].CurrencyFactor;
                var debit = List[i].Debit;
                var credit = List[i].Credit;
                var description = List[i].Description;
                if (isNaN(accountId) || isNaN(currencyId) || isNaN(currencyFactor)  || (debit == 0 && credit == 0)) {
                    listValid = false;
                    swal({
                        title: Resources.DataNotCompletedResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });

                    break;
                }
            }
            if (listValid) {
                $.ajax({
                    url: "/GlJournalVoucher/SaveVouchers",
                    type: "Post",
                    data: JSON.stringify(Obj),
                    contentType: 'application/json',
                    success: function (result) {
                        debugger
                        if (result) {

                            swal({
                                title: Resources.SavedSuccessfullyResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "success"
                            }, function () {
                                window.location.href = '/GlJournalVoucher/Create';
                            });
                        }
                        else {
                            swal({
                                title: Resources.DefaultErrorMessageResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }
                    }
                });
            }

        }
    }
}

function getTotalDebit(container, options) {
    $('<input name="' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            change: function () {
                var totalRecords = $("#GlJournalVoucherDetailgrid").data("kendoGrid").dataSource.data().length;
                $("#Serial").val(totalRecords);
                var DebitTotal = 0;
                var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid");
                var gridData = grid.dataSource.view();
                for (var i = 0; i < gridData.length; i++) {
                    DebitTotal += gridData[i].Debit;
                }
                $("#TotalDebit").val(DebitTotal);
            }
        })
}

function getTotalCredit(container, options) {
    $('<input name="' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            change: function () {
                var totalRecords = $("#GlJournalVoucherDetailgrid").data("kendoGrid").dataSource.data().length;
                $("#Serial").val(totalRecords);
                var CreditTotal = 0
                var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid");
                var gridData = grid.dataSource.view();
                for (var i = 0; i < gridData.length; i++) {
                    CreditTotal += gridData[i].Credit;
                }
                $("#TotalCredit").val(CreditTotal);
            }
        })
}

