import FlowGraphLine from "./flowGraphLine";
import * as GraphComponents from "./graphComponents";
import mithril from "mithril";
import FlowCode from "./flowCode";
import FlowControl from "./flowControl";
import { completeAssign } from "../objectSupply";
import FlowGraphBasic from "./flowGraphBasic";
class FlowValueMenu extends FlowGraphBasic {
  constructor() {
    super();
    this.root = null;
    this.data = null;
    this.refName = "";
  }
  setData(data) {
    this.data = data;
  }
  view(vnode) {
    return mithril("div.valueMenuItem", [
      mithril("div.name", `${this.self.data.name}`),
      mithril("input.inputText", {
        type: "text",
        value: this.data.value,
        onmousedown: (ev) => {
          ev.stopPropagation();
        },
        oninput: (ev) => {
          const value = ev.currentTarget.value;
          if (value !== "") {
            if (this.data.type == "Number") {
              this.root.setValue(this.refName, parseFloat(value));
            }
          }
        },
        onblur: (ev) => {
          if (ev.currentTarget.value === "") {
            this.root.setValue(this.refName, this.data.value);
          }
        },
      }),
    ]);
  }
}
export default class FlowGraph {
  constructor(selector) {
    this.root = document.querySelector(selector);
    this.time = 0;
    this.code = null;
    this.connectList = [];
    this.connectLine = {};
    this.graphLine = new FlowGraphLine();

    this.menu = {
      valueList: {},
      flowGraphList: [],
    };

    this.selectList = [];
    this.selectRange = [];
    this.operate = "";

    this.control = new FlowControl(this.root);
    this.control.on("start", (ev) => {
      this.setOperate("select");
    });
    this.control.on("drag", (ev) => {
      if (this.operate == "select") {
        mithril.redraw();
      } else if (this.operate == "selectActive") {
        this.selectList.forEach((el) => {
          el.bubbleFire("selectDrag", ev);
        });
      } else if (this.operate == "connectLine") {
        this.graphLine.endPos = ev.mousePos;
      }
    });
    this.control.on("end", (ev) => {
      if (this.operate == "select") {
        this.setOperate("selectActive");
      } else if (this.operate == "connectLine") {
        this.setOperate("");
      }
    });

    this.setCode(new FlowCode());
    const loop = (time) => {
      requestAnimationFrame(loop);
      this.time = time;
      this.code.list.forEach((el) => el.properties.graph.onExecute(time));
      this.connectList.forEach((el) => el.onExecute(time));
    };
    loop();
  }
  setOperate(operate) {
    if (this.operate != operate) {
      const oldOperate = this.operate;
      this.operate = operate;
      if (oldOperate == "select") {
      } else if (oldOperate == "selectActive") {
        this.selectList.forEach((el) => el.fire("unselect"));
      } else if (oldOperate == "connectLine") {
        this.connectLine = {};
      }
      if (operate == "select") {
        this.selectRange = this.control.currentControl ? this.control.currentControl.children : [];
      } else if (operate == "selectActive") {
        const pos = this.control.dragRect.pos;
        const size = this.control.dragRect.size;
        this.selectList = this.selectRange.filter((el) => el.has("select") && el.rectHitTest(pos, size));
        if (this.selectList.length) {
          this.selectList.forEach((el) => el.fire("select"));
        } else {
          this.setOperate("");
        }
      } else if (operate == "connectLine") {
        const output = this.connectLine.output;
        this.graphLine.startPos = output.component.getOutputPos(output.num);
        this.graphLine.endPos = this.control.mousePos;
      }
      mithril.redraw();
    }
  }
  addControl(item) {
    this.control.add(item);
    this.control.children.sort((a, b) => b.src.zindex - a.src.zindex);
  }
  setCode(code) {
    this.code = code;
    this.code.on("setValue", (data) => {
      data.list.forEach((el) => {
        el.properties.graph.update();
      });
      this.menu.valueList[data.name].redraw = true;
      mithril.redraw();
    });
    this.code.on("connect", (outComponent, outNum, inComponent, inNum) => {
      outComponent = outComponent.properties.graph;
      inComponent = inComponent.properties.graph;
      const component = new FlowGraphLine();
      component.root = this;
      component.connect(outComponent, outNum, inComponent, inNum);
      this.connectList.push(component);
      component.startPos = outComponent.getOutputPos(outNum);
      component.endPos = inComponent.getInputPos(inNum);
      if (inComponent.type != "flow") {
        outComponent.update();
      }
    });
    this.code.on("unconnect", (outComponent, outNum, inComponent, inNum) => {
      outComponent = outComponent.properties.graph;
      inComponent = inComponent.properties.graph;
      outComponent.outputLineList[outNum] = outComponent.outputLineList[outNum].filter((el) => {
        const input = el.input;
        return input.component != inComponent || input.num != inNum;
      });
      inComponent.inputLineList[inNum] = inComponent.inputLineList[inNum].filter((el) => {
        const output = el.output;
        return output.component != outComponent || output.num != inNum;
      });
      this.connectList = this.connectList.filter((el) => {
        return (
          el.output.component != outComponent ||
          el.output.num != outNum ||
          el.input.component != inComponent ||
          el.input.num != inNum
        );
      });
      mithril.redraw();
    });
    const operateComponent = {
      view: () => {
        if (this.operate == "select") {
          return mithril("div.selectRect", {
            style: {
              left: `${this.control.dragRect.pos[0]}px`,
              top: `${this.control.dragRect.pos[1]}px`,
              width: `${this.control.dragRect.size[0]}px`,
              height: `${this.control.dragRect.size[1]}px`,
            },
          });
        } else if (this.operate == "connectLine") {
          return mithril("svg.connectLine", { width: "100%", height: "100%" }, [mithril(this.graphLine)]);
        }
      },
    };
    const rootComponent = {
      view: () => [
        mithril(
          "svg.svg",
          { width: "100%", height: "100%" },
          this.connectList.map((el) => mithril(el, { key: el.id }))
        ),
        mithril(
          "div.flowgraphs",
          this.code.list.map((el) => mithril(el.properties.graph, { key: el.properties.graph.id }))
        ),
        mithril("div.sideMenu", [
          mithril("div", [
            mithril("div.title", "變數"),
            mithril(
              "div.content",
              Object.values(this.menu.valueList).map((el) => mithril(el))
            ),
          ]),
          mithril("div", [mithril("div.title", "指令"), mithril("div.content")]),
        ]),
        mithril("div.front", [mithril(operateComponent)]),
      ],
    };
    mithril.mount(this.root, rootComponent);
  }
  addValue(name, value) {
    const data = this.code.addValue(name, value);
    const component = new FlowValueMenu();
    component.root = this;
    component.refName = name;
    component.setData(data);
    this.menu.valueList[name] = component;
  }
  setValue(name, val) {
    this.code.setValue(name, val);
  }
  getValue(name) {
    return this.code.getValue(name);
  }
  addComponent(name, properties, style) {
    const code = this.code.addComponent(name, properties);
    const component = new GraphComponents[`components_${name}`](code, style);
    component.init(this);
    return component;
  }
  connect(outComponent, outNum, inComponent, inNum) {
    this.code.connect(outComponent.code, outNum, inComponent.code, inNum);
  }
  unconnect(outComponent, outNum, inComponent, inNum) {
    this.code.unconnect(outComponent.code, outNum, inComponent.code, inNum);
  }
}
