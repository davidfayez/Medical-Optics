$(document).ready(function () {
 
    $('#DefBranches').change(function () {

        $("#FK_GlAccountId").data("kendoDropDownList").value("0");
        $("#FK_GlAccountId").data("kendoDropDownList").dataSource.read();

        $("#FK_CbDiscountTypeId").data("kendoDropDownList").value("0");
        $("#FK_CbDiscountTypeId").data("kendoDropDownList").dataSource.read();

        $("#FK_TaxesId").data("kendoDropDownList").value("0");
        $("#FK_TaxesId").data("kendoDropDownList").dataSource.read();

    });
    //Active in Create
    $('input[type=radio][name=IsActive]').change(function () {
        if (this.value == "true") {
            $(".disabled-input").attr("disabled", "disabled");
            $("#frezzingReasonBtn").attr("disabled", "disabled");
            $("#FK_DefFreezingReasonId").val("");
            $("#FreezingNotes").val("");
        }
        else {
            $(".disabled-input").removeAttr('disabled');
            $("#frezzingReasonBtn").removeAttr("disabled");

        }


    });

    //Active 
    var activeVal = $('input[name="IsActive"]:checked').val();
    if (activeVal == undefined) {
        $(".disabled-input").removeAttr('disabled');
        $("#frezzingReasonBtn").removeAttr("disabled");

    }

    $("#Amount").change(function () {
        var Amount = parseInt($("#Amount").val());
        if ($('#customControlInline4').is(':checked') && Amount > 100) {
            $("#Amount").val("");
            swal({
                title: Resources.PercentageLessThan100Resource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    });

    $("#customControlInline4").change(function () {
        var Amount = parseInt($("#Amount").val());
        if ($('#customControlInline4').is(':checked') && Amount > 100) {
            $("#Amount").val("");
            swal({
                title: Resources.PercentageLessThan100Resource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
    });
    /* *********  */
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

    $("#FK_GlAccountForDiscountId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: dataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
        //change: onChangeDdlTree
    });
    taxdataSourceDdlTree = new kendo.data.HierarchicalDataSource({
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
    $("#FK_GlAccountForTaxId").kendoDropDownTree({
        placeholder: Resources.Choose,
        dataSource: taxdataSourceDdlTree,
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        filter: "contains",
        //checkboxes: true,
        //checkAll: true,
        autoClose: false,
        //change: onChangeDdlTree
    });

    $("#FK_GlAccountId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCashAndBankAccount/GetGlAccountsForCashAndBank",//GetAllAccountsForDDLTree",
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
        // select: onCashAndBankSelect
    });
    $("#FK_CbDiscountTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbDiscountType/GetAllDiscountTypeForDDList",
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

    });

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
        select: onSelectTax

    });
    function onSelectTax(e) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var accId = e.dataItem.fK_GlAccountId;
        if (accId > 0) {

            $.ajax({
                type: "POST",
                url: "/Taxes/IsInDateRange?id=" + e.dataItem.id + "&today=" + date,
                data: "name=John&location=Boston",
                dataType: "json",
                success: function (response) {
                    

                    if (response.isInDateRange) {
                        
                        $('#FK_GlAccountForTaxId').data("kendoDropDownTree").value(accId);
                        $("#TaxOnDiscountAmount").val((e.dataItem.amount).toString());
                        $("#IsTaxPercentage").prop('checked', response.tax.isPercentage);


                    } else {
                        swal({
                            title: Resources.TaxTypeOutofDateRange,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });

                        $('#FK_TaxesId').data("kendoDropDownList").value(0);
                        $('#FK_GlAccountForTaxId').data("kendoDropDownTree").value(0);
                        $("#TaxOnDiscountAmount").val(0);



                    }
                }
            });
            
        }

    }
    var id = parseInt($("#FK_CbCreditCardTypeId").val());


    $("#FK_CbCreditCardTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCreditCardType/GetAllCreditCardTypeForDDList",
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
        select: onSelectCbCreditCardType


    });
    function onSelectCbCreditCardType(e) {
        id = parseInt(e.dataItem.id);
        LoadGridCbCreditCardTypeGlAccount();
    }


    function LoadGridCbCreditCardTypeGlAccount() {

        tempSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/CbCreditCardTypeGlAccount/GetAllGlAccountByCreditCardTypeId?id=" + id,
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
            //pageSize: 20,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        fK_CreatorId: { editable: false },
                        fK_DefBranchId: { editable: false },
                        fK_CbCreditCardTypeId: { validation: { required: true } },
                        fK_GlAccountId: { validation: { required: true } },
                        fK_CbDiscountTypeId: { validation: { required: true } },
                        fK_GlAccountForDiscountId: { validation: { required: true } },
                        fK_TaxesId: { validation: { required: true } },
                        creditCardTypeName: { type: "text" },
                        accountName: { type: "text" },
                        discountType: { type: "text" },
                        accountNameForDiscount: { type: "text" },
                        discountAmount: { type: "number" },
                        isDiscountPercentage: { editable: false },
                        taxName: { type: "text" },
                        //taxAccount: { type: "text" },
                        taxOnDiscountAmount: { type: "number" },
                        isTaxPercentage: { editable: false },
                        isGenerale: { editable: false },
                    }
                }
            }
        });
        var gridBound = $("#CreditCardGlAccountGrid").kendoGrid({
            dataSource: tempSource,
            scrollable: true,
            //navigatable: true,
            pageable: false,
            columns: [
                { field: "fK_CreatorId", hidden: true },
                { field: "fK_DefBranchId", hidden: true },
                { field: "fK_CbCreditCardTypeId", hidden: true },
                { field: "fK_GlAccountId", hidden: true },
                { field: "fK_CbDiscountTypeId", hidden: true },
                { field: "fK_GlAccountForDiscountId", hidden: true },
                { field: "fK_TaxesId", hidden: true },
                { field: "creditCardTypeName", title: Resources.CreditCardType, width: Resources.NameWidth },
                { field: "accountName", width: Resources.NameWidth, title: Resources.CbCashAndBankAccount },
                { field: "discountType", width: Resources.NameWidth, title: Resources.DiscountType },
                { field: "accountNameForDiscount", width: Resources.NameWidth, title: Resources.DiscountAccount },
                { field: "discountAmount", width: Resources.NameWidth, title: Resources.Amount },
                { width: Resources.NameWidth, template: "<input type='checkbox' #= isTaxPercentage ? checked='checked' :'' # class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.DiscountPercentageResource },
                //  { width: Resources.NameWidth, template: "<input type='checkbox' data-bind='checked:isDiscountPercentage' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.DiscountPercentageResource },
                { field: "taxName", width: Resources.NameWidth, title: Resources.TaxName },
                //{ field: "taxAccount", width: Resources.NameWidth, title: Resources.TaxAccount },
                { field: "taxOnDiscountAmount", width: Resources.NameWidth, title: Resources.TaxOnDiscountAmount },
                { width: Resources.CheckboxWidth, template: "<input type='checkbox' #= isTaxPercentage ? checked='checked' :'' # class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Percent },
                // { width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isTaxPercentage' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Percent },
                { width: Resources.DoubleActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a> " },

            ],
            editable: false,
            selectable: "multiple, cell",
            noRecords: true,
            sortable: true,
            reorderable: true,
            groupable: true,
            resizable: true,
            messages: {
                noRecords: "There is no data on current page"
            },


        });
        gridBound.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
        //gridBound.data("kendoGrid").table.on("click", ".btnEdit", editRow);
    }


    LoadGridCbCreditCardTypeGlAccount();

    function editRow() {
        var row = $(this).closest("tr"),
            grid = $("#CreditCardGlAccountGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        var uid = dataItem.uid;
        var associatedRowKey = dataItem.associatedRowKey;
        $("#uid").val(dataItem.uid);
        $("#FK_GlAccountId").val(dataItem.fK_GlAccountId);
        $("#Serial").val(dataItem.serial);
        //  $("#accountAutoComplete").val(dataItem.accountCode);
        $("#accountAutoComplete").data("kendoDropDownList").value(dataItem.fK_GlAccountId);
        $("#AccountName").val(dataItem.accountName);
        $("#ReferenceNumber").val(dataItem.referenceNumber);
        //$("#ReferenceDate").val(new Date(dataItem.ReferenceDate));
        $("#Debit").val(dataItem.debit);
        $("#Credit").val(dataItem.credit);
        $("#Description").val(dataItem.description);
        //CurrencyName = jQuery("#FK_DefCurrencyId option:selected").text();
        // $("#costCenterAutoComplete").val(dataItem.costCenterCode);
        $("#costCenterAutoComplete").data("kendoDropDownList").value(dataItem.fK_CostCenterId);
        $("#FK_CostCenterId").val(parseInt(dataItem.fK_CostCenterId));
        $("#CostCenterName").val(dataItem.costCenterName);

        if (associatedRowKey != null) {
            var data = grid.dataSource.data();
            var res = $.grep(data, function (d) {
                return d.associatedRowKey == associatedRowKey;
            });
            for (var i = 0; i < res.length; i++) {
                if (res[i].fK_TaxesId > 0) {
                    $("#FK_TaxesId").data("kendoDropDownList").value(res[i].fK_TaxesId);
                    $("#TaxPercentage").val(res[i].taxPercentage);
                    $("#TaxNumber").val(res[i].taxNumber);
                    $("#AmountIncluldeTax").val(res[i].amountIncluldeTax);
                    $("#FK_AppliedGlAccountId").val(res[i].fK_AppliedGlAccountId);
                    $("#TaxName").val(res[i].taxName);
                    if (res[i].debit > 0)
                        $("#TotalTaxAmount").val(res[i].debit);

                    if (res[i].credit > 0)
                        $("#TotalTaxAmount").val(res[i].credit);

                    if (res[i].amountIncluldeTax > 0 && res[i].credit > 0) {
                        $("#IsAmountIncluldeTax").prop('checked', true);
                        $("#Credit").val(res[i].amountIncluldeTax);
                    }
                    if (res[i].amountIncluldeTax > 0 && res[i].debit > 0) {
                        $("#IsAmountIncluldeTax").prop('checked', true);
                        $("#Debit").val(res[i].amountIncluldeTax);
                    }
                    $('#IsAmountIncluldeTax').prop("disabled", false);

                }
            }
        }

        //$("#Notes").val(dataItem.);
        var ReferenceDate = dataItem.referenceDate;
        var referenceDate = ReferenceDate.getFullYear() + "-" + ("0" + (ReferenceDate.getMonth() + 1)).slice(-2) + "-" + ("0" + ReferenceDate.getDate()).slice(-2);
        $('#ReferenceDate').val(referenceDate);
    }

    function removeRow() {


        var row = $(this).closest("tr"),
            grid = $("#CreditCardGlAccountGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row),
            dataSource = $("#CreditCardGlAccountGrid").data("kendoGrid").dataSource;
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
                    $.ajax({
                        url: "/CbCreditCardTypeGlAccount/Delete?id=" + dataItem.id,
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
    $("#btnAddNew").on('click', function () {

        if ($("#FK_CbCreditCardTypeId").val() > 0)
            $("#FK_CbCreditCardTypeIdValidation").text("")
        else
            $("#FK_CbCreditCardTypeIdValidation").text(Resources.Required)

        if ($("#FK_GlAccountId").val() > 0)
            $("#FK_GlAccountIdValid").text("")
        else
            $("#FK_GlAccountIdValid").text(Resources.Required)

        if ($("#FK_TaxesId").val() > 0)
            $("#FK_TaxesIdValid").text("")
        else
            $("#FK_TaxesIdValid").text(Resources.Required)


        var fK_CbCreditCardTypeId = parseInt($("#FK_CbCreditCardTypeId").val()),
            creditCardTypeName = $("#FK_CbCreditCardTypeId").data("kendoDropDownList").text(),
            fK_GlAccountId = parseInt($("#FK_GlAccountId").val()),
            accountName = $("#FK_GlAccountId").data("kendoDropDownList").text(),
            fK_TaxesId = parseInt($("#FK_TaxesId").val()),
            taxName = $("#FK_TaxesId").data("kendoDropDownList").text(),
            fK_CbDiscountTypeId = parseInt($("#FK_CbDiscountTypeId").val()),
            discountType = $("#FK_CbDiscountTypeId").data("kendoDropDownList").text(),
            fK_GlAccountForDiscountId = parseInt($("#FK_GlAccountForDiscountId").val()),
            accountNameForDiscount = $("#FK_GlAccountForDiscountId").data("kendoDropDownTree").text(),
            discountAmount = parseFloat($("#DiscountAmount").val()),
            isDiscountPercentage = $("#IsDiscountPercentage").is(":checked"),
            //fK_GlAccountForTaxId = $("#FK_GlAccountForTaxId").val(),
            //taxAccount = $("#FK_GlAccountForTaxId").data("kendoDropDownList").text(),
            taxOnDiscountAmount = $("#TaxOnDiscountAmount").val(),
            fK_CreatorId = parseInt($("#FK_CreatorId").val()),
            fK_DefBranchId = parseInt($("#FK_DefBranchId").val()),
            isTaxPercentage = $("#IsTaxPercentage").is(":checked"),
            isGenerale = $("#IsGenerale").is(":checked");

        if ($("#FK_CbCreditCardTypeId").val() > 0 && $("#FK_GlAccountId").val() > 0 && $("#FK_TaxesId").val() > 0) {

            if (discountType == "اختر")
                discountType = "";

            if (accountNameForDiscount == "اختر")
                accountNameForDiscount = "";
            
            /*  if ($('#IsDiscountPercentage').is(':checked'))*/
            isDiscountPercentage = $("#IsDiscountPercentage").is(":checked") == true ? true : false;
            isGenerale = $("#IsGenerale").is(":checked") ==true?true:false;
            console.log(isGenerale,isDiscountPercentage);
            /*      if ($('#IsTaxPercentage').is(':checked'))*/
            isTaxPercentage = $("#IsTaxPercentage").is(":checked");

            var totalRecords = $("#CreditCardGlAccountGrid").data("kendoGrid").dataSource.data().length;

            tempSource.insert(totalRecords, {
                fK_CbCreditCardTypeId: fK_CbCreditCardTypeId,
                creditCardTypeName: creditCardTypeName,
                fK_GlAccountId: fK_GlAccountId,
                accountName: accountName,
                fK_TaxesId: fK_TaxesId,
                taxName: taxName,
                fK_CbDiscountTypeId: fK_CbDiscountTypeId,
                discountType: discountType,
                fK_GlAccountForDiscountId: fK_GlAccountForDiscountId,
                accountNameForDiscount: accountNameForDiscount,
                discountAmount: discountAmount,
                isDiscountPercentage: isDiscountPercentage,
                //fK_GlAccountForTaxId: fK_GlAccountForTaxId,
                //taxAccount: taxAccount,
                taxOnDiscountAmount: taxOnDiscountAmount,
                isTaxPercentage: isTaxPercentage,
                fK_CreatorId: fK_CreatorId,
                fK_DefBranchId: fK_DefBranchId,
                isGenerale: isGenerale
            });

            ClearFormDetails();
        }

    });

});


function ChangeIsActive(e) {
    if (e.checked === true) {
        $(".disabled-input").attr("disabled", "disabled");
        $("#frezzingReasonBtn").attr("disabled", "disabled");
        $("#FK_DefFreezingReasonId").val("");
        $("#FreezingNotes").val("");
    }
    else {
        $("#frezzingReasonBtn").removeAttr("disabled");
        $(".disabled-input").removeAttr('disabled');

    }

}

function removeCreditCardType(id) {

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
                url: "/CbCreditCardType/Delete?id=" + id,
                type: "Get",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    if (result) {
                        swal({
                            title: Resources.DeleteSuccessResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/CbCreditCardType/Index'
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

        }, 3000);
    });
}

function ClearFormDetails() {
    //$("#fK_CbCreditCardTypeId").val("");
    $("#FK_CbCreditCardTypeId").data("kendoDropDownList").value(0);
    //$("#fK_GlAccountId").val("");
    $("#FK_GlAccountId").data("kendoDropDownList").value(0);
    // $("#accountAutoComplete").val("");
    $("#FK_TaxesId").data("kendoDropDownList").value(0);
    $("#FK_CbDiscountTypeId").data("kendoDropDownList").value(0);
    $("#DiscountAmount").val("");
    //$("#TaxOnDiscountAmount").val("");
    //$("#IsTaxPercentage").prop("checked", false);
    //$("#IsDiscountPercentage").prop("checked", false);

}
$("#IsGenerale").on("change", function () {
    console.log($("#IsGenerale").is(":checked"));
})
$("#btnSave").on('click', function () {

    var List = [];
    var gridData = $('#CreditCardGlAccountGrid').data("kendoGrid").dataSource.data();
    for (var i = 0; i < gridData.length; i++) {

        //if (gridData[i].Notes == undefined)
        //    gridData[i].Notes = null;
        //if (gridData[i].Description == undefined)
        //    gridData[i].Description = null;
        console.log(data)
        var data = {
            Id: parseInt(gridData[i].id),
            FK_CbCreditCardTypeId: parseInt(gridData[i].fK_CbCreditCardTypeId),
            FK_CbDiscountTypeId: parseInt(gridData[i].fK_CbDiscountTypeId),
            FK_GlAccountId: parseInt(gridData[i].fK_GlAccountId),
            FK_TaxesId: gridData[i].fK_TaxesId,
            DiscountAmount: gridData[i].discountAmount,
            TaxOnDiscountAmount: parseFloat(gridData[i].taxOnDiscountAmount),
            FK_GlAccountForDiscountId: gridData[i].fK_GlAccountForDiscountId,
            IsDiscountPercentage: gridData[i].isDiscountPercentage == true ? true : false,
            IsTaxPercentage: gridData[i].isTaxPercentage == true ? true : false,
            FK_CreatorId: gridData[i].fK_CreatorId,
            FK_DefBranchId: gridData[i].fK_DefBranchId,
            IsGenerale: gridData[i].isGenerale == true ? true : false,
        }

        List.push(data);

    }
    debugger;
    $.ajax({
        url: "/CbCreditCardTypeGlAccount/Create",
        type: "Post",
        cache: false,
        processData: false,
        data: JSON.stringify(List),
        contentType: 'application/json',
        success: function (result) {

            if (result) {

                swal({
                    title: Resources.SavedSuccessfullyResource,
                    confirmButtonText: Resources.DoneResource,
                    type: "success"
                }, function () {
                    window.location.href = '/CbCreditCardTypeGlAccount/Create';
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
    //}

});

