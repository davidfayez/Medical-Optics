$("#submitCurrency").on('click', function () {

    if ($("#currencyFormAdd").valid()) {
        var isPimary = $("input[name='isPimary']:checked").val();
        if (isPimary == "True") {
            $.ajax({
                url: "/Currency/CheckIsPimary/",
                type: "post",
                contentType: 'application/json',

                success: function (result) {
                    if (result) {
                        $("#currencyFormAdd").submit();
                    }
                    else {

                        swal({
                            title: Resources.WarningResource,
                            text: Resources.ChangeMainCurrencyResource,
                            type: "info",
                            showCancelButton: true,
                            confirmButtonText: Resources.ChangeResource,
                            cancelButtonText: Resources.CancelResource,
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true
                        }, function () {

                            setTimeout(function () {
                                swal({
                                    title: Resources.ChangedSuccessfullyResource,
                                    confirmButtonText: Resources.DoneResource,
                                    type: "success"
                                }, function () {
                                    $("#currencyFormAdd").submit();
                                });

                            }, 2000);
                        });
                    }

                },
            });
        }
        else
            $("#currencyFormAdd").submit();


    }

});
