import * as FlowBox from "./flowBox";
import * as FlowGraph from "./flowGraph";
import * as FlowMenu from "./flowMenu";
import * as FlowMenuItem from "./flowMenuItem";
import { observable } from "../../../js/observable";
import { Vector, VectorE } from "../../../js/vector";
export class Model extends FlowBox.Model {
  init() {
    super.init();
    this.graph = null;
    this.menu = null;
    this.values = {};
    this.operate = "";
  }
  setGraph(component) {
    this.graph = component;
  }
  getGraph() {
    return this.graph;
  }
  setMenu(component) {
    this.menu = component;
  }
  getMenu() {
    return this.menu;
  }
  setOperate(val) {
    this.operate = val;
  }
  getOperate() {
    return this.operate;
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
    this.model.addClass("flowMain");
    this.view.vnodeClass(this.model.getClass());

    const graph = new FlowGraph.Presenter();
    graph.setParent(this);
    this.model.setGraph(graph);

    const menu = new FlowMenu.Presenter();
    menu.setParent(this);
    this.model.setMenu(menu);
  }
  setMain(main) {
    super.setMain(main);

    this.model.getGraph().setMain(this);
    this.model.getMenu().setMain(this);
  }
  setOperate(operate, ...data) {
    const oldOperate = this.model.getOperate();
    if (oldOperate != operate) {
      this.model.setOperate(operate);
    }
  }
  viewUpdate() {
    this.view.vnodeGraph(this.model.getGraph());
    this.view.vnodeMenu(this.model.getMenu());
    this.view.render();
  }
  getGraph() {
    return this.model.getGraph();
  }
  addValue(key, val) {
    this.model.addValue(key, val);

    const item = new FlowMenuItem.Presenter();
    item.setProperties({ refName: key });
    const menu = this.model.getMenu();
    menu.addChild(item);
  }
  removeValue(key) {
    this.model.removeValue(key);

    /*const item = new FlowMenuItem.Presenter({ refName: key });
    const menu = this.model.getMenu();
    menu.removeChild(item);*/
  }
}
export class View extends FlowBox.View {
  init() {
    super.init();
    this.graph = null;
    this.menu = null;
  }
  vnodeGraph(graph) {
    this.graph = graph.view.vnode;
  }
  vnodeMenu(menu) {
    this.menu = menu.view.vnode;
  }
  viewVnode(content) {
    const vnode = [this.menu, this.graph];
    return super.viewVnode(vnode);
  }
}
