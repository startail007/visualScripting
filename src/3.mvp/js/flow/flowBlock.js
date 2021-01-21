import * as FlowBox from "./flowBox";
import { objEventDrag } from "../../../js/mithrilSupply";
import mithril from "mithril";
import * as FlowPut from "./flowPut";
import { arrayRemove } from "../../../js/supply";
export class Model extends FlowBox.Model {
  constructor() {
    super();
    this.inputs = [];
    this.outputs = [];
    this.inputsValue = [];
    this.type = "";
  }
  addInput(component) {
    this.inputs.push(component);
    this.inputsValue.push(undefined);
  }
  removeInput(component) {
    arrayRemove(this.inputs, component, (index) => {
      this.inputsValue.splice(index, 1);
    });
  }
  getInputs() {
    return this.inputs.slice();
  }
  getInput(n) {
    return this.inputs[n];
  }
  addOutput(component) {
    this.outputs.push(component);
  }
  removeOutput(component) {
    arrayRemove(this.outputs, component);
  }
  getOutputs() {
    return this.outputs.slice();
  }
  getOutput(n) {
    return this.outputs[n];
  }
  setInputValue(n, val) {
    this.inputsValue[n] = val;
  }
  /*getInputValue(n) {
    return this.inputsValue[n];
  }*/
  getInputsValue() {
    return this.inputsValue.slice();
  }
  setType(val) {
    this.type = val;
  }
  getType() {
    return this.type;
  }
}
export class Presenter extends FlowBox.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.on("action", (target, data, src) => {
      this.setInputValue(target.model.getIndex(), data);
      target.setState("active", true);
      if (this.model.getType() == "Flow") {
        this.triggerReset();
      }
      const bool = this.calcExports(this.model.getInputsValue()) ?? true;
      //if (bool) {
      this.model.getInputs().forEach((el) => {
        if (el.model.getType() == "Exec") {
          this.setInputValue(el.model.getIndex(), undefined);
          el.setState("active", false);
        }
      });
      //}
    });
    this.view.vnodeTitle("flowBlock");
    this.triggerID = undefined;
  }
  flowRun() {
    this.triggerReset();
    this.calcExports(this.model.getInputsValue());
  }
  calcExports(inputsValue) {}
  addInput(name, index, type) {
    if (type == "Exec") {
      this.model.setType("Flow");
    }
    const component = new FlowPut.Presenter();
    component.setProperty(name, index, type);
    this.model.addInput(component);
    component.setParent(this);
    this.update();
  }
  removeInput(component) {
    this.model.removeInput(component);
    this.update();
  }
  addOutput(name, index, type) {
    if (type == "Exec") {
      this.model.setType("Flow");
    }
    const component = new FlowPut.Presenter();
    component.setProperty(name, index, type);
    this.model.addOutput(component);
    component.setParent(this);
    this.update();
  }
  removeOutput(component) {
    this.model.removeOutput(component);
    this.update();
  }
  trigger(n, data) {
    const put = this.model.getOutput(n);
    if (put.model.getType() == "Exec") {
      this.setState("active", true);
      put.model.getLines().forEach((el) => {
        el.setState("active", true);
      });
      clearTimeout(this.triggerID);
      this.triggerID = setTimeout(() => {
        this.setState("active", false);
        put.model.getLines().forEach((el) => {
          el.setState("active", false);
        });
      }, 2000);
    }
    put.setState("active", true);
    put.model.getRelevanceList().forEach((el) => {
      el.model.getParent().fire("action", el, data, put);
    });
    if (put.model.getType() == "Exec") {
      put.setState("active", false);
    }
  }
  triggerFire(n, data) {
    this.triggerReset();
    this.trigger(n, data);
  }
  setInputValue(n, data) {
    this.model.setInputValue(n, data);
  }
  triggerReset() {
    const temp = new Set();
    this.model.getOutputs().forEach((el, index) => {
      el.setState("active", false);
      el.model.getRelevanceList().forEach((el) => {
        el.setState("active", false);
        const component = el.model.getParent();
        component.setInputValue(el.model.getIndex(), undefined);
        temp.add(component);
      });
    });
    Array.from(temp).forEach((el) => {
      if (el.model.getType() != "Flow") {
        el.triggerReset();
      }
    });
  }
  viewUpdate() {
    this.view.vnodeInputs(this.model.getInputs());
    this.view.vnodeOutputs(this.model.getOutputs());
    this.view.vnodeChildren(this.model.getChildren());
    this.view.render();
    this.model.getInputs().forEach((el) => {
      el.model.getLines().forEach((el) => {
        el.viewUpdate();
      });
    });
    this.model.getOutputs().forEach((el) => {
      el.model.getLines().forEach((el) => {
        el.viewUpdate();
      });
    });
  }
  selectStart() {
    if (!this.model.getState("select")) {
      const component = this.model.getParent();
      component.setOperate("");
      const select = component.model.getSelect();
      select.setSelectList([this]);
      component.setOperate("selectActive");
    }
  }
  selectMove(move) {
    const component = this.model.getParent();
    component.fire("selectDrag", move);
  }
  removeInputLines(n) {
    const put = this.model.getInput(n);
    if (put) {
      const parent = this.model.getParent();
      put.model.getLines().forEach((el) => {
        parent.removeLine(el);
      });
    }
  }
  removeOutputLines(n) {
    const put = this.model.getOutput(n);
    if (put) {
      const parent = this.model.getParent();
      put.model.getLines().forEach((el) => {
        parent.removeLine(el);
      });
    }
  }
}
export class View extends FlowBox.View {
  constructor(presenter) {
    super(presenter);
    this.inputs = [];
    this.outputs = [];
    this.title = null;
  }
  init() {
    this.class = "flowBlock";
  }
  vnodeInputs(inputs) {
    this.inputs = inputs.map((el) => el.view.vnode);
  }
  vnodeOutputs(outputs) {
    this.outputs = outputs.map((el) => el.view.vnode);
  }
  vnodeTitle(title) {
    this.title = title;
  }
  viewVnode(content) {
    const vnode = [
      mithril("div.title", this.title),
      mithril("div.content", [
        mithril("div.inputs", this.inputs),
        mithril("div.slots", content ?? this.children),
        mithril("div.outputs", this.outputs),
      ]),
    ];
    return super.viewVnode(vnode);
  }
  eventsVnode() {
    return {
      onclick: () => {
        //this.presenter.movePos([100, 0]);
        //this.presenter.removeOutputLines(1);
      },
      ...objEventDrag({
        start: () => {
          this.presenter.selectStart();
        },
        drag: (ev) => {
          this.presenter.selectMove(ev.movePos);
        },
      }),
    };
  }
}
