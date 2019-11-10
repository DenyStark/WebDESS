let transitionCounter = 0;

class TransitionObject {
  constructor(id) {
    this.id = id;
    transitionCounter++;

    const object = `
      <div class="sandbox-item text-center draggable" id="item-${id}">
        T${transitionCounter}<br>
        <div class="sandbox-object">
          <svg width="60" height="60">
            <rect x="27" y="6" width="6" height="48" style="fill:#333333" />
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
