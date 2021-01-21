import * as FlowBlock from "../flowBlock";
export class Model extends FlowBlock.Model {}
export class Presenter extends FlowBlock.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.addOutput("out", 0, "Number");
    this.view.vnodeTitle("getValue");
  }
  calcExports(inputsValue) {
    this.trigger(0, 1000);
  }
}
export class View extends FlowBlock.View {
  eventsVnode() {
    return {
      onclick: () => {
        //this.presenter.flowRun();
      },
      ...super.eventsVnode(),
    };
  }
}
