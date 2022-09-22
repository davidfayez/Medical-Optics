$(document).ready(function () {
    $("#FinancialPeriods").kendoDropDownList({
        dataTextField: "financialPeriodName",
        dataValueField: "id",
        dataSource: {
            transport: {
                read: {
                    url: "/GlFinancialPeriod/GetAllCloseGlFinancialPeriods",
                }
            }
        }
    });


});

function closeFinancialPeriod() {
    var financialPeriodName = $('#FinancialPeriods').val();
    console.log(financialPeriodName);
    if ($("#FinancialPeriods").val() == "") {
        swal({
            title: Resources.MustAddFinancialPeriodFirstResource,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        }, function () {
        });
    }
    else {
        $.ajax({
            url: "/GlFinancialPeriod/OpenFinancialPeriodById?id=" + $("#FinancialPeriods").val(),
            type: "Post",
            contentType: false,
            processData: false,
            success: function (data) {
                debugger;
                if (data == "NO") {
                    swal({
                        title: Resources.AllVoucherMustBePostedResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "error"
                    }, function () {
                    });
                }
                else {
                    swal({
                        title: Resources.SavedSuccessfullyResource,
                        confirmButtonText: Resources.DoneResource,
                        type: "success"
                    }, function () {

                    });
                }

                console.log(data);
            }
        });
    }
    
}