import { Drag, DragEventType } from "../drag";
import { ElementMouseCompose, getElementPos, getElementSize } from "../elementSupply";
import { Vector, VectorE } from "../vector";
import FlowControlComponent from "./flowControlComponent";

export default class FlowControl extends FlowControlComponent {
  constructor(element) {
    super();
    const drag = new Drag(element);
    const elementMouseCompose = new ElementMouseCompose(element);
    this.setCollisionGraph({ type: "rect", pos: getElementPos(element), size: getElementSize(element) });

    this.selectRect = null;
    this.operate = "";

    this.pinPos = [0, 0];
    this.currentControl = null;
    this.hoverControl = null;
    this.selectList = [];
    this.selectRange = [];
    this.mousePos = [0, 0];

    let dragHoverControl = null;

    elementMouseCompose.on("press", (ev) => {
      if (this.hoverControl) {
        this.hoverControl.bubbleFire("press", { mousePos: ev.mousePos });
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
        this.hoverControl.bubbleFire("release", { mousePos: ev.mousePos });
      }
    });
    drag.on(DragEventType.START, (ev) => {
      dragHoverControl = this.hoverControl;
      this.currentControl = this.hoverControl;
      VectorE.set(this.pinPos, ...ev.mousePos);
      if (this.currentControl) {
        if (this.currentControl != this) {
          if (this.selectList.every((el) => el != this.currentControl)) {
            this.setOperate("");
            this.selectRange = [this.currentControl];
            this.setOperate("selectActive");
          }
        }
      }
      if (this.currentControl) {
        this.currentControl.bubbleFire("start", { mousePos: ev.mousePos });
        if (this.currentControl.parent) {
          this.currentControl.parent.setTop(this.selectList);
        }
      }
    });
    drag.on(DragEventType.MOVE, (ev) => {
      if (this.currentControl) {
        this.currentControl.bubbleFire("drag", { mousePos: ev.mousePos, movePos: ev.movePos });
      }
      if (dragHoverControl != this.hoverControl) {
        if (dragHoverControl) {
          if (this.currentControl == dragHoverControl) {
            dragHoverControl.bubbleFire("dragLeave", { mousePos: ev.mousePos });
          }
        }
        if (this.hoverControl) {
          if (this.currentControl != this.hoverControl) {
            this.hoverControl.bubbleFire("dragEnter", { mousePos: ev.mousePos });
          }
        }
        dragHoverControl = this.hoverControl;
      }
      if (this.operate == "selectActive") {
        this.selectList.forEach((el) => {
          if (el != this.currentControl) {
            el.bubbleFire("drag", { mousePos: ev.mousePos, movePos: ev.movePos });
          }
        });
      }
    });
    drag.on(DragEventType.END, (ev) => {
      if (this.currentControl) {
        this.currentControl.bubbleFire("end", { mousePos: ev.mousePos });
      }
    });

    this.on("start", (ev) => {
      this.setOperate("select");
    });
    this.on("drag", (ev) => {
      if (this.operate == "select") {
        this.selectRect = this.calcRect(this.pinPos, ev.mousePos);
        //mithril.redraw();
      }
    });
    this.on("release", (ev) => {
      if (this.operate == "select") {
        this.setOperate("selectActive");
      }
    });
  }
  calcRect(startPos, endPos) {
    const minPos = Vector.min(startPos, endPos);
    const maxPos = Vector.max(startPos, endPos);
    return [...minPos, ...Vector.sub(maxPos, minPos)];
  }
  setOperate(operate) {
    const rectCollisionRect = (pos0, size0, pos1, size1) => {
      return (
        pos0[0] <= pos1[0] + size1[0] &&
        pos1[0] <= pos0[0] + size0[0] &&
        pos0[1] <= pos1[1] + size1[1] &&
        pos1[1] <= pos0[1] + size0[1]
      );
    };
    const rectHitTest = (pos, size, collisionGraph) => {
      if (collisionGraph.type == "rect") {
        return rectCollisionRect(pos, size, collisionGraph.pos, collisionGraph.size);
      }
    };
    if (this.operate != operate) {
      const oldOperate = this.operate;
      this.operate = operate;
      if (oldOperate == "select") {
      } else if (oldOperate == "selectActive") {
        this.selectList.forEach((el) => el.fire("unselect"));
      }
      this.fire("changeOperate", operate, oldOperate);
      if (operate == "select") {
        this.selectRange = this.currentControl ? this.currentControl.children : [];
        this.selectRect = this.calcRect(this.mousePos, this.mousePos);
      } else if (operate == "selectActive") {
        this.selectRect = this.calcRect(this.pinPos, this.mousePos);
        const pos = this.selectRect.slice(0, 2);
        const size = this.selectRect.slice(2, 4);
        this.selectList = this.selectRange.filter(
          (el) => el.has("select") && rectHitTest(pos, size, el.collisionGraph)
        );
        if (this.selectList.length) {
          this.selectList.forEach((el) => el.fire("select"));
        } else {
          this.setOperate("");
        }
      }
    }
  }
}
