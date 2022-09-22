$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#FK_PaySupplierId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierId").data("kendoDropDownList").dataSource.read();
    });

    $("#FK_PaySupplierId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllPaySupplierForDDList",
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

    disableFreezing();
    $("#rdActive").change(function () {
        disableFreezing();
    })
    $("#rdInactive").click(function () {
        disableFreezing();
    })
    function disableFreezing() {
        var state = $("input[name='IsActive']:checked").val();
        if (state == "True") {
            $("#FK_DefFreezingReasonId").attr("disabled", "disabled");
            $("#FreezingNotes").attr("disabled", "disabled");
            $("#frezzingReasonBtn").attr("disabled", "disabled");

        } else {
            $("#FK_DefFreezingReasonId").removeAttr("disabled");
            $("#FreezingNotes").removeAttr("disabled");
            $("#frezzingReasonBtn").removeAttr("disabled");

        }
    }

    $("#btnSave").click(function () {
        debugger;

        if ($("#FK_PaySupplierId").val() != "0")
            $("#FK_PaySupplierIdValid").text("")
        else
            $("#FK_PaySupplierIdValid").text(Resources.Required)


        if ($("#formSubSupplierAdd").valid())
            $("#formSubSupplierAdd").submit();

    });
});

function savePaySubSupplier() {
    debugger;
    if ($("#formSubSupplier").valid()) {
        //var List = [];
        //var gridData = $('#GlJournalVoucherDetailgrid').data("kendoGrid").dataSource.data();
        //for (var i = 0; i < gridData.length; i++) {

        //    if (gridData[i].Notes == undefined)
        //        gridData[i].Notes = null;
        //    if (gridData[i].Description == undefined)
        //        gridData[i].Description = null;
        //    var data = {
        //        FK_GlAccountId: parseInt(gridData[i].FK_GlAccountId),
        //        AccountCode: "",
        //        AccountName: "",
        //        CostCenterName: "",
        //        FK_DefCurrencyId: parseInt(gridData[i].FK_DefCurrencyId.id),
        //        FK_CostCenterId: parseInt(gridData[i].FK_CostCenterId),
        //        ReferenceNumber: String(gridData[i].ReferenceNumber),
        //        CurrencyFactor: parseFloat(gridData[i].CurrencyFactor),
        //        Debit: parseFloat(gridData[i].Debit),
        //        Credit: parseFloat(gridData[i].Credit),
        //        Notes: gridData[i].Notes,
        //        Description: gridData[i].Description,
        //    }

        //    List.push(data);

        //}
        var Obj = {
            Id: parseInt($('#Id').val()),
            SupplierCode: $("#SupplierCode").val(),
            SupplierNameAr: $("#SupplierNameAr").val(),
            SupplierNameEn: $("#SupplierNameEn").val(),
            CompanyNameAr: $("#CompanyNameAr").val(),
            CompanyNameEn: $("#CompanyNameEn").val(),
            TransactionStartDate: new Date($("#TransactionStartDate").val()),
            FK_PaySupplierId: parseInt($("#FK_PaySupplierId").val()),
            FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
            FreezingNotes: String($("#FreezingNotes").val()),
            Description: String($("#Description").val()),
            IsActive: Boolean($("input[name='IsActive']:checked").val()),
            //ListDetails: List,
            //Categories: []
        };
        if (isNaN(Obj.FK_DefFreezingReasonId))
            Obj.FK_DefFreezingReasonId = 0;
        if (isNaN(Obj.FK_PaySupplierId))
            Obj.FK_PaySupplierId = 0;
        //if (List.length == 0) {

        //    swal({
        //        title: $("#GridLengthZeroResource").text(),
        //        confirmButtonText: $("#DoneResource").text(),
        //        type: "error"
        //    }, function () {
        //    });

        //}
        //else if ($("#VoucherCode").val() == "") {
        //    swal({
        //        title: $("#NoCodingCreatedResource").text(),
        //        confirmButtonText: $("#DoneResource").text(),
        //        type: "error"
        //    }, function () {
        //    });
        //}
        //else if (parseInt($("#TotalDebit").val()) != parseInt($("#TotalCredit").val())) {
        //    swal({
        //        title: $("#TotalDebitNotEqualTotalCreditResource").text(),
        //        confirmButtonText: $("#DoneResource").text(),
        //        type: "error"
        //    }, function () {

        //    });
        //}
        //else {
            var listValid = true;
            //for (var i = 0; i < List.length; i++) {
            //    if (isNaN(List[i].FK_CostCenterId))
            //        List[i].FK_CostCenterId = null;
            //    var accountId = List[i].FK_GlAccountId;
            //    var currencyId = List[i].FK_DefCurrencyId;
            //    var currencyFactor = List[i].CurrencyFactor;
            //    var debit = List[i].Debit;
            //    var credit = List[i].Credit;
            //    if (isNaN(accountId) || isNaN(currencyId) || isNaN(currencyFactor) || (debit == 0 && credit == 0)) {
            //        listValid = false;
            //        swal({
            //            title: $("#DataNotCompletedResource").text(),
            //            confirmButtonText: $("#DoneResource").text(),
            //            type: "error"
            //        });

            //        break;
            //    }
            //}
            if (listValid) {
                $.ajax({
                    url: "/PayLookups/CreatePaySubSupplier",
                    type: "Post",
                    data: JSON.stringify(Obj),
                    contentType: 'application/json',
                    success: function (result) {
                        debugger
                        if (result) {

                            swal({
                                title: Resources.SavedSuccessfullyResource,
                                confirmButtonText: Resources.DoneResource ,
                                type: "success"
                            }, function () {
                                    window.location.href = '/PayLookups/IndexPaySubSupplier';
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

        //}
    }
}