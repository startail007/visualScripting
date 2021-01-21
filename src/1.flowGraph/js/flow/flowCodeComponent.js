import Listener from "../../../js/listener";
import { completeAssign, observeObj } from "../../../js/objectSupply";
export default class FlowCodeComponent extends Listener {
  constructor(properties = {}) {
    super();
    this.properties = {};
    completeAssign(this.properties, properties);
    this.type = "";
    this.root = null;
    this.inputList = [];
    this.outputList = [];
    this.list = [];
    this.valueList = observeObj({});
    this.valueList.on("change", (key, val, oldVal) => {
      this.fire("setValue", key, val);
    });
  }
  init(root) {
    this.root = root;
    this.root.list.push(this);
    this.on("action", () => {
      this.nextFlow();
    });
  }
  addValue(name, val) {
    this.valueList.add(name, val);
    this.fire("addValue", name, val);
  }
  getValue(name) {
    return this.valueList[name];
  }
  setValue(name, val) {
    this.valueList[name] = val;
  }

  connect(outComponent, outNum, inComponent, inNum) {
    const output = outComponent.outputList[outNum];
    const input = inComponent.inputList[inNum];
    if (output.type == input.type) {
      if (output.type != "Exec") {
        if (input.connectList.length) {
          inComponent.removeInputConnect(inNum);
        }
      }
      input.connectList.push({ component: outComponent, num: outNum });
      output.connectList.push({ component: inComponent, num: inNum });
      if (output.type != "Exec") {
        input.data = output.data;
      }
      if (outComponent.type != "flow") {
        outComponent.nextFlow();
      }
      this.fire("connect", outComponent, outNum, inComponent, inNum);
    }
  }
  unconnect(outComponent, outNum, inComponent, inNum) {
    const output = outComponent.outputList[outNum];
    const input = inComponent.inputList[inNum];
    if (output && input) {
      output.connectList = output.connectList.filter((el) => {
        return el.component != inComponent || el.num != inNum;
      });
      input.connectList = input.connectList.filter((el) => {
        return el.component != outComponent || el.num != outNum;
      });
      input.data = null;
      inComponent.resetFlow();
      this.fire("unconnect", outComponent, outNum, inComponent, inNum);
    }
  }
  addInput(name, type) {
    this.inputList.push({ name, type, connectList: [], data: undefined });
  }
  addOutput(name, type) {
    this.outputList.push({ name, type, connectList: [], data: { value: undefined } });
  }
  removeInputConnect(n) {
    this.inputList[n].connectList.forEach((el) => {
      this.root.unconnect(el.component, el.num, this, n);
    });
  }
  removeOutputConnect(n) {
    this.outputList[n].connectList.forEach((el) => {
      this.root.unconnect(this, n, el.component, el.num);
    });
  }
  getInputValue(n) {
    return this.inputList[n]?.data?.value;
  }
  getOutputValue(n) {
    return this.outputList[n]?.data?.value;
  }
  setOutputValue(n, val) {
    const output = this.outputList[n]?.data;
    if (output) output.value = val;
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
  getValTriggerList(list = new Set()) {
    if (list.has(this)) {
      list.delete(this);
    }
    list.add(this);
    this.getOutputComponent().forEach((el) => {
      if (el.type != "flow") {
        el.getValTriggerList(list);
      }
    });
    return list;
  }
  getOutputComponent() {
    return new Set(this.outputList.flatMap((el) => el.connectList.map((el) => el.component)));
  }
  calcOutputs(valueList) {}
  resetFlow(list) {
    list = list ?? Array.from(this.getValTriggerList());
    list.forEach((el, index) => {
      el.outputList.forEach((el) => {
        el.data.bool = false;
        el.data.value = undefined;
      });
    });
  }
  nextFlow(list) {
    list = list ?? Array.from(this.getValTriggerList());
    this.resetFlow(list);
    list.every((el) => {
      const valueList = el.inputList.map((el) => el?.data?.value);
      const bool = el.calcOutputs(valueList) ?? true;
      if (bool) {
        el.fire("calcComplete");
      }
      return bool;
    });
  }
  onExecute() {}
}
