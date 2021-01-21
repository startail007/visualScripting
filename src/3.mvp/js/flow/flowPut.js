import * as FlowBox from "./flowBox";
import { objEventDrag } from "../../../js/mithrilSupply";
import mithril from "mithril";
import { arrayRemove } from "../../../js/supply";
export class Model extends FlowBox.Model {
  constructor() {
    super();
    this.data = { name: "", index: -1, type: "" };
    this.lines = [];
  }
  setData(name, index, type) {
    this.data.name = name;
    this.data.index = index;
    this.data.type = type;
  }
  getName() {
    return this.data.name;
  }
  getIndex() {
    return this.data.index;
  }
  getType() {
    return this.data.type;
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
}
export class Presenter extends FlowBox.Presenter {
  constructor() {
    super();
  }
  setProperty(name, index, type) {
    this.model.setData(name, index, type);
    this.view.vnodePoint(type);
    this.view.vnodeText(name);
  }
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
  }
  viewUpdate() {
    this.view.render();
  }
}
export class View extends FlowBox.View {
  init() {
    this.class = "flowPut";
    this.point = null;
    this.text = null;
  }
  eventsVnode() {
    return {
      ...objEventDrag({
        start: () => {},
      }),
    };
  }
  vnodePoint(type) {
    this.point = mithril("div.point", { class: type });
  }
  vnodeText(text) {
    this.text = mithril("div.text", text);
  }
  viewVnode(content) {
    const vnode = [this.point, this.text];
    return super.viewVnode(vnode);
  }
}
