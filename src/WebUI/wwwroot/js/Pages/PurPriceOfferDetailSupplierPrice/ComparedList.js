var url = window.location.pathname;
var id = url.substring(url.lastIndexOf('/') + 1);
createGrid("CompareDetailGrid", "/PurPriceOfferDetailSupplierPrice/GetCompareBetweenPricesById?id=" + id);

function createGrid(gridName, baseUrl) {
    $.ajax({
        url: baseUrl,
        success: function (response) {
            debugger;
            var sampleDataItem = response[0];
            var keysValues = sampleDataItem.keyValuePairs;
            for (var i = 0; i < keysValues.length; i++) {
                var key = keysValues[i].Key.charAt(0).toLowerCase() + keysValues[i].Key.slice(1);
                sampleDataItem["" + key + ""] = keysValues[i].Value;
            }
            for (var j = 0; j < response.length; j++) {
                var keysValues = response[j].keyValuePairs;
                for (var i = 0; i < keysValues.length; i++) {
                    var key = keysValues[i].Key.charAt(0).toLowerCase() + keysValues[i].Key.slice(1);
                    response[j]["" + key + ""] = keysValues[i].Value;
                }
            }
            var model = generateModel(sampleDataItem);
            debugger;
            var dataSource = generateDataSource(baseUrl, model, response/*, editable*/);
            var columns = generateColumns(sampleDataItem);
            var gridOptions = {
                //toolbar: ["create", "save", "cancel"],
                dataSource: dataSource,
                columns: columns,
                pageable: true,
                //editable: editable,
                height: Resources.GridHeight
            };

            //columns.push({ command: "destroy", title: " ", width: 170 });

            $("#" + gridName).kendoGrid(gridOptions);
        }
    });
}

function generateColumns(sampleDataItem) {
    var columnNames = Object.keys(sampleDataItem);
    return columnNames.map(function (name) {
        debugger;
        var isIdField = name.indexOf("ID") !== -1;
        var title = "";
        var hide = false;
        var Price = name.indexOf("Price");
        var LeastPrice = name.indexOf("Least");
        if (name == 'itemName')
            title = Resources.ItemName;
        else if (name == 'itemBarcode')
            title = Resources.Barcode;
        else if (name == "quantity")
            title = Resources.Quantity;
        else if (name == 'categoryName')
            title = Resources.MainCategories;
        else if (Price > -1)
            title = Resources.Price;
        else if (LeastPrice > -1)
            title = Resources.LeastPrice;
        else if (name == "keyValuePairs")
            hide = true;
        else
            title = name;
        //if (title != "")
        //    name = title;
        return {
            field: name,
            width: (isIdField ? 40 : 200),
            title: (isIdField ? "Id" : title),
            hidden: hide
        };
    });
}

function generateDataSource(baseURL, model, response) {
    var dataSource = {
        data: response,
        batch: true,
        schema: {
            model: model
        },
        pageSize: 10
    };

    return dataSource;
}

var dateFields = [];

function generateModel(sampleDataItem) {
    var model = {};
    var fields = {};
    for (var property in sampleDataItem) {
        if (property.indexOf("ID") !== -1) {
            model["id"] = property;
        }

        var propType = typeof sampleDataItem[property];
        if (propType === "number") {
            fields[property] = {
                type: "number"
            };
            if (model.id === property) {
                fields[property].editable = false;
            }
        } else if (propType === "boolean") {
            fields[property] = {
                type: "boolean"
            };
        } else if (propType === "string") {
            var parsedDate = kendo.parseDate(sampleDataItem[property]);
            if (parsedDate) {
                fields[property] = {
                    type: "date"
                };
                dateFields[property] = true;
            }
            else {
                fields[property] = {
                    type: "string"
                };
            }
        }
    }

    model.fields = fields;

    return model;
}