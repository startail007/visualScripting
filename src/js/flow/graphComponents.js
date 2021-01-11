import FlowGraphComponent from "./flowGraphComponent";
import { completeAssign } from "../objectSupply";
import mithril from "mithril";

export class components_getValue extends FlowGraphComponent {
  constructor(properties, style) {
    //style = completeAssign({ size: [100, 70] }, style);
    super(properties, style);
  }
  setCode(code) {
    super.setCode(code);
    this.slotsRedraw = true;
    const slots = {
      onupdate: () => {
        this.slotsRedraw = false;
      },
      view: (vnode) => {
        //console.log(this, "sss");
        return mithril("div.refvalue", [
          mithril("div.index", `變數 ${this.code.properties.refIndex}`),
          mithril("input.inputText", {
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
          }),
        ]);
      },
    };
    this.slots.push(slots);
  }
  /*createControl() {
    const control = super.createControl();
    console.log(control);
    return control;
  }*/
}
export class components_setValue extends FlowGraphComponent {
  setCode(code) {
    super.setCode(code);
    this.slotsRedraw = true;
    const slots = {
      onupdate: () => {
        this.slotsRedraw = false;
      },
      view: (vnode) => {
        return mithril("div.refvalue", [
          mithril("div.index", `變數 ${this.code.properties.refIndex}`),
          mithril("input.inputText", {
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
          }),
        ]);
      },
    };
    this.slots.push(slots);
    //console.log(data);
    this.code.on("action", () => {
      this.code.root.valueList[this.code.properties.refIndex].list.forEach((el) => {
        el.properties.graph.update();
      });
    });
  }
}
export class components_add extends FlowGraphComponent {}
export class components_watch extends FlowGraphComponent {
  setCode(code) {
    super.setCode(code);
    this.slotsRedraw = true;
    const slots = {
      onupdate: () => {
        this.slotsRedraw = false;
      },
      view: (vnode) => {
        return mithril("div.text", {
          textContent: this.code.getInputValue(0),
        });
      },
    };
    this.slots.push(slots);
  }
  onExecute(time) {
    super.onExecute(time);
    //console.log(this.code.inputList[0].streamData());
  }
}
export class components_ticker extends FlowGraphComponent {
  /*setCode(code) {
    super.setCode(code);
    this.code.on("trigger", (n, output) => {
      this._activeTime = this.code.root.time;
      console.log(n, output);
    });
  }*/
}
export class components_branch extends FlowGraphComponent {
  onExecute(time) {
    super.onExecute(time);
  }
  setCode(code) {
    super.setCode(code);
    this.code.on("action", (n, src) => {
      //console.log(n, src);
    });
  }
}
export class components_box extends FlowGraphComponent {
  /*setCode(code) {
    super.setCode(code);
    this.slotsRedraw = true;
    let count = 0;
    const slots = {
      onbeforeupdate: () => {
        count++;
      },
      onupdate: () => {
        this.slotsRedraw = false;
      },
      view(vnode) {
        return mithril("div", count);
      },
    };
    this.slots.push(slots);
  }*/
}

export class components_button extends FlowGraphComponent {
  setCode(code) {
    super.setCode(code);
    this.slotsRedraw = true;
    const slots = {
      onupdate: () => {
        this.slotsRedraw = false;
      },
      view: (vnode) => {
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
          "button"
        );
      },
    };
    this.slots.push(slots);
  }
}
