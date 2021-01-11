import FlowGraphLine from "./flowGraphLine";
import * as GraphComponents from "./graphComponents";
import { DragEventType, Drag } from "../drag";
import { Vector, VectorE } from "../vector";
import mithril from "mithril";
import FlowCode from "./flowCode";
import FlowControlComponent from "./flowControlComponent";
import FlowControl from "./flowControl";
export default class FlowGraph {
  constructor(selector) {
    this.root = document.querySelector(selector);
    this.time = 0;
    this.code = null;

    this.connectLine = {};
    this.graphLine = new FlowGraphLine();

    this.control = new FlowControl(this.root);
    this.control.on("drag", (ev) => {
      if (this.control.operate == "select") {
        mithril.redraw();
      }
    });
    this.control.on("changeOperate", (operate, oldOperate) => {
      mithril.redraw();
    });
    this.control.on("release", (ev) => {
      if (this.operate == "connectLine") {
        this.control.setOperate("");
      }
    });

    this.setCode(new FlowCode());
    const loop = (time) => {
      requestAnimationFrame(loop);
      this.time = time;
      this.code.list.forEach((el) => el.properties.graph.onExecute(time));
      this.code.connectList.forEach((el) => el.properties.graph.onExecute(time));
    };
    loop();
  }
  get operate() {
    return this.control.operate;
  }
  setOperate(operate) {
    this.control.setOperate(operate);
  }
  addControl(item) {
    this.control.add(item);
    this.control.children.sort((a, b) => b.src.zindex - a.src.zindex);
  }
  setCode(code) {
    this.code = code;
    const operateComponent = {
      view: () => {
        if (this.control.operate == "select") {
          return mithril("div.selectRect", {
            style: {
              left: `${this.control.selectRect[0]}px`,
              top: `${this.control.selectRect[1]}px`,
              width: `${this.control.selectRect[2]}px`,
              height: `${this.control.selectRect[3]}px`,
            },
          });
        } else if (this.control.operate == "connectLine") {
          return mithril("svg.connectLine", { width: "100%", height: "100%" }, [mithril(this.graphLine)]);
        }
      },
    };
    const rootComponent = {
      view: () => [
        mithril(
          "svg.svg",
          { width: "100%", height: "100%" },
          this.code.connectList.map((el) => mithril(el.properties.graph, { key: el.properties.graph.id }))
        ),
        mithril(
          "div.flowgraphs",
          this.code.list.map((el) => mithril(el.properties.graph, { key: el.properties.graph.id }))
        ),
        mithril("div.front", [mithril(operateComponent)]),
      ],
    };
    mithril.mount(this.root, rootComponent);
  }
  createValue(name, value) {
    this.code.addValue(name, value);
  }
  setValue(n, val) {
    this.code.setValue(n, val);
    this.code.getValueList(n).forEach((el) => {
      el.properties.graph.update();
    });
    mithril.redraw();
  }
  getValue(n) {
    return this.code.getValue(n);
  }
  addComponent(name, properties, style) {
    const component = new GraphComponents[`components_${name}`](properties, style);
    component.init(this);
    return component;
  }
  connect(outComponent, outNum, inComponent, inNum) {
    const output = outComponent.code.outputList[outNum];
    const input = inComponent.code.inputList[inNum];
    if (output.type == input.type) {
      if (output.type != "Exec") {
        if (input.connectList.length) {
          inComponent.removeInputConnect(inNum);
        }
      }
      const component = new FlowGraphLine();
      component.root = this;
      component.connect(outComponent, outNum, inComponent, inNum);
      this.code.addConnect(component.code);
      return component;
    }
  }
}
