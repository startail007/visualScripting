import FlowVnode from "./flowVnode";
import { Vector } from "../../../js/vector";
import mithril from "mithril";
import FlowLine from "./flowLine";
import { objEventDrag } from "../../../js/mithrilSupply";

export default class FlowViewComponent extends FlowVnode {
  constructor(properties = {}) {
    super();
    this.properties = properties;
    this.class = "flowViewComponent";
    this.inputLineList = [];
    this.outputLineList = [];
    this.inputList = [];
    this.outputList = [];
    this.connectList = [];
    this.on("changeStyle", () => {
      this.updateLine();
    });
  }
  addValue(name, val) {
    this.code.addValue(name, val);
  }
  setValue(name, val) {
    this.code.setValue(name, val);
  }
  getValue(name) {
    return this.code.getValue(name);
  }
  connect(outComponent, outNum, inComponent, inNum) {
    this.code.connect(outComponent.code, outNum, inComponent.code, inNum);
  }
  unconnect(outComponent, outNum, inComponent, inNum) {
    this.code.unconnect(outComponent.code, outNum, inComponent.code, inNum);
  }
  setCode(code) {
    this.code = code;
    this.code.properties.view = this;
    if (this.parent) {
      this.parent.code.add(this.code);
      this.inputList = this.code.inputList.map((el, index) => {
        const put = new FlowViewPut({ gate: "input", data: el, index: index });
        this.add(put);
        put.event = {
          onmousedown: (ev) => {
            ev.stopPropagation();
          },
          onmouseup: (ev) => {
            if (this.parent.operate == "connectLine") {
              this.parent.setOperate("connectLineEnd", { component: this, num: put.properties.index });
              ev.stopPropagation();
            }
          },
        };

        return put;
      });
      this.outputList = this.code.outputList.map((el, index) => {
        const put = new FlowViewPut({ gate: "output", data: el, index: index });
        this.add(put);

        put.event = {
          ...objEventDrag({
            start: (ev) => {
              this.parent.setOperate("connectLine", { component: this, num: put.properties.index });
            },
            drag: (ev) => {
              this.parent.graphLine.endPos = Vector.add(Vector.add(ev.locPos, put.pos), this.pos);
            },
            end: () => {
              this.parent.setOperate("connectLineEnd");
            },
          }),
        };
        return put;
      });
      this.code.on("calcComplete", (n, src) => {
        this.reset();
      });
      this.code.on("trigger", (n, output) => {
        this.setActive();
        if (this.outputLineList[n]) {
          this.outputLineList[n].forEach((el) => {
            el.setActive(el);
          });
        }
      });
      this.code.on("action", (n, src) => {
        this.setActive();
      });
    }
    this.code.on("connect", (outComponent, outNum, inComponent, inNum) => {
      outComponent = outComponent.properties.view;
      inComponent = inComponent.properties.view;
      const component = new FlowLine();
      component.parent = this;
      component.connect(outComponent, outNum, inComponent, inNum);
      outComponent.addOutputLine(outNum, component);
      inComponent.addInputLine(inNum, component);
      this.connectList.push(component);
      //this.add(component);
      this.redraw = true;
      inComponent.reset();
      outComponent.reset();
    });
    this.code.on("unconnect", (outComponent, outNum, inComponent, inNum) => {
      outComponent = outComponent.properties.view;
      inComponent = inComponent.properties.view;
      const component =
        outComponent.findOutputLine(outNum, inComponent, inNum) ||
        inComponent.findInputLine(inNum, outComponent, outNum);
      outComponent.removeOutputLine(outNum, component);
      inComponent.removeInputLine(inNum, component);
      this.connectList = this.connectList.filter((el) => el != component);
      this.remove(component);
      this.redraw = true;
      inComponent.reset();
      outComponent.reset();
    });
  }
  getInputPos(n) {
    return Vector.add(Vector.add(this.pos, this.inputList[n].pos), [10, 0.5 * this.inputList[n].size[1]]);
  }
  getOutputPos(n) {
    return Vector.add(Vector.add(this.pos, this.outputList[n].pos), [
      this.outputList[n].size[0] - 10,
      0.5 * this.outputList[n].size[1],
    ]);
  }
  addInputLine(n, component) {
    if (!this.inputLineList[n]) {
      this.inputLineList[n] = [];
    }
    this.inputLineList[n].push(component);
  }
  removeInputLine(n, component) {
    if (this.inputLineList[n]) {
      this.inputLineList[n] = this.inputLineList[n].filter((el) => el != component);
    }
  }
  findInputLine(n, outComponent, outNum) {
    return this.inputLineList[n].find((el) => {
      const output = el.output;
      return output.component == outComponent && output.num == outNum;
    });
  }
  addOutputLine(n, component) {
    if (!this.outputLineList[n]) {
      this.outputLineList[n] = [];
    }
    this.outputLineList[n].push(component);
  }
  removeOutputLine(n, component) {
    if (this.outputLineList[n]) {
      this.outputLineList[n] = this.outputLineList[n].filter((el) => el != component);
    }
  }
  findOutputLine(n, inComponent, inNum) {
    return this.outputLineList[n].find((el) => {
      const input = el.input;
      return input.component == inComponent && input.num == inNum;
    });
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
  removeInputConnect(n) {
    this.code.removeInputConnect(n);
  }
  removeOutputConnect(n) {
    this.code.removeOutputConnect(n);
  }
}

export class FlowViewPut extends FlowViewComponent {
  constructor(properties) {
    super(properties);
    this.class = `flowViewPut ${this.properties.data.type}`;
  }
  viewVnode(content) {
    const vnode = [mithril("div.point"), mithril("div.text", { textContent: this.properties.data.name })];
    return super.viewVnode(vnode);
  }
}
