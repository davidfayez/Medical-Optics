$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#ClientName").val("");
        $("#clientAutoComplete").data("kendoDropDownList").value(0);
        $("#clientAutoComplete").data("kendoDropDownList").dataSource.read();
    });

    $("#RceReferenceTypeId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceRepayment/GetAllRceReferenceTypeForDDL",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            //fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        //change: onSelectInvoiceType

    });

    $("#clientAutoComplete").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientForDDList",
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
        select: onSelectRceClient
    });

    function onSelectRceClient(e) {
        $("#FK_RceClientId").val(e.dataItem.id);
        $("#RceClientName").val(e.dataItem.clientNameAr);
    }
    //Grid


    loadRceRepaymentDetailsGrid();

    function loadRceRepaymentDetailsGrid() {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/RceRepayment/GetAllRceReference",
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
                        isActive: { editable: true },
                        id: { editable: false },
                        fK_RceRepaymentId: { editable: false },
                        fK_RefMasterId: { editable: false },
                        fK_ReferenceId: { editable: false },
                        referenceSerial: { editable: false },
                        referenceDate: { type: "date", editable: false },
                        rceReferenceType: { editable: false },
                        rceReferenceName: { editable: false },
                        referenceGross: { editable: false },
                        referenceRemaining: { editable: false },
                        referenceDownPayment: { editable: false },
                        referenceDiscount: { editable: false },
                        referenceTax: { editable: false },
                        repaymentAmount: { editable: false },
                        isFullyRepayment: { editable: false },
                        remaining: { editable: true },
                        isChecked: { editable: true },
                    }
                }
            }
        });
        var grid = $("#GridRceRepayment").kendoGrid({
            excel: {
                fileName: "Rce Repayments.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: dataSource,
            editable: "incell",
            height: Resources.GridHeight,
            groupable: Resources.GridGroupable
            ,
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
                { field: "remaining", hidden: true },
                { width: "90px", template: "<input type='checkbox' class= 'control-label i-check btnCheck' data-bind='checked:isChecked'/>" },
                { field: "rceReferenceName", title: Resources.PayBondTypeResource, width: "150px" },
                { field: "referenceGross", title: Resources.TotalAmountResource, width: "150px" },
                { field: "referenceRemaining", title: Resources.BondTotalAmountResource, width: "150px" },
                { field: "referenceDownPayment", title: Resources.ReferenceDownPaymentResource, width: "150px" },
                { field: "referenceDiscount", title: Resources.DiscountResource, width: "150px" },
                {
                    field: "referenceDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: "150px",
                    filterable: {
                        operators: {
                            date: {
                                gte: Resources.Isafterorequalto,
                                lte: Resources.Isbeforeorequalto
                            }
                        },
                        extra: false,
                        ui: function (element) {
                            element.kendodatepicker({
                                format: '{0: dd/mm/yyyy}'
                            })
                        }
                    }
                },


            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });
                ////debugger
                //if (!hasRoleEdit)
                //    $(".btnSaveRow").attr('disabled', 'disabled');

            }
        });
        grid.data("kendoGrid").table.on("click", ".btnCheck", onCheckDetail);
    }

});
var rceBondFound = false;
$("#btnSearch").on('click', function () {
    debugger
    var clientId = parseInt($("#FK_RceClientId").val()),
        refrencyType = parseInt($("#RceReferenceTypeId").val()),
        rceBondSerial = parseInt($("#RceBondSerial").val()),
        dateFrom = $("#DateFrom").val(),
        branchId = parseInt($("#FK_DefBranchId").val()),
        dateTo = $("#DateTo").val();
    if (isNaN(refrencyType) || refrencyType == "")
        refrencyType = null;

    if (isNaN(clientId) || clientId == "") {
        swal({
            title: Resources.ChooseClientResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else if (!isNaN(rceBondSerial)) {
        $.ajax({
            type: "POST",
            url: "/RceBond/CheckRceBondExchangeExist?serial=" + rceBondSerial,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger
                if (response != null) {
                    rceBondFound = true;

                    $("#BondTotalAmount").val(response.totalAmount);
                    $("#FK_RceBondId").val(response.id);
                    $("#RceBondDate").val(response.bondDate);
                    $("#BalnceAfterRepayment").val(response.totalAmount);
                    $('#GridRceRepayment').data('kendoGrid').dataSource.read({ clientId: clientId, refrencyType: refrencyType, dateFrom: dateFrom, dateTo: dateTo, branchId: branchId });

                } else {
                    $("#BondTotalAmount").val(null);
                    $("#FK_RceBondId").val(null);
                    $("#RceBondDate").val(null);

                    swal({
                        title: Resources.PayBondNotFoundResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }
    else
        $('#GridRceRepayment').data('kendoGrid').dataSource.read({ clientId: clientId, refrencyType: refrencyType, dateFrom: dateFrom, dateTo: dateTo, branchId: branchId });

});

function onCheckDetail() {
    debugger;
    var row = $(this).closest("tr"),
        grid = $("#GridRceRepayment").data("kendoGrid"),
        dataItem = grid.dataItem(row),
        rowchecked = false;
    if ($(this).is(':checked'))
        rowchecked = true;

    rceBondSerial = parseInt($("#RceBondSerial").val());
    dataItem.set('isChecked', true);

    if (isNaN(rceBondSerial)) {
        swal({
            title: Resources.PayBondNotFoundResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
        $(".btnCheck").prop("checked", false);
        dataItem.set('isChecked', false);
    }
    else {
        $.ajax({
            type: "POST",
            url: "/RceBond/CheckRceBondExchangeExist?serial=" + rceBondSerial,
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (response) {
                debugger
                if (response != null) {
                    $("#FK_RceBondId").val(response.id);
                    $("#RceBondDate").val(response.bondDate);
                    $("#BondTotalAmount").val(response.totalAmount);
                    if (!rceBondFound) {
                        $("#BalnceAfterRepayment").val(response.totalAmount);
                        rceBondFound = true;
                    }

                    var balnceAfterRepayment = parseFloat($("#BalnceAfterRepayment").val());
                    if (isNaN(balnceAfterRepayment))
                        balnceAfterRepayment = 0;

                    if (rowchecked == true) {
                        balnceAfterRepayment = balnceAfterRepayment - parseFloat(dataItem.referenceRemaining);
                        $("#BalnceAfterRepayment").val(balnceAfterRepayment);
                        if (balnceAfterRepayment <= 0) {
                            // $(".btnCheck").attr("disabled", "disabled");
                            dataItem.set('remaining', Math.abs(balnceAfterRepayment));

                            $("#BalnceAfterRepayment").val(0);
                            $(".btnCheck").prop("disabled", true);
                            swal({
                                title: Resources.CantAddMoreRepaymentResource,
                                confirmButtonText: Resources.DoneResource,
                                type: "error"
                            });
                        }

                    }
                    else {
                        balnceAfterRepayment = balnceAfterRepayment + parseFloat(dataItem.referenceRemaining);
                        $("#BalnceAfterRepayment").val(balnceAfterRepayment);
                    }

                    // $("#PaySupplierName").val(response.supplierNameAr);

                } else {
                    $("#BondTotalAmount").val(null);
                    $("#FK_RceBondId").val(null);
                    $("#RceBondDate").val(null);

                    rceBondFound = false;
                    //$("#PaySupplierName").val(null);

                    swal({
                        title: Resources.PayBondNotFoundResource,
                        confirmButtonText: ResourcesResources.DoneResource,
                        type: "error"
                    });
                }

            }
        });
    }

}

$('select[name="RceReferenceTypeId"]').change(function () {

    $('#GridRceRepayment').data('kendoGrid').dataSource.read();
});

function SubmitRceRepaymentCreate() {
    var listDetails = [];
    var grid = $("#GridRceRepayment").data("kendoGrid");
    var gridData = $('#GridRceRepayment').data("kendoGrid").dataSource.data();

    if (gridData.length == 0) {
        swal({
            title: Resources.GridLengthZeroChooseResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
    else {
        debugger
        for (var i = 0; i < gridData.length; i++) {
            var currentUid = gridData[i].uid;
            var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
            var dataitem = grid.dataItem(currentRow);
            // currentRow.context.checked;
            if (dataitem.isChecked) {
                var remaining = gridData[i].remaining,
                    isFullyRepayment = false,
                    repaymentAmount = 0;
                if (isNaN(remaining) || remaining == null || remaining == 0) {
                    remaining = 0;
                    isFullyRepayment = true;
                }



                repaymentAmount = parseFloat(gridData[i].referenceRemaining) - remaining;
                var detail = {
                    Id: 0,
                    FK_RefMasterId: parseInt(gridData[i].fK_RefMasterId),
                    FK_ReferenceId: parseInt(gridData[i].fK_ReferenceId),
                    ReferenceSerial: gridData[i].referenceSerial,
                    ReferenceDate: gridData[i].referenceDate,
                    RceReferenceType: parseInt(gridData[i].rceReferenceType),
                    ReferenceGross: parseFloat(gridData[i].referenceGross),
                    ReferenceRemaining: parseFloat(gridData[i].referenceRemaining),
                    ReferenceDownPayment: parseFloat(gridData[i].referenceDownPayment),
                    ReferenceDiscount: parseFloat(gridData[i].referenceDiscount),
                    ReferenceTax: parseFloat(gridData[i].referenceTax),
                    RepaymentAmount: parseFloat(repaymentAmount),
                    IsFullyRepayment: isFullyRepayment,
                    Remaining: parseFloat(remaining),
                };
                listDetails.push(detail);
            }

        }


        debugger
        var Obj = {
            Id: 0,
            Serial: parseInt($("#Serial").val()),
            FK_RceBondId: parseInt($("#FK_RceBondId").val()),
            FK_RceClientId: parseInt($("#FK_RceClientId").val()),
            RceClientName: $("#RceClientName").val(),
            RceBondSerial: parseInt($("#RceBondSerial").val()),
            BondTotalAmount: parseFloat($("#BondTotalAmount").val()),
            BalnceAfterRepayment: isNaN(parseFloat($("#BalnceAfterRepayment").val())) ? 0 : parseFloat($("#BalnceAfterRepayment").val()),
            RceBondDate: $("#RceBondDate").val(),
            FK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
            ListDetails: listDetails
        };
        debugger;
        if (listDetails.length > 0) {
            $.ajax({
                url: "/RceRepayment/Create",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (result) {

                    if (result) {

                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            window.location.href = '/RceRepayment/Index';
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
        else {
            swal({
                title: Resources.GridLengthZeroChooseResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

    }

}