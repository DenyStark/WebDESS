const randomId = () => Math.round(Math.random() * 1e8);
const getNetOptions = () => filesManager.loadList('Net').map(e => ({
    netId: e.data.id,
    netName: e.title,
    net: JSON.stringify(e.data),
}));

var newObjectId = 1,
    newArcId = 1,
    newPetriObjectModelId = randomId();
var distBtwnButtonsAndSandbox = 58;
var temporaryArrowExists = false;
var temporaryArrowFixed = false;
var currentModel = new PetriObjectModel(null);
currentModel.id = newPetriObjectModelId;
var net;

function reset() {
    newPetriObjectModelId = randomId();
    newObjectId = newArcId = 1;
    temporaryArrowExists = false;
    temporaryArrowFixed = false;
    currentModel = new PetriObjectModel(null);
    currentModel.id = newPetriObjectModelId;
    net = null;
    $('.page-svg svg, .top-svg svg, .sandbox div').remove();
    $('.stats').html('');
}

function createMouseDownEvent(buttonLocation) {
    var mouseDownEvent = new $.Event('mousedown');
    mouseDownEvent.pageX = buttonLocation.left;
    mouseDownEvent.pageY = buttonLocation.top + distBtwnButtonsAndSandbox;
    return mouseDownEvent;
}

function newObject() {
    var netOptions = getNetOptions();
    if (netOptions.length === 0) {
        alert('No saved Petri nets found. Please create them first.');
        return;
    }
    net = null;
    var location = getCoords($('#add-object-btn')[0]);
    var existingNet = restorePetriNet(parsePetriNet(netOptions[0].net));
    var newObject = new PetriObject(newObjectId, 'O' + newObjectId, 'new class', existingNet, location.top + distBtwnButtonsAndSandbox, location.left);
    currentModel.objects.push(newObject);
    newObject.draw();
    $('#object' + newObjectId).trigger(createMouseDownEvent(location));
    newObjectId++;
}

function drawTemporaryArrow(x, y) {
    temporaryArrowExists = true;
    temporaryArrowFixed = false;
    const arrow = `
        <svg class="temp-arrow">
            <path class="arrow-path" d="" style="stroke:black; stroke-width: 1.25px; fill: none;"/>
        </svg>`;

    $('.page-svg').append(arrow);
    $('.temp-arrow').find('.arrow-path')[0].setAttribute('d', `M${x},${y} L${x},${y}`);
}

function removeTemporaryArrow() {
    temporaryArrowExists = false;
    temporaryArrowFixed = false;
    $('.temp-arrow').remove();
}

function openArcDialog(firstObject, secondObject) {
    $('#firstNetName').text(firstObject.net.name);
    $('#secondNetName').text(secondObject.net.name);
    $('#place-model-arc-count').html('1');
    $('#placeFirstNet, #placeSecondNet').html('');
    for (var i = 0; i < firstObject.net.places.length; i++) {
        var place = firstObject.net.places[i];
        $('#placeFirstNet').append('<option value="' + place.id + '">' + place.name + '</option>');
    }
    for (var i = 0; i < secondObject.net.places.length; i++) {
        var place = secondObject.net.places[i];
        $('#placeSecondNet').append('<option value="' + place.id + '">' + place.name + '</option>');
    }

    var dialog = $('#defineArcPopup').dialog({
        autoOpen: true,
        modal: true,
        resizable: false,
        width: 292,
        buttons: {
            'Cancel': function () {
                removeTemporaryArrow();
                dialog.dialog('close');
            },
            'Ok': function () {
                removeTemporaryArrow();
                var firstObjectPlaceId = parseInt($('#placeFirstNet').val());
                var secondObjectPlaceId = parseInt($('#placeSecondNet').val());
                var count = parseInt($('#place-model-arc-count').val());
                dialog.dialog("close");
                net = null;
                var newArc = new PetriObjectArc(newArcId, firstObject, secondObject, firstObjectPlaceId, secondObjectPlaceId, count);
                currentModel.arcs.push(newArc);
                newArc.draw();
                newArcId++;
            }
        },
        close: function () {
            dialog.dialog('destroy');
        }
    });
}

function newArc() {
    allowDragAndDrop = false;
    $(document).one('mousedown', function (e) {
        var beginElemId;
        var $elem = $(document.elementFromPoint(e.pageX, e.pageY));
        if ($elem.hasClass('petri-object')) {
            beginElemId = parseInt($elem.attr('id').match(/\d+/));
            drawTemporaryArrow(e.pageX, e.pageY);
            $(document).one('mouseup', function (e) {
                $elem = $(document.elementFromPoint(e.pageX, e.pageY));
                if ($elem.hasClass('petri-object')) {
                    var endElemId = parseInt($elem.attr('id').match(/\d+/));
                    var firstObjectId = beginElemId;
                    var secondObjectId = endElemId;
                    if (beginElemId === endElemId) {
                        removeTemporaryArrow();
                        allowDragAndDrop = true;
                        return;
                    }
                    var firstObject = currentModel.objects.filter(function (item) {
                        return item.id === firstObjectId;
                    })[0];
                    var secondObject = currentModel.objects.filter(function (item) {
                        return item.id === secondObjectId;
                    })[0];
                    if (currentModel.arcs.filter(function (item) {
                        return (item.firstObjectId === firstObjectId && item.secondObjectId === secondObjectId)
                            || (item.firstObjectId === secondObjectId && item.secondObjectId === firstObjectId);
                    }).length === 0) {
                        temporaryArrowFixed = true;
                        openArcDialog(firstObject, secondObject);
                    } else {
                        removeTemporaryArrow();
                    }
                } else {
                    removeTemporaryArrow();
                }
                allowDragAndDrop = true;
            });
        } else {
            allowDragAndDrop = true;
        }
    });
}

function redrawTemporaryArrowIfNecessary(e) {
    if (temporaryArrowExists && !temporaryArrowFixed) {
        const arrow = $('.temp-arrow').find('.arrow-path')[0];
        const oldD = arrow.getAttribute('d');
        const newD = `${oldD.slice(0, oldD.indexOf('L'))}L${e.pageX},${e.pageY}`;
        arrow.setAttribute('d', newD);
    }
}

function getNextElementId(elementsArray) {
    return Math.max.apply(null, elementsArray.map(function (element) {
        return element.id;
    })) + 1;
}

function restoreModel(jsonModel) {
    var restoringOk = true;
    var netOptions = getNetOptions();
    var simpleModelObject = JSON.parse(jsonModel);
    var model = new PetriObjectModel(simpleModelObject.name);
    model.id = simpleModelObject.id;
    $.extend(model, simpleModelObject);
    var allObjs = {};
    for (var i = 0; i < model.objects.length; i++) {
        var object = model.objects[i];
        var petriNets = netOptions.filter(function (item) {
            return item.netId === object.netId;
        });
        if (!petriNets.length) {
            restoringOk = false;
            break;
        }
        var objectNet = restorePetriNet(parsePetriNet(petriNets[0].net));
        var petriObject = new PetriObject(object.id, object.name, object.className, objectNet, object.top, object.left);
        petriObject.netId = object.netId;
        $.extend(petriObject, object);
        model.objects[i] = $.extend(object, petriObject);
        allObjs[object.id] = object;
    }
    if (!restoringOk) {
        return false;
    }

    model.arcs = model.arcs.map(e => {
        const firstObject = allObjs[e.firstObjectId];
        const secondObject = allObjs[e.secondObjectId];
        return new PetriObjectArc(e.id, firstObject, secondObject, e.firstObjectPlaceId, e.secondObjectPlaceId, e.count);
    });
    $.each(model.objects, function (p, object) {
        object.arcs = model.arcs.filter(function (arcElem) {
            return arcElem.firstObjectId === object.id || arcElem.secondObjectId === object.id;
        }).slice();
    });
    return model;
}

function buildPetri(json) {
    const openedModel = restoreModel(json);

    newObjectId = getNextElementId(openedModel.objects);
    newArcId = getNextElementId(openedModel.arcs);
    temporaryArrowExists = false;
    temporaryArrowFixed = false;
    currentModel = openedModel;

    $('.page-svg svg, .top-svg svg, .sandbox div').remove();
    $('.stats').html('');

    currentModel.draw();
}

function getCurrentModel() {
    const model = $.extend(true, {}, currentModel);

    model.objects = getDeepArrayCopy(currentModel.objects);
    model.objects.forEach(object => {
        object.arcs = undefined;
        object.net = undefined;
    });
    model.arcs = getDeepArrayCopy(currentModel.arcs);

    return { model, json: JSON.stringify(model) };
}

function saveCurrentModel(title) {
    currentModel.name = title;
    const { valid, message } = currentModel.validate();
    if (!valid) return alert(`Invalid Petri objects model: ${message}`);

    const { model } = getCurrentModel();

    filesManager.createFile(title, true, 'Model', model);
}

function runModelSimulation() {
    const { valid, message } = currentModel.validate();
    if (!valid) return alert(`Invalid Petri objects model: ${message}`);

    if (currentModel.hasParameters())
        return alert('Petri objects model has parameters. Please provide specific values for them first.');

    runSimulationForModel(currentModel);
}

function deleteArc(id) {
    net = null;
    var theseArcs = currentModel.arcs.filter(function (item) {
        return item.id === id;
    });
    if (theseArcs.length) {
        var arcToDelete = theseArcs[0];
        var objects = currentModel.objects.filter(function (item) {
            return item.id === arcToDelete.firstObjectId || item.id === arcToDelete.secondObjectId;
        });
        if (objects) {
            for (var j = 0; j < objects.length; j++) {
                var objectArcIndex = objects[j].arcs.indexOf(arcToDelete);
                objects[j].arcs.splice(objectArcIndex, 1);
            }
        }
        arcToDelete.destroy();
        var index = currentModel.arcs.indexOf(arcToDelete);
        currentModel.arcs.splice(index, 1);
    }
}

function deleteObject(id) {
    net = null;
    var theseObjects = currentModel.objects.filter(function (item) {
        return item.id === id;
    });
    if (theseObjects.length) {
        var objectToDelete = theseObjects[0];
        if (objectToDelete.arcs.length) {
            $.each(objectToDelete.arcs, function (a, arc) {
                deleteArc(arc.id);
            });
        }
        objectToDelete.destroy();
        var index = currentModel.objects.indexOf(objectToDelete);
        currentModel.objects.splice(index, 1);
    }
}

function getNetById(netId) {
    var netOptions = getNetOptions();
    return restorePetriNet(parsePetriNet(netOptions.filter(function (item) {
        return item.netId === netId;
    })[0].net));
}

function convertToFunction() {
    const { valid, message } = currentModel.validate();
    if (!valid) return returnalert(`Invalid Petri objects model: ${message}`);

    const name = currentModel.name || 'New';
    let func = `function generate${normalizeString(name)}PetriObjectModel() {
    const model = new PetriObjectModel('${name}');`;

    currentModel.objects.forEach(object => {
        const netId = object.netId;
        func += `
    const net${object.id} = getNetById(${netId});
    const object${object.id} = new PetriObject(${object.id}, '${object.name}', '${object.className}', net${object.id}, ${object.top}, ${object.left});
    model.objects.push(object${object.id});`;
    });

    currentModel.arcs.forEach(arc => {
        func += `
    const arc${arc.id} = new PetriObjectArc(${arc.id}, object${arc.firstObjectId}, object${arc.secondObjectId}, ${arc.firstObjectPlaceId}, ${arc.secondObjectPlaceId}, ${arc.count});
    model.arcs.push(arc${arc.id});`;
    });

    func += `
    return model;
}`;
    $('#function-text').val(func);
    $('#function-invocation').val(`generate${normalizeString(name)}PetriObjectModel()`);
}

function generateFromFunction() {
    let func;
    let net;
    let args;

    try {
        const text = $('#function-text').val();
        if (!text) return alert('Error: no function definition provided.');

        const name = parseFunctionNameFromDefinition(text);
        const params = parseParamsString(text);
        let paramsCount = (params.match(/,/g) || []).length + 1;
        if (paramsCount === 1 && !params) paramsCount = 0;
        const body = parseFunctionBody(text);

        const invocation = $('#function-invocation').val();
        if (!invocation) return alert('Error: no function invocation provided.');

        args = parseArgumentsArray(invocation);
        if (args.length !== paramsCount) return alert('Error: incorrect number of arguments supplied.');

        let secondName = parseFunctionNameFromInvocation(invocation);
        if (secondName !== name) return alert('Error: different function names in the definition and invocation.');

        func = new Function(params, body);
    } catch (e) { return alert('Function parsing error.'); }

    try { net = func.apply(this, args); }
    catch (e) { return alert('Function execution error.'); }

    if (!net || !net.getClass || net.getClass() !== 'PetriObjectModel')
        return alert('Error: invalid object returned from the function.');

    net.id = randomId();
    newObjectId = getNextElementId(net.objects);
    newArcId = getNextElementId(net.arcs);
    temporaryArrowExists = false;
    temporaryArrowFixed = false;
    currentModel = net;

    $('.page-svg svg, .top-svg svg, .sandbox div').remove();
    $('.stats').html('');

    currentModel.draw();
}

function clearProgrammingPopup() {
    $('#function-text, #function-invocation').val('');
}

function addMoreSimilarObjects(objectId, number) {
    net = null;
    var initialObject = currentModel.objects.filter(function (item) {
        return item.id === objectId;
    })[0];
    for (var i = 0; i < number; i++) {
        var newObject = new PetriObject(newObjectId, 'O' + newObjectId, initialObject.className, initialObject.net, 0, 0);
        currentModel.objects.push(newObject);
        newObject.draw();
        newObjectId++;
        left += 25;
    }
}

function editArcsForObject(objectId) {
    var $popup = $('#editArcsPopup');
    var object = currentModel.objects.filter(function (item) {
        return item.id === objectId;
    })[0];
    var arcs = object.arcs;
    for (var j = 0; j < arcs.length; j++) {
        var arc = arcs[j];
        var newHtml = '';
        if (arc.firstObjectId === objectId) {
            var secondObject = currentModel.objects.filter(function (item) {
                return item.id === arc.secondObjectId;
            })[0];
            newHtml += '<div class="popup-line"><span class="popup-label">Place (net: ' + object.net.name + '):</span><select data-number="first" '
                + 'data-arc-id="' + arc.id + '" class="place-for-net">';
            for (var i = 0; i < object.net.places.length; i++) {
                var place = object.net.places[i];
                newHtml += '<option value="' + place.id + '">' + place.name + '</option>';
            }
            var selectedValueForSecondLine = '';
            for (var i = 0; i < secondObject.net.places.length; i++) {
                var place = secondObject.net.places[i];
                if (place.id === arc.secondObjectPlaceId) {
                    selectedValueForSecondLine = place.name;
                    break;
                }
            }
            newHtml += '</select></div><div class="popup-line last-in-group"><span class="popup-label">Place (net: ' + secondObject.net.name + '):</span>'
                + '<span class="ready-value">' + selectedValueForSecondLine + '</span></div>';
        } else {
            var firstObject = currentModel.objects.filter(function (item) {
                return item.id === arc.firstObjectId;
            })[0];
            var selectedValueForFirstLine = '';
            for (var i = 0; i < firstObject.net.places.length; i++) {
                var place = firstObject.net.places[i];
                if (place.id === arc.firstObjectPlaceId) {
                    selectedValueForFirstLine = place.name;
                    break;
                }
            }
            newHtml += '<div class="popup-line"><span class="popup-label">Place (net: ' + firstObject.net.name + '):</span><span class="ready-value">'
                + selectedValueForFirstLine + '</span></div>';
            newHtml += '<div class="popup-line last-in-group"><span class="popup-label">Place (net: ' + object.net.name
                + '):</span><select data-number="second" data-arc-id="' + arc.id + '" class="place-for-net">';
            for (var i = 0; i < object.net.places.length; i++) {
                var place = object.net.places[i];
                newHtml += '<option value="' + place.id + '">' + place.name + '</option>';
            }
            newHtml += '</select></div>';
        }
        $popup.append(newHtml);
    }

    var editArcsDialog = $popup.dialog({
        autoOpen: true,
        modal: true,
        resizable: false,
        width: 292,
        open: function () {
            $(".ui-dialog-titlebar-close").hide();
        },
        close: function () {
            editArcsDialog.dialog('destroy');
        },
        buttons: {
            'Ok': function () {
                $('.place-for-net').each(function () {
                    var arcId = parseInt($(this).data('arc-id'));
                    var placeId = parseInt($(this).val());
                    var number = $(this).data('number');
                    var arc = currentModel.arcs.filter(function (item) {
                        return item.id === arcId;
                    })[0];
                    arc[number + 'ObjectPlaceId'] = placeId;
                });
                editArcsDialog.dialog('close');
            }
        }
    });
}

$(document).ready(function () {
    allowDragAndDrop = true;

    $(document).on('mousemove', redrawTemporaryArrowIfNecessary);

    var $focusedElement;
    $(document).on('modelEdited', function () {
        net = null;
    });
    $(document).on('click', function (e) {
        $focusedElement = $(e.target);
    });
    $(document).on('keyup', function (e) {
        if (e.keyCode === 46 && $focusedElement && $('#' + $focusedElement.attr('id')).length) {
            if ($focusedElement.hasClass('petri-object')) {
                var objectId = parseInt($focusedElement.attr('id').substr(6));
                deleteObject(objectId);
            } else if ($focusedElement.hasClass('arc-clickable-area') || $focusedElement.hasClass('arrow-path')) {
                $focusedElement = $focusedElement.parent();
                var arcId = parseInt($focusedElement.attr('id').substr(10));
                deleteArc(arcId);
            }
        }
    });
    $(document).on('click', '.edit-object-arcs', function () {
        var objectId = $(this).data('id');
        $(this).remove();
        editArcsForObject(objectId);
    });
    $(document).on('contextmenu', function (e) {
        var $target = $(e.target);
        if ($target.hasClass('petri-object')) {
            e.preventDefault();
            var objectId = parseInt($target.attr('id').substr(6));
            var addMoreObjectsDialog = $('#addMoreObjectsPopup').dialog({
                autoOpen: true,
                modal: true,
                resizable: false,
                height: 124,
                width: 292,
                open: function () {
                    $('#numOfNewObjects').val('');
                },
                buttons: {
                    'Cancel': function () {
                        addMoreObjectsDialog.dialog('close');
                    },
                    'Ok': function () {
                        var numStr = $('#numOfNewObjects').val();
                        if (!numStr || Math.floor(numStr) != numStr || !$.isNumeric(numStr) || parseInt(numStr) < 1) {
                            alert('Number of Objects must be a positive integer.');
                            return;
                        }
                        var number = parseInt(numStr);
                        addMoreObjectsDialog.dialog('close');
                        addMoreSimilarObjects(objectId, number);
                    }
                },
                close: function () {
                    addMoreObjectsDialog.dialog('destroy');
                }
            });
        }
    });
});
