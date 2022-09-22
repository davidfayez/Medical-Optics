$(document).ready(function () {
   

    $("#FK_HrDepartmentId").change(function () {
        var id = $("#FK_HrDepartmentId").val();
        $.ajax({
            url: "/HrEmployee/GetEmployeeByDepartment/"+id,
            success: function (data) {
                var empData=""
                for (var i = 0; i < data.length; i++) {
                    empData+="<option value="+data[i].id+">"+data[i].fullName+"</option>"
                }
                $("#FK_HrEmployeeId").html(empData)
            }
        })
    })

    var accountCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CbCashAndBankAccount/GetAllAutoCompleteSearchByCode"
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
                id: "id",
                fields: {

                    accountCode: {
                        type: "string"
                    }
                }
            }
        }
    });

    
    $("#accountAutoComplete").kendoAutoComplete({

        dataSource: accountCodeDataSource,
        select: onSelect,
        change: onChange,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.AccountCodeResource + ' </span>' +
            '<span>' + Resources.AccountNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:100px">#: data.accountCode #</span>' +
            '<span>#: data.accountNameAr #</span>',
        dataTextField: "accountCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        placeholder: Resources.AutocompleateChoose
    });
});
function onSelect(e) {
    $("#FK_CbCashAndBankAccountId").val(e.dataItem.id);
}
function onChange(e) {
    debugger;
    var code = this.value();

    $.ajax({
        type: "POST",
        url: "/CbCashAndBankAccount/CheckAccountCodeExist?code=" + code,
        data: "name=John&location=Boston",
        dataType: "json",
        success: function (response) {

            if (response != null) {
                console.log(response);
                $("#FK_CbCashAndBankAccountId").val(response.id);

            } else {
                $("#FK_CbCashAndBankAccountId").val(null);
                swal({
                    title: Resources.AccountCodeNotFoundResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }
    });
}