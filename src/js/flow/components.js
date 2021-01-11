import FlowCodeComponent from "./flowCodeComponent";
import { completeAssign } from "../objectSupply";

export class components_getValue extends FlowCodeComponent {
  constructor(properties) {
    properties = completeAssign({ title: "getValue" }, properties);
    super(properties);
  }
  init(root) {
    super.init(root);
    const that = this;
    completeAssign(this.properties, {
      get value() {
        return root.getValue(that.properties.refIndex);
      },
      set value(val) {
        root.setValue(that.properties.refIndex, val);
      },
    });
    const data = root.valueList[this.properties.refIndex];
    data.list.push(this);
    this.addOutput("val", data.type);
  }
  calcOutputs(valueList) {
    this.setOutputValue(0, this.properties.value);
  }
}

export class components_setValue extends FlowCodeComponent {
  constructor(properties) {
    properties = completeAssign({ title: "setValue" }, properties);
    super(properties);
    this.type = "flow";
  }
  init(root) {
    super.init(root);
    this.properties.value = this.properties.value ?? root.getValue(this.properties.refIndex);
    this.addInput("in0", "Exec");
    this.addInput("in1", "Number");
    this.addOutput("out0", "Exec");
    this.on("action", () => {
      root.setValue(this.properties.refIndex, this.getInputValue(1) ?? this.properties.value);
      this.trigger(0);
    });
  }
}
export class components_add extends FlowCodeComponent {
  constructor(properties) {
    properties = completeAssign({ title: "add" }, properties);
    super(properties);
  }
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
export class components_watch extends FlowCodeComponent {
  constructor(properties) {
    properties = completeAssign({ title: "watch" }, properties);
    super(properties);
  }
  init(root) {
    super.init(root);
    this.addInput("val", "Number");
  }
  calcOutputs(valueList) {
    //console.log(valueList);
  }
}
export class components_ticker extends FlowCodeComponent {
  constructor(properties) {
    properties = completeAssign({ title: "ticker" }, properties);
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

export class components_branch extends FlowCodeComponent {
  constructor(properties) {
    properties = completeAssign({ title: "branch" }, properties);
    super(properties);
    this.type = "flow";
  }
  calcOutputs(valueList) {
    if (valueList[1] === undefined) {
      return false;
    }
    this.setOutputValue(2, valueList[1] ? 1 : 0);
  }
  init(root) {
    super.init(root);
    this.addInput("in0", "Exec");
    this.addInput("bool", "Boolean");
    this.addOutput("true", "Exec");
    this.addOutput("false", "Exec");
    this.addOutput("out", "Number");
    this.on("action", (n, src) => {
      //console.log(this.inputList[1]);
      if (this.getInputBool(1)) {
        this.trigger(this.getInputValue(1) ? 0 : 1);
      }
    });
  }
}

export class components_box extends FlowCodeComponent {
  constructor(properties) {
    properties = completeAssign({ title: "box" }, properties);
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
export class components_button extends FlowCodeComponent {
  constructor(properties) {
    properties = completeAssign({ title: "button" }, properties);
    super(properties);
    this.type = "flow";
  }
  init(root) {
    super.init(root);
    this.addOutput("out0", "Exec");
  }
}
