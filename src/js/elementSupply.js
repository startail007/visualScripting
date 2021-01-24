import Listener from "./listener";
import { isMobile } from "./supply";
import { Vector, VectorE } from "./vector";

export const setElementPos = (element, pos) => {
  element.style.left = pos[0] + "px";
  element.style.top = pos[1] + "px";
};
export const setElementSize = (element, size) => {
  element.style.width = size[0] + "px";
  element.style.height = size[1] + "px";
};
export const getElementPos = (element) => {
  return [element.offsetLeft, element.offsetTop];
};
export const getElementSize = (element) => {
  return [element.offsetWidth, element.offsetHeight];
};
export const getElementPagePos = (element) => {
  const pos = [0, 0];
  let m = element;
  while (m) {
    pos[0] += m.scrollLeft ?? 0;
    pos[1] += m.scrollTop ?? 0;
    m = m.parentElement;
  }
  const rect = element.getBoundingClientRect();
  return [rect.x + pos[0], rect.y + pos[1]];
};
/*export const getElementPagePos = (element) => {
  if (element) {
    const pos = getElementPos(element);
    VectorE.add(pos, [element.scrollLeft ?? 0, element.scrollTop ?? 0]);
    VectorE.add(pos, getElementPagePos(element.parentElement) ?? [0, 0]);
    return pos;
  }
};*/
export const getElementTargetPos = (element, target) => {
  if (element && element != target) {
    const pos = getElementPos(element);
    VectorE.add(pos, [element.scrollLeft ?? 0, element.scrollTop ?? 0]);
    VectorE.add(pos, getElementTargetPos(element.parentElement, target) ?? [0, 0]);
    return pos;
  }
};
export const createElement = (tag, attributes = {}, textContent = "") => {
  const element =
    tag === "svg" ? document.createElementNS("http://www.w3.org/2000/svg", "svg") : document.createElement(tag);
  //element.className = className;
  element.textContent = textContent;
  for (let key in attributes) {
    if (key !== "style") {
      element.setAttribute(key, attributes[key]);
    }
  }
  if (attributes.style) {
    for (let key in attributes.style) {
      element.style[key] = attributes.style[key];
    }
  }
  return element;
};

export class ElementMouseCompose extends Listener {
  constructor(element) {
    super();
    if (element) {
      this.init(element);
    }
  }
  init(element) {
    this.element = element;
    const mousePos = [0, 0];
    let currentTarget = null;
    const start = (ev) => {
      ev.register = this;
      const item = ev.touches ? ev.touches[0] : ev;
      VectorE.set(mousePos, item.pageX, item.pageY);
      ev.mousePos = mousePos;
      this.fire("press", ev);
    };
    const move = (ev) => {
      ev.register = this;
      const item = ev.touches ? ev.touches[0] : ev;
      const newMousePos = [0, 0];
      VectorE.set(newMousePos, item.pageX, item.pageY);
      const movePos = Vector.sub(newMousePos, mousePos);
      VectorE.set(mousePos, ...newMousePos);
      ev.mousePos = mousePos;
      ev.movePos = movePos;
      this.fire("move", ev);
    };
    const end = (ev) => {
      ev.register = this;
      const item = ev.touches ? ev.touches[0] : ev;
      if (item) {
        VectorE.set(mousePos, item.pageX, item.pageY);
      }
      ev.mousePos = mousePos;
      this.fire("release", ev);
    };

    if (isMobile()) {
      this.element.addEventListener("touchstart", start);
      this.element.addEventListener("touchmove", move);
      this.element.addEventListener("touchend", end);
    } else {
      this.element.addEventListener("mousedown", start);
      this.element.addEventListener("mousemove", move);
      this.element.addEventListener("mouseup", end);
    }
  }
}
