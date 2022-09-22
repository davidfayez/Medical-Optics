$(document).ready(function () {
    //start >> Classes

    $("#radioNoDeduction").click(function () {
        var ched = $(this).prop("checked");
        if ($(this).prop("checked") == true) {
            $("#sectionAmount").hide();
            $("#sectionPrecentage").hide();
            $("#sectionMaxAllowedDiscount").hide();

            $("#radioMaximumClass").prop("checked", false);

        }
    });

    $("#radioAmount").click(function () {
        if ($(this).prop("checked") == true) {
            $("#sectionAmount").show();
            $("#sectionPrecentage").hide();
            $("#sectionMaxAllowedDiscount").hide();

            $("#radioMaximumClass").prop("checked", false);
        }
    });

    $("#radioPrecentage").click(function () {
        if ($(this).prop("checked") == true) {
            $("#sectionAmount").hide();
            $("#sectionPrecentage").show();
            $("#sectionMaxAllowedDiscount").hide();

            $("#radioMaximumClass").prop("checked", false);
        }
    });

    $("#radioMaximumClass").change(function () {
        if ($(this).prop("checked") == true) {
            $("#sectionAmount").hide();
            $("#sectionPrecentage").hide();
            $("#sectionMaxAllowedDiscount").show();

        } else {
            $("#sectionMaxAllowedDiscount").hide();
        }
    });

    $("#amounts").change(function () {
        var amountVal = parseInt($("#amounts option:selected").val());
        if (amountVal > 0)
            $("#greaterThanOneThousand").val(amountVal);

    });
    //Grid Classes
    var tempSource = new kendo.data.DataSource({

    });

    var classesGrid = $("#ClassesGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "FK_InsurancePriceListId", hidden: true },
            { field: "WithoutDiscount", hidden: true },
            { field: "WithoutDiscountTXT", title: Resources.DiscountResource, width: Resources.CodeWidth },
            { field: "ClassName", title: Resources.ClassName, width: Resources.NameWidth },
            { field: "PriceListName", title: Resources.PriceList, width: Resources.NameWidth },
            { field: "DiscountValue", title: Resources.Value, width: Resources.InputNumberWidth },
            { field: "DiscountPercent", title: Resources.Percent, width: Resources.InputNumberWidth },
            { field: "MaxAllowedDiscount", title: Resources.MaxAllowed, width: Resources.InputNumberWidth },
            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDelete' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });

    classesGrid.data("kendoGrid").table.on("click", ".btnDelete", removeRow);
    function removeRow() {

        var row = $(this).closest("tr"),
            grid = $("#ClassesGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
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
                var dataSource = $("#ClassesGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
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

            }, 1000);
        });
    }

    //Btn Add Class
    $("#btnAddClass").on('click', function () {

        var className = $("#className").val().trim(),
            icPriceListId = $("#priceListClass option:selected").val(),
            icPriceListName = $("#priceListClass option:selected").text(),
            radioType = $("input[name='radioType']:checked").val(),
            amountVal = $("#greaterThanOneThousand").val(),
            percentVal = $("#percents option:selected").val(),
            maxAllowedDiscount = $("#maxAllowedDiscount").val();

        debugger
        if (amountVal == "")
            amountVal = $("#amounts option:selected").val();

        if (icPriceListId == "")
            icPriceListName = "";


        if (className == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.ClassName,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (radioType == "NoDeduction") {
            debugger

            var totalRecords = $("#ClassesGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSource.insert(totalRecords, {
                FK_InsurancePriceListId: icPriceListId,
                WithoutDiscount: false,
                WithoutDiscountTXT: Resources.WithoutDiscount,
                ClassName: className,
                PriceListName: icPriceListName,

            });
            ClearClasses();
        }
        else if (radioType == "Amount") {
            debugger
            if (amountVal == "") {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Value,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });

            }
            else if (maxAllowedDiscount == "") {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.MaxAllowed,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else {
                var totalRecords = $("#ClassesGrid").data("kendoGrid").dataSource.data().length;
                var Index = parseInt($("#Index").val());
                if (!isNaN(Index))
                    totalRecords = Index - 1;
                tempSource.insert(totalRecords, {
                    FK_InsurancePriceListId: icPriceListId,
                    WithoutDiscount: true,
                    WithoutDiscountTXT: Resources.WithDiscount,
                    ClassName: className,
                    PriceListName: icPriceListName,
                    DiscountValue: amountVal,
                    MaxAllowedDiscount: maxAllowedDiscount,
                });
                ClearClasses();
            }

        }
        else if (radioType == "Precentage") {
            debugger
            if (percentVal == "") {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.Percent,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });

            }
            else if (maxAllowedDiscount == "") {
                swal({
                    title: Resources.EnterRequiredResource + " " + Resources.MaxAllowed,
                    confirmButtonText: Resources.DoneResource,
                    type: "error"
                });
            }
            else {
                var totalRecords = $("#ClassesGrid").data("kendoGrid").dataSource.data().length;
                var Index = parseInt($("#Index").val());
                if (!isNaN(Index))
                    totalRecords = Index - 1;
                tempSource.insert(totalRecords, {
                    FK_InsurancePriceListId: icPriceListId,
                    WithoutDiscount: true,
                    WithoutDiscountTXT: Resources.WithDiscount,
                    ClassName: className,
                    PriceListName: icPriceListName,
                    DiscountPercent: percentVal,
                    MaxAllowedDiscount: maxAllowedDiscount,
                });
                ClearClasses();
            }
        }

    });
    function ClearClasses() {
        $("#className").val("");
        $("#priceListClass").val("");
        $("#greaterThanOneThousand").val("");
        $("#percents").val("");
        $("#maxAllowedDiscount").val("");
        $("#amounts").val("");
    }

    //end >> Classes

    //start >>  Services & Categories Excluded
    $("#checkBoxMainCategories").change(function () {
        if ($(this).prop("checked") == true) {
            $("#secMainCategories").show();
            $("#secSubCategories").hide();
            $("#secBrands").hide();
            $("#secProducts").hide();

            $("#checkBoxSubCategories").prop("checked", false);
            $("#checkBoxBrands").prop("checked", false);
            $("#checkBoxProducts").prop("checked", false);
        }
    });

    $("#checkBoxSubCategories").change(function () {
        if ($(this).prop("checked") == true) {
            $("#secSubCategories").show();
            $("#secMainCategories").hide();
            $("#secBrands").hide();
            $("#secProducts").hide();

            $("#checkBoxMainCategories").prop("checked", false);
            $("#checkBoxBrands").prop("checked", false);
            $("#checkBoxProducts").prop("checked", false);
        }
    });

    $("#checkBoxBrands").change(function () {
        if ($(this).prop("checked") == true) {
            $("#secBrands").show();
            $("#secMainCategories").hide();
            $("#secSubCategories").hide();
            $("#secProducts").hide();

            $("#checkBoxMainCategories").prop("checked", false);
            $("#checkBoxSubCategories").prop("checked", false);
            $("#checkBoxProducts").prop("checked", false);
        }
    });

    $("#checkBoxProducts").change(function () {
        if ($(this).prop("checked") == true) {
            $("#secProducts").show();
            $("#secMainCategories").hide();
            $("#secSubCategories").hide();
            $("#secBrands").hide();

            $("#checkBoxMainCategories").prop("checked", false);
            $("#checkBoxSubCategories").prop("checked", false);
            $("#checkBoxBrands").prop("checked", false);
        }
    });

    //MultiSelect Main Categories
    $("#multiSelectMainCategories").kendoMultiSelect({
        placeholder: Resources.Choose + " " + Resources.MainCategories,
        dataTextField: "categoryNameAr",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/StLookups/GetAllStMainCategory"
                },
            },
            schema: {
                model: {
                    id: "id",
                    fields: {

                        colorNameAr: {
                            type: "string"
                        }
                    }
                }
            }
        },

    });

    //MultiSelect Sub Categories
    $("#multiSelectSubCategories").kendoMultiSelect({
        placeholder: Resources.Choose + " " + Resources.SubCategories,
        dataTextField: "categoryNameAr",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/StLookups/GetAllStCategory"
                },
            },
            schema: {
                model: {
                    id: "id",
                    fields: {

                        colorNameAr: {
                            type: "string"
                        }
                    }
                }
            }
        },

    });

    //MultiSelect Brands
    $("#multiSelectBrands").kendoMultiSelect({
        placeholder: Resources.Choose + " " + Resources.Brand,
        dataTextField: "brandNameAr",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/StLookups/GetAllStBrand"
                },
            },
            schema: {
                model: {
                    id: "id",
                    fields: {

                        colorNameAr: {
                            type: "string"
                        }
                    }
                }
            }
        },

    });

    //MultiSelect Items
    $("#multiSelectItems").kendoMultiSelect({
        placeholder: Resources.Choose + " " + Resources.Items,
        dataTextField: "itemName",
        dataValueField: "id",
        autoBind: false,
        open: onOpenItems,
        filtering: onFilteringItems,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/StLookups/GetAllStItemMultiSelect"
                },
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        itemName: {
                            type: "string"
                        }
                    }
                }
            }
        },

    });


    function onFilteringItems(e) {
        var multiselectItem = $("#multiSelectItems").data("kendoMultiSelect");
        multiselectItem.dataSource.read({ mainCatId: $("#mainCategory").val(), subCatId: $("#subCategory").val() });
    }
    function onOpenItems(e) {
        var multiselectItem = $("#multiSelectItems").data("kendoMultiSelect");
        multiselectItem.dataSource.read({ mainCatId: $("#mainCategory").val(), subCatId: $("#subCategory").val() });
    }

    //end >>  Services & Categories Excluded


    //Grid St Main Cat
    var tempSourceMainCat = new kendo.data.DataSource({

    });

    var mainCatGrid = $("#MainCatGrid").kendoGrid({
        dataSource: tempSourceMainCat,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "FK_StMainCategoryId", hidden: true },
            { field: "MainCategoryName", title: Resources.MainCategory, width: Resources.NameWidth },
            { field: "DiscountPercent", title: Resources.DiscountPercentageResource, width: Resources.InputNumberWidth },
            { width: Resources.ActionWidth, template: "<a  class='btn btn-danger btn-sm btnDeleteMainCat' ><i class='fas fa-trash-alt'></i></a>" }
        ],
        editable: false,
        selectable: "multiple, cell",


    });

    mainCatGrid.data("kendoGrid").table.on("click", ".btnDeleteMainCat", removeRowMainCat);
    function removeRowMainCat() {

        var row = $(this).closest("tr"),
            grid = $("#MainCatGrid").data("kendoGrid"),
            dataItem = grid.dataItem(row);
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
                var dataSource = $("#MainCatGrid").data("kendoGrid").dataSource;

                if (dataSource.remove(dataItem)) {
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

            }, 1000);
        });
    }

    //Btn Add St Main Cat
    $("#btnAddMainCat").on('click', function () {

        var discountPercent = $("#DiscountPercent").val(),
            mainCatId = $("#MainCategoriesForDiscountRatios option:selected").val(),
            mainCatName = $("#MainCategoriesForDiscountRatios option:selected").text(),
            isAdded = false;
        var gridStMainCats = $("#MainCatGrid").data("kendoGrid").dataSource.data();
        if (gridStMainCats.length > 0) {
            for (var i = 0; i < gridStMainCats.length; i++) {
                if (gridStMainCats[i].FK_StMainCategoryId == mainCatId) {
                    isAdded = true;
                    break;
                }
            }
        }

        if (mainCatId == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.MainCategory,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (discountPercent == "") {
            swal({
                title: Resources.EnterRequiredResource + " " + Resources.DiscountPercentageResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }
        else if (isAdded) {
            swal({
                title: Resources.MainCatAlreadyAdded,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }

        else {

            var totalRecords = $("#MainCatGrid").data("kendoGrid").dataSource.data().length;
            var Index = parseInt($("#Index").val());
            if (!isNaN(Index))
                totalRecords = Index - 1;
            tempSourceMainCat.insert(totalRecords, {
                FK_StMainCategoryId: mainCatId,
                MainCategoryName: mainCatName,
                DiscountPercent: discountPercent,

            });
            ClearMainCat();
        }


    });
    function ClearMainCat() {
        $("#MainCategoriesForDiscountRatios").val("");
        $("#DiscountPercent").val(null);
    }

    //end >> St Main Cat
    // Save
    $("#btnCreate").on('click', function () {
        debugger
        if ($("#createInsSubCompany").valid()) {

            var isActive = $("input[name='IsActive']:checked").val();
            if (isActive == "true")
                isActive = true;
            else
                isActive = false;

            //Get Classes
            var listClasses = [];
            var tableClasses = $("#ClassesGrid").data("kendoGrid").dataSource.data();
            if (tableClasses.length > 0) {
                for (var i = 0; i < tableClasses.length; i++) {
                    var data = {
                        ClassName: tableClasses[i].ClassName,
                        DiscountValue: tableClasses[i].DiscountValue,
                        WithoutDiscount: tableClasses[i].WithoutDiscount,
                        DiscountPercent: tableClasses[i].DiscountPercent,
                        MaxAllowedDiscount: tableClasses[i].MaxAllowedDiscount,
                        FK_InsurancePriceListId: tableClasses[i].FK_InsurancePriceListId,
                    }

                    listClasses.push(data);
                }
            }
            //Get MainCategories For Discount Ratios
            var listMainCats = [];
            var tableMainCats = $("#MainCatGrid").data("kendoGrid").dataSource.data();
            if (tableMainCats.length > 0) {
                for (var i = 0; i < tableMainCats.length; i++) {
                    var dataMainCat = {
                        FK_StMainCategoryId: tableMainCats[i].FK_StMainCategoryId,
                        DiscountPercent: tableMainCats[i].DiscountPercent,
                    }

                    listMainCats.push(dataMainCat);
                }
            }
            //Get Selected MainCategories
            var multiSelectMainCategories = $("#multiSelectMainCategories").data("kendoMultiSelect");
            var multiSelectMainCategoriesData = multiSelectMainCategories.dataItems();
            var mainCatIds = [];
            for (var i = 0; i < multiSelectMainCategoriesData.length; i++) {
                mainCatIds.push(multiSelectMainCategoriesData[i].id);
            }

            //Get Selected SubCategories
            var multiSelectSubCategories = $("#multiSelectSubCategories").data("kendoMultiSelect");
            var multiSelectSubCategoriesData = multiSelectSubCategories.dataItems();
            var subCatIds = [];
            for (var i = 0; i < multiSelectSubCategoriesData.length; i++) {
                subCatIds.push(multiSelectSubCategoriesData[i].id);
            }

            //Get Selected Brands
            var multiSelectBrands = $("#multiSelectBrands").data("kendoMultiSelect");
            var multiSelectBrandsData = multiSelectBrands.dataItems();
            var brandsIds = [];
            for (var i = 0; i < multiSelectBrandsData.length; i++) {
                brandsIds.push(multiSelectBrandsData[i].id);
            }

            //Get Selected Items
            var multiSelectItems = $("#multiSelectItems").data("kendoMultiSelect");
            var multiSelectItemsData = multiSelectItems.dataItems();
            var itemsIds = [];
            for (var i = 0; i < multiSelectItemsData.length; i++) {
                itemsIds.push(multiSelectItemsData[i].id);
            }

            var subCompany = {
                CompanyCode: $("#CompanyCode").val(),
                CompanyNameAr: $("#CompanyNameAr").val(),
                CompanyNameEn: $("#CompanyNameEn").val(),
                FK_InsurancePolicyId: $("#FK_InsurancePolicyId option:selected").val(),
                InsurancePolicyDate: $("#InsurancePolicyDate").val(),
                IsInsurancePolicyRequire: $('input[type="checkbox"][name=IsInsurancePolicyRequire]').prop("checked"),
                FK_InsuranceMainCompanyId: $("#FK_InsuranceMainCompanyId option:selected").val(),
                PrintNotes: $("#PrintNotes").val(),
                SalesmanMessage: $("#SalesmanMessage").val(),
                FK_InsurancePriceListId: $("#FK_InsurancePriceListId option:selected").val(),
                PriceListDateStart: $("#PriceListDateStart").val(),
                FrameDiscountPercent: $("#FrameDiscountPercent").val(),
                LensesDiscountPercent: $("#LensesDiscountPercent").val(),
                ContactLensDiscountPercent: $("#ContactLensDiscountPercent").val(),
                Description: $("#Description").val(),
                IsActive: isActive,
                hdnAttachmentIds: $("#hdnAttachmentIds").val(),
                MainCategoriesIds: mainCatIds,
                SubCategoriesIds: subCatIds,
                BrandsIds: brandsIds,
                ItemsIds: itemsIds,
                Classes: listClasses,
                StMainCats: listMainCats
            }
            debugger
            $.ajax({
                url: '/InsuranceSubCompany/Create',
                type: 'POST',
                data: { subCompanyVM: subCompany },
                success: function (result) {
                    debugger
                    if (result > 0) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            setTimeout(function () {
                                document.location = "../../InsuranceSubCompany/Index"
                            }, 1000);
                        });
                    }
                    else if (result == "NotValid") {
                        swal({
                            title: Resources.EnterAllRequired,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                    else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "error"
                        });
                    }
                }
            })
        }
    });
});