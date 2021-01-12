import Listener from "./listener";
import { Vector, VectorE } from "./vector";
import { setElementPos, getElementPos } from "./elementSupply";
import { isMobile } from "./supply";
export class DragEventType {
  static get START() {
    return "start";
  }
  static get MOVE() {
    return "move";
  }
  static get END() {
    return "end";
  }
}
export class Drag extends Listener {
  constructor(element) {
    super();
    if (element) {
      this.init(element);
    }
  }
  init(element) {
    this.element = element;
    this.mousedown = false;
    const mousePos = [0, 0];
    const stopDrag = () => {
      this.mousedown = false;
    };
    const start = (ev) => {
      if (!this.mousedown) {
        ev.register = this;
        ev.stopDrag = stopDrag;
        this.mousedown = true;

        const item = ev.touches ? ev.touches[0] : ev;
        VectorE.set(mousePos, item.pageX, item.pageY);

        ev.mousePos = mousePos;
        this.fire(DragEventType.START, ev);
        //ev.preventDefault();
        ev.stopPropagation();
      }
    };
    const move = (ev) => {
      if (this.mousedown) {
        ev.register = this;
        ev.stopDrag = stopDrag;

        const item = ev.touches ? ev.touches[0] : ev;
        const newMousePos = [0, 0];
        VectorE.set(newMousePos, item.pageX, item.pageY);
        const movePos = Vector.sub(newMousePos, mousePos);
        VectorE.set(mousePos, ...newMousePos);
        ev.mousePos = mousePos;
        ev.movePos = movePos;

        this.fire(DragEventType.MOVE, ev);
        //ev.preventDefault();
        ev.stopPropagation();
      }
    };
    const end = (ev) => {
      if (this.mousedown) {
        ev.register = this;
        ev.stopDrag = stopDrag;
        this.mousedown = false;

        const item = ev.touches ? ev.touches[0] : ev;
        if (item) {
          VectorE.set(mousePos, item.pageX, item.pageY);
        }
        ev.mousePos = mousePos;

        this.fire(DragEventType.END, ev);
        //ev.preventDefault();
        ev.stopPropagation();
      }
    };

    if (isMobile()) {
      this.element.addEventListener("touchstart", start);
      this.element.addEventListener("touchmove", move);
      this.element.addEventListener("touchend", end);
    } else {
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
      this.element.addEventListener("mousedown", a_start);
    }
  }
  get pos() {
    return getElementPos(this.element);
  }
  set pos(pos) {
    setElementPos(this.element, pos);
  }
}

export class DragMove extends Drag {
  constructor(element) {
    super(element);
  }
  init(element) {
    super.init(element);
    const local = [0, 0];
    const mousePos = [0, 0];
    this.on(DragEventType.START, (ev) => {
      const item = ev.touches ? ev.touches[0] : ev;
      VectorE.set(mousePos, item.pageX, item.pageY);
      VectorE.set(local, ...Vector.sub(mousePos, this.pos));
    });
    this.on(DragEventType.MOVE, (ev) => {
      const item = ev.touches ? ev.touches[0] : ev;
      VectorE.set(mousePos, item.pageX, item.pageY);
      this.pos = Vector.sub(mousePos, local);
    });
    //this.on(DragEventType.END, (ev) => {});
  }
}
