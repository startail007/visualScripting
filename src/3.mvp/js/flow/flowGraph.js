import * as FlowBox from "./flowBox";
import * as FlowSelect from "./flowSelect";
import * as FlowPutLine from "./flowPutLine";
import * as FlowConnectLine from "./flowConnectLine";
import mithril from "mithril";
import { arrayRemove } from "../../../js/supply";
import { observable } from "../../../js/observable";
export class Model extends FlowBox.Model {
  init() {
    super.init();
    this.lines = [];
    this.select = null;
    this.connectLine = null;
    this.values = {};
  }
  addLine(component) {
    this.lines.push(component);
  }
  removeLine(component) {
    arrayRemove(this.lines, component);
  }
  getLines() {
    return this.lines.slice();
  }

  setSelect(component) {
    this.select = component;
  }
  getSelect() {
    return this.select;
  }
  setConnectLine(component) {
    this.connectLine = component;
  }
  getConnectLine() {
    return this.connectLine;
  }
  addValue(key, val) {
    this.values[key] = observable(val);
  }
  removeValue(key) {
    this.values[key].unnotification();
    delete this.values[key];
  }
  setValue(key, val) {
    this.values[key](val);
  }
  getValue(key) {
    return this.values[key]();
  }
  addValueNotification(key, callback) {
    this.values[key].notification(callback);
  }
  removeValueNotification(key, callback) {
    this.values[key].unnotification(callback);
  }
}
export class Presenter extends FlowBox.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);

    this.model.addClass("flowGraph");
    this.view.vnodeClass(this.model.getClass());
    const select = new FlowSelect.Presenter();
    select.setParent(this);
    this.model.setSelect(select);

    const connectLine = new FlowConnectLine.Presenter();
    connectLine.setParent(this);
    this.model.setConnectLine(connectLine);

    this.on("selectDrag", (move) => {
      this.model.getSelect().selectRun((el) => {
        el.movePos(move);
      });
    });
  }
  setMain(main) {
    super.setMain(main);

    this.model.getSelect().setMain(main);
    this.model.getConnectLine().setMain(main);
  }
  addValue(key, val) {
    this.model.addValue(key, val);
  }
  removeValue(key) {
    this.model.removeValue(key);
  }

  createLine(output, input) {
    const component = new FlowPutLine.Presenter();
    component.connection(output, input);
    component.setParent(this);
    component.setMain(this.model.getMain());
    return component;
  }
  connect(outComponent, outNum, inComponent, inNum) {
    const output = outComponent.model.getOutput(outNum);
    const input = inComponent.model.getInput(inNum);

    const component = this.createLine(output, input);
    this.addLine(component);
    outComponent.valExports();
  }
  addLine(component) {
    const output = component.model.getOutput();
    const input = component.model.getInput();

    output.addRelevance(input);
    output.model.addLine(component);
    input.model.addLine(component);
    this.model.addLine(component);
  }
  removeLine(component) {
    const output = component.model.getOutput();
    const input = component.model.getInput();

    output.removeRelevance(input);
    output.model.removeLine(component);
    input.model.removeLine(component);
    this.model.removeLine(component);

    //output.model.getParent().model.setInputValue(output.model.getIndex(), undefined);
    //output.setState("active", false);
    //const outComponent = output.model.getParent();
    //outComponent.valExports();

    input.model.getParent().model.setInputValue(input.model.getIndex(), undefined);
    input.setState("active", false);
    input.model.getParent().triggerReset();
  }
  getAllChildren() {
    return [...this.model.getLines(), ...this.model.getChildren(), this.model.getSelect(), this.model.getConnectLine()];
  }
  viewUpdate() {
    this.view.vnodeLines(this.model.getLines());
    this.view.vnodeChildren(this.model.getChildren());
    this.view.vnodeSelect(this.model.getSelect());
    this.view.vnodeConnectLine(this.model.getConnectLine());
    this.view.render();
  }
  addChild(component) {
    component.setMain(this.model.getMain());
    super.addChild(component);
  }
  ondragstart(ev) {
    const select = this.model.getSelect();
    select.dragstart(ev.locPos);
  }
  ondrag(ev) {
    const select = this.model.getSelect();
    select.drag(ev.locPos);
  }
  ondragend(ev) {
    const select = this.model.getSelect();
    select.dragend(this.model.getChildren());
  }
  onbundle(ev) {
    if (ev.bundleVerification == "newComponent") {
      return this;
    }
  }
}
export class View extends FlowBox.View {
  init() {
    super.init();
    this.lines = [];
    this.select = null;
    this.connectLine = null;
  }
  vnodeSelect(select) {
    this.select = select.view.vnode;
  }
  vnodeConnectLine(connectLine) {
    this.connectLine = connectLine.view.vnode;
  }
  vnodeLines(lines) {
    this.lines = lines.map((el) => el.view.vnode);
  }
  viewVnode(content) {
    const vnode = [
      mithril("svg.svg", { width: "100%", height: "100%" }, this.lines),
      mithril("div.boxs", content ?? this.children),
      mithril(
        "div.front",
        [this.select, this.connectLine].filter((el) => el)
      ),
    ];
    return super.viewVnode(vnode);
  }
}
