$(document).ready(function () {
    var resources = {

        accountCode: $('#AccountCodeResource').text(),
        accountName: $("#AccountNameResource").text(),
        accountNameAr: $('#AccountNameArResource').text(),
        accountNameEn: $('#AccountNameEnResource').text(),
        status: Resources.Status,
        all: Resources.All,
    };

    $("#accountAutoComplete").val($("#CbCashAndBankAccountCode").val())

    $("#FK_HrDepartmentId").change(function () {
        var id = $("#FK_HrDepartmentId").val();
        $.ajax({
            url: "/HrEmployee/GetEmployeeByDepartment/" + id,
            success: function (data) {
                var empData = ""
                for (var i = 0; i < data.length; i++) {
                    empData += "<option value=" + data[i].id + ">" + data[i].fullName + "</option>"
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
        //change: onChange,
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

function removeCreditMachine(id) {

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
                url: "/CbCreditMachine/Delete?Id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    debugger;
                    if (result) {
                        
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                        document.location = "/CbCreditMachine/Index";
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