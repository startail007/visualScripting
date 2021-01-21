import mithril from "mithril";
import FlowCodeComponent from "./flowCodeComponent";
import FlowViewBox from "./FlowViewBox";

export class codeComponent_getValue extends FlowCodeComponent {
  init() {
    this.parent.valueList.on("change", (key, val, oldVal) => {
      if (this.properties.refName == key) {
        this.nextFlow();
      }
    });
    this.addOutput("val", "Number");
  }
  calcOutputs(valueList) {
    this.setOutputValue(0, this.getValue());
  }
  getValue() {
    return this.parent.getValue(this.properties.refName);
  }
}
export class component_getValue extends FlowViewBox {
  init() {
    this.setCode(new codeComponent_getValue(this.properties));
  }
  titleVnode() {
    return "getValue";
  }
  slotsVnode() {
    return this.parent.getValue(this.code.properties.refName);
  }
}

export class codeComponent_watch extends FlowCodeComponent {
  init() {
    this.addInput("val", "Number");
  }
  calcOutputs(valueList) {}
}
export class component_watch extends FlowViewBox {
  init() {
    this.setCode(new codeComponent_watch(this.properties));
  }
  titleVnode() {
    return "watch";
  }
  slotsVnode() {
    return this.code.getInputValue(0);
  }
}
export class codeComponent_add extends FlowCodeComponent {
  init() {
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
export class component_add extends FlowViewBox {
  init() {
    this.setCode(new codeComponent_add(this.properties));
  }
  titleVnode() {
    return "add";
  }
}

export class codeComponent_button extends FlowCodeComponent {
  constructor(properties = {}) {
    super(properties);
    this.type = "flow";
  }
  init() {
    this.addOutput("out0", "Exec");
  }
}

export class component_button extends FlowViewBox {
  init() {
    this.setCode(new codeComponent_button(this.properties));
  }
  titleVnode() {
    return "button";
  }
  slotsVnode() {
    return mithril(
      "button",
      {
        onmousedown: (ev) => {
          ev.stopPropagation();
        },
        onclick: () => {
          this.code.trigger(0);
        },
      },
      "按鈕"
    );
  }
}

export class codeComponent_setValue extends FlowCodeComponent {
  constructor(properties = {}) {
    super(properties);
    this.type = "flow";
  }
  init() {
    this.properties.value = this.properties.value ?? this.parent.getValue(this.properties.refName);
    this.addInput("in0", "Exec");
    this.addInput("in1", "Number");
    this.addOutput("out0", "Exec");
    this.on("action", () => {
      this.parent.setValue(this.properties.refName, this.getInputValue(1) ?? this.properties.value);
      this.trigger(0);
    });
  }
}

export class component_setValue extends FlowViewBox {
  init() {
    this.setCode(new codeComponent_setValue(this.properties));
    this.once("create", (vnode) => {
      if (this.code.getInputCount(1)) {
        this.reset();
      }
    });
  }
  titleVnode() {
    return "setValue";
  }
  slotsVnode() {
    if (this.code.getInputCount(1) <= 0) {
      return mithril("input.inputText", {
        type: "text",
        value: this.code.properties.value,
        onmousedown: (ev) => {
          ev.stopPropagation();
        },
        oninput: (ev) => {
          const value = ev.currentTarget.value;
          if (value !== "") {
            this.code.properties.value = parseFloat(value);
          }
        },
        onblur: (ev) => {
          if (ev.currentTarget.value === "") {
            ev.currentTarget.value = this.code.properties.value;
          }
        },
      });
    }
  }
}
