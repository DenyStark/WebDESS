let petriCounter = 0;

class PetriObject {
  constructor(id) {
    this.id = id;
    petriCounter++;

    const object = `
      <div class="sandbox-item text-center draggable" id="item-${id}">
        P${petriCounter}<br>
        <div class="sandbox-object">
          <svg width="60" height="60">
            <circle cx="30" cy="30" r="22.5" style="fill:white" />
          </svg>
        </div>
      </div>`;
    $('#sandbox').append(object);

    $(`#item-${id}`).click(this.select);
    $(document).on('click', e => {
      if (!$(e.target).closest(`#item-${id}`).length) this.deselect();
    });
  }

  select() {
    $($('.sandbox-object', `#${this.id}`)[0]).addClass('select');
  }

  deselect() {
    $($('.sandbox-object', `#item-${this.id}`)[0]).removeClass('select');
  }
};
