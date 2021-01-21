import FlowCodeComponent from "./flowCodeComponent";
import { completeAssign } from "../../../js/objectSupply";

export class component_getValue extends FlowCodeComponent {
  init(root) {
    super.init(root);
    const data = root.valueList[this.properties.refName];
    root.valueList.on("change", (key, val, oldVal) => {
      if (this.properties.refName == key) {
        this.nextFlow();
      }
    });
    this.addOutput("val", data.constructor.name);
  }
  calcOutputs(valueList) {
    this.setOutputValue(0, this.getValue());
  }
  getValue() {
    return this.root.getValue(this.properties.refName);
  }
}

export class component_setValue extends FlowCodeComponent {
  constructor(properties = {}) {
    super(properties);
    this.type = "flow";
  }
  init(root) {
    super.init(root);
    this.properties.value = this.properties.value ?? root.getValue(this.properties.refName);
    this.addInput("in0", "Exec");
    this.addInput("in1", "Number");
    this.addOutput("out0", "Exec");
    this.on("action", () => {
      root.setValue(this.properties.refName, this.getInputValue(1) ?? this.properties.value);
      this.trigger(0);
    });
  }
}
export class component_add extends FlowCodeComponent {
  init(root) {
    super.init(root);
    this.addInput("num0", "Number");
    this.addInput("num1", "Number");
    this.addOutput("sum", "Number");
  }
  calcOutputs(valueList) {
    if (valueList[0] === undefined || valueList[1] === undefined) {
      return false;
    }
    this.setOutputValue(0, valueList[0] + valueList[1]);
  }
}
export class component_watch extends FlowCodeComponent {
  init(root) {
    super.init(root);
    this.addInput("val", "Number");
  }
  calcOutputs(valueList) {}
}
export class component_ticker extends FlowCodeComponent {
  constructor(properties = {}) {
    super(properties);
    this.type = "flow";
  }
  init(root) {
    super.init(root);
    this.addOutput("out0", "Exec");
    setInterval(() => {
      this.trigger(0);
    }, 1000);
  }
}

export class component_branch extends FlowCodeComponent {
  constructor(properties = {}) {
    super(properties);
    this.type = "flow";
  }
  init(root) {
    super.init(root);
    this.addInput("in0", "Exec");
    this.addInput("bool", "Boolean");
    this.addOutput("true", "Exec");
    this.addOutput("false", "Exec");
    this.addOutput("out", "Number");
    this.on("action", (n, src) => {
      if (this.getInputValue(1) !== undefined) {
        this.trigger(this.getInputValue(1) ? 0 : 1);
      }
    });
  }
  calcOutputs(valueList) {
    if (valueList[1] === undefined) {
      return false;
    }
    this.setOutputValue(2, valueList[1] ? 1 : 0);
  }
}

export class component_box extends FlowCodeComponent {
  constructor(properties = {}) {
    super(properties);
    this.type = "flow";
  }
  init(root) {
    super.init(root);
    this.addInput("in", "Exec");
    this.addOutput("out", "Exec");
    this.on("action", (n, src) => {
      this.trigger(0);
    });
  }
}
export class component_button extends FlowCodeComponent {
  constructor(properties = {}) {
    super(properties);
    this.type = "flow";
  }
  init(root) {
    super.init(root);
    this.addOutput("out0", "Exec");
  }
}
