import mithril from "mithril";
import * as FlowBlock from "../flowBlock";
export class Model extends FlowBlock.Model {
  init() {
    super.init();
    this.refName = "";
  }
  setRefName(val) {
    this.refName = val;
  }
  getRefName() {
    return this.refName;
  }
}
export class Presenter extends FlowBlock.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.addOutput("out", 0, "Number");
  }
  setProperties(properties) {
    super.setProperties(properties);
    this.model.setTitle("getValue" + " " + this.model.getProperty("refName"));
    this.view.vnodeTitle(this.model.getTitle());
  }
  setMain(main) {
    super.setMain(main);

    this._value = main.model.getValue(this.model.getProperty("refName"));
    main.model.addValueNotification(this.model.getProperty("refName"), (val) => {
      this._value = val;
      this.valTrigger(0, this._value);
    });
    this.valExports();
  }
  valExports() {
    this.valTrigger(0, this._value);
  }
  getValue() {
    return this._value;
  }
}
export class View extends FlowBlock.View {
  eventsVnode() {
    return {
      ...super.eventsVnode(),
      onclick: () => {
        //this.presenter.trigger(0, this.presenter._value);
        //this.presenter.flowRun();
        //const main = this.presenter.model.getMain();
        //main.model.setValue("a0", 200);
        //console.log("bbb");
        //this.vnode.instance.attrs.left = "0px";
        //this.setRedraw(true);
        //console.log(this.vnode);
      },
    };
  }
  viewVnode(content) {
    return super.viewVnode(this.presenter.getValue());
  }
}
