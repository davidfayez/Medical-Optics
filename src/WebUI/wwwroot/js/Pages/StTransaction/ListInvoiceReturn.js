$(document).ready(function () {

    var isClient = true;

    var clientCodeDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: function () {
                    if (isClient == true)
                        return "/RceLookups/GetAllRceClientAutoCompleteSearchByCode";
                    else
                        return "/RceLookups/GetAllRceSubClientAutoCompleteSearchByCode";
                }
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

    $("#clientAutoComplete").kendoAutoComplete({

        dataSource: clientCodeDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onSelectClient,
        change: onChangeClient,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:100px">' + Resources.ClientCodeResource + ' </span>' +
            '<span>' + Resources.ClientNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:150px">#: data.clientCode #</span>' +
            '<span>#: data.clientNameAr #</span>',
        dataTextField: "clientCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });
    function onSelectClient(e) {
        if (isClient == true)
            $("#FK_RceClientId").val(e.dataItem.id);

        else
            $("#FK_RceSubClientId").val(e.dataItem.id);

        $("#ClientName").val(e.dataItem.clientNameAr);
        $("#RepaymentPeriod").val(e.dataItem.repaymentPeriod);
        $("#FK_DefCurrencyId").val(e.dataItem.fK_DefCurrencyId);
        $("#FK_GlAccountId").val(e.dataItem.fK_GlAccountId);
        $("#Factor").val(e.dataItem.factor);
    }
    function onChangeClient(e) {
        debugger;
        var code = this.value();
        var id = "";
        var checkUrl = "";
        if (isClient == true) {
            id = 'FK_RceClientId';
            checkUrl = "/RceLookups/CheckClientCodeExist?code=";
        }
        else {
            id = 'FK_RceSubClientId';
            checkUrl = "/RceLookups/CheckSubClientCodeExist?code=";
        }
        $.ajax({
            type: "GET",
            url: checkUrl + code,
            success: function (response) {
                debugger
                if (response != null) {
                    $("#" + id + "").val(response.id);
                    $("#ClientName").val(response.clientNameAr);
                    $("#RepaymentPeriod").val(response.repaymentPeriod);
                    $("#FK_DefCurrencyId").val(response.fK_DefCurrencyId);
                    $("#FK_GlAccountId").val(response.fK_GlAccountId);
                    $("#Factor").val(response.factor);

                    //Set BillDueDate
                    var newDate = new Date($("#BillDate").val()),
                        day = newDate.getDate() + response.repaymentPeriod,
                        month = newDate.getMonth(),
                        year = newDate.getFullYear();
                    newDate = new Date(year, month, day);
                    newDate = newDate.getFullYear() + "-" + ("0" + (newDate.getMonth() + 1)).slice(-2) + "-" + ("0" + newDate.getDate()).slice(-2);
                    $('#BillDueDate').val(newDate);
                } else {
                    $("#" + id + "").val(null);
                    $("#ClientName").val(null);
                    $("#RepaymentPeriod").val(null);
                    $("#FK_GlAccountId").val(null);
                    $("#FK_DefCurrencyId").val("");
                    $("#Factor").val("");
                    swal({
                        title: Resources.ClientCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

    var dateFrom = $("#DateFrom").val(),
        dateTo = $("#DateTo").val(),
        serialNumber = $("#SerialNumber").val(),
        phone = $("#Phone").val(),
        companyName = $("#CompanyName").val(),
        fK_RceClientId = $("#FK_RceClientId").val(),
        fK_HrEmployeeId = $("#FK_HrEmployeeId").val(),
        fK_DefBranchId = $("#FK_DefBranchId").val();

    var invoiceType = "Sale";
    var payType = $("input[type='radio'][name='Pay-Type']:checked").val();


    debugger
    url = "/StTransaction/GetAllReturnedToClient?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&serialNumber=" + serialNumber + "&phone=" + phone + "&companyName=" + companyName + "&fK_RceClientId=" + fK_RceClientId + "&fK_HrEmployeeId=" + fK_HrEmployeeId + "&fK_DefBranchId=" + fK_DefBranchId + "&invoiceType=" + invoiceType + "&payType=" + payType

    loadSearchGrid();

    function loadSearchGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: url,
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            pageSize: 10,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false },
                        serialNumber: { editable: false },
                        transactionDate: { type: "date", editable: false },
                        //invoiceType: { editable: false },
                        payType: { editable: false },
                        clientCode: { editable: false },
                        clientName: { editable: false },
                        branchName: { editable: false },
                        finalTotal: { editable: false },
                        //totalDiscount: { editable: false },
                        //totalTax: { editable: false },

                    }
                }
            }
        });


        var grid = $("#SearchGrid").kendoGrid({
            excel: {
                fileName: "Search Grid.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            pageSize: 10,
            serverPaging: Resources.GridServerPaging,
            serverFiltering: Resources.GridServerFiltering,
            filterable: Resources.GridFilterable,
            height: Resources.GridHeight,
            groupable: Resources.GridGroupable,
            sortable: Resources.GridSortable,
            resizable: Resources.GridResizable,
            noRecords: Resources.GridNoRecords,
            messages: {
                noRecords: Resources.GridNoRecordsMessage
            },
            pageable: {
                pageSizes: [10, 20, 50, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [

                { field: "serialNumber", title: Resources.PurchaseOrderNumber, width: Resources.NameWidth },
                {
                    field: "transactionDate", title: Resources.TransactionDate, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.IsAfterOrEqualTo,
                                lte: Resources.IsBeforeOrEqualTo
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: '{0: dd/MM/yyyy}'
                            })
                        }
                    }
                },
                //{ field: "invoiceType", title: Resources.InvoiceType, width: Resources.NameWidth },
                { field: "payType", title: Resources.PayType, width: Resources.NameWidth },
                { field: "clientCode", title: Resources.ClientCodeResource, width: Resources.NameWidth },
                { field: "clientName", title: Resources.ClientNameResource, width: Resources.NameWidth },
                { field: "branchName", title: Resources.Branch, width: Resources.NameWidth },
                { field: "finalTotal", title: Resources.TotalBill, width: Resources.NameWidth },
                //{ field: "totalDiscount", title: Resources.TotalDiscount, width: Resources.NameWidth },
                //{ field: "totalTax", title: Resources.TaxValueResource, width: Resources.NameWidth },
                {
                    width: Resources.DoubleActionWidth, template: "<a  href='/StTransaction/EditReturnedClient/#= id #'  class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i> </a>"
                },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                       // $(this).addClass("k-state-selected");
                    }
                })
                if (!hasRoleEdit)
                    $(".btnEdit").addClass('disabled');

                if (!hasRoleDelete)
                    $(".btnDelete").addClass('disabled');
            },
            resizable: true,
        });

    }

    $("#btnSearch").on('click', function () {
        var dateFrom = $("#DateFrom").val(),
            dateTo = $("#DateTo").val(),
            serialNumber = $("#SerialNumber").val(),
            phone = $("#Phone").val(),
            companyName = $("#CompanyName").val(),
            fK_RceClientId = $("#FK_RceClientId").val(),
            fK_HrEmployeeId = $("#FK_HrEmployeeId").val(),
            fK_DefBranchId = $("#FK_DefBranchId").val();

        var invoiceType = "Sale";
        var payType = $("input[type='radio'][name='Pay-Type']:checked").val();

        url = "/StTransaction/GetAllReturnedToClient?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&serialNumber=" + serialNumber + "&phone=" + phone + "&companyName=" + companyName + "&fK_RceClientId=" + fK_RceClientId + "&fK_HrEmployeeId=" + fK_HrEmployeeId + "&fK_DefBranchId=" + fK_DefBranchId + "&invoiceType=" + invoiceType + "&payType=" + payType
        loadSearchGrid();


    });

}) 