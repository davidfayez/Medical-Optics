$(document).ready(function () {
    $('#DefBranches').change(function () {



        ClearForm();

        ReloadClientsDataSource();

    });

    $("#FK_RceClientGroupId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientGroupForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    $("#FK_RceClientType").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientTypeForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    $("#FK_RceClientClassId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientClassForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    $("#FK_RceClientCategoryId").kendoDropDownList({
        filter: "contains",
        height: 300,
        dataTextField: "codeAndName",
        dataValueField: "id",
        dataSource: {
            type: "json",
            //serverFiltering: true,
            transport: {
                read: {
                    url: "/RceLookups/GetAllClientCategoryForDDList",
                },
                parameterMap: function (data, action) {

                    if (action === "read") {
                        return {
                            defBranchId: parseInt($("#FK_DefBranchId").val()),
                        };


                    } else {
                        return data;
                    }
                }
            }
        },

    });

    dataSourceClients = new kendo.data.DataSource({
        serverFiltering: true,
        /*   type: "json",*/
        transport: {
            read: {
                url: "/RceLookups/GetAllRceClient",
                dataType: "json"
            },
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

    dataSourceClients.fetch(function () {
        var data = this.data();
        var discontinued = $("#discontinued").data("kendoListBox");
        var available = $("#available").data("kendoListBox");

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
        dataTextField: "clientNameAr",
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
        dataTextField: "clientNameAr",
        dataValueField: "id"
    });

    function setDiscontinued(e, flag) {
        var removedItems = e.dataItems;
        for (var i = 0; i < removedItems.length; i++) {
            debugger
            var item = dataSourceClients.get(removedItems[i].id);
            item.Discontinued = flag;
            item.dirty = !item.dirty;
        }
    }

    function ReloadClientsDataSource() {
        debugger

        $.ajax({
            type: "POST",
            url: "/RceLookups/GetAllRceClient?fK_DefBranchId=" + parseInt($("#FK_DefBranchId").val()),
            data: "name=John&location=Boston",
            dataType: "json",
            success: function (result) {

                if (result != null) {

                    $("#discontinued").data("kendoListBox").dataSource.read();
                    dataSourceClients = new kendo.data.DataSource({
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

                    dataSourceClients.fetch(function () {
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

        if ($("#FK_RceClientGroupId").val() == "0")
            $("#FK_RceClientGroupIdValid").show();
        else
            $("#FK_RceClientGroupIdValid").hide();

        if ($("#FK_RceClientCategoryId").val() == "0")
            $("#FK_RceClientCategoryIdValid").show();
        else
            $("#FK_RceClientCategoryIdValid").hide();

        var selectedClients = $("#available").val();
        if (selectedClients.length == 0) {
            swal({
                title: Resources.ChooseClientResource,
                confirmButtonText: Resources.DoneResource,
                type: "error"
            });
        }


        if (selectedClients.length > 0 && $("#FK_RceClientGroupId").val() > 0 && $("#FK_RceClientCategoryId").val() > 0) {

            var categories = {
                FK_RceClientCategoryId: $("#FK_RceClientCategoryId").val(),
                FK_RceClientGroupId: $("#FK_RceClientGroupId").val(),
                FK_RceClientClassId: $("#FK_RceClientClassId").val(),
                FK_RceClientType: $("#FK_RceClientType").val(),
                ClientsIds: selectedClients,
            }
            debugger
            $.ajax({
                url: '/RceLookups/SaveRceClientCategories',
                type: 'POST',
                data: { clientsCategoriesVM: categories },
                success: function (result) {
                    debugger
                    if (result) {
                        swal({
                            title: Resources.SavedSuccessfullyResource,
                            confirmButtonText: Resources.DoneResource,
                            type: "success"
                        }, function () {
                            ClearForm();
                            ReloadClientsDataSource();
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

        $("#FK_RceClientType").data("kendoDropDownList").value("0");
        $("#FK_RceClientType").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientClassId").data("kendoDropDownList").value("0");
        $("#FK_RceClientClassId").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientCategoryId").data("kendoDropDownList").value("0");
        $("#FK_RceClientCategoryId").data("kendoDropDownList").dataSource.read();

        $("#FK_RceClientGroupId").data("kendoDropDownList").value("0");
        $("#FK_RceClientGroupId").data("kendoDropDownList").dataSource.read();

        $("#available").data("kendoListBox").dataSource.read();
    }
});
