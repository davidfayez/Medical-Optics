$(document).ready(function () {

    
    $("#SeparatorId").prop("disabled", true);
    $("#PartLength").prop("disabled", true);

    $("#haveSeprator").change(function (ev) {
        var checked = ev.target.checked;
        if (checked) {
            $("#SeparatorId").prop("disabled", false);
            $("#PartLength").prop("disabled", false);
        } else {
            $("#SeparatorId").prop("disabled", true);
            $("#PartLength").prop("disabled", true);
        }
    });

    $("#FK_SecModulePageId").change(function () {
        var id = $("#FK_SecModulePageId").val();
        $.ajax({
            url: '/DefCoding/GetModulPageCoding/' + id,
            success: function (data) {
                if (data) {
                    $("#Length").val(data.length);
                    $("#Example").val(data.example);
                    $("#StartFrom").val(data.startFrom);
                    if ($("#radioNumbers").val() == data.partTypeId) {
                        document.getElementById("radioNumbers").checked = true;
                    } else if ($("#radioCharacter").val() == data.partTypeId) {
                        document.getElementById("radioCharacter").checked = true;
                    } else if ($("#radioCharacterAndNumbers").val() == data.partTypeId) {
                        document.getElementById("radioCharacterAndNumbers").checked = true;
                    }

                    if (data.separatorId) {
                        document.getElementById("haveSeprator").checked = true
                        $("#SeparatorId").prop("disabled", false);
                        $("#PartLength").prop("disabled", false);
                        $("#PartLength").val(data.partLength);
                        $("#SeparatorId").val(data.separatorId);
                    } else {
                        $('#haveSeprator').attr('checked', false);
                        $("#SeparatorId").prop("disabled", true);
                        $("#PartLength").prop("disabled", true);
                    }
                } else {
                    $("#Length").val("");
                    $("#PartLength").val("");
                    $("#Example").val("");
                    $("#StartFrom").val("");
                    $('#haveSeprator').attr('checked', false);
                    $("#SeparatorId").prop("disabled", true);
                    $("#PartLength").prop("disabled", true);
                }


            }
        });
    });

    $("#Length").change(function () {
        generateExample();
    });
    $("#SeparatorId").change(function () {
        generateExample();
    });
    $("#PartLength").change(function () {
        generateExample();
    });
    $("#radioNumbers").click(function () {
        generateExample();
    });
    $("#radioCharacter").click(function () {
        generateExample();
    });
    $("#radioCharacterAndNumbers").click(function () {
        generateExample();
    });
    $("#haveSeprator").click(function () {
        generateExample();
    });

});

function checkValid() {
    var checked = $("#haveSeprator").is(':checked');
    generateExample();
    var partLength = $("#PartLength").val();
    var codeLength = $("#Length").val();
    if (checked && partLength > 0 && partLength < 20 && partLength < codeLength) {
        return true;
    } else if(!checked) {
        return true;
    } else {
        return false;
    }
   
   
    
}

function generateExample() {
    var speratortype = $("#SeparatorId option:selected").html();
    var codeLength = $("#Length").val();
    var sperator = $("#haveSeprator").is(':checked');
    var numbers = $("#radioNumbers").is(':checked');
    var characters = $("#radioCharacter").is(':checked');
    var charAndNum = $("#radioCharacterAndNumbers").is(':checked');
    var partLength = $("#PartLength").val();
    var example = "";
    if (sperator) {
        if (numbers) {
            for (var i = 0; i < codeLength; i++) {
                if (i == partLength) {
                    example += "" + speratortype + "";
                    continue;
                }
                example += "" + i.toString() + "";
            }
        } else if (characters) {
            for (var j = 0; j < codeLength; j++) {
                if (j == partLength) {
                    example += "" + speratortype + "";
                    continue;
                }
                example += "A";
            }
        } else if (charAndNum) {
            var insNum = false;
            
            for (var k = 0; k < codeLength; k++) {
                if (k == partLength) {
                    example += "" + speratortype + "";
                    continue;
                }
                if (insNum) {
                    example += k;
                    insNum = false;
                } else {
                    example += "A";
                    insNum = true;
                }

            }
        }
    } else {
        if (numbers) {
            for (var i = 0; i < codeLength; i++) {
                example += "" + i.toString() + "";
            }
        } else if (characters) {
            for (var j = 0; j < codeLength; j++) {
                example += "A";
            }
        } else if (charAndNum) {
            var insNum = false;
            for (var k = 0; k < codeLength; k++) {
                if (insNum) {
                    example += k;
                    insNum = false;
                } else {
                    example += "A";
                    insNum = true;
                }
                
            }
        }
    }
    $("#Example").val(example);

}

$(document).ready(function () {

    $("#inputNumOfAccountLevels").change(function () {
        GenerateAccountLevel("#divAccountLevels", "#inputNumOfAccountLevels","GetGlAccountLevels");
    });
    function GenerateAccountLevel(divName,inputNumFoLevels,page) {
        var numOfLevels = $(inputNumFoLevels).val();
        if (numOfLevels > 0) {
            var htmlLevels = "";
            $.ajax({
                url: '/DefCoding/'+page,
                success: function (data) {
                    if (data.length > 0) {
                        if (data.length > numOfLevels) {
                            for (var i = 0; i < numOfLevels; i++) {
                                htmlLevels += '<div class="row"><label class="col-xl-2 col-lg-3 form-group " > مستوى ' + (i + 1) + '</label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="Lengths" id="inputLevel' + (i + 1) + '" value="' + data[i].length + '" required>' + ''
                                    + '</div><label class="col-xl-2 col-lg-3 form-group " > تزايد </label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="IncrementalValues" value="' + data[i].incrementalValue + '" required><input type="text" name="LevelNumbers" value="' + (i + 1) + '" hidden required></div></div>';
                            }
                           
                            $(divName).html(htmlLevels);
                        } else if (data.length < numOfLevels) {
                            for (var i = 0; i < data.length; i++) {
                                htmlLevels += '<div class="row"><label class="col-xl-2 col-lg-3 form-group " > مستوى ' + (i + 1) + '</label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="Lengths" id="inputLevel' + (i + 1) + '" value="' + data[i].length + '" required>' + ''
                                    + '</div><label class="col-xl-2 col-lg-3 form-group " > تزايد </label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="IncrementalValues" value="' + data[i].incrementalValue + '" required><input type="text" name="LevelNumbers" value="' + (i + 1) + '" hidden required></div></div>';
                            }
                            for (var j = data.length; j < numOfLevels ; j++) {
                                htmlLevels += '<div class="row"><label class="col-xl-2 col-lg-3 form-group " > مستوى ' + (j + 1) + '</label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="Lengths" id="inputLevel' + (j + 1) + '" required>' + ''
                                    + '</div><label class="col-xl-2 col-lg-3 form-group " > تزايد </label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="IncrementalValues" required><input type="text" name="LevelNumbers" value="' + (j + 1) + '" hidden required></div></div>';
                            }
                            $(divName).html(htmlLevels);
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                htmlLevels += '<div class="row"><label class="col-xl-2 col-lg-3 form-group " > مستوى ' + (i + 1) + '</label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="Lengths" id="inputLevel' + (i + 1) + '" value="' + data[i].length + '" required>' + ''
                                    + '</div><label class="col-xl-2 col-lg-3 form-group " > تزايد </label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="IncrementalValues" value="' + data[i].incrementalValue + '" required><input type="text" name="LevelNumbers" value="' + (i + 1) + '" hidden required></div></div>';
                            }
                           
                            $(divName).html(htmlLevels);
                        }
                        
                    } else {
                        for (var i = 0; i < numOfLevels; i++) {
                            htmlLevels += '<div class="row"><label class="col-xl-2 col-lg-3 form-group " > مستوى ' + (i + 1) + '</label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="Lengths" id="inputLevel' + (i + 1) + '" required>' + ''
                                + '</div><label class="col-xl-2 col-lg-3 form-group " > تزايد </label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="IncrementalValues" required><input type="text" name="LevelNumbers" value="' + (i + 1) + '" hidden required></div></div>';
                        }

                        $(divName).html(htmlLevels);
                    }
                }
            });

           
        }

    }

    LoadAccountLevels();

    function LoadAccountLevels() {
        $.ajax({
            url: '/DefCoding/GetGlAccountLevels',
            success: function (data) {
                if (data.length > 0) {
                    var htmlLevels = "";
                    for (var i = 0; i < data.length; i++) {
                        htmlLevels += '<div class="row"><label class="col-xl-2 col-lg-3 form-group " > مستوى ' + (i + 1) + '</label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="Lengths" id="inputLevel' + (i + 1) + '" value="' + data[i].length + '" required>' + ''
                            + '</div><label class="col-xl-2 col-lg-3 form-group " > تزايد </label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="IncrementalValues" value="' + data[i].incrementalValue + '" required><input type="text" name="LevelNumbers" value="' + (i + 1) + '" hidden required></div></div>';
                    }
                    $("#inputNumOfAccountLevels").val(data.length);
                    $("#divAccountLevels").html(htmlLevels);
                }
            }
        });
    }

    $("#inputNumOfCostCenterLevels").change(function () {
        GenerateAccountLevel("#divCostCenterLevels", "#inputNumOfCostCenterLevels","GetCostCenterLevels");
    });

    LoadCoastCenterLevels();
    function LoadCoastCenterLevels() {
        $.ajax({
            url: '/DefCoding/GetCostCenterLevels',
            success: function (data) {
                if (data.length > 0) {
                    var htmlLevels = "";
                    for (var i = 0; i < data.length; i++) {
                        htmlLevels += '<div class="row"><label class="col-xl-2 col-lg-3 form-group " > مستوى ' + (i + 1) + '</label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="Lengths" id="inputLevel' + (i + 1) + '" value="' + data[i].length + '" required>' + ''
                            + '</div><label class="col-xl-2 col-lg-3 form-group " > تزايد </label ><div class="col-xl-2 col-lg-2 form-group  "><input type="text" class="form-control input-sys" name="IncrementalValues" value="' + data[i].incrementalValue + '" required><input type="text" name="LevelNumbers" value="' + (i + 1) + '" hidden required></div></div>';
                    }
                    $("#inputNumOfCostCenterLevels").val(data.length);
                    $("#divCostCenterLevels").html(htmlLevels);
                }
            }
        });
    }
});
