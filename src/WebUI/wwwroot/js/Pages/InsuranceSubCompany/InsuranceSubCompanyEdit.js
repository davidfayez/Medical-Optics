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
    tempSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/InsuranceSubCompany/GetInSubCompClassBySubCompId?id=" + $("#Id").val(),
                Type: "GET"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return { models: kendo.stringify(options.models) };
                }
            }

        },
        //autoSync: true,
        batch: true,
        //pageSize: 20,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: true },
                    fK_InsurancePriceListId: { editable: false },
                    withoutDiscount: { editable: false },
                    withoutDiscountTXT: { type: "text", editable: false },
                    className: { type: "text", editable: false },
                    priceListName: { type: "text", editable: false },
                    discountValue: { type: "number", editable: false },
                    discountPercent: { type: "number", editable: false },
                    maxAllowedDiscount: { type: "number", editable: false },
                }
            }
        }
    });

    var classesGrid = $("#ClassesGrid").kendoGrid({
        dataSource: tempSource,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "fK_InsurancePriceListId", hidden: true },
            { field: "withoutDiscount", hidden: true },
            { field: "withoutDiscountTXT", title: Resources.DiscountResource, width: Resources.CodeWidth },
            { field: "className", title: Resources.ClassName, width: Resources.NameWidth },
            { field: "priceListName", title: Resources.PriceList, width: Resources.NameWidth },
            { field: "discountValue", title: Resources.Value, width: Resources.InputNumberWidth },
            { field: "discountPercent", title: Resources.Percent, width: Resources.InputNumberWidth },
            { field: "maxAllowedDiscount", title: Resources.MaxAllowed, width: Resources.InputNumberWidth },
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
                id: 0,
                fK_InsurancePriceListId: icPriceListId,
                withoutDiscount: false,
                withoutDiscountTXT: Resources.WithoutDiscount,
                className: className,
                priceListName: icPriceListName,

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
                    id: 0,
                    fK_InsurancePriceListId: icPriceListId,
                    withoutDiscount: true,
                    withoutDiscountTXT: Resources.WithDiscount,
                    className: className,
                    priceListName: icPriceListName,
                    discountValue: amountVal,
                    maxAllowedDiscount: maxAllowedDiscount,
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
                    id: 0,
                    fK_InsurancePriceListId: icPriceListId,
                    withoutDiscount: true,
                    withoutDiscountTXT: Resources.WithDiscount,
                    className: className,
                    priceListName: icPriceListName,
                    discountPercent: percentVal,
                    maxAllowedDiscount: maxAllowedDiscount,
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
    var multiSelectMainCategory = $("#multiSelectMainCategories").kendoMultiSelect({
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
    multiSelectMainCategory.data("kendoMultiSelect").value(selectedMainCatIds);

    //MultiSelect Sub Categories
    var multiSelectSubCategory = $("#multiSelectSubCategories").kendoMultiSelect({
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
    multiSelectSubCategory.data("kendoMultiSelect").value(selectedSubCatIds);

    //MultiSelect Brands
    var multiSelectBrand = $("#multiSelectBrands").kendoMultiSelect({
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
    multiSelectBrand.data("kendoMultiSelect").value(selectedBrandsIds);

    //MultiSelect Items
    var multiSelectItem = $("#multiSelectItems").kendoMultiSelect({
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
    multiSelectItem.data("kendoMultiSelect").value(selectedItemsIds);

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
        transport: {
            read: {
                url: "/InsuranceSubCompany/GetStMainCatsBySubCompId?id=" + $("#Id").val(),
                Type: "GET"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return { models: kendo.stringify(options.models) };
                }
            }

        },
        //autoSync: true,
        batch: true,
        //pageSize: 20,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: true },
                    fK_StMainCategoryId: { editable: false },
                    mainCategoryName: { type: "text", editable: false },
                    discountPercent: { type: "number", editable: false },

                }
            }
        }
    });

    var mainCatGrid = $("#MainCatGrid").kendoGrid({
        dataSource: tempSourceMainCat,
        navigatable: true,
        pageable: false,
        scrollable: false,
        columns: [
            { field: "fK_StMainCategoryId", hidden: true },
            { field: "mainCategoryName", title: Resources.MainCategory, width: Resources.NameWidth },
            { field: "discountPercent", title: Resources.DiscountPercentageResource, width: Resources.InputNumberWidth },
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
                if (gridStMainCats[i].fK_StMainCategoryId == mainCatId) {
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
                id: 0,
                fK_StMainCategoryId: mainCatId,
                mainCategoryName: mainCatName,
                discountPercent: discountPercent,

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
        if ($("#editInsSubCompany").valid()) {

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
                        Id: tableClasses[i].id,
                        ClassName: tableClasses[i].className,
                        DiscountValue: tableClasses[i].discountValue,
                        WithoutDiscount: tableClasses[i].withoutDiscount,
                        DiscountPercent: tableClasses[i].discountPercent,
                        MaxAllowedDiscount: tableClasses[i].maxAllowedDiscount,
                        FK_InsurancePriceListId: tableClasses[i].fK_InsurancePriceListId,
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
                        Id: tableMainCats[i].id,
                        FK_StMainCategoryId: tableMainCats[i].fK_StMainCategoryId,
                        DiscountPercent: tableMainCats[i].discountPercent,
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
                Id: $("#Id").val(),
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
                url: '/InsuranceSubCompany/Edit',
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