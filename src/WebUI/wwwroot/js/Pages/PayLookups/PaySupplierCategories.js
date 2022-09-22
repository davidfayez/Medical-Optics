$(document).ready(function () {
    $('#DefBranches').change(function () {



        ClearForm();

        ReloadSuppliersDataSource();

    });
    $("#FK_PaySupplierCategoryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllSupplierCategoryForDDList",
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
        select: onSelectCategory
    });
    function onSelectCategory(e) {

        $("#FK_PaySupplierGroupId").data("kendoDropDownList").dataSource.read({ categoryId: e.dataItem.id });
    }
    $("#FK_PaySupplierGroupId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllSupplierGroupByCategoryForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            categoryId: data.categoryId
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectGroup
    });
    function onSelectGroup(e) {
        $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.read({ groupId: e.dataItem.id });
    }
    $("#FK_PaySupplierClassId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllSupplierClassByGroupForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            groupId: data.groupId
                        };


                    } else {
                        return data;
                    }
                }
            }
        },
        select: onSelectClass
    });
    function onSelectClass(e) {
        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read({ classId: e.dataItem.id });
    }
    $("#FK_PaySupplierType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/PayLookups/GetAllSupplierTypeByClassForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                            classId: data.classId
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });


    dataSourceSuppliers = new kendo.data.DataSource({
        serverFiltering: true,
        /*   type: "json",*/
        transport: {
            read: {
                url: "/PayLookups/GetAllPaySupplier",
                dataType: "json"
            },
            //update: {
            //    url: crudServiceBaseUrl + "/Products/Update",
            //    dataType: "jsonp"
            //},
            parameterMap: function (options, operation) {

                if (operation !== "read") {
                    return {
                        fK_DefBranchId: parseInt($("#FK_DefBranchId").val()),
                    };
                }
            }
        },
        requestStart: function () {
            kendo.ui.progress($(".demo-section"), true);
        },
        requestEnd: function () {
            kendo.ui.progress($(".demo-section"), false);
        },
        batch: false,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false, nullable: true },
                    discontinued: { type: "boolean" },
                }
            }
        }
    });

    dataSourceSuppliers.fetch(function () {
        var data = this.data();
        var discontinued = $("#discontinued").data("kendoListBox");
        var available = $("#available").data("kendoListBox");
        debugger
        for (var i = 0; i < data.length; i++) {
            if (data[i].discontinued) {
                discontinued.add(data[i]);
            }
            //else {
            //    available.add(data[i]);
            //}
        }
    });

    $("#discontinued").kendoListBox({
        draggable: true,
        connectWith: "available",
        dropSources: ["available"],
        dataTextField: "supplierNameAr",
        dataValueField: "id",
        remove: function (e) {
            setDiscontinued(e, false);
        },
        add: function (e) {
            setDiscontinued(e, true);
        }
    });

    $("#available").kendoListBox({
        draggable: true,
        connectWith: "discontinued",
        dropSources: ["discontinued"],
        dataTextField: "supplierNameAr",
        dataValueField: "id"
    });



    function setDiscontinued(e, flag) {
        var removedItems = e.dataItems;
        for (var i = 0; i < removedItems.length; i++) {
            debugger
            var item = dataSourceSuppliers.get(removedItems[i].id);
            item.Discontinued = flag;
            item.dirty = !item.dirty;
        }
    }

    function ReloadSuppliersDataSource() {
        debugger

        $.ajax({
            type: "POST",
            url: "/PayLookups/GetAllPaySupplier?fK_DefBranchId=" + parseInt($("#FK_DefBranchId").val()),
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (result) {

                if (result != null) {
                    //var listbox = $("#discontinued").data("kendoListBox");
                    //listbox.remove(listbox.items());
                    debugger
                    //listbox.add(result);
                    //  dataSourceSuppliers = new kendo.data.DataSource({ data: result });
                    // listbox.add(result);
                    $("#discontinued").data("kendoListBox").dataSource.read();
                    dataSourceSuppliers = new kendo.data.DataSource({
                        serverFiltering: true,
                        data: result,

                        requestStart: function () {
                            kendo.ui.progress($(".demo-section"), true);
                        },
                        requestEnd: function () {
                            kendo.ui.progress($(".demo-section"), false);
                        },
                        batch: false,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: { editable: false, nullable: true },
                                    discontinued: { type: "boolean" },
                                }
                            }
                        }
                    });

                    dataSourceSuppliers.fetch(function () {
                        var data = this.data();
                        var discontinued = $("#discontinued").data("kendoListBox");
                        var available = $("#available").data("kendoListBox");
                        debugger
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].discontinued) {
                                discontinued.add(data[i]);
                            }
                            //else {
                            //    available.add(data[i]);
                            //}
                        }
                    });


                } else {

                }

            }
        });
    }


    $("#btnSave").click(function (e) {
        debugger;

        if ($("#FK_PaySupplierGroupId").val() == "0")
            $("#FK_PaySupplierGroupIdValid").show();
        else
            $("#FK_PaySupplierGroupIdValid").hide();

        if ($("#FK_PaySupplierCategoryId").val() == "0")
            $("#FK_PaySupplierCategoryIdValid").show();
        else
            $("#FK_PaySupplierCategoryIdValid").hide();

        var selectedSuppliers = $("#available").val();
        if (selectedSuppliers.length == 0) {
            swal({
                title: Resources.ChooseSupplierResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }


        if (selectedSuppliers.length > 0 && $("#FK_PaySupplierGroupId").val() > 0 && $("#FK_PaySupplierCategoryId").val() > 0) {

            var categories = {
                FK_PaySupplierCategoryId: $("#FK_PaySupplierCategoryId").val(),
                FK_PaySupplierClassId: $("#FK_PaySupplierClassId").val(),
                FK_PaySupplierGroupId: $("#FK_PaySupplierGroupId").val(),
                FK_PaySupplierType: $("#FK_PaySupplierType").val(),
                SuppliersIds: selectedSuppliers,
            }
            debugger
            $.ajax({
                url: '/PayLookups/SavePaySupplierCategories',
                type: 'POST',
                data: { suppliersCategoriesVM: categories },
                success: function (result) {
                    debugger
                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            ClearForm();
                            ReloadSuppliersDataSource();
                        });

                    } else {
                        swal({
                            title: Resources.ErrorMsgResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        });
                    }
                }
            })

        }

        else
            e.preventDefault();


    });

    function ClearForm() {
        $("#FK_PaySupplierGroupId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierGroupId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierClassId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierClassId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierCategoryId").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierCategoryId").data("kendoDropDownList").dataSource.read();

        $("#FK_PaySupplierType").data("kendoDropDownList").value("0");
        $("#FK_PaySupplierType").data("kendoDropDownList").dataSource.read();

        $("#available").data("kendoListBox").dataSource.read();
    }
});
