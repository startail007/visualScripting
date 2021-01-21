import * as FlowBlock from "../flowBlock";
export class Model extends FlowBlock.Model {}
export class Presenter extends FlowBlock.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.addInput("in", 0, "Number");
    this._value = 0;
    this.view.vnodeTitle("watch");
  }
  calcExports(inputsValue) {
    if (inputsValue[0] == undefined) {
      return false;
    }
    this._value = inputsValue[0];
    console.log(inputsValue[0]);
  }
  getValue() {
    return this._value;
  }
}
export class View extends FlowBlock.View {
  viewVnode(content) {
    return super.viewVnode(this.presenter.getValue());
  }
}
