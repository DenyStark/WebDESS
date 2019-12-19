class PetriObjectArc {
  constructor(id, firstObject, secondObject, firstObjectPlaceId, secondObjectPlaceId, count = 1) {
    this.id = id;
    this.firstObjectId = firstObject.id;
    this.secondObjectId = secondObject.id;

    this.firstObjectPlaceId = firstObjectPlaceId;
    this.secondObjectPlaceId = secondObjectPlaceId;

    this.count = count;

    firstObject.arcs.push(this);
    secondObject.arcs.push(this);
  }

  setArrowPosition() {
    const id = `object-arc${this.id}`;
    const shift = 25;

    const from = $(`#object${this.firstObjectId}`)[0].getBoundingClientRect();
    const to = $(`#object${this.secondObjectId}`)[0].getBoundingClientRect();
    const top = parseInt($('.page-svg').css('top'));
    const left = parseInt($('.page-svg').css('left'));

    const d = `M${from.x + shift - left},${from.y + shift - top} L${to.x + shift - left},${to.y + shift - top}`;

    $(`#${id}`).find('.arrow-path')[0].setAttribute('d', d);
    $(`#${id}`).find('.arc-clickable-area')[0].setAttribute('d', d);
  }

  edit() {
    const dialog = $('#defineArcPopup').dialog({
      autoOpen: true,
      modal: true,
      resizable: false,
      width: 292,
      buttons: {
        'Cancel': () => { dialog.dialog('close'); },
        'Ok': () => {
          this.firstObjectPlaceId = parseInt($('#placeFirstNet').val());
          this.secondObjectPlaceId = parseInt($('#placeSecondNet').val());
          dialog.dialog("close");
        }
      },
      close: () => { dialog.dialog('destroy'); }
    });
  }

  draw() {
    const id = `object-arc${this.id}`;
    if ($(`#${id}`).length) return;

    const arrowSvg = `
      <svg class="petri-object-arc" id="${id}">
        <path class="arc-clickable-area" d="" style="stroke: transparent; stroke-width: 18px; fill: none;" id="${id}ClickableArea"/>
        <path class="arrow-path" style="stroke:black; stroke-width: 1.25px; fill: none;" id="${id}ArrowPath"/>
      </svg>`;

    $('.page-svg').append(arrowSvg);
    this.setArrowPosition();

    $(`#${id}`).find('.arc-clickable-area, .arrow-path').on('dblclick', this.edit);
  }
  redraw() { this.setArrowPosition(); }

  destroy() { $(`#object-arc${this.id}`).remove(); }
}
