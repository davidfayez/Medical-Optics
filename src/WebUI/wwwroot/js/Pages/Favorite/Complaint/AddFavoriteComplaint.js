$(document).ready(function () {

    $("#searchBox").on("input", function (e) {
        var listBox = $("#optional").getKendoListBox();
        var sarchString = $(this).val();

        listBox.dataSource.filter({ field: "complaintNameEn", operator: "contains", value: sarchString });
    });

    var id = $("#Id").val();
    var selectedIds = $("#SelectedIds").val();


    $("#selected").kendoListBox({
        dataTextField: "complaintNameEn",
        dataValueField: "id",
        toolbar: {
            position: "right",
            tools: ["moveUp", "moveDown"/*, "remove"*/]
        },
        draggable: {
            placeholder: function (element) {
                return element.clone().css({
                    "opacity": 0.3,
                    "border": "1px dashed #000000"
                });
            }
        },
        dropSources: ["optional"],
        connectWith: "optional"
    });

    if (id > 0) {
        optionalUrl = "/Complaint/GetAllOptional?selectedIds=" + selectedIds;
        selectedUrl = "/Complaint/GetAllSelected?selectedIds=" + selectedIds;

        var selectedDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: selectedUrl,
                    Type: "GET"
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            }
        });

        var listbox = $("#selected").data("kendoListBox");
        listbox.setDataSource(selectedDataSource);
    }
    else {
        optionalUrl = "/Complaint/GetAll"
        
    }

    var complaintsDataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: optionalUrl,
                Type: "GET"
            }
        },
        error: function (e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        pageSize: Resources.GridPageSize,
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false },
                    complaintCode: { editable: false },
                    complaintNameAr: { editable: false },
                    complaintNameEn: { editable: false },
                    description: { editable: false },
                    creationDate: { type: "date", editable: false },
                    lastModifiedDate: { type: "date", editable: false },
                    isActive: { editable: false },
                    isDeleted: { editable: false },

                }
            }
        }
    });

    $("#optional").kendoListBox({
        dataSource: complaintsDataSource,
        dataTextField: "complaintNameEn",
        dataValueField: "id",
        connectWith: "selected",
        draggable: true,
        dropSources: ["selected"],
        selectable: "multiple",
        toolbar: {
            tools: ["moveUp", "moveDown", "transferTo", "transferFrom", "transferAllTo", "transferAllFrom"]
        }
    });

});