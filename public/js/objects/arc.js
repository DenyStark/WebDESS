let active;

function createArc(id, index) {
  enableDragDrop = false;
  active = id;

  // console.log($(`#sandbox`).offset());
  // console.log($(`#sandbox`).position());

  // console.log($(`#button-${id}`).offset());
  // console.log($(`#button-${id}`).position());
  const { left, top } = $(`#button-${id}`).offset();

  console.log(left, top);

  const x1 = left - 202 + 7.5;
  const x2 = top - 56 + 7.5;

  console.log(x1, x2);


  const arc = `
    <svg class="position-absolute w-100 h-100" style="z-index:-100;">
      <line x1="${x1}" y1="${x2}" x2="500" y2="500" />
    </svg>`
  $('#sandbox').append(arc);

  console.log(`Create arc at for ${id}, ${index}`);
}

function moveArc(id) {
  
}

function completeArc(id) {
  enableDragDrop = true;
  console.log(`Complete arc at for ${id}`);
}

$(document).on('mouseup', '#sandbox', () => completeArc(active));
$(document).on('mouseleave', '#sandbox', () => completeArc(active));
$(document).on('mousemove', '#sandbox', () => moveArc(active));
