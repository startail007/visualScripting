import * as FlowBox from "./flowBox";
import * as FlowMenuItem from "./flowMenuItem";
export class Model extends FlowBox.Model {}
export class Presenter extends FlowBox.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.model.addClass("flowMenu");
    this.view.vnodeClass(this.model.getClass());
  }
  addChild(component) {
    component.setMain(this.model.getMain());
    super.addChild(component);
  }
  setMain(main) {
    super.setMain(main);
    /*const item = new FlowMenuItem.Presenter();
    this.addChild(item);
    this.addChild(item);
    this.addChild(item);
    this.addChild(item);*/
  }
}
export class View extends FlowBox.View {}
