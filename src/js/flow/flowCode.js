import Listener from "../listener";
import { completeAssign } from "../objectSupply";
import * as Components from "./components";

export default class FlowCode extends Listener {
  constructor() {
    super();
    this.list = [];
    //this.connectList = [];
    this.valueList = {};
  }
  addValue(name, value) {
    const obj = { name, value, list: [], type: value.constructor.name };
    this.valueList[name] = obj;
    this.fire("addValue", obj);
    return obj;
  }
  getValueList(name) {
    return this.valueList[name].list;
  }
  getValue(name) {
    return this.valueList[name].value;
  }
  setValue(name, val) {
    this.valueList[name].value = val;
    this.valueList[name].list.forEach((el) => {
      el.resetOutputs();
      el.nextFlow();
    });
    this.fire("setValue", this.valueList[name]);
  }
  addComponent(name, properties) {
    properties = completeAssign({ componentName: name }, properties ?? {});
    const component = new Components[`components_${name}`](properties);
    component.init(this);
    this.list.push(component);
    return component;
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
        outComponent.resetOutputs();
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
      inComponent.resetOutputs();
      this.fire("unconnect", outComponent, outNum, inComponent, inNum);
    }
  }
}
