import * as FlowBox from "./flowBox";
import { objEventDrag } from "../../../js/mithrilSupply";
import mithril from "mithril";
import * as FlowPut from "./flowPut";
import { arrayRemove } from "../../../js/supply";
export class Model extends FlowBox.Model {
  init() {
    super.init();
    this.inputs = [];
    this.outputs = [];
    this.inputsValue = [];
    this.type = "";
    this.title = "";
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
  getInputsValue() {
    return this.inputsValue.slice();
  }
  setType(val) {
    this.type = val;
  }
  getType() {
    return this.type;
  }
  setTitle(val) {
    this.title = val;
  }
  getTitle() {
    return this.title;
  }
  getAllChildren() {
    return [...this.inputs, ...this.outputs, ...this.children];
  }
}
export class Presenter extends FlowBox.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.model.addClass("flowBlock");
    this.view.vnodeClass(this.model.getClass());
    this.model.setTitle("flowBlock");
    this.view.vnodeTitle(this.model.getTitle());
  }
  setMain(main) {
    super.setMain(main);
    //const main = this.model.getMain();
    this.model.getInputs().forEach((el) => {
      el.setMain(main);
    });
    this.model.getOutputs().forEach((el) => {
      el.setMain(main);
    });
  }
  addInput(name, index, type) {
    if (type == "Exec") {
      this.model.setType("Flow");
    }
    const component = new FlowPut.Presenter();
    component.setProperty(name, index, type, "in");
    this.model.addInput(component);
    component.setParent(this);
    //component.model.setMain(this.model.getMain());
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
    component.setProperty(name, index, type, "out");
    this.model.addOutput(component);
    component.setParent(this);
    //component.model.setMain(this.model.getMain());
    this.update();
  }
  removeOutput(component) {
    this.model.removeOutput(component);
    this.update();
  }
  triggerReset() {
    const temp = new Set();
    this.model.getOutputs().forEach((el, index) => {
      el.setState("active", false);
      el.model.getRelevanceList().forEach((el) => {
        el.setState("active", false);
        const component = el.model.getParent();
        component.model.setInputValue(el.model.getIndex(), undefined);
        temp.add(component);
      });
    });
    Array.from(temp).forEach((el) => {
      if (el.model.getType() != "Flow") {
        el.triggerReset();
      }
    });
  }
  valTrigger(n, data) {
    const put = this.model.getOutput(n);
    put.setActive(1000);
    put.model.getRelevanceList().forEach((el) => {
      el.model.getParent().valAction(el, data, put);
    });
  }
  valAction(target, data, src) {
    this.model.setInputValue(target.model.getIndex(), data);
    target.setActive(1000);
    this.valExports();
  }
  valExports() {}
  execTrigger(n) {
    const put = this.model.getOutput(n);
    put.setActive(500);
    put.model.getRelevanceList().forEach((el) => {
      el.model.getParent().execAction(el, put);
    });

    this.setActive(500);
    put.model.getLines().forEach((el) => {
      el.setActive(500);
    });
  }
  execAction(target, src) {
    target.setActive(500);
    this.execExports();
  }
  execExports() {}
  getAllChildren() {
    return this.model.getAllChildren();
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
  removeInputLines(n) {
    const put = this.model.getInput(n);
    if (put) {
      const main = this.model.getMain();
      const graph = main.model.getGraph();
      put.model.getLines().forEach((el) => {
        graph.removeLine(el);
      });
    }
  }
  removeOutputLines(n) {
    const put = this.model.getOutput(n);
    if (put) {
      const main = this.model.getMain();
      const graph = main.model.getGraph();
      put.model.getLines().forEach((el) => {
        graph.removeLine(el);
      });
    }
  }
  event_dragstart(ev) {
    if (!this.model.getState("select")) {
      const main = this.model.getMain();
      main.setOperate("selectStart");
      const graph = main.model.getGraph();
      const select = graph.model.getSelect();
      select.setSelectList([this]);
      main.setOperate("selectEnd");
    }
  }
  event_drag(ev) {
    const main = this.model.getMain();
    const graph = main.model.getGraph();
    graph.fire("selectDrag", ev.movePos);
  }
  event_onmouseover(ev) {
    //console.log("aaaa");
    //ev.stopPropagation();
  }
}
export class View extends FlowBox.View {
  init() {
    super.init();
    this.inputs = [];
    this.outputs = [];
    this.title = null;
  }
  vnodeInputs(inputs) {
    this.inputs = inputs.map((el) => el.view.vnode);
  }
  vnodeOutputs(outputs) {
    this.outputs = outputs.map((el) => el.view.vnode);
  }
  vnodeTitle(title) {
    this.title = mithril("div", title);
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
      onmousedown: objEventDrag({
        start: this.presenter.event_dragstart.bind(this.presenter),
        drag: this.presenter.event_drag.bind(this.presenter),
      }),
      onmouseover: this.presenter.event_onmouseover.bind(this.presenter),
    };
  }
}
