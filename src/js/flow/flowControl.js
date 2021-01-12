import { Drag, DragEventType } from "../drag";
import { ElementMouseCompose, getElementPos, getElementSize } from "../elementSupply";
import { Vector, VectorE } from "../vector";
import FlowControlComponent from "./flowControlComponent";

export default class FlowControl extends FlowControlComponent {
  constructor(element) {
    super();
    const drag = new Drag(element);
    const elementMouseCompose = new ElementMouseCompose(element);
    //element.addEventListener("contextmenu", (ev) => ev.preventDefault()); //取消右鍵選單
    this.setCollisionGraph({ type: "rect", pos: getElementPos(element), size: getElementSize(element) });

    this.currentControl = null;
    this.hoverControl = null;

    this.pinPos = [0, 0];
    this.mousePos = [0, 0];

    let dragHoverControl = null;
    let pressControl = null;
    this.dragRect = { pos: [0, 0], size: [0, 0] };
    elementMouseCompose.on("press", (ev) => {
      pressControl = this.hoverControl;
      if (this.hoverControl) {
        this.hoverControl.bubbleFire("press", { mousePos: ev.mousePos, button: ev.button });
      }
    });
    elementMouseCompose.on("move", (ev) => {
      VectorE.set(this.mousePos, ...ev.mousePos);
      const control = this.pointDeepHitTest(ev.mousePos);
      if (this.hoverControl != control) {
        if (this.hoverControl) {
          this.hoverControl.bubbleFire("leave");
        }
        this.hoverControl = control;
        if (this.hoverControl) {
          this.hoverControl.bubbleFire("enter");
        }
      }
    });
    elementMouseCompose.on("release", (ev) => {
      if (this.hoverControl) {
        this.hoverControl.bubbleFire("release", { mousePos: ev.mousePos, button: ev.button });
        if (this.hoverControl == pressControl) {
          this.hoverControl.bubbleFire("click", { mousePos: ev.mousePos, button: ev.button });
        }
      }
    });
    drag.on(DragEventType.START, (ev) => {
      dragHoverControl = this.hoverControl;
      this.currentControl = this.hoverControl;
      VectorE.set(this.pinPos, ...ev.mousePos);
      this.dragRect = this.calcRect(this.pinPos, ev.mousePos);
      if (this.currentControl) {
        this.currentControl.bubbleFire("start", { mousePos: ev.mousePos, button: ev.button, stopDrag: ev.stopDrag });
      }
    });
    drag.on(DragEventType.MOVE, (ev) => {
      this.dragRect = this.calcRect(this.pinPos, ev.mousePos);
      if (this.currentControl) {
        this.currentControl.bubbleFire("drag", {
          mousePos: ev.mousePos,
          movePos: ev.movePos,
          button: ev.button,
          stopDrag: ev.stopDrag,
        });
      }
      if (dragHoverControl != this.hoverControl) {
        if (dragHoverControl) {
          if (this.currentControl == dragHoverControl) {
            dragHoverControl.bubbleFire("dragLeave", {
              mousePos: ev.mousePos,
              button: ev.button,
              stopDrag: ev.stopDrag,
            });
          }
        }
        if (this.hoverControl) {
          if (this.currentControl != this.hoverControl) {
            this.hoverControl.bubbleFire("dragEnter", {
              mousePos: ev.mousePos,
              button: ev.button,
              stopDrag: ev.stopDrag,
            });
          }
        }
        dragHoverControl = this.hoverControl;
      }
    });
    drag.on(DragEventType.END, (ev) => {
      this.dragRect = this.calcRect(this.pinPos, ev.mousePos);
      if (this.currentControl) {
        this.currentControl.bubbleFire("end", { mousePos: ev.mousePos, button: ev.button, stopDrag: ev.stopDrag });
      }
    });
  }
  calcRect(startPos, endPos) {
    const minPos = Vector.min(startPos, endPos);
    const maxPos = Vector.max(startPos, endPos);
    return { pos: minPos, size: Vector.sub(maxPos, minPos) };
  }
}
