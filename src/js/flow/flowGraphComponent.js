import { Vector, VectorE } from "../vector";
import mithril from "mithril";
import FlowGraphVnode from "./flowGraphVnode";
import FlowGraphBasic from "./flowGraphBasic";
import { completeAssign } from "../objectSupply";
import { getElementSize } from "../elementSupply";
import FlowControlComponent from "./flowControlComponent";

class FlowGraphPutsComponent extends FlowGraphVnode {
  view(vnode) {
    return mithril(
      "div",
      { class: vnode.attrs.class },
      vnode.attrs._list.map((el, index) => {
        return mithril("div", { class: `item ${el.data.type} ${el.control.src.hover ? "hover" : ""}` }, [
          mithril("div", { class: "point" }),
          mithril("div", { class: "text", textContent: el.data.name }),
        ]);
      })
    );
  }
}
export default class FlowGraphComponent extends FlowGraphBasic {
  constructor(code, style = {}) {
    super();
    this.inputLineList = [];
    this.outputLineList = [];
    this.inputList = [];
    this.outputList = [];

    this.putsRedraw = false;

    this.style = { pos: [0, 0], size: [undefined, undefined], zindex: undefined };
    completeAssign(this.style, style);

    this.control = null;
    this.setCode(code);
  }
  oncreate(vnode) {
    this.self.element = vnode.dom;
    this.self.resize();
  }
  resize() {
    const size = getElementSize(this.element);
    size[0] = this.style.size[0] ?? size[0];
    size[1] = this.style.size[1] ?? size[1];
    this.size = size;
  }
  onupdate(vnode) {
    super.onupdate(vnode);
    this.self.putsRedraw = false;
  }
  init(root) {
    this.root = root;
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
      if (!this.select) {
        this.root.setOperate("");
        this.root.selectRange = [main];
        this.root.setOperate("selectActive");
      }
      if (main.parent) {
        main.parent.setTop(this.root.selectList);
      }
      ev.stopPropagation();
    });
    main.on("selectDrag", (ev) => {
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
    this.inputList = this.code.inputList.map((el, index) => {
      const sub = new FlowControlComponent();
      const data = { hover: false };
      const obj = {
        get hover() {
          return data.hover;
        },
        set hover(val) {
          data.hover = val;
          that.redraw = true;
          that.putsRedraw = true;
          mithril.redraw();
        },
      };
      sub.src = obj;
      sub.setCollisionGraph({
        type: "rect",
        get pos() {
          return Vector.sub(that.getInputPos(index), [5, 5]);
        },
        get size() {
          return [10, 10];
        },
      });
      sub.on("enter", (ev) => {
        obj.hover = true;
        ev.stopPropagation();
      });
      sub.on("leave", (ev) => {
        obj.hover = false;
        ev.stopPropagation();
      });
      sub.on("start", (ev) => {
        this.root.setOperate("");
        ev.stopPropagation();
      });
      sub.on("release", (ev) => {
        if (this.root.operate == "connectLine") {
          if (that.root.connectLine.input && that.root.connectLine.output) {
            const input = that.root.connectLine.input;
            const output = that.root.connectLine.output;
            that.root.connect(output.component, output.num, input.component, input.num);
          }
          this.root.setOperate("");
          ev.stopPropagation();
        }
      });
      sub.on("dragEnter", (ev) => {
        if (this.root.operate == "connectLine") {
          console.log("拖曳滑入");
          that.root.connectLine.input = { component: that, num: index };
          ev.stopPropagation();
        }
      });
      sub.on("click", (ev) => {
        this.removeInputConnect(index);
        ev.stopPropagation();
      });
      main.add(sub);
      return { control: sub, data: el };
    });
    this.outputList = this.code.outputList.map((el, index) => {
      const sub = new FlowControlComponent();
      const data = { hover: false };
      const obj = {
        get hover() {
          return data.hover;
        },
        set hover(val) {
          data.hover = val;
          that.redraw = true;
          that.putsRedraw = true;
          mithril.redraw();
        },
      };
      sub.src = obj;
      sub.setCollisionGraph({
        type: "rect",
        get pos() {
          return Vector.sub(that.getOutputPos(index), [5, 5]);
        },
        get size() {
          return [10, 10];
        },
      });
      sub.on("enter", (ev) => {
        obj.hover = true;
        ev.stopPropagation();
      });
      sub.on("leave", (ev) => {
        obj.hover = false;
        ev.stopPropagation();
      });
      sub.on("start", (ev) => {
        this.root.setOperate("");
        ev.stopPropagation();
      });
      sub.on("dragLeave", (ev) => {
        console.log("拖曳滑出");
        that.root.connectLine.output = { component: that, num: index };
        this.root.setOperate("connectLine");
        ev.stopPropagation();
      });

      sub.on("click", (ev) => {
        if (this.root.operate != "connectLine") {
          if (!that.root.connectLine.output) {
            this.removeOutputConnect(index);
            ev.stopPropagation();
          }
        }
      });
      main.add(sub);
      return { control: sub, data: el };
    });

    return main;
  }
  setCode(code) {
    this.code = code;
    this.code.properties.graph = this;
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
        mithril("div.title", this.self.getTitle()),
        mithril("div.wrap", [
          mithril("div.content", [
            mithril(FlowGraphPutsComponent, {
              class: "inputs",
              _list: this.self.inputList,
              redraw: this.self.putsRedraw,
            }),
            mithril("div.slotContent", this.self.getSlots()),
            mithril(FlowGraphPutsComponent, {
              class: "outputs",
              _list: this.self.outputList,
              redraw: this.self.putsRedraw,
            }),
          ]),
        ]),
      ]
    );
  }
  getTitle() {
    return mithril("div", { textContent: this.code.properties.title ?? this.code.properties.componentName });
  }
  getSlots() {}
  getInputPos(n) {
    return Vector.add(this.style.pos, [10, 30 + 25 * (n + 0.5)]);
  }
  getOutputPos(n) {
    return Vector.add(this.style.pos, [(this.style.size[0] ?? 0) - 10, 30 + 25 * (n + 0.5)]);
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
  }
  removeOutputConnect(n) {
    this.code.removeOutputConnect(n);
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
