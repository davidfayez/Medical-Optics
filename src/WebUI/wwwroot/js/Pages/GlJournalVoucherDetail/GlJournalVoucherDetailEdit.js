$(document).ready(function () {

    var fisrtEdit = true;
    var fromDelete = false;
    var PrimaryCurrency_Id = parseInt($("#PrimaryCurrency_Id").val());
    var PrimaryCurrency_CurrencyNameAr = $("#PrimaryCurrency_CurrencyNameAr").val();
    var PrimaryCurrency_DefaultFactor = $("#PrimaryCurrency_DefaultFactor").val();

    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    
    var dataSource = new kendo.data.DataSource();
    //debugger;
    if ($('input[type="checkbox"]').prop("checked") == true)
        $(".disabled-input").attr("disabled", "disabled");
    else
        $(".disabled-input").removeAttr('disabled');
    LoadGridVoucher();
    function LoadGridVoucher() {
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/GlJournalVoucher/GetGlJournalVoucherDetailsById?id=" + id,
                    Type: "GET"
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
                    id: "id",
                    fields: {
                        fK_GlAccountId: { validation: { required: true } },
                        accountCode: { validation: { required: true } },
                        accountName: { validation: { required: true, message: Resources.Required } },
                        debit: { type: "number" },
                        credit: { type: "number" },
                        description: { type: "text" },
                        referenceNumber: { type: "number", validation: { min: 0, required: true, message: Resources.Required } },
                        fK_DefCurrencyId: { defaultValue: { id: "", currencyNameAr: "" } },
                        currencyNameAr: { defaultValue: { id: "", currencyNameAr: "" } },
                        currencyFactor: { validation: { required: true } },
                        fK_CostCenterId: { defaultValue: { id: "", costCenterCode: "" } },
                        costCenterCode: { defaultValue: { id: "", costCenterCode: "" } },
                        costCenterName: { type: "text", validation: { required: true }, message: Resources.Required },
                        notes: { type: "text", validation: { required: true } },
                    }
                }
            }
        });
        
        var grid = $("#GlJournalVoucherDetailgrid").kendoGrid({
            dataSource: dataSource,
            pageable: false,
            toolbar: [{ name: "create", text: "اضافة جديد" }],
            columns: [
                { field: "fK_GlAccountId", hidden: true, width: 120 },
                { field: "accountCode", editor: accountCodeAutoCompleteEditor, title: Resources.AccountCodeResource, width: Resources.InputNumberWidth },
                { field: "accountName", title: Resources.AccountNameResource, width: Resources.NameWidth },
                { field: "debit", title: Resources.Debit, width: Resources.InputNumberWidth, editor: getTotalDebit },
                { field: "credit", title: Resources.Credit, width: Resources.InputNumberWidth, editor: getTotalCredit },
                { field: "description", width: Resources.DescriptionWidth, title: Resources.Description },
                { field: "referenceNumber", width: Resources.InputNumberWidth, title: Resources.ReferenceNumber},
                { field: "fK_DefCurrencyId", hidden: true, format: "{0:c}", width: 120 },
                { field: "currencyNameAr", hidden: true, width: Resources.TypeWidth, title: Resources.Currency, editor: currenciesDropDownEditor, template: "#=currencyNameAr#" },
                { field: "currencyFactor", hidden: true,width: Resources.InputNumberWidth, title: Resources.CurrencyFactor},
                { field: "fK_CostCenterId", hidden: true, width: 140},
                { field: "costCenterCode", width: Resources.InputNumberWidth, title: Resources.CostCenterCode, editor: costCenterCodeDropDownEditor, template: "#=costCenterCode#" },
                { field: "costCenterName", width: Resources.NameWidth, title: Resources.CostCenterName },
                { field: "notes", hidden: true, width: Resources.NoteWidth, title: Resources.Notes },
                { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },
            ],
            editable: true,
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },
            edit: function (e) {
                //debugger;
                if (fisrtEdit) {
                    if (e.model.isNew()) {
                        fisrtEdit = false;
                        var gridData = e.sender.dataSource.data();
                        var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid");
                        var currentUid = gridData[0].uid;
                        var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
                        var dataitem = grid.dataItem(currentRow);
                        if (fromDelete) {
                            fisrtEdit = true;
                            fromDelete = false;
                            dataitem = e.sender.dataItem(currentRow);
                        }
                        dataitem.set("fK_DefCurrencyId", PrimaryCurrency_Id);
                        dataitem.set("currencyNameAr", "" + PrimaryCurrency_CurrencyNameAr + "");
                        dataitem.set("fK_CostCenterId", 0);
                        dataitem.set("costCenterCode", "");
                        dataitem.set('currencyFactor', 1);
                        //fisrtEdit = true;
                    }
                }
            },
            selectable: "multiple, cell"
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeAccount);
    }

    $('.k-grid-add').on('click', function () {
        //debugger;
        fisrtEdit = true;
    });

    var accountCodeDataSource = new kendo.data.DataSource({
        serverFiltering: true,
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
        grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid");
        var dataItem = grid.dataItem(this.element.closest("tr"));
        dataItem.set('accountName', e.dataItem.accountNameAr);
        dataItem.set('fK_GlAccountId', e.dataItem.accountId);
        dataItem.set('fK_CostCenterId', e.dataItem.fK_CostCenterId);
        dataItem.set('costCenterName', e.dataItem.costCenterName);
        dataItem.set("costCenterCode", e.dataItem.costCenterCode);
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
                    dataItem.set('accountName', response.accountNameAr);
                    dataItem.set('fK_GlAccountId', response.accountId);

                } else {
                    dataItem.set('accountName', null);
                    dataItem.set('fK_GlAccountId', null);
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
        fisrtEdit = true;
        debugger;
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
                    if (dataItem.id == "") {
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
                    } else {
                        fisrtEdit = true;
                        $.ajax({
                            url: "/GlJournalVoucher/DeleteDetail?id=" + dataItem.id,
                            type: "Get",
                            contentType: 'application/json; charset=utf-8',
                            success: function (result) {
                                debugger;
                                if (result) {
                                    fromDelete = true;
                                    LoadGridVoucher();
                                    swal({
                                        title: Resources.DeleteSuccessResource,
                                        confirmButtonText: Resources.DoneResource,
                                        type: "success"
                                    }, function () {
                                            fisrtEdit = true;
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
    dataSource.fetch(function () {
        var data = dataSource.data();
        $("#Serial").val(data.length);
        var CreditTotal = 0
        var DebitTotal = 0;
        for (var i = 0; i < data.length; i++) {
            DebitTotal += data[i].debit;
            CreditTotal += data[i].credit;
        }
        $("#TotalCredit").val(CreditTotal);
        $("#TotalDebit").val(DebitTotal);
    });

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
                    read: "/GlJournalVoucher/GetAllCostCenter",
                }
            },
            select: function (e) {
                //var kendoDate = $("#datetimepicker").data("kendoDatePicker");
                //var voucherDate = new Date($("#datetimepicker").val());
                var item = e.dataItem;
                var row = $(this).closest("tr");

                var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid"),
                    dataItem = grid.dataItem(this.element.closest("tr"));
                dataItem.set("value", e.sender.value());
                dataItem.set('fK_CostCenterId', item.id);
           

            },
            change: function (e) {
                var item = e.sender.dataItem();
                var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid"),
                    dataItem = grid.dataItem(this.element.closest("tr"));
                dataItem.set('costCenterName', item.costCenterNameAr);
                dataItem.set('value', e.sender.value());
                dataItem.set('fK_CostCenterId', item.id);

            }
        });
}

function currenciesDropDownEditor(container, options) {
    $('<input id="CurrencyId" required data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataTextField: "currencyNameAr",
            dataValueField: "value",
            dataSource: {
                type: "jsonp",
                transport: {
                    read: "/GlJournalVoucher/GetAllCurrencies"
                }
            },
            index: 1,
            select: function (e) {

                //var kendoDate = $("#datetimepicker").data("kendoDatePicker");
                var voucherDate = new Date($("#VoucherDate").val());
                var item = e.dataItem;
                var row = $(this).closest("tr");

                var grid = $("#GlJournalVoucherDetailgrid").data("kendoGrid"),
                    dataItem = grid.dataItem(this.element.closest("tr"));
                $.ajax({
                    url: "/GlJournalVoucher/GetCurrencyFactorByIdInPeriod?id=" + item.id + "&period=" + voucherDate /*voucherDate.toUTCString()*/,
                    type: "Get",
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        dataItem.set("value", e.sender.value());
                        dataItem.set('fK_DefCurrencyId', data.id);
                    }
                });

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
                        dataItem.set("value", e.sender.value());
                        dataItem.set('fK_DefCurrencyId', data.id);
                        if (data.hasOwnProperty("factor"))
                            dataItem.set('currencyFactor', data.factor);
                        else
                            dataItem.set('currencyFactor', data.defaultFactor);
                    }
                });

            }
        });
}

function editVoucher() {
    //debugger;
    if ($("#formVoucher").valid()) {

        var List = [];
        var isActive = $("input[name='IsActive']:checked").val();
        if (isActive == "true")
            isActive = true;
        else
            isActive = false;
        var gridData = $('#GlJournalVoucherDetailgrid').data("kendoGrid").dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var defCurrencyId;
            var CostCenterId;
            if (gridData[i].notes == undefined)
                gridData[i].notes = null;
            if (gridData[i].description == undefined)
                gridData[i].description = null;
            if (isNaN(gridData[i].id) == true || gridData[i].id != "") {
                defCurrencyId = gridData[i].fK_DefCurrencyId;
                CostCenterId = gridData[i].fK_CostCenterId;
            }
            else {
                defCurrencyId = gridData[i].fK_DefCurrencyId;
                CostCenterId = gridData[i].fK_CostCenterId;

            }
            var data = {
                Id: parseInt(gridData[i].id),
                FK_GlAccountId: gridData[i].fK_GlAccountId,
                AccountCode:"",
                AccountName: "",
                CostCenterName:"",
                FK_DefCurrencyId: defCurrencyId,
                FK_CostCenterId: CostCenterId,
                ReferenceNumber: String(gridData[i].referenceNumber),
                CurrencyFactor: parseFloat(gridData[i].currencyFactor),
                Debit: parseFloat(gridData[i].debit),
                Credit: parseFloat(gridData[i].credit),
                Notes: gridData[i].notes,
                Description: gridData[i].description,
            }

            List.push(data);

        }
        //var datepicker = $("#datetimepicker").data("kendoDatePicker");
        //var value = datepicker.value();
        //var voucherDate = new Date(value.toUTCString());
        //var VDate = voucherDate.setDate(voucherDate.getDate() + 1);
        //alert(dd);
        //alert(new Date(dd));
        var Obj = {
            Id: parseInt($('#Id').val()),
            VoucherCode: $("#VoucherCode").val(),
            VoucherDate: new Date($("#VoucherDate").val()),
            Serial: $("#Serial").val(),
            FK_GlJournalVoucherCategoryId: $("#FK_GlJournalVoucherCategoryId").val(),
            IsPosted: Boolean($("input[name='IsPosted']:checked").val()),
            IsActive: isActive,
            FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
            Notes: $("#Notes").val(),
            ListDetails: List,
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
        else if (String($("#FK_GlJournalVoucherCategoryId").val()) == "") {
            swal({
                title: Resources.GlJournalVoucherCategoryNotExistResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            }, function () {

            });
        }
        //if (isNaN(Obj.FK_DefFreezingReasonId) && !isActive) {
        //    swal({
        //        title: $("#FreezingReasonMsgResource").text(),
        //        confirmButtonText: $("#DoneResource").text(),
        //        type: "error"
        //    });
        //}
        else {
            var listValid = true;
            for (var i = 0; i < List.length; i++) {
                if (isNaN(List[i].FK_CostCenterId) || List[i].FK_CostCenterId=="")
                    List[i].FK_CostCenterId = null;
                if (isNaN(List[i].Id) || List[i].Id == "")
                    List[i].Id = null;
                var accountId = List[i].FK_GlAccountId;
                var currencyId = List[i].FK_DefCurrencyId;
                var currencyFactor = List[i].CurrencyFactor;
                var debit = List[i].Debit;
                var credit = List[i].Credit;
                var description = List[i].Description;

                if (isNaN(accountId) || isNaN(currencyId) || isNaN(currencyFactor) ||  (debit == 0 && credit == 0)) {
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
                    url: "/GlJournalVoucher/EditVoucher",
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
                                    window.location.href = '/GlJournalVoucher/Index';
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
                    DebitTotal += gridData[i].debit;
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
                    CreditTotal += gridData[i].credit;
                }
                $("#TotalCredit").val(CreditTotal);
            }
        })
}

function ChangeIsActive(e) {
    if (e.checked === true) {
        $(".disabled-input").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#Notes").val("");
    }
    else
        $(".disabled-input").removeAttr('disabled');

}

