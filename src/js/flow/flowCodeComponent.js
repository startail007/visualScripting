import { completeAssign } from "../objectSupply";
import Listener from "../listener";
export default class FlowCodeComponent extends Listener {
  constructor(properties = {}) {
    super();
    this.properties = {};
    completeAssign(this.properties, properties);
    this.type = "";
    this.root = null;
    this.inputList = [];
    this.outputList = [];
    this.outputsComplete = false;
  }
  init(root) {
    this.root = root;
    this.on("action", () => {
      this.resetOutputs();
      this.nextFlow(true);
    });
  }
  addInput(name, type) {
    this.inputList.push({ name, type, connectList: [], data: undefined });
  }
  addOutput(name, type) {
    this.outputList.push({ name, type, connectList: [], data: { bool: false, value: undefined } });
  }
  removeInputConnect(n) {
    this.resetOutputs();
    const input = this.inputList[n];
    input.connectList.forEach((el) => {
      const output = el.component.outputList[el.num];
      output.connectList = output.connectList.filter((el) => {
        return el.component != this || el.num != n;
      });
      input.data = null;
    });
    input.connectList = [];
    this.root.connectList = this.root.connectList.filter((el) => {
      return el.input.component != this || el.input.num != n;
    });
  }
  getInputValue(n) {
    return this.inputList[n]?.data?.value;
  }
  getOutputValue(n) {
    return this.outputList[n]?.data?.value;
  }
  getInputBool(n) {
    return this.inputList[n]?.data?.bool;
  }
  getOutputBool(n) {
    return this.outputList[n]?.data?.bool;
  }
  setOutputValue(n, val) {
    const output = this.outputList[n]?.data;
    if (output) [output.value, output.bool] = [val, true];
  }
  trigger(n) {
    const output = this.outputList[n];
    if (output.type == "Exec") {
      this.fire("trigger", n, output);
      output.connectList.forEach((el) => {
        el.component.fire("action", el.num, { component: this, num: n });
      });
    }
  }
  getOutputComponent() {
    return new Set(this.outputList.flatMap((el) => el.connectList.map((el) => el.component)));
  }
  resetOutputs() {
    this.outputsComplete = false;
    this.outputList.forEach((el) => {
      if (el.data.bool) {
        el.data.bool = false;
        el.data.value = undefined;
      }
    });
    this.getOutputComponent().forEach((el) => {
      if (el.type != "flow") {
        el.resetOutputs();
      }
    });
  }
  calcOutputs(valueList) {}
  nextFlow(pass = false) {
    if (!this.outputsComplete) {
      if (pass || this.type != "flow") {
        const valueList = this.inputList.map((el) => el?.data?.value);
        const bool = this.calcOutputs(valueList) ?? true;
        if (bool) {
          this.outputsComplete = true;
          this.fire("outputsComplete");
          this.getOutputComponent().forEach((el) => {
            el.nextFlow();
          });
        }
      }
    }
  }
  onExecute() {}
}
