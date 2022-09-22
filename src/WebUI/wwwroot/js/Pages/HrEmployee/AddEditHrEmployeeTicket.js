$(document).ready(function () {
    var today = new Date().toISOString().split('T')[0];

    var hasAirlineTicket = $("#HasAirlineTicket").prop("checked");
    if (hasAirlineTicket == true)
        $("#AirlineTicket").show();
    else {
        $("#AirlineTicket").hide();
        $("#FK_HrTicketTypeId").val("");
        $("#TravelTicketCount").val("");
        $("#TravelDateEntitlement").val("");
    }

    $("#HasAirlineTicket").change(function () {
        debugger
        if ($(this).prop("checked") == true) {
            $("#AirlineTicket").show();
            $("#TravelDateEntitlement").val(today);
        }
        else {
            $("#AirlineTicket").hide();
            $("#FK_HrTicketTypeId").val("");
            $("#TravelTicketCount").val("");
            $("#TravelDateEntitlement").val("");
        }

    });

    $("#addTravelData").on('click', function () {
        debugger;
        var today = new Date().toISOString().split('T')[0];
        var employeeId = $("#EmployeeId").val();
        var FK_NationalityId = parseInt($("#FK_KinshipNationalityId").val());
        

        if (employeeId == "" || employeeId == "0") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.BasicInformation,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else {
            var hasAirlineTicket = $("#HasAirlineTicket").is(":checked");
           
            var dateEntitlement = $('#TravelDateEntitlement').val();
            var ticketType = parseInt($("#FK_TravelHrTicketTypeId").val());
            if (dateEntitlement != "")
                dateEntitlement = new Date(dateEntitlement);
            else
                dateEntitlement = null;

            if (isNaN(ticketType))
                ticketType = null;
            if (hasAirlineTicket == false) {
                ticketType = null;
                dateEntitlement = null;
            }

            debugger
            var Obj = {
                FK_HrEmployeeId: parseInt(employeeId),
                HasAirlineTicket: hasAirlineTicket,
                FK_HrTicketTypeId: ticketType,
                TravelTicketCount: parseInt($("#TravelTicketCount").val()),
                TravelDateEntitlement: dateEntitlement,
            }

            $.ajax({
                url: "/HrEmployee/CreateTravelData",
                type: "Post",
                cache: false,
                processData: false,
                data: JSON.stringify(Obj),
                contentType: 'application/json',
                success: function (response) {
                    debugger
                    if (response != null) {
                        debugger
                        var dateEntitlement = new Date(response.travelDateEntitlement);
                        dateEntitlement = dateEntitlement.getFullYear() + "-" + ("0" + (dateEntitlement.getMonth() + 1)).slice(-2) + "-" + ("0" + dateEntitlement.getDate()).slice(-2);

                        $("#HasAirlineTicket").val(response.hasAirlineTicket);
                        $("#FK_TravelHrTicketTypeId").val(response.fK_HrTicketTypeId);
                        $("#TravelTicketCount").val(response.travelTicketCount);
                        $("#TravelDateEntitlement").val(dateEntitlement);
                        $("#AirlineTicket").show();

                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }

                }
            });
            

        }


    });
});