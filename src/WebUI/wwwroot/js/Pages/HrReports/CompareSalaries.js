$(document).ready(function () {
    $("#Year").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "text",
        dataValueField: "value",
        height: 300,
        checkboxes: false,
        checkAll: false,
        autoClose: true,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrReports/GetAllYears",
                },
                
            }
        }

    });

    $("#Month").kendoMultiSelect({
        placeholder: Resources.Choose,
        dataTextField: "text",
        dataValueField: "value",
        height: 300,
        maxSelectedItems: 2,
        //autoBind: false,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrReports/GetAllMonths"
                },
                
            }
        },
        //change : changeOnFirstMonth

    });

    $("#SecondYear").kendoDropDownTree({
        placeholder: Resources.Choose,
        filter: "contains",
        dataTextField: "text",
        dataValueField: "value",
        height: 300,
        checkboxes: false,
        checkAll: false,
        autoClose: true,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrReports/GetAllYears",
                },

            }
        },
        change: onselectSecondYear,

    });

    function onselectSecondYear() {
        var MonthsMultiselect = $("#Month").data("kendoMultiSelect").value();  //["1", "2"]
        if (this._values.length > 0) {
            $("#SecondMonth").data("kendoMultiSelect").value(MonthsMultiselect);  //["1", "2"]
        }
        else {
            $("#SecondMonth").data("kendoMultiSelect").value("");  //["1", "2"]
        }
    }

    function changeOnFirstMonth() {
        debugger;
        var z = this;
        var MonthsMultiselect = $("#Month").data("kendoMultiSelect").value();  //["1", "2"]
        if (MonthsMultiselect.length > 0) {
            $("#SecondMonth").data("kendoMultiSelect").value(MonthsMultiselect);  //["1", "2"]
        }
        else {
            $("#SecondMonth").data("kendoMultiSelect").value("");  //["1", "2"]
        }
    }

    $("#SecondMonth").kendoMultiSelect({
        placeholder: Resources.Choose,
        dataTextField: "text",
        dataValueField: "value",
        height: 300,
        maxSelectedItems: 2,
        //autoBind: false,
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/HrReports/GetAllMonths"
                },

            }
        }

    });
});

function getComparedSalaries() {
    debugger;
    var YearId = $("#Year").data("kendoDropDownTree").value();  
    var SecondYearId = $("#SecondYear").data("kendoDropDownTree").value();  
    var filterBy = $('input[name="Filters"]:checked').val();

    var MonthsMultiselect = $("#Month").data("kendoMultiSelect").value();  //["1", "2"]
    var SecondMonthsMultiselect = $("#SecondMonth").data("kendoMultiSelect").value();  //["1", "2"]

    if (YearId != "" && MonthsMultiselect.length > 1) {

        var MonthIds = [];
        $.each(MonthsMultiselect, function (i, v) {
            MonthIds.push(v);
        });

        var SecondMonthIds = [];
        $.each(SecondMonthsMultiselect, function (i, v) {
            SecondMonthIds.push(v);
        });

        if (SecondYearId != "" && SecondMonthsMultiselect.length < 2) {
            swal({
                title: Resources.ChooseMonthsFromSecondYear,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (SecondYearId == "" && SecondMonthsMultiselect.length > 1) {
            swal({
                title: Resources.ChooseSecondYear,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (SecondYearId != "" && SecondMonthsMultiselect.length > 1) {
            $.ajax({
                type: "GET",
                url: '/HrReports/GetComparedSalariesInTwoYears?year=' + parseInt(YearId) + "&months=" + MonthIds + "&secondYear=" + parseInt(SecondYearId) + "&secondMonths=" + SecondMonthIds + "&filterBy=" + parseInt(filterBy),
                dataType: "html",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $("#_ComparedSalariesCard").html(data);
                },
                error: function (err) {
                    alert("Error while inserting data");
                }
            });
        }
        else {
            $.ajax({
                type: "GET",
                url: '/HrReports/GetComparedSalaries?year=' + parseInt(YearId) + "&months=" + MonthIds + "&filterBy=" + parseInt(filterBy),
                dataType: "html",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $("#_ComparedSalariesCard").html(data);
                },
                error: function (err) {
                    alert("Error while inserting data");
                }
            });
        }
        
    }
    else {
        swal({
            title: Resources.Choose + " " + Resources.Month + Resources.And + Resources.Year,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
}

function getComparedSalariesPrint() {
    debugger;
    var YearId = $("#Year").data("kendoDropDownTree").value();
    var SecondYearId = $("#SecondYear").data("kendoDropDownTree").value();  
    var filterBy = $('input[name="Filters"]:checked').val();

    var MonthsMultiselect = $("#Month").data("kendoMultiSelect").value();  //["1", "2"]
    var SecondMonthsMultiselect = $("#SecondMonth").data("kendoMultiSelect").value();  //["1", "2"]

    if (YearId != "" && MonthsMultiselect.length > 1) {
        var MonthIds = [];
        $.each(MonthsMultiselect, function (i, v) {
            MonthIds.push(v);
        });

        var SecondMonthIds = [];
        $.each(SecondMonthsMultiselect, function (i, v) {
            SecondMonthIds.push(v);
        });

        if (SecondYearId != "" && SecondMonthsMultiselect.length < 2) {
            swal({
                title: Resources.ChooseMonthsFromSecondYear,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (SecondYearId == "" && SecondMonthsMultiselect.length > 1) {
            swal({
                title: Resources.ChooseSecondYear,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (SecondYearId != "" && SecondMonthsMultiselect.length > 1) {
            var url = '/HrReports/GetComparedSalariesPrint?year=' + parseInt(YearId) + "&months=" + MonthIds + "&secondYear=" + parseInt(SecondYearId) + "&secondMonths=" + SecondMonthIds + "&filterBy=" + parseInt(filterBy);
            window.open(url, '_blank');
        }
        else {
            var url = '/HrReports/GetComparedSalariesPrint?year=' + parseInt(YearId) + "&months=" + MonthIds + "&secondYear=" + null + "&secondMonths=" + "" + "&filterBy=" + parseInt(filterBy);
            window.open(url, '_blank');
        }
    }
    else {
        swal({
            title: Resources.Choose + " " + Resources.Month + Resources.And + Resources.Year,
            confirmButtonText: Resources.DoneResource,
            type: "error"
        });
    }
   
}

