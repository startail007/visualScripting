import mithril from "mithril";
import { Float } from "../../../js/float";
import Listener from "../../../js/listener";
import { Vector, VectorE } from "../../../js/vector";
import {
  getElementSize,
  getElementPagePos,
  getElementTargetPos,
  setElementPos,
  setElementSize,
} from "../../../js/elementSupply";
import { observeObj } from "../../../js/objectSupply";
import { completeAssign } from "../../../js/objectSupply";
const pointCollisionRect = (pos0, pos1, size1) => {
  return pos0[0] <= pos1[0] + size1[0] && pos1[0] <= pos0[0] && pos0[1] <= pos1[1] + size1[1] && pos1[1] <= pos0[1];
};
const pointDeepHitTest = (mousePos, view) => {
  if (view && pointCollisionRect(mousePos, view.pos, view.size)) {
    for (let i = view.child.length - 1; i >= 0; i--) {
      const el = view.child[i];
      const temp = pointDeepHitTest(Vector.sub(mousePos, view.pos), el);
      if (temp) {
        return temp;
      }
    }
    return view;
  }
};
const bubbleLoop = (view, fun) => {
  if (view) {
    let bool = true;
    fun(view, {
      stopPropagation() {
        bool = false;
      },
    });
    if (bool) {
      bubbleLoop(view.parent, fun);
    }
  }
};
export default class FlowVnode extends Listener {
  constructor() {
    super();
    this._id = Float.guid();
    this.el = null;
    this._pos = [0, 0];
    this._size = [0, 0];
    this.parent = null;
    this.child = [];
    this.style = {};
    this._activeId = null;
    this._redraw = true;
    this.class = "";
    this.state = observeObj({ hover: false, active: false, select: false });
    this.state.on("change", (key, val, oldVal) => {
      this.redraw = true;
    });
    this.once("init", (vnode) => {});
    this.once("create", (vnode) => {
      this.el = vnode.dom;
      this.updateData();
    });
    this.on("beforeupdate", () => {
      return this._redraw;
    });
    this.on("update", () => {
      this._redraw = false;
    });
    this.on("view", () => {
      return this.viewVnode();
    });
    this.event = {};
  }
  reset() {
    this.once("update", () => {
      this.updateDataChild();
    });
    this.redraw = true;
  }
  oninit(vnode) {
    this.fire("init", vnode);
  }
  oncreate(vnode) {
    this.fire("create", vnode);
  }
  onbeforeupdate(vnode) {
    return this.get("beforeupdate");
  }
  onupdate(vnode) {
    this.fire("update", vnode);
  }
  view() {
    return this.get("view");
  }
  pointDeepHitTest(mousePos) {
    return pointDeepHitTest(mousePos, this);
  }
  bubbleLoop(fun) {
    bubbleLoop(this, fun);
  }
  bubbleFire(type, mainEv, ...data) {
    mainEv = mainEv ?? {};
    bubbleLoop(this, (el, ev) => {
      completeAssign(mainEv, { stopPropagation: ev.stopPropagation });
      el.fire(type, mainEv, ...data);
    });
  }
  init() {}
  add(component) {
    component.parent = this;
    this.child.push(component);
    component.init();
  }
  remove(component) {
    component.parent = null;
    this.child.find((el, index, array) => {
      if (el == component) {
        array.splice(index, 1);
        return true;
      }
    });
  }
  get id() {
    return this._id;
  }
  set redraw(val) {
    if (val) {
      this.bubbleLoop((el) => {
        el._redraw = val;
      });
    } else {
      this._redraw = val;
    }
    mithril.redraw();
  }
  get pos() {
    return this._pos;
  }
  get size() {
    return this._size;
  }
  set pos(val) {
    VectorE.set(this._pos, ...val);
    setElementPos(this, this._pos);
    this.redraw = true;
    this.fire("changeStyle");
  }
  set size(val) {
    VectorE.set(this._size, ...val);
    setElementSize(this, this._size);
    this.redraw = true;
    this.fire("changeStyle");
  }
  updateData(vnode) {
    const rect = this.el.getBoundingClientRect();
    VectorE.set(this._pos, rect.x, rect.y);
    if (this.parent) {
      const rect0 = this.parent.el.getBoundingClientRect();
      VectorE.sub(this._pos, [rect0.x, rect0.y]);
    }
    VectorE.set(this._size, rect.width, rect.height);
  }
  updateDataChild() {
    this.updateData();
    this.child.forEach((el) => {
      el.updateDataChild();
    });
    this.redraw = true;
    this.fire("changeStyle");
  }
  setActive() {
    clearTimeout(this._activeId);
    this.state.active = true;
    this._activeId = setTimeout(() => {
      this.state.active = false;
    }, 1000);
  }
  viewVnode(content) {
    return mithril(
      "div",
      {
        class: `${this.class} ${this.state.hover ? "hover" : ""} ${this.state.active ? "active" : ""} ${
          this.state.select ? "select" : ""
        }`,
        style: {
          left: this.style.left,
          top: this.style.top,
          width: this.style.width,
          height: this.style.height,
        },
        ...this.event,
      },
      content ?? this.child.map((el) => mithril(el, { key: el.id }))
    );
  }
}
