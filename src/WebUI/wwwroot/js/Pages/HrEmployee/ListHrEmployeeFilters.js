$().ready(function () {

    var EmployeesIds = ",";
    var ManagmentsIds = ",";
    var DepartmentsIds = ",";
    var ClinicsIds = ",";
    var CostCentersIds = ",";
    var ReligionsIds = ",";
    var NationalityIds = ",";
    var CountryIds = ",";
    var CityIds = ",";
    var JobsIds = ",";
    var JobsAccordingToIds = ",";
    var DocTypesIds = ",";
    

    $("#EmployeesFilters").click(function () {
        var emp="";
        emp= $("#EmployeesFilterTxt").val();
        $.ajax({
            data: { Employee: emp },
            url: "/HrEmployee/GetEmployeesByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#EmployeesOptions").html("");//Clear Data
                    $("#EmployeesOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#AdministrationsFilters").click(function () {
        var Admin = "";
        Admin = $("#AdministrationsFilterTxt").val();
        $.ajax({
            data: { Admin: Admin },
            url: "/HrEmployee/GetManagmentByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#AdministrationsOptions").html("");//Clear Data
                    $("#AdministrationsOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#DepartmentsFilters").click(function () {
        var Department = "";
        Department = $("#DepartmentsFilterTxt").val();
        $.ajax({
            data: { Department: Department },
            url: "/HrEmployee/GetDepartmentByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#DepartmentsOptions").html("");//Clear Data
                    $("#DepartmentsOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#ClinicsFilters").click(function () {
        var Clinic = "";
        Clinic = $("#ClinicsFilterTxt").val();
        $.ajax({
            data: { Clinic: Clinic },
            url: "/HrEmployee/GetClinicByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#ClinicsOptions").html("");//Clear Data
                    $("#ClinicsOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#CostCentersFilters").click(function () {
        var CostCenter = "";
        CostCenter = $("#CostCentersFilterTxt").val();
        $.ajax({
            data: { CostCenter: CostCenter },
            url: "/HrEmployee/GetCostCenterByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#CostCentersOptions").html("");//Clear Data
                    $("#CostCentersOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#ReligionsFilters").click(function () {
        var Religions = "";
        Religions = $("#ReligionsFilterTxt").val();
        $.ajax({
            data: { Religions: Religions },
            url: "/HrEmployee/GetReligionsByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#ReligionsOptions").html("");//Clear Data
                    $("#ReligionsOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#NationalityFilters").click(function () {
        var Nationality = "";
        Nationality = $("#NationalityFilterTxt").val();
        $.ajax({
            data: { Nationality: Nationality },
            url: "/HrEmployee/GetNationalityByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#NationalityOptions").html("");//Clear Data
                    $("#NationalityOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#CountryFilters").click(function () {
        var Country = "";
        Country = $("#CountryFilterTxt").val();
        $.ajax({
            data: { Country: Country },
            url: "/HrEmployee/GetCountryByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#CountryOptions").html("");//Clear Data
                    $("#CountryOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#CityFilters").click(function () {
        var City = "";
        City = $("#CityFilterTxt").val();
        $.ajax({
            data: { City: City },
            url: "/HrEmployee/GetCityByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#CityOptions").html("");//Clear Data
                    $("#CityOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#JobsFilters").click(function () {
        var Job = "";
        Job = $("#JobsFilterTxt").val();
        $.ajax({
            data: { Job: Job },
            url: "/HrEmployee/GetJobsByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#JobsOptions").html("");//Clear Data
                    $("#JobsOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#JobsAccToFilters").click(function () {
        var JobAccTo = "";
        JobAccTo = $("#JobsAccToFilterTxt").val();
        $.ajax({
            data: { JobAccTo: JobAccTo },
            url: "/HrEmployee/GetJobsAccToByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#JobsAccToOptions").html("");//Clear Data
                    $("#JobsAccToOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $("#DocTypeFilters").click(function () {
        var DocType = "";
        DocType = $("#DocTypeFilterTxt").val();
        $.ajax({
            data: { DocType: DocType },
            url: "/HrEmployee/GetDocTypeByName",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != "") {
                    $("#DocTypeOptions").html("");//Clear Data
                    $("#DocTypeOptions").html(result);
                }
                else {

                }
            },
            error: function (err, xqr, txt) { }
        });
    });

    $('input[type=checkbox]').change(function () {
        var MyName = $(this).attr("Name");
        var MyID = $(this).attr("Value");
        var IsChecked = $(this).prop("checked");
        if (IsChecked) {
            switch (MyName) {
                case "EmployeesFilter":
                    EmployeesIds += MyID + ",";
                    break;
                case "ManagmentsFilter":
                    ManagmentsIds += MyID + ",";
                    break;
                case "DepartmentsFilter":
                    DepartmentsIds += MyID + ",";
                    break;
                case "ClinicsFilter":
                    ClinicsIds += MyID + ",";
                    break;
                case "CostCenterTypesFilter":
                    CostCentersIds += MyID + ",";
                    break;
                case "ReligionsFilter":
                    ReligionsIds += MyID + ",";
                    break;
                case "NationalityFilter":
                    NationalityIds += MyID + ",";
                    break;
                case "CountryFilter":
                    CountryIds += MyID + ",";
                    break;
                case "CityFilter":
                    CityIds += MyID + ",";
                    break;
                case "JobsFilter":
                    JobsIds += MyID + ",";
                    break;
                case "JobsAccordingToFilter":
                    JobsAccordingToIds += MyID + ",";
                    break;
                case "DocumentsTypesFilter":
                    DocTypesIds += MyID + ",";
                    break;
            }
        }
        else {
            switch (MyName) {
                case "EmployeesFilter":
                    EmployeesIds = EmployeesIds.replace(MyID, "");
                    break;
                case "ManagmentsFilter":
                    ManagmentsIds = ManagmentsIds.replace(MyID, "");
                    break;
                case "DepartmentsFilter":
                    DepartmentsIds = DepartmentsIds.replace(MyID, "");
                    break;
                case "ClinicsFilter":
                    ClinicsIds = ClinicsIds.replace(MyID, "");
                    break;
                case "CostCenterTypesFilter":
                    CostCentersIds = CostCentersIds.replace(MyID, "");
                    break;
                case "ReligionsFilter":
                    ReligionsIds = ReligionsIds.replace(MyID, "");
                    break;
                case "NationalityFilter":
                    NationalityIds = NationalityIds.replace(MyID, "");
                    break;
                case "CountryFilter":
                    CountryIds = CountryIds.replace(MyID, "");
                    break;
                case "CityFilter":
                    CityIds = CityIds.replace(MyID, "");
                    break;
                case "JobsFilter":
                    JobsIds = JobsIds.replace(MyID, "");
                    break;
                case "JobsAccordingToFilter":
                    JobsAccordingToIds = JobsAccordingToIds.replace(MyID, "");
                    break;
                case "DocumentsTypesFilter":
                    DocTypesIds = DocTypesIds.replace(MyID, "");
                    break;
            }
        }
    });

    $('#SearchFiltersBtn').click(function () {

        const SData = {
            EmployeesIds : EmployeesIds,
            ManagmentsIds : ManagmentsIds,
            DepartmentsIds : DepartmentsIds,
            ClinicsIds : ClinicsIds,
            CostCentersIds: CostCentersIds,
            ReligionsIds: ReligionsIds,
            NationalityIds: NationalityIds,
            CountryIds: CountryIds,
            CityIds: CityIds,
            JobsIds: JobsIds,
            JobsAccordingToIds: JobsAccordingToIds,
            DocTypesIds: DocTypesIds
        }
        var MyData = JSON.stringify(SData);
        debugger
        $.ajax({
            data: SData,
            url: "/HrEmployee/SearchFilters",
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                
            },
            error: function (err, xqr, txt) { }
        });
    });
});