export default class FlowCode {
  constructor() {
    this.list = [];
    this.connectList = [];
    this.valueList = [];
  }
  addValue(name, value) {
    this.valueList.push({ name, value, list: [], type: value.constructor.name });
  }
  getValueList(n) {
    return this.valueList[n].list;
  }
  getValue(n) {
    return this.valueList[n].value;
  }
  setValue(n, val) {
    this.valueList[n].value = val;
    this.valueList[n].list.forEach((el) => {
      el.resetOutputs();
      el.nextFlow();
    });
  }
  add(component) {
    component.init(this);
    this.list.push(component);
  }
  addConnect(component) {
    const outComponent = component.output.component;
    const inComponent = component.input.component;
    const output = outComponent.outputList[component.output.num];
    const input = inComponent.inputList[component.input.num];
    input.connectList.push(component.output);
    output.connectList.push(component.input);
    if (output.type != "Exec") {
      input.data = output.data;
    }
    if (inComponent.type != "type") {
      outComponent.resetOutputs();
      outComponent.nextFlow();
    }
    this.connectList.push(component);
  }
}
