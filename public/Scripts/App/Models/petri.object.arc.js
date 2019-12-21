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

    const middleX = (from.x + to.x) / 2 + (shift - left);
    const middleY = (from.y + to.y) / 2 + (shift - top);

    const countText = $(`#${id}`).find('.arc-note')[0];
    countText.textContent = this.count > 1 ? this.count : '';
    countText.setAttribute('x', middleX - 3);
    countText.setAttribute('y', middleY - 8);

    const routeText = $(`#${id}`).find('.arc-note')[1];
    routeText.textContent = `P${this.firstObjectPlaceId} => P${this.secondObjectPlaceId}`;
    routeText.setAttribute('x', middleX - 25);
    routeText.setAttribute('y', middleY + 25);
  }

  draw() {
    const id = `object-arc${this.id}`;
    if ($(`#${id}`).length) return;

    const arrowSvg = `
      <svg class="petri-object-arc" id="${id}">
        <text class="arc-note" fill="black"></text>
        <text class="arc-note" fill="black"></text>
        <path class="arc-clickable-area" d="" style="stroke: transparent; stroke-width: 18px; fill: none;" id="${id}ClickableArea"/>
        <path class="arrow-path" style="stroke:black; stroke-width: 1.25px; fill: none;" id="${id}ArrowPath"/>
      </svg>`;

    $('.page-svg').append(arrowSvg);
    this.setArrowPosition();
  }
  redraw() { this.setArrowPosition(); }

  destroy() { $(`#object-arc${this.id}`).remove(); }
}
