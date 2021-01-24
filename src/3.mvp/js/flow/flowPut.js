import * as FlowBox from "./flowBox";
import { objEventDrag } from "../../../js/mithrilSupply";
import mithril from "mithril";
import { arrayRemove } from "../../../js/supply";
import { Vector, VectorE } from "../../../js/vector";
export class Model extends FlowBox.Model {
  init() {
    super.init();
    this.data = { name: "", index: -1, type: "", dir: "" };
    this.lines = [];
  }
  setData(name, index, type, dir) {
    this.data.name = name;
    this.data.index = index;
    this.data.type = type;
    this.data.dir = dir;
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
  getDir() {
    return this.data.dir;
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
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.model.addClass("flowPut");
    this.view.vnodeClass(this.model.getClass());
  }
  setProperty(name, index, type, dir) {
    this.model.setData(name, index, type, dir);
    this.view.vnodePoint(type);
    this.view.vnodeText(name);
  }
  getAllChildren() {
    return [];
  }
  viewUpdate() {
    this.view.render();
  }
  getPointPos() {
    const loc = this.view.getLoc();
    const size = this.view.getSize();
    const dir = this.model.getDir();
    if (dir == "in") {
      return Vector.add(loc, [10, 0.5 * size[1]]);
    } else {
      return Vector.add(loc, [size[0] - 10, 0.5 * size[1]]);
    }
  }
  event_dragstart(ev) {
    if (this.model.getDir() == "out") {
      const main = this.model.getMain();
      main.setOperate("connectLineStart", this, ev.mousePos);
    }
  }
  event_drag(ev) {
    const main = this.model.getMain();
    main.setOperate("connectLine", this, ev.mousePos);
  }
  event_dragend(ev) {
    const main = this.model.getMain();
    main.setOperate("connectLineEnd");
  }
  event_onmouseup() {
    const main = this.model.getMain();
    if (main.model.getOperate() == "connectLine") {
      if (this.model.getDir() == "in") {
        const graph = main.model.getGraph();
        const connectLine = graph.model.getConnectLine();
        connectLine.model.setInput(this);
        connectLine.update();
      }
    }
  }
}
export class View extends FlowBox.View {
  init() {
    super.init();
    this.point = null;
    this.text = null;
  }
  eventsVnode() {
    return {
      onmouseup: this.presenter.event_onmouseup.bind(this.presenter),
      onmousedown: objEventDrag({
        start: this.presenter.event_dragstart.bind(this.presenter),
        drag: this.presenter.event_drag.bind(this.presenter),
        end: this.presenter.event_dragend.bind(this.presenter),
      }),
    };
  }
  vnodePoint(type) {
    this.point = mithril("div.point", { class: type });
  }
  vnodeText(text) {
    this.text = mithril("div.text", text);
  }
  resetRect() {
    super.resetRect();
  }
  viewVnode(content) {
    const vnode = [this.point, this.text];
    return super.viewVnode(vnode);
  }
}
