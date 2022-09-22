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

    var autocomplete = $("#AccountsList").kendoAutoComplete({
        minLength: 1,
        dataTextField: "accountCode",
        filter: "contains",
        template: '<span class="k-state-default"><p>#: data.accountCode #</p></span>' +
            '<span class="k-state-default"><p>#: data.accountNameAr #</p></span>',
        dataSource: accountCodeDataSource,
        select: onSelect,
        change: onChange,
        height: 400,
        placeholder: Resources.AutocompleateChoose
    }).data("kendoAutoComplete");
    function onSelect(e) {
        debugger;
        var x = e.dataItem;
        var y = e.sender;
        $("#AccountName").val(e.dataItem.accountNameAr);
        
    }
    function onChange(e) {
        debugger;
        var code = this.value();
        if (code == "")
            $("#AccountName").val("");
        //$("#AccountName").val(e.dataItem.accountNameAr);
        
    }
});