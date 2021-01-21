import mithril from "mithril";
import { objEventDrag } from "../../../js/mithrilSupply";
import { VectorE } from "../../../js/vector";
import * as components from "./components";
import FlowCodeComponent from "./flowCodeComponent";
import FlowLine from "./flowLine";
import FlowViewComponent from "./flowViewComponent";
import FlowVnode from "./flowVnode";
export class FlowMenuValueButton extends FlowVnode {
  constructor(properties = {}) {
    super();
    this.properties = properties;
    this.class = "flowMenuValueButton";
  }
  init() {
    this.parent.code.valueList.on("change", (key, val, oldVal) => {
      this.redraw = true;
    });
  }
  setValue(val) {
    return this.parent.code.setValue(this.properties.refName, val);
  }
  getValue() {
    return this.parent.code.getValue(this.properties.refName);
  }
  viewVnode(content) {
    const vnode = [
      mithril("div.name", this.properties.refName),
      mithril("input.inputText", {
        type: "text",
        value: this.getValue(),
        onmousedown: (ev) => {
          ev.stopPropagation();
        },
        oninput: (ev) => {
          const value = ev.currentTarget.value;
          if (value !== "") {
            this.setValue(parseFloat(value));
          }
        },
        onblur: (ev) => {
          if (ev.currentTarget.value === "") {
            ev.currentTarget.value = this.getValue();
          }
        },
      }),
    ];
    return super.viewVnode(vnode);
  }
}

export class FlowMenu extends FlowVnode {
  constructor(properties = {}) {
    super();
    this.properties = properties;
    this.class = "flowMenu";
    this.menuList = [];
  }
  setCode(code) {
    this.code = code;
    this.code.valueList.on("add", (key, val) => {
      this.add(new FlowMenuValueButton({ refName: key }));
    });
  }
}
const rectCollisionRect = (pos0, size0, pos1, size1) => {
  return (
    pos0[0] <= pos1[0] + size1[0] &&
    pos1[0] <= pos0[0] + size0[0] &&
    pos0[1] <= pos1[1] + size1[1] &&
    pos1[1] <= pos0[1] + size0[1]
  );
};
export class FlowGraph extends FlowVnode {
  constructor(properties) {
    super(properties);
    this.class = "flowGraph";

    this.code = new FlowCodeComponent();
    this.mainMenu = new FlowMenu(properties);
    this.mainMenu.setCode(this.code);
    this.add(this.mainMenu);
    this.mainView = new FlowView(properties);
    this.mainView.setCode(this.code);
    this.add(this.mainView);
  }
  viewVnode(content) {
    const vnode = [mithril(this.mainMenu), mithril(this.mainView)];
    return super.viewVnode(vnode);
  }
  addValue() {
    this.mainView.addValue(...arguments);
  }
  addComponent(name, properties) {
    const component = new components[`component_${name}`](properties);
    this.mainView.add(component);
    return component;
  }
  connect(outComponent, outNum, inComponent, inNum) {
    this.mainView.connect(outComponent, outNum, inComponent, inNum);
  }
}
export class FlowView extends FlowViewComponent {
  constructor(properties) {
    super(properties);
    this.class = "flowView";
    this.operate = "";
    this.selectRange = null;
    this.selectList = [];
    this.dragRect = { pos: [0, 0], size: [0, 0] };
    this.connectLine = {};
    this.graphLine = new FlowLine();
    this.graphLine.parent = this;
    //this.add(this.graphLine);

    this.event = objEventDrag({
      start: (ev) => {
        this.setOperate("select", this.child);
        //console.log(ev.mousePos);
        VectorE.set(this.dragRect.pos, ...ev.locPos);
        VectorE.set(this.dragRect.size, 0, 0);
      },
      drag: (ev) => {
        if (this.operate == "select") {
          VectorE.set(this.dragRect.pos, ...ev.dragRect.pos);
          VectorE.set(this.dragRect.size, ...ev.dragRect.size);
          this.redraw = true;
        }
      },
      end: (ev) => {
        if (this.operate == "select") {
          VectorE.set(this.dragRect.pos, ...ev.dragRect.pos);
          VectorE.set(this.dragRect.size, ...ev.dragRect.size);
          this.setOperate("selectActive", ev.dragRect);
        }
      },
    });
    this.on("selectDrag", (ev) => {
      if (this.operate == "selectActive") {
        this.selectList.forEach((el) => {
          el.fire("selectDrag", ev);
        });
      }
    });
  }
  viewVnode(content) {
    const vnode = [
      mithril(
        "svg.svg",
        { width: "100%", height: "100%" },
        this.connectList.map((el) => mithril(el, { key: el.id }))
      ),
      mithril(
        "div.boxs",
        this.child.map((el) => mithril(el, { key: el.id }))
      ),
      mithril(
        "div.front",
        (() => {
          return [
            mithril("div.selectRect", {
              style: {
                display: this.operate == "select" ? undefined : "none",
                left: `${this.dragRect.pos[0]}px`,
                top: `${this.dragRect.pos[1]}px`,
                width: `${this.dragRect.size[0]}px`,
                height: `${this.dragRect.size[1]}px`,
              },
            }),
            mithril(
              "svg.connectLine",
              {
                style: {
                  display: this.operate == "connectLine" ? undefined : "none",
                },
                width: "100%",
                height: "100%",
              },
              [mithril(this.graphLine)]
            ),
          ];
        })()
      ),
    ];
    return super.viewVnode(vnode);
  }
  setOperate(operate, ...data) {
    if (this.operate != operate) {
      const oldOperate = this.operate;
      this.operate = operate;
      if (oldOperate == "select") {
      } else if (oldOperate == "selectActive") {
        this.selectList.forEach((el) => el.has("select") && el.fire("unselect"));
        this.selectList = [];
      } else if (oldOperate == "connectLine") {
        //this.connectLine = {};
      }
      if (operate == "select") {
        this.selectRange = data[0];
      } else if (operate == "selectActive") {
        if (!this.selectList.length) {
          const pos = data[0].pos;
          const size = data[0].size;
          this.selectList = this.selectRange.filter(
            (el) => el.has("select") && rectCollisionRect(el.pos, el.size, pos, size)
          );
        }
        if (this.selectList.length) {
          this.selectList.forEach((el) => el.fire("select"));
        } else {
          this.setOperate("");
        }
      } else if (operate == "connectLine") {
        this.connectLine.output = data[0];
        const pos = data[0].component.getOutputPos(data[0].num);
        this.graphLine.startPos = pos;
        this.graphLine.endPos = pos;
      } else if (operate == "connectLineEnd") {
        if (data[0]) {
          this.connectLine.input = data[0];
          const input = this.connectLine.input;
          const output = this.connectLine.output;
          this.connect(output.component, output.num, input.component, input.num);
        }
        this.setOperate("");
        //console.log("aaa");
      }
      this.redraw = true;
    }
  }
}
