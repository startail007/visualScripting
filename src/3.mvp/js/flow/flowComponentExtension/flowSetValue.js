import * as FlowBlock from "../flowBlock";
export class Model extends FlowBlock.Model {}
export class Presenter extends FlowBlock.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.addInput("in", 0, "Exec");
    this.addInput("in", 1, "Number");
    this.addOutput("out", 0, "Exec");
    this.addOutput("out", 1, "Number");
    this.model.setTitle("setValue" + " " + this.property.refName);
    this.view.vnodeTitle(this.model.getTitle());
  }
  execExports() {
    const inputsValue = this.model.getInputsValue();
    if (inputsValue[1] !== undefined) {
      this.valTrigger(1, inputsValue[1]);
      const main = this.model.getMain();
      main.model.setValue(this.property.refName, inputsValue[1]);
    }
    this.execTrigger(0);
  }
}
export class View extends FlowBlock.View {}
