$(document).ready(function () {

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
                change: onChange,
                dataTextField: "accountCode",
                filter: "contains",
                template: '<span class="k-state-default"><p>#: data.accountCode #</p></span>' +
                    '<span class="k-state-default"><p>#: data.accountNameAr #</p></span>',
                dataSource: accountCodeDataSource,
                select: onSelect,
                height: 400
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

        dataItem.set('FK_CostCenterId', e.dataItem.FK_CostCenterId);
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
                        title: $("#AccountCodeNotFoundResource").text(),
                        confirmButtonText: $("#DoneResource").text(),
                        type: "error"
                    });
                }

            }
        });
    }
});
