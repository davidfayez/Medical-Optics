$(document).ready(function () {

    var fK_StCategoryId = $("#FK_StCategoryId").val(),
        fK_StMainCategoryId = $("#FK_StMainCategoryId").val(),
        fK_HrDepartmentId = $("#FK_HrDepartmentId").val(),
        itemCode = $("#ItemCode").val(),
        itemName = $("#ItemName").val(),
        fK_InsuranceMainCompanyId = $("#FK_InsuranceMainCompanyId").val(),
        fK_InsuranceSubCompanyId = $("#FK_InsuranceSubCompanyId").val();

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
    url = "/InsuranceService/GetAll?fK_StCategoryId=" + fK_StCategoryId + "&fK_StMainCategoryId=" + fK_StMainCategoryId + "&fK_HrDepartmentId=" + fK_HrDepartmentId + "&fK_InsuranceMainCompanyId=" + fK_InsuranceMainCompanyId + "&fK_InsuranceSubCompanyId=" + fK_InsuranceSubCompanyId+ "&itemCode=" + itemCode + "&itemName=" + itemName 


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
                        url: url,
                        Type: "GET"
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            itemCode: { type: "string" },
                            itemName: { type: "string" },
                            contractCode: { type: "string" },
                            serviceType: { type: "string" },
                            serviceCategory: { type: "string" },
                            departmentName: { type: "string" },
                            cashPrice: { type: "number" },
                            contractPrice: { type: "number" },
                            insurancePrice: { type: "number" },
                            //isActive: { editable: false },
                            //creationDate: { type: "date", editable: false },
                        }
                    }
                },
                pageSize: Resources.GridPageSize
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
                pageSizes: [20, 40, 60, Resources.All],
                numeric: Resources.GridNumeric,
                refresh: Resources.GridRefresh,

            },
            columns: [{
                field: "itemCode",
                title: Resources.Code,
                width: Resources.CodeWidth
            },
            {
                field: "contractCode",
                title: Resources.ContractCode,
                width: Resources.NameWidth
            },
            {
                field: "itemName",
                title: Resources.ItemName,
                width: Resources.NameWidth
                },
                {
                    field: "serviceType",
                    title: Resources.ServiceType,
                    width: Resources.NameWidth
                },
            {
                field: "serviceCategory",
                title: Resources.ServiceCategory,
                width: Resources.NameWidth
            },
            {
                field: "departmentName",
                title: Resources.DepartmentName,
                width: Resources.NameWidth
            }, {
                field: "cashPrice",
                title: Resources.CashPrice,
                width: Resources.AmountWidth,
                hidden: true
            }, {
                field: "contractPrice",
                title: Resources.ContractPrice,
                width: Resources.AmountWidth,
                hidden: true
            }, {
                field: "insurancePrice",
                title: Resources.InsurancePrice,
                width: Resources.AmountWidth,
                hidden: true
            },
            //{ width: Resources.CheckboxWidth, template: "<input type='checkbox' data-bind='checked:isActive' class= 'control-label i-check' disabled = 'disabled' />", headerTemplate: Resources.Status },
            //{
            //    field: "creationDate", title: Resources.CreationDateResource, format: "{0:yyyy/MM/dd}", width: Resources.DateWidth,
            //    filterable: {
            //        operators: {
            //            date: {
            //                gte: Resources.IsAfterOrEqualTo,
            //                lte: Resources.IsBeforeOrEqualTo
            //            }
            //        },
            //        extra: false,
            //        ui: function (element) {
            //            element.kendoDatePicker({
            //                format: '{0: dd/MM/yyyy}'
            //            })
            //        }
            //    }
            //},
            

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
    }
    debugger;
    
    //grid.hideColumn("cashPrice");
    //grid.hideColumn("contractPrice");
    //grid.hideColumn("insurancePrice");

    $("#btnSearch").on('click', function () {
        var fK_StCategoryId = $("#FK_StCategoryId").val(),
            fK_StMainCategoryId = $("#FK_StMainCategoryId").val(),
            fK_HrDepartmentId = $("#FK_HrDepartmentId").val(),
            itemCode = $("#ItemCode").val(),
            itemName = $("#ItemName").val(),
            fK_InsuranceMainCompanyId = $("#FK_InsuranceMainCompanyId").val(),
            fK_InsuranceSubCompanyId = $("#FK_InsuranceSubCompanyId").val();

        url = "/InsuranceService/GetAll?fK_StCategoryId=" + fK_StCategoryId + "&fK_StMainCategoryId=" + fK_StMainCategoryId + "&fK_HrDepartmentId=" + fK_HrDepartmentId + "&fK_InsuranceMainCompanyId=" + fK_InsuranceMainCompanyId + "&fK_InsuranceSubCompanyId=" + fK_InsuranceSubCompanyId + "&itemCode=" + itemCode + "&itemName=" + itemName 
        LoadInsuranceServiceGrid();


        debugger;
        //$("#InsuranceServiceGrid").data("kendoGrid").dataSource.read(); 
        var grid = $("#InsuranceServiceGrid").data("kendoGrid");
        
        //grid.hideColumn("cashPrice");
        //grid.hideColumn("contractPrice");
        //grid.hideColumn("insurancePrice");
        var CashPrice = $('#CashPrice').is(":checked");

        if (CashPrice == true) {
            grid.showColumn("cashPrice");
        }
        else {
        grid.hideColumn("cashPrice");
        }

        var ContractPrice = $('#ContractPrice').is(":checked");
        if (ContractPrice == true) {
            grid.showColumn("contractPrice");
        }
        else
            grid.hideColumn("contractPrice");

        var InsurancePrice = $('#InsurancePrice').is(":checked");
        if (InsurancePrice == true) {
            grid.showColumn("insurancePrice");
        }
        else
            grid.hideColumn("insurancePrice");

        $("#InsuranceServiceGrid").data("kendoGrid").dataSource.read();
        $("#InsuranceServiceGrid").data("kendoGrid").refresh();
        $("#InsuranceServiceGrid").data("kendoGrid").dataSource.sync();

    });

    $("#CashPrice").on('change', function () {
        var CashPrice = $('#CashPrice').is(":checked");
        debugger;
        var grid = $("#InsuranceServiceGrid").data("kendoGrid");
        if (CashPrice == true) {
            grid.showColumn("cashPrice");
        }
        else
        {
            grid.hideColumn("cashPrice");
        }
    });

    $("#ContractPrice").on('change', function () {
        var ContractPrice = $('#ContractPrice').is(":checked");
        debugger;
        var grid = $("#InsuranceServiceGrid").data("kendoGrid");
        if (ContractPrice == true) {
            grid.showColumn("contractPrice");
        }
        else {
            grid.hideColumn("contractPrice");
        }
    });

    $("#InsurancePrice").on('change', function () {
        var InsurancePrice = $('#InsurancePrice').is(":checked");
        debugger;
        var grid = $("#InsuranceServiceGrid").data("kendoGrid");
        if (InsurancePrice == true) {
            grid.showColumn("insurancePrice");
        }
        else {
            grid.hideColumn("insurancePrice");
        }
    });
});

$(".exportExcel").on('click', function () {
    $("#InsuranceServiceGrid").getKendoGrid().saveAsExcel();
});