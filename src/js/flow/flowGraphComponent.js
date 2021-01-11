import { Vector, VectorE } from "../vector";
import mithril from "mithril";
import FlowGraphVnode from "./flowGraphVnode";
import FlowGraphBasic from "./flowGraphBasic";
import * as Components from "./components";
import { completeAssign } from "../objectSupply";
import { getElementSize } from "../elementSupply";
import FlowControlComponent from "./flowControlComponent";

class FlowGraphPutsComponent extends FlowGraphVnode {
  view(vnode) {
    return mithril(
      "div",
      { class: vnode.attrs.class },
      vnode.attrs._list.map((el, index) => {
        return mithril("div", { class: `item ${vnode.attrs._list[index].type}` }, [
          mithril("div", { class: "point" }),
          mithril("div", { class: "text", textContent: vnode.attrs._list[index].name }),
        ]);
      })
    );
  }
}
class FlowGraphSlot extends FlowGraphVnode {
  view(vnode) {
    //console.log("view");
    return vnode.attrs._vnodeList.map((el) => mithril(el));
  }
}
export default class FlowGraphComponent extends FlowGraphBasic {
  constructor(properties = {}, style = {}) {
    super();
    this.inputLineList = [];
    this.outputLineList = [];

    this.putsRedraw = false;

    this.slots = [];
    this.slotsRedraw = false;

    this.style = { pos: [0, 0], size: [undefined, undefined], zindex: undefined };
    completeAssign(this.style, style);

    completeAssign(properties, { graph: this });
    this.control = null;
    this.setCode(new Components[`components_${properties.componentName}`](properties));
  }
  oncreate(vnode) {
    const size = getElementSize(vnode.dom);
    size[0] = this.self.style.size[0] ?? size[0];
    size[1] = this.self.style.size[1] ?? size[1];
    this.self.element = vnode.dom;
    this.self.size = size;
  }
  init(root) {
    this.root = root;
    this.root.code.add(this.code);
    this.zindex = this.root.code.list.length;
    this.control = this.createControl();
    if (this.control) {
      this.root.addControl(this.control);
    }
  }
  createControl() {
    const main = new FlowControlComponent();
    main.setCollisionGraph({ type: "rect", pos: this.pos, size: this.size });
    main.src = this;
    main.on("start", (ev) => {
      this.root.setOperate("selectActive");
      ev.stopPropagation();
    });
    main.on("drag", (ev) => {
      if (this.root.operate == "selectActive") {
        if (this.select) {
          this.pos = Vector.add(this.pos, ev.movePos);
        }
      }
      ev.stopPropagation();
    });
    main.on("end", (ev) => {});
    main.on("select", (ev) => {
      this.select = true;
    });
    main.on("unselect", (ev) => {
      this.select = false;
    });
    main.on("enter", (ev) => {
      this.hover = true;
    });
    main.on("leave", (ev) => {
      this.hover = false;
    });
    const that = this;
    this.code.inputList.forEach((el, index) => {
      const sub = new FlowControlComponent();
      sub.setCollisionGraph({
        type: "rect",
        get pos() {
          return Vector.sub(that.getInputPos(index), [5, 5]);
        },
        get size() {
          return [10, 10];
        },
      });
      sub.on("start", (ev) => {
        ev.stopPropagation();
      });
      sub.on("release", (ev) => {
        if (this.root.operate == "connectLine") {
          //console.log(that.root.connectLine.input, that.root.connectLine.output);
          if (that.root.connectLine.input && that.root.connectLine.output) {
            const input = that.root.connectLine.input;
            const output = that.root.connectLine.output;
            const line = that.root.connect(output.component, output.num, input.component, input.num);
            if (line) {
              line.startPos = output.component.getOutputPos(output.num);
              line.endPos = input.component.getInputPos(input.num);
            }
          }
          that.root.connectLine = {};
          ev.stopPropagation();
          this.root.setOperate("");
        }
      });
      sub.on("dragEnter", (ev) => {
        if (this.root.operate == "connectLine") {
          console.log("拖曳滑入");
          that.root.connectLine.input = { component: that, num: index };
        }
      });
      sub.on("end", (ev) => {
        this.removeInputConnect(index);
        //console.log(this.code.inputList[index]);
        ev.stopPropagation();
      });
      main.add(sub);
    });
    this.code.outputList.forEach((el, index) => {
      const sub = new FlowControlComponent();
      sub.setCollisionGraph({
        type: "rect",
        get pos() {
          return Vector.sub(that.getOutputPos(index), [5, 5]);
        },
        get size() {
          return [10, 10];
        },
      });
      sub.on("start", (ev) => {
        this.root.setOperate("connectLine");
        this.root.graphLine.startPos = that.getOutputPos(index);
        this.root.graphLine.endPos = ev.mousePos;
        that.root.connectLine = {};
        ev.stopPropagation();
      });
      sub.on("drag", (ev) => {
        if (this.root.operate == "connectLine") {
          this.root.graphLine.endPos = ev.mousePos;
          ev.stopPropagation();
        }
      });
      sub.on("dragLeave", (ev) => {
        if (this.root.operate == "connectLine") {
          console.log("拖曳滑出");
          that.root.connectLine.output = { component: that, num: index };
        }
      });
      main.add(sub);
    });

    return main;
  }
  setCode(code) {
    this.code = code;
    this.code.on("trigger", (n, output) => {
      this._activeTime = this.root.time;
      if (this.outputLineList[n]) {
        this.outputLineList[n].forEach((el) => {
          el._activeTime = this.root.time;
        });
      }
    });
    this.code.on("action", (n, src) => {
      this._activeTime = this.root.time;
      this.update();
    });
    this.code.on("outputsComplete", (n, src) => {
      if (this.slots.length) {
        this.slotsRedraw = true;
      }
      this.update();
    });
  }
  calcStyleValue(val) {
    if (typeof val == "number") {
      return val + "px";
    } else {
      return val ?? "";
    }
  }
  calcStyle() {
    return {
      left: this.calcStyleValue(this.style.pos[0]),
      top: this.calcStyleValue(this.style.pos[1]),
      zIndex: this.style.zindex,
      width: this.calcStyleValue(this.style.size[0]),
      height: this.calcStyleValue(this.style.size[1]),
    };
  }
  view(vnode) {
    return mithril(
      "div.flowGraph",
      {
        key: this._id,
        class: `flow_${this.code.properties.componentName} 
        ${this.self._active ? "active" : ""} ${this.self._select ? "select" : ""} ${this.self._hover ? "hover" : ""}`,
        style: this.self.calcStyle(),
      },
      [
        mithril("div.title", { textContent: this.code.properties.title }),
        mithril("div.wrap", [
          mithril("div.content", [
            mithril(FlowGraphPutsComponent, {
              class: "inputs",
              _list: this.code.inputList,
              redraw: this.self.putsRedraw,
            }),
            mithril(
              "div.slotContent",
              mithril(FlowGraphSlot, { _vnodeList: this.self.slots, redraw: this.self.slotsRedraw })
            ),
            mithril(FlowGraphPutsComponent, {
              class: "outputs",
              _list: this.code.outputList,
              redraw: this.self.putsRedraw,
            }),
          ]),
        ]),
      ]
    );
  }
  getInputPos(n) {
    return Vector.add(this.style.pos, [10, 30 + 25 * (n + 0.5)]);
  }
  getOutputPos(n) {
    return Vector.add(this.style.pos, [this.style.size[0] - 10, 30 + 25 * (n + 0.5)]);
  }
  addInputLine(n, component) {
    if (!this.inputLineList[n]) {
      this.inputLineList[n] = [];
    }
    this.inputLineList[n].push(component);
  }
  addOutputLine(n, component) {
    if (!this.outputLineList[n]) {
      this.outputLineList[n] = [];
    }
    this.outputLineList[n].push(component);
  }
  removeInputConnect(n) {
    this.code.removeInputConnect(n);
    this.inputLineList[n].forEach((el) => {
      const line = el;
      const num = el.code.output.num;
      const output = el.code.output.component.properties.graph;
      output.outputLineList[num] = output.outputLineList[num].filter((el) => {
        return line != el;
      });
    });
    this.inputLineList[n] = [];
    mithril.redraw();
  }
  get zindex() {
    return this.style.zindex;
  }
  set zindex(val) {
    this.style.zindex = val;
    this.redraw = true;
    mithril.redraw();
  }
  get pos() {
    return this.style.pos;
  }
  set pos(val) {
    if (this.style.pos[0] !== val[0] || this.style.pos[1] !== val[1]) {
      VectorE.set(this.style.pos, ...val);
      this.redraw = true;
      mithril.redraw();
      this.updateLine();
    }
  }
  get size() {
    return this.style.size;
  }
  set size(val) {
    if (this.style.size[0] !== val[0] || this.style.size[1] !== val[1]) {
      VectorE.set(this.style.size, ...val);
      this.redraw = true;
      mithril.redraw();
      this.updateLine();
    }
  }
  get select() {
    return this._select;
  }
  set select(val) {
    if (this._select !== val) {
      this._select = val;
      this.redraw = true;
      mithril.redraw();
    }
  }
  get hover() {
    return this._hover;
  }
  set hover(val) {
    if (this._hover !== val) {
      this._hover = val;
      this.redraw = true;
      mithril.redraw();
    }
  }
  get dragHover() {
    return this._dragHover;
  }
  set dragHover(val) {
    if (this._dragHover !== val) {
      this._dragHover = val;
    }
  }
  updateLine() {
    this.inputLineList.forEach((el, index) => {
      if (el) {
        el.forEach((el) => {
          el.endPos = this.getInputPos(index);
        });
      }
    });
    this.outputLineList.forEach((el, index) => {
      if (el) {
        el.forEach((el) => {
          el.startPos = this.getOutputPos(index);
        });
      }
    });
  }
  update() {
    this.redraw = true;
    this.code.getOutputComponent().forEach((el) => {
      if (el.type != "flow") {
        el.properties.graph.update();
      }
    });
  }
}
