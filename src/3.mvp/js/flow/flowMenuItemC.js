import { Vector } from "../../../js/vector";
import * as FlowBox from "./flowBox";
import * as Components from "./flowComponentExtension";
import mithril from "mithril";
export class Model extends FlowBox.Model {
  init() {
    super.init();
    this.title = "";
    this.component = null;
  }
  setTitle(val) {
    this.title = val;
  }
  getTitle() {
    return this.title;
  }
  setComponentClass(val) {
    this.component = val;
  }
  getComponentClass() {
    return this.component;
  }
}
export class Presenter extends FlowBox.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.model.addClass("flowMenuItemC");
    this.view.vnodeClass(this.model.getClass());
  }
  setProperties(properties) {
    super.setProperties(properties);
    this.model.setTitle(this.model.getProperty("title"));
    this.model.setComponentClass(this.model.getProperty("component"));
    this.view.vnodeTitle(this.model.getTitle());
  }
  ondragstart(ev) {
    ev.setBundleVerification("newComponent");
  }
  ondrag(ev) {}
  ondragend(ev) {
    if (ev.bundle) {
      const componentClass = this.model.getComponentClass();
      const main = this.model.getMain();
      const graph = main.model.getGraph();
      const component = new componentClass.Presenter();
      component.setProperties({ refName: this.model.getProperty("refName") });
      graph.addChild(component);
      const graphLoc = graph.view.getLoc();
      component.setPos(Vector.sub(ev.mousePos, graphLoc));
    }
    //console.log("newnewnewnew", ev.bundle);
  }
}
export class View extends FlowBox.View {
  init() {
    super.init();
    this.title = null;
  }
  vnodeTitle(title) {
    this.title = mithril("div", title);
  }
  viewVnode(content) {
    return super.viewVnode(this.title);
  }
}
