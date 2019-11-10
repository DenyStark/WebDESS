let transitionCounter = 0;

class TransitionObject {
  constructor(id) {
    this.id = id;
    transitionCounter++;

    const object = `
      <div class="sandbox-item text-center draggable" id="item-${id}">
        T${transitionCounter}<br>
        <svg width="60" height="60">
          <rect x="27" y="6" width="6" height="48" style="fill:#333333" />
        </svg>
      </div>`;
    $('#sandbox').append(object);
  }
};
