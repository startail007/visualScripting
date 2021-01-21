import * as FlowBlock from "../flowBlock";
export class Model extends FlowBlock.Model {}
export class Presenter extends FlowBlock.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.addInput("in", 0, "Number");
    this.addInput("in", 1, "Number");
    this.addOutput("out", 0, "Number");
    this.view.vnodeTitle("add");
  }
  calcExports(inputsValue) {
    if (inputsValue[0] == undefined || inputsValue[1] == undefined) {
      return false;
    }
    this.trigger(0, inputsValue[0] + inputsValue[1]);
  }
}
export class View extends FlowBlock.View {}
