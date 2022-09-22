$(document).ready(function () {

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
    $("#FK_RceClientId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "nameAndCode",
        dataValueField: "id",
        //valueTemplate: '<span class="selected-value"></span><span>' + Resources.Choose + '</span>',
        //template: '<span class="k-state-default">#: data.codeAndName #</span>',
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllRceClientsForDDLList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        if (Object.keys(data).length > 0 && data.filter != undefined && data.filter.filters["length"] > 0) {
                            return {
                                //code: data.filter.filters[0].value,
                                //defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        } else {
                            return {
                                //code: "",
                                //defBranchId: parseInt($("#FK_DefBranchId").val()),
                            };
                        }

                    } else {
                        return data;
                    }
                }
            }
        },
    });
});

$("#btnSubmit").on('click', function () {

    //submit form if valid
    if ($("#FK_RceClientId").val() > 0)
        $("#FK_RceClientIdValidation").hide();
    else
        $("#FK_RceClientIdValidation").show();

    if ($("#formSubClient").valid() && $("#FK_RceClientId").val() > 0)
        $("#formSubClient").submit();
});
//function savePaySubClient() {
//    debugger;
//    if ($("#formSubClient").valid()) {
//        //var List = [];
//        //var gridData = $('#GlJournalVoucherDetailgrid').data("kendoGrid").dataSource.data();
//        //for (var i = 0; i < gridData.length; i++) {

//        //    if (gridData[i].Notes == undefined)
//        //        gridData[i].Notes = null;
//        //    if (gridData[i].Description == undefined)
//        //        gridData[i].Description = null;
//        //    var data = {
//        //        FK_GlAccountId: parseInt(gridData[i].FK_GlAccountId),
//        //        AccountCode: "",
//        //        AccountName: "",
//        //        CostCenterName: "",
//        //        FK_DefCurrencyId: parseInt(gridData[i].FK_DefCurrencyId.id),
//        //        FK_CostCenterId: parseInt(gridData[i].FK_CostCenterId),
//        //        ReferenceNumber: String(gridData[i].ReferenceNumber),
//        //        CurrencyFactor: parseFloat(gridData[i].CurrencyFactor),
//        //        Debit: parseFloat(gridData[i].Debit),
//        //        Credit: parseFloat(gridData[i].Credit),
//        //        Notes: gridData[i].Notes,
//        //        Description: gridData[i].Description,
//        //    }

//        //    List.push(data);

//        //}
//        var Obj = {
//            Id: parseInt($('#Id').val()),
//            ClientCode: $("#ClientCode").val(),
//            ClientNameAr: $("#ClientNameAr").val(),
//            ClientNameEn: $("#ClientNameEn").val(),
//            CompanyNameAr: $("#CompanyNameAr").val(),
//            CompanyNameEn: $("#CompanyNameEn").val(),
//            TransactionStartDate: new Date($("#TransactionStartDate").val()),
//            FK_RceClientId: parseInt($("#FK_RceClientId").val()),
//            FK_DefFreezingReasonId: parseInt($("#FK_DefFreezingReasonId").val()),
//            FreezingNotes: String($("#FreezingNotes").val()),
//            Description: String($("#Description").val()),
//            IsActive: Boolean($("input[name='IsActive']:checked").val()),
//            //ListDetails: List,
//            //Categories: []
//        };
//        if (isNaN(Obj.FK_DefFreezingReasonId))
//            Obj.FK_DefFreezingReasonId = 0;
//        if (isNaN(Obj.FK_PayClientId))
//            Obj.FK_PayClientId = 0;
//        //if (List.length == 0) {

//        //    swal({
//        //        title: $("#GridLengthZeroResource").text(),
//        //        confirmButtonText: $("#DoneResource").text(),
//        //        type: "error"
//        //    }, function () {
//        //    });

//        //}
//        //else if ($("#VoucherCode").val() == "") {
//        //    swal({
//        //        title: $("#NoCodingCreatedResource").text(),
//        //        confirmButtonText: $("#DoneResource").text(),
//        //        type: "error"
//        //    }, function () {
//        //    });
//        //}
//        //else if (parseInt($("#TotalDebit").val()) != parseInt($("#TotalCredit").val())) {
//        //    swal({
//        //        title: $("#TotalDebitNotEqualTotalCreditResource").text(),
//        //        confirmButtonText: $("#DoneResource").text(),
//        //        type: "error"
//        //    }, function () {

//        //    });
//        //}
//        //else {
//        var listValid = true;
//        //for (var i = 0; i < List.length; i++) {
//        //    if (isNaN(List[i].FK_CostCenterId))
//        //        List[i].FK_CostCenterId = null;
//        //    var accountId = List[i].FK_GlAccountId;
//        //    var currencyId = List[i].FK_DefCurrencyId;
//        //    var currencyFactor = List[i].CurrencyFactor;
//        //    var debit = List[i].Debit;
//        //    var credit = List[i].Credit;
//        //    if (isNaN(accountId) || isNaN(currencyId) || isNaN(currencyFactor) || (debit == 0 && credit == 0)) {
//        //        listValid = false;
//        //        swal({
//        //            title: $("#DataNotCompletedResource").text(),
//        //            confirmButtonText: $("#DoneResource").text(),
//        //            type: "error"
//        //        });

//        //        break;
//        //    }
//        //}
//        if (listValid) {
//            $.ajax({
//                url: "/RceLookups/CreateRceSubClient",
//                type: "Post",
//                data: JSON.stringify(Obj),
//                contentType: 'application/json',
//                success: function (result) {
//                    debugger
//                    if (result) {

//                        swal({
//                            title: $("#SavedSuccessfullyResource").text(),
//                            confirmButtonText: $("#DoneResource").text(),
//                            type: "success"
//                        }, function () {
//                            window.location.href = '/RceLookups/IndexRceSubClient';
//                        });
//                    }
//                    else {
//                        swal({
//                            title: $("#DefaultErrorMessageResource").text(),
//                            confirmButtonText: $("#DoneResource").text(),
//                            type: "error"
//                        });
//                    }
//                }
//            });
//        }

//        //}
//    }
//}