let counter = 0;

class PetriObject {
  constructor(id) {
    this.id = id;
    counter++;

    const object = `
      <div class="sandbox-item text-center draggable" id="item-${id}">
        P${counter}<br>
        <svg width="60" height="60">
          <circle cx="30" cy="30" r="22.5" style="fill:white" />
        </svg>
      </div>`;
    $('#sandbox').append(object);
  }
};
