$(document).ready(function () {

    LoadInsuranceServiceGrid();
    function LoadInsuranceServiceGrid() {
        var grid = $("#InsuranceServiceGrid").kendoGrid({
            excel: {
                fileName: "Insurance Service.xlsx",
                allPages: Resources.GridAllPages,
                filterable: Resources.GridFilterable
            },
            dataSource: {
                transport: {
                    read: {
                        url: "/InsuranceCompItemPrice/GetAll",
                        Type: "GET"
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            fK_StItemId: { editable: false },
                            fK_InsuranceMainCompanyId: { editable: false },
                            fK_InsuranceSubCompanyId: { editable: false },
                            fK_StMainCategoryId: { editable: false },
                            itemName: { type: "string" },
                            itemNameEn: { type: "string" },
                            insuranceMainCompany: { type: "string" },
                            insuranceSubCompany: { type: "string" },
                            cashPrice: { type: "number" },
                            contractPrice: { type: "number" },
                            insurancePrice: { type: "number" },
                            //dateFrom: { type: "date", editable: false },
                            //dateTo: { type: "date", editable: false },
                        }
                    }
                },
                pageSize: 30
            },
            height: Resources.GridHeight,
            sortable: Resources.GridSortable,
            reorderable: Resources.GridReorderable,
            groupable: Resources.GridGroupable,
            resizable: Resources.GridResizable,
            filterable: Resources.GridFilterable,
            columnMenu: Resources.GridColumnMenu,
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
                { field: "fK_StItemId", hidden: true },
                { field: "fK_InsuranceMainCompanyId", hidden: true },
                { field: "fK_InsuranceSubCompanyId", hidden: true },
                { field: "fK_StMainCategoryId", hidden: true },
            {
                field: "itemName",
                title: Resources.ItemName,
                width: Resources.NameWidth
            },
            {
                field: "itemNameEn",
                title: Resources.NameEn,
                width: Resources.NameWidth
            },
            {
                field: "insuranceMainCompany",
                title: Resources.InsuranceMainCompany,
                width: Resources.NameWidth
            },
            {
                field: "insuranceSubCompany",
                title: Resources.InsuranceSubCompany,
                width: Resources.NameWidth
            }, {
                field: "cashPrice",
                title: Resources.CashPrice,
                width: Resources.AmountWidth,
            }, {
                field: "contractPrice",
                title: Resources.ContractPrice,
                width: Resources.AmountWidth,
            }, {
                field: "insurancePrice",
                title: Resources.InsurancePrice,
                width: Resources.AmountWidth,
            },
                
                { width: Resources.DoubleActionWidth, template: "<a class='btn btn-success btn-sm btnEdit'><i class='fas fa-edit'></i></a> <a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" },

            ],
            dataBound: function (e) {
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    kendo.bind(this, dataItem);
                    if (dataItem.isActive) {
                        //$(this).addClass("k-state-selected");
                    }
                });

            }
        });
        grid.data("kendoGrid").table.on("click", ".btnDelete", removeInsuranceCompanyItemPrice);
        grid.data("kendoGrid").table.on("click", ".btnEdit", editInsuranceCompanyItemPrice);

    }

    function removeInsuranceCompanyItemPrice() {

        var row = $(this).closest("tr"),
            grid = $("#InsuranceServiceGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
        //var filters = grid.dataSource.filter();
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
                    url: "/InsuranceCompItemPrice/Delete?id=" + dataItem.id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        debugger;
                        if (result) {
                            LoadInsuranceServiceGrid();
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
                    },
                    error: function (err, xqr, txt) { }
                });

            }, 3000);
        });
    }

    function editInsuranceCompanyItemPrice() {

        var row = $(this).closest("tr"),
            grid = $("#InsuranceServiceGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        $("#Id").val(dataItem.id);
        $("#ItemName").val(dataItem.itemName);
        $("#ItemNameEn").val(dataItem.itemNameEn);
        $("#StItemId").val(dataItem.id);
        $("#FK_StItemId").val(dataItem.id);
        $("#FK_InsuranceMainCompanyId").val(dataItem.fK_InsuranceMainCompanyId);
        $("#FK_InsuranceSubCompanyId").val(dataItem.fK_InsuranceSubCompanyId);
        $("#mainCategorie").val(dataItem.fK_StMainCategoryId);
        $("#CashPrice").val(dataItem.cashPrice);
        $("#ContractPrice").val(dataItem.contractPrice);
        $("#InsurancePrice").val(dataItem.insurancePrice);

        var option1 = $('<option></option>').attr("value", dataItem.fK_StItemId).text(dataItem.itemName);
        $("#FK_StItemId").append(option1);

        var option2 = $('<option></option>').attr("value", dataItem.fK_InsuranceSubCompanyId).text(dataItem.insuranceSubCompany);
        $("#FK_InsuranceSubCompanyId").append(option2);
        //var filters = grid.dataSource.filter();
        
    }

    $("#FK_InsuranceMainCompanyId").on('change', function () {
        debugger;
        var loadingoption = $('<option></option>').text("اختر");
        //('#FK_HrSubBranchId').attr("disabled", "disabled").empty().append(loadingoption);
        var id = $("#FK_InsuranceMainCompanyId > option:selected").val();
        //alert(id);
        jQuery.getJSON("/InsuranceService/GetAllSubCompanyByMainId/" + id, function (data) {
            var defaultoption = $('<option value="">اختر</option>');
            $('#FK_InsuranceSubCompanyId').removeAttr("disabled").empty().append(defaultoption);
            jQuery.each(data, function (i) {
                var option2 = $('<option></option>').attr("value", data[i].id).text(data[i].companyNameAr);
                $("#FK_InsuranceSubCompanyId").append(option2);
            });
        });
    });


    $("#mainCategorie").change(function () {

        if ($("#mainCategorie").val() > 0) {
            var fK_StMainCategoryId = $("#mainCategorie").val(),
                fK_InsuranceMainCompanyId = $("#FK_InsuranceMainCompanyId").val(),
                fK_StItemId = $("#FK_StItemId").val(),
                fK_InsuranceSubCompanyId = $("#FK_InsuranceSubCompanyId").val();
            $.ajax({
                url: "/InsuranceService/GetAllservicesByMainCategory?id=" + fK_StMainCategoryId,
                success: function (items) {
                    var options = '<option value="">' + Resources.SelectOne + '</option>'
                    for (var i = 0; i < items.length; i++) {
                        options += '<option value="' + items[i].id + '">' + items[i].itemName + '</options>'
                    }
                    $("#FK_StItemId").html(options)
                }
            })
        }
    });

    $("#FK_StItemId").change(function () {
        if ($("#FK_StItemId").val() > 0) {
             
            var fK_StMainCategoryId = $("#FK_StMainCategoryId").val(),
                fK_InsuranceMainCompanyId = $("#FK_InsuranceMainCompanyId").val(),
                fK_StItemId = $("#FK_StItemId").val(),
                fK_InsuranceSubCompanyId = $("#FK_InsuranceSubCompanyId").val();
            $.ajax({
                url: "/InsuranceService/GetServiceData?id="+ fK_StItemId,
                success: function (item) {
                    $("#ItemName").val(item.itemName);
                    $("#ItemNameEn").val(item.itemNameEn);
                    $("#StItemId").val(item.id);
                    
                }
            })
        }
    })

    $("#btnSubmit").on('click', function () {

        if ($("#FK_StItemId").val() > 0)
            $("#FK_StItemIdValid").text("")
        else
            $("#FK_StItemIdValid").text(Resources.Required)

        if ($("#create").valid()) {
            $("#create").submit();
        }
    });

});