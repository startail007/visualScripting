import Listener from "../../../js/listener";
import mithril from "mithril";
import { Vector, VectorE } from "../../../js/vector";
import { ElementMouseCompose, getElementPos, getElementSize, getElementPagePos } from "../../../js/elementSupply";
import { completeAssign } from "../../../js/objectSupply";
import { Float } from "../../../js/float";
import FlowCodeComponent from "./flowCodeComponent";
import * as Components from "./components";

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
export class FlowViewBasic extends Listener {
  constructor() {
    super();
    this.el = null;
    this.parent = null;
    this.child = [];
    this._pos = [0, 0];
    this._size = [0, 0];
    this._id = Float.guid();
    this.style = {};
    this.class = "flowViewBasic";
    this.hover = false;
    this.on("init", (vnode) => {});
    this.on("create", (vnode) => {
      this.el = vnode.dom;
      this.updateData();
    });
    this.on("view", () => {
      return this.viewVnode();
    });
  }
  viewVnode(content) {
    return mithril(
      "div",
      {
        class: `${this.class} ${this.hover ? "hover" : ""}`,
        style: {
          left: this.style.left,
          top: this.style.top,
          width: this.style.width,
          height: this.style.height,
        },
      },
      content ?? this.child.map((el) => mithril(el, { key: el.id }))
    );
  }
  oninit(vnode) {
    this.fire("init", vnode);
  }
  oncreate(vnode) {
    this.fire("create", vnode);
  }
  view() {
    return this.get("view");
  }
  updateData() {
    VectorE.set(this._pos, ...Vector.sub(getElementPagePos(this.el), this.parent ? this.parent._pos : [0, 0]));
    VectorE.set(this._size, ...getElementSize(this.el));
  }
  add(component) {
    this.child.push(component);
    component.parent = this;
  }
  pointDeepHitTest(mousePos) {
    return pointDeepHitTest(mousePos, this);
  }
  bubbleFire(type, mainEv, ...data) {
    mainEv = mainEv ?? {};
    bubbleLoop(this, (el, ev) => {
      completeAssign(mainEv, { stopPropagation: ev.stopPropagation });
      el.fire(type, mainEv, ...data);
    });
  }
  get pos() {
    return this._pos;
  }
  get size() {
    return this._size;
  }
  set pos(val) {
    VectorE.set(this._pos, ...val);
    this.style.left = `${this._pos[0]}px`;
    this.style.top = `${this._pos[1]}px`;
    mithril.redraw();
  }
  set size(val) {
    VectorE.set(this._size, ...val);
    this.style.width = `${this._size[0]}px`;
    this.style.height = `${this._size[1]}px`;
    mithril.redraw();
  }
  get id() {
    return this._id;
  }
}
export class FlowView extends FlowViewBasic {
  constructor() {
    super();
    this.class = "flowView";
    this.code = new FlowCodeComponent();
    this.code.properties.view = this;
  }
  viewVnode(content) {
    const vnode = mithril(
      "div.view",
      mithril(
        "div.boxs",
        this.child.map((el) => mithril(el, { key: el.id }))
      )
    );
    return super.viewVnode(vnode);
  }
  add(component) {
    super.add(component);
    this.code.list.push(component.code);
    console.log(this.code);
  }
}
export class FlowViewBox extends FlowViewBasic {
  constructor() {
    super();
    this.class = "flowViewBox";
    this.on("enter", () => {
      this.hover = true;
      mithril.redraw();
    });
    this.on("leave", () => {
      this.hover = false;
      mithril.redraw();
    });

    this.on("drag", (ev) => {
      this.pos = VectorE.add(this.pos, ev.movePos);
      mithril.redraw();
      ev.stopPropagation();
    });
  }
  viewVnode(content) {
    const vnode = [
      mithril("div.title", this.titleVnode()),
      mithril("div.wrap", [
        mithril("div.content", [
          mithril(
            "div.inputs",
            this.child.filter((el) => el.gate == "input").map((el) => mithril(el, { key: el.id }))
          ),
          mithril("div.slotContent", this.slotsVnode()),
          mithril(
            "div.outputs",
            this.child.filter((el) => el.gate == "output").map((el) => mithril(el, { key: el.id }))
          ),
        ]),
      ]),
    ];
    return super.viewVnode(vnode);
  }
  titleVnode() {
    return "";
  }
  slotsVnode() {
    return "";
  }
}

export class FlowViewPut extends FlowViewBasic {
  constructor(gate, type, data) {
    super();
    this.gate = gate;
    this.type = type;
    this.data = data;
    this.class = `flowViewPut ${this.type}`;
    this.on("enter", () => {
      this.hover = true;
      mithril.redraw();
    });
    this.on("leave", () => {
      this.hover = false;
      mithril.redraw();
    });
    this.on("drag", (ev) => {
      ev.stopPropagation();
    });
    this.on("dragEnter", (ev) => {
      console.log("拖曳滑入");
      ev.stopPropagation();
    });
    this.on("dragLeave", (ev) => {
      console.log("拖曳滑出");
      ev.stopPropagation();
    });
  }
  viewVnode(content) {
    const vnode = [mithril("div.point"), mithril("div.text", { textContent: this.data.name })];
    return super.viewVnode(vnode);
  }
}

export class component_getValue extends FlowViewBox {
  constructor() {
    super();
    const data = { name: "out" };
    this.code = new Components["component_getValue"]();
    this.code.properties.view = this;
    this.add(new FlowViewPut("output", "Number", data));
  }
  titleVnode() {
    return "getValue";
  }
  slotsVnode() {
    return "0";
  }
}
