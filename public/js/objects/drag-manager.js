const DragManager = new function() {
  let dragObject = {};
  const self = this;

  function onMouseDown(e) {
    if (e.which !== 1) return;

    const elem = e.target.closest('.draggable');
    if (!elem) return;

    dragObject.elem = elem;
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;

    return false;
  }

  function onMouseMove(e) {
    if (!dragObject.elem) return;

    if (!dragObject.avatar) {
      const moveX = e.pageX - dragObject.downX;
      const moveY = e.pageY - dragObject.downY;

      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }

      dragObject.avatar = createAvatar(e);
      if (!dragObject.avatar) {
        dragObject = {};
        return;
      }

      const coords = getCoords(dragObject.avatar);
      dragObject.shiftX = dragObject.downX - coords.left;
      dragObject.shiftY = dragObject.downY - coords.top;

      startDrag(e);
    }

    const { left: sandboxMinX, top: sandboxMinY } = $('#sandbox').offset();
    const sandboxMaxX = sandboxMinX + $('#sandbox').width() - $(dragObject.avatar).width() / 2;
    const sandboxMaxY = sandboxMinY + $('#sandbox').height() - $(dragObject.avatar).height();

    const left = e.pageX - dragObject.shiftX;
    const top = e.pageY - dragObject.shiftY;

    dragObject.avatar.style.left = `${Math.max(Math.min(left, sandboxMaxX), sandboxMinX)}px`;
    dragObject.avatar.style.top = `${Math.max(Math.min(top, sandboxMaxY), sandboxMinY)}px`;

    return false;
  }

  function onMouseUp(e) {
    if (dragObject.avatar) finishDrag(e);
    dragObject = {};
  }

  function finishDrag(e) {
    const dropElem = findDroppable(e);

    if (!dropElem) {
      self.onDragCancel(dragObject);
    } else {
      self.onDragEnd(dragObject, dropElem);
    }
  }

  function createAvatar() {
    const avatar = dragObject.elem;
    const old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || ''
    };

    avatar.rollback = function() {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex;
    };

    return avatar;
  }

  function startDrag() {
    const avatar = dragObject.avatar;
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
  }

  function findDroppable(event) {
    dragObject.avatar.hidden = true;
    const elem = document.elementFromPoint(event.clientX, event.clientY);
    dragObject.avatar.hidden = false;

    if (elem === null) return null;
    return elem.closest('.droppable');
  }

  document.onmousemove = onMouseMove;
  document.onmouseup = onMouseUp;
  document.onmousedown = onMouseDown;

  this.onDragEnd = function() {};
  this.onDragCancel = function() {};
}();


function getCoords(elem) {
  const box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}
