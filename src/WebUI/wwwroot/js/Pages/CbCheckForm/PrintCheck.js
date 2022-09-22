$(document).ready(function () {

    $('#DefBranches').change(function () {

        $("#CbCheckForm").data("kendoDropDownList").value("0");
        $("#CbCheckForm").data("kendoDropDownList").dataSource.read();
    });


    $("#CbCheckForm").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/CbCheckForm/GetAllForDDList",
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
        select: onSelectForm

    });
    function onSelectForm(e) {

        clearForm();
        var BondDate = $("#InvoiceDate").val();
        var voucherDate = new Date($("#InvoiceDate").val());
        if (e.dataItem.id > 0) {

            $.ajax({
                url: "/CbCheckForm/GetById?id=" + e.dataItem.id,
                type: "Get",
                contentType: false,
                processData: false,
                success: function (data) {

                    if (data) {
                        if (data.fontSize != null)
                            $('#FontSize').val(data.fontSize);

                        if (data.dateCheck_X != null || data.dateCheck_Y != null || data.dateCheck_Z != null)
                            $('#DateCheck').removeAttr('disabled');

                        if (data.recipient_X != null || data.recipient_Y != null || data.recipient_Z != null)
                            $('#Recipient').removeAttr('disabled');

                        if (data.amount_X != null || data.amount_Y != null || data.amount_Z != null)
                            $('#Amount').removeAttr('disabled');

                        if (data.fraction_X != null || data.fraction_Y != null || data.fraction_Z != null)
                            $('#Fraction').removeAttr('disabled');

                        if (data.amountText_X != null || data.amountText_Y != null || data.amountText_Z != null)
                            $('#AmountText').removeAttr('disabled');

                        if (data.description_X != null || data.description_Y != null || data.description_Z != null)
                            $('#Description').removeAttr('disabled');

                        if (data.line_X != null || data.line_Y != null || data.line_Z != null)
                            $('#Line').removeAttr('disabled');

                        if (data.writtenIn_X != null || data.writtenIn_Y != null || data.writtenIn_Z != null)
                            $('#WrittenIn').removeAttr('disabled');
                    }

                }
            });
        }

    }


});

function clearForm() {
    $('#DateCheck').val(null);
    $('#DateCheck').prop('disabled', true);
    $('#Recipient').val('');
    $('#Recipient').prop('disabled', true);
    $('#Amount').val('');
    $('#Amount').prop('disabled', true);
    $('#Fraction').val('');
    $('#Fraction').prop('disabled', true);
    $('#AmountText').val('');
    $('#AmountText').prop('disabled', true);
    $('#Description').val('');
    $('#Description').prop('disabled', true);
    $('#Line').val('');
    $('#Line').prop('disabled', true);
    $('#WrittenIn').val('');
    $('#WrittenIn').prop('disabled', true);


}

function PrintCheck() {
    var cbCheckFormId = $("#CbCheckForm").val(),

        dateCheck = $("#DateCheck").val(),
        recipient = $("#Recipient").val(),
        amount = $("#Amount").val(),
        fraction = $("#Fraction").val(),
        amountText = $("#AmountText").val(),
        fontSize = $('#FontSize').val(),
        description = $("#Description").val(),
        line = $("#Line").val(),
        writtenIn = $("#WrittenIn").val();
    debugger
    if (cbCheckFormId == 0) {
        swal({
            title: Resources.ChooseResource + " " + Resources.CheckForm,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    } else {
        var url = '/CbCheckForm/PrintCheckView?id=' + cbCheckFormId + "&dateCheck=" + dateCheck + "&recipient=" + recipient + "&amount=" + amount + "&fraction=" + fraction + "&amountText=" + amountText + "&description=" + description + "&line=" + line + "&writtenIn=" + writtenIn + "&fontSize=" + fontSize +'';
        window.open(url, '_blank').print();
    }

}