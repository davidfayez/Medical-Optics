$(document).ready(function () {

    $("#mainCategorie").change(function () {

        if ($("#mainCategorie").val() > 0) {
            $.ajax({
                url: '/StLookups/GetAllStItemServiceByMainCategory?id=' + $("#mainCategorie").val(),
                success: function (items) {

                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    for (var i = 0; i < items.length; i++) {
                        options += '<option value="' + items[i].id + '">' + items[i].itemName + '</options>'
                    }
                    $("#FK_StItemId").html(options)
                }
            })
        }
    });

    $("#FK_StItemId").change(function () {

        if ($("#FK_StItemId").val() > 0) {
            $.ajax({
                url: '/StLookups/GetItemData?id=' + $("#FK_StItemId").val(),
                success: function (item) {

                    $("#UnitSalesPrice").val(item.salePrice);
                    $("#ItemCode").val(item.barcodeCode);


                }
            })
        }
    })

    //Clt Client
    var cltClientDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CltClient/GetAllByCode"
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
                    id: {
                        type: "int"
                    },
                    clientCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#cltClientAutoComplete").kendoAutoComplete({
        minLength: 1,
        dataTextField: "clientCode",
        filter: "contains",
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:50px">' + Resources.ClientCodeResource + ' </span>' +
            '<span>' + Resources.ClientNameResource + '</span>' +
            '</div>',
        template: '<span style="margin-left:100px">#: data.clientCode #</span>' +
            '<span class="k-state-default">#: data.clientFullName #</span>',
        dataSource: cltClientDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onCltClientSelect,
        change: onCltClientChange,
        height: 400
    }).data("kendoAutoComplete");
    function onCltClientSelect(e) {
        $("#FK_CltClientId").val(e.dataItem.id);
    }
    function onCltClientChange(e) {

        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CltClient/CheckClientCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger
                if (response != null) {
                    $("#FK_CltClientId").val(response.id);
                    $("#CltClientName").val(response.clientFullName);
                    $("#InsuranceSubCompanyName").val(response.insuranceSubCompanyName);
                    $("#InsurSubCompClassName").val(response.insurSubCompClassName);
                    $("#CltClientPhone").val(response.phone);
                    $("#EligibilityNo").val(response.eligibilityNo);
                    $("#ApprovalNo").val(response.approvalNo);
                    $("#InsuranceId").val(response.insuranceId);
                    $("#PolicyNo").val(response.policyNo);
                    $("#ResidentialNo").val(response.residentialNo);

                    if (response.cardImage != null)
                        $("#ClientCard").attr("src", "/images/Clt/" + response.cardImage);
                    if (response.residenceImage != null)
                        $("#ResidenceImage").attr("src", "/images/Clt/" + response.residenceImage);
                } else {
                    $("#FK_CltClientId").val(null);
                    $("#CltClientName").val("");
                    $("#InsuranceSubCompanyName").val("");
                    $("#InsurSubCompClassName").val("");
                    $("#CltClientPhone").val("");
                    $("#EligibilityNo").val("");
                    $("#ApprovalNo").val("");
                    $("#InsuranceId").val("");
                    $("#PolicyNo").val("");
                    $("#ResidentialNo").val("");
                    $("#ClientCard").attr("src", "/images/back-login.jpg");
                    $("#ResidenceImage").attr("src", "/images/back-login.jpg");
                    swal({
                        title: Resources.ClientCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });

    }
    //GlAccount
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
                id: "id",
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
    $("#accountAutoComplete").kendoAutoComplete({
        minLength: 1,
        dataTextField: "accountCode",
        filter: "contains",
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:50px">' + Resources.AccountCodeResource + ' </span>' +
            '<span>' + Resources.AccountNameResource + '</span>' +
            '</div>',
        template: '<span style="margin-left:100px">#: data.accountCode #</span>' +
            '<span class="k-state-default">#: data.accountNameAr #</span>',
        dataSource: accountCodeDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onAccountSelect,
        change: onAccountChange,
        height: 400
    }).data("kendoAutoComplete");
    function onAccountSelect(e) {
        debugger
        $("#FK_GlAccountId").val(e.dataItem.id);

    }
    function onAccountChange(e) {

        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/GlAccount/CheckAccountCodeExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#FK_GlAccountId").val(response.accountId);
                    $("#AccountName").val(response.accountNameAr);
                } else {
                    $("#FK_GlAccountId").val(null);
                    swal({
                        title: Resources.AccountCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });

    }


    //cost center
    var costCenterDataSource = new kendo.data.DataSource({

        serverFiltering: true,
        type: "json",
        transport: {
            read: {
                url: "/CostCenter/GetAllAutoCompleteBySearch"
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

                    costCenterCode: {
                        type: "string"
                    }
                }
            }
        }
    });
    $("#costCenterAutoComplete").kendoAutoComplete({

        dataSource: costCenterDataSource,
        placeholder: Resources.AutocompleateChoose,
        select: onSelectCostCenter,
        change: onChangeCostCenter,
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span style="margin-left:30px">' + Resources.CostCenterCodeResource + ' </span>' +
            '<span>' + Resources.CostCenterNameResource + '</span>' +

            '</div>',
        template: '<span style="margin-left:150px">#: data.costCenterCode #</span>' +
            '<span>#: data.costCenterNameAr #</span>',
        dataTextField: "costCenterCode",
        dataValueField: "id",
        filter: "contains",
        minLength: 1
    });

    function onSelectCostCenter(e) {
        $("#FK_CostCenterId").val(e.dataItem.id);
        $("#CostCenterName").val(e.dataItem.costCenterNameAr);
    }
    function onChangeCostCenter(e) {
        var code = this.value();

        $.ajax({
            type: "POST",
            url: "/CostCenter/CheckCostCenterExist?code=" + code,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {

                if (response != null) {
                    $("#FK_CostCenterId").val(response.id);
                    $("#CostCenterName").val(response.costCenterNameAr);

                } else {
                    $("#FK_CostCenterId").val(null);
                    $("#CostCenterName").val(null);
                    swal({
                        title: Resources.CostCenterCodeNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }





    //grid
    var tempSource = new kendo.data.DataSource({

    });

    var invoiceDetailsGrid = $("#InvoiceDetailsGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "FK_StItemId", hidden: true },
            { field: "FK_CbDiscountTypeId", hidden: true },
            { field: "FK_StMainCategoryId", hidden: true },
            { field: "ItemCode", title: Resources.Code, width: Resources.CodeWidth },
            { field: "ItemName", title: Resources.ItemName, width: Resources.NameWidth },
            { field: "UnitSalesPrice", title: Resources.UnitSalesPrice, width: Resources.InputNumberWidth },
            { field: "Quantity", title: Resources.Quantity, width: Resources.InputNumberWidth },
            { field: "Discount", title: Resources.DiscountResource, width: Resources.InputNumberWidth },
            { field: "TaxValue", title: Resources.TaxValueResource, width: Resources.InputNumberWidth },
            { field: "InsuranceCode", title: Resources.InsuranceCode, width: Resources.InputNumberWidth },
            { field: "ApprovalAmount", title: Resources.ApprovalAmount, width: Resources.InputNumberWidth },
            { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:StoreRequest' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.StoreRequest },
            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });
    invoiceDetailsGrid.data("kendoGrid").table.on("click", ".btnDelete", removeInvoiceRow);

    function removeInvoiceRow() {

        var row = $(this).closest("tr"),
            grid = $("#InvoiceDetailsGrid").data("kendoGrid"),
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
                var dataSource = $("#InvoiceDetailsGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
                    swal({
                        title: Resources.DeleteSuccessResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    });
                    var totalSalesPrice = parseFloat($("#TotalSalesPrice").val()),
                        totalDiscount = parseFloat($("#TotalDiscount").val()),
                        totalTaxAmount = parseFloat($("#TotalTax").val()),
                        totalNet = parseFloat($("#TotalNet").val());

                    $("#TotalSalesPrice").val(totalSalesPrice - dataItem.Quantity * dataItem.UnitSalesPrice);
                    $("#TotalDiscount").val(totalDiscount - dataItem.Discount);
                    $("#TotalTax").val(totalTaxAmount - dataItem.TaxValue);

                    totalSalesPrice = parseFloat($("#TotalSalesPrice").val());
                    totalDiscount = parseFloat($("#TotalDiscount").val());
                    totalTaxAmount = parseFloat($("#TotalTax").val());
                    $("#TotalNet").val(totalSalesPrice + totalTaxAmount - totalDiscount);

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
    $("#btnAddNewDetail").on('click', function () {

        var FK_StItemId = $("#FK_StItemId").val(),
            ItemBarcode = $("#ItemCode").val(),
            ItemName = $("#FK_StItemId option:selected").text(),
            UnitSalesPrice = $("#UnitSalesPrice").val(),
            ApprovalAmount = $("#ApprovalAmount").val(),
            InsuranceCode = $("#InsuranceCode").val(),
            Quantity = $("#Quantity").val(),
            Discount = $("#Discount").val() == "" ? 0 : $("#Discount").val(),
            StoreRequest = $('#StoreRequest').is(":checked"),
            TaxValue = $("#TaxValue").val() == "" ? 0 : $("#TaxValue").val();

        if (FK_StItemId > 0 && Quantity > 0 && UnitSalesPrice > 0) {

            var totalRecords = $("#InvoiceDetailsGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                FK_StItemId: FK_StItemId,
                ItemCode: ItemBarcode,
                ItemName: ItemName,
                UnitSalesPrice: UnitSalesPrice,
                Quantity: Quantity,
                Discount: Discount,
                TaxValue: TaxValue,
                InsuranceCode: InsuranceCode,
                ApprovalAmount: ApprovalAmount,
                StoreRequest: StoreRequest
            });
            var TotalSalesPrice = parseFloat($("#TotalSalesPrice").val()),
                TotalDiscount = parseFloat($("#TotalDiscount").val()),
                TotalTax = parseFloat($("#TotalTax").val()),
                FinalTotal = parseFloat($("#TotalNet").val());
            if (TotalSalesPrice > 0) {
                $("#TotalSalesPrice").val(parseFloat(TotalSalesPrice) + (parseFloat(Quantity) * parseFloat(UnitSalesPrice)))
            } else {
                $("#TotalSalesPrice").val(parseFloat(Quantity) * parseFloat(UnitSalesPrice))
            }
            if (TotalDiscount > 0) {
                $("#TotalDiscount").val(parseFloat(TotalDiscount) + parseFloat(Discount))
            } else {
                $("#TotalDiscount").val(parseFloat(Discount))
            }
            if (TotalTax > 0) {
                $("#TotalTax").val(parseFloat(TotalTax) + parseFloat(TaxValue))
            } else {
                $("#TotalTax").val(parseFloat(TaxValue))
            }
            if (FinalTotal > 0) {
                $("#TotalNet").val(parseFloat(FinalTotal) + ((parseFloat(Quantity) * parseFloat(UnitSalesPrice)) + parseFloat(TaxValue) - parseFloat(Discount)))
            } else {
                $("#TotalNet").val((parseFloat(Quantity) * parseFloat(UnitSalesPrice)) + parseFloat(TaxValue) - parseFloat(Discount))
            }
            ClearFormDetails();

        } else {

            if (isNaN(FK_StItemId) || FK_StItemId <= 0) {

                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.ItemName,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else if (isNaN(Quantity) || Quantity <= 0) {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Quantity,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            } else {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.UnitSalesPrice,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }

        }

    });

    function ClearFormDetails() {
        $("#FK_StItemId").val("");
        $("#ItemBarcode").val("");
        $("#Quantity").val(0);
        $("#ItemCode").val("")
        $("#Discount").val(0);
        $("#TaxValue").val(0);
        $("#UnitSalesPrice").val(0);
        $("#InsuranceCode").val("");
        $("#ApprovalAmount").val(0);
    }

    $("#btnSave").click(function () {
        if ($("#SerialNumber").val() > 0) {
            $("#SerialNumberValid").text("")
        } else {
            $("#SerialNumberValid").text(Resources.Required)
        }

        if ($("#FK_CltClientId").val() > 0) {
            $("#validFK_RceClientId").text("")
        } else {
            $("#validFK_RceClientId").text(Resources.Required)
        }
        var table = $("#InvoiceDetailsGrid").data("kendoGrid").dataSource.data();
        if (table.length == 0) {
            swal({
                title: Resources.GridLengthZeroResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });

        }

        if ($("#FK_CltClientId").val() > 0 && $("#SerialNumber").val() > 0 && table.length > 0) {
            var tranDetail = [];
            for (var i = 0; i < table.length; i++) {
                var detail = {
                    FK_StItemId: table[i].FK_StItemId,
                    ItemName: table[i].ItemName,
                    ItemCode: table[i].ItemCode,
                    FK_StMainCategoryId: table[i].FK_StMainCategoryId,
                    Quantity: table[i].Quantity,
                    Discount: table[i].Discount,
                    TaxValue: table[i].TaxValue,
                    StoreRequest: table[i].StoreRequest,
                    UnitSalesPrice: table[i].UnitSalesPrice,
                    InsuranceCode: table[i].InsuranceCode,
                    ApprovalAmount: table[i].ApprovalAmount
                }
                tranDetail.push(detail);
            }
            var tran = {
                SerialNumber: $("#SerialNumber").val(),
                FK_CltClientId: $("#FK_CltClientId").val(),
                InvoiceDate: $("#InvoiceDate").val(),
                DeliveryDate: $("#DeliveryDate").val(),
                DeliveryTime: $("#DeliveryTime").val(),
                FK_GlAccountId: $("#FK_GlAccountId").val(),
                FK_CostCenterId: $("#FK_CostCenterId").val(),

                DistRSPH: $("#DistRSPH").val(),
                DistRCYL: $("#DistRCYL").val(),
                DistRAXIS: $("#DistRAXIS").val(),
                DistLSPH: $("#DistLSPH").val(),
                DistLCYL: $("#DistLCYL").val(),
                DistLAXIS: $("#DistLAXIS").val(),
                DistIPD: $("#DistIPD").val(),

                NearRSPH: $("#NearRSPH").val(),
                NearRCYL: $("#NearRCYL").val(),
                NearRAXIS: $("#NearRAXIS").val(),
                NearLSPH: $("#NearLSPH").val(),
                NearLCYL: $("#NearLCYL").val(),
                NearLAXIS: $("#NearLAXIS").val(),
                NearIPD: $("#NearIPD").val(),

                CLRSPH: $("#CLRSPH").val(),
                CLRCYL: $("#CLRCYL").val(),
                CLRAXIS: $("#CLRAXIS").val(),
                CLLSPH: $("#CLLSPH").val(),
                CLLCYL: $("#CLLCYL").val(),
                CLLAXIS: $("#CLLAXIS").val(),
                CLIPD: $("#CLIPD").val(),

                TotalSalesPrice: $("#TotalSalesPrice").val(),
                TotalTax: $("#TotalTax").val(),
                TotalDiscount: $("#TotalDiscount").val(),
                TotalNet: $("#TotalNet").val(),
                PayedAmount: $("#PayedAmount").val(),
                ApprovalLensesAmount: $("#ApprovalLensesAmount").val(),
                ApprovalFrameAmount: $("#ApprovalFrameAmount").val(),

                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                details: tranDetail
            }
            debugger
            $.ajax({
                url: '/LensesInvoice/CreateDeferredInvoice',
                type: 'POST',
                data: { addEditLensesInvoiceVM: tran },
                success: function (result) {
                    if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });

                        window.location = "../../LensesInvoice/EditDeferredInvoice/" + result
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



}) 