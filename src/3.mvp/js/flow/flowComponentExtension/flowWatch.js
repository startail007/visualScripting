import * as FlowBlock from "../flowBlock";
export class Model extends FlowBlock.Model {}
export class Presenter extends FlowBlock.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.addInput("in", 0, "Exec");
    this.addInput("in", 1, "Number");
    this.addOutput("out", 0, "Exec");
    this.model.setTitle("watch");
    this.view.vnodeTitle(this.model.getTitle());
  }
  setMain(main) {
    super.setMain(main);
    this._value = 0;
  }
  execExports() {
    const inputsValue = this.model.getInputsValue();
    if (inputsValue[1] !== undefined) {
      this._value = inputsValue[1];
    }
    this.execTrigger(0);
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
