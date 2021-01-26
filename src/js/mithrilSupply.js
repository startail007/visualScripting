import { getElementPagePos } from "./elementSupply";
import { calcRect } from "./supply";
import { Vector, VectorE } from "./vector";

export const objEventDrag = (event = {}) => {
  let mousedown = false;
  const mousePos = [0, 0];
  const pinPos = [0, 0];
  let currentTarget = null;
  const start = (ev) => {
    currentTarget = ev.currentTarget;

    VectorE.set(mousePos, ev.pageX, ev.pageY);

    const locPos = Vector.sub(mousePos, getElementPagePos(currentTarget));

    VectorE.set(pinPos, ...locPos);

    const dragRect = calcRect(pinPos, locPos);

    mousedown = true;
    if (event.start) {
      event.start({ mousePos, locPos, pinPos, dragRect });
      ev.stopPropagation();
    }
  };
  const move = (ev) => {
    if (mousedown) {
      const newMousePos = [0, 0];
      VectorE.set(newMousePos, ev.pageX, ev.pageY);
      const movePos = Vector.sub(newMousePos, mousePos);

      VectorE.set(mousePos, ...newMousePos);
      const locPos = Vector.sub(mousePos, getElementPagePos(currentTarget));

      const dragRect = calcRect(pinPos, locPos);

      if (event.drag) {
        event.drag({ mousePos, locPos, movePos, pinPos, dragRect });
        //ev.stopPropagation();
      }
    }
  };
  const end = (ev) => {
    if (mousedown) {
      mousedown = false;

      VectorE.set(mousePos, ev.pageX, ev.pageY);
      const locPos = Vector.sub(mousePos, getElementPagePos(currentTarget));

      const dragRect = calcRect(pinPos, locPos);

      if (event.end) {
        event.end({ pinPos, mousePos, locPos, pinPos, dragRect });
        //ev.stopPropagation();
      }
    }
  };

  const a_start = (ev) => {
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", a_end);
    start(ev);
  };
  const a_end = (ev) => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", a_end);
    end(ev);
  };
  return a_start;
};
