let petriCounter = 0;

class PetriObject {
  constructor(uid) {
    const object = `
      <div class="sandbox-item text-center draggable" id="item-${uid}">
        <button type="button" class="btn btn-default btn-circle btn-item p-0" id="button-${uid}" onmousedown="createArc('${uid}', ${petriCounter});"></button>
        P${petriCounter}<br>
        <div class="sandbox-object">
          <svg width="60" height="60">
            <circle cx="30" cy="30" r="22.5" style="fill:white" />
          </svg>
        </div>
      </div>`;
    $('#sandbox').append(object);

    $(`#item-${uid}`).click(() => this.select(uid));
    $(document).on('click', e => {
      if (!$(e.target).closest(`#item-${uid}`).length) this.deselect(uid);
    });

    petriCounter++;
  }

  select(uid) {
    $($('.sandbox-object', `#item-${uid}`)[0]).addClass('select');
    $(`#button-${uid}`, `#item-${uid}`).addClass('active');
  }

  deselect(uid) {
    $($('.sandbox-object', `#item-${uid}`)[0]).removeClass('select');
    $(`#button-${uid}`, `#item-${uid}`).removeClass('active');
  }
};
