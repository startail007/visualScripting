import FlowGraphComponent from "./flowGraphComponent";
import mithril from "mithril";

export class components_getValue extends FlowGraphComponent {
  getTitle() {
    return [super.getTitle(), mithril("div", `變數 ${this.code.properties.refName}`)];
  }
  getSlots() {
    return mithril("div.refvalue", `${this.code.properties.value}`);
  }
}
export class components_setValue extends FlowGraphComponent {
  getTitle() {
    return [super.getTitle(), mithril("div", `變數 ${this.code.properties.refName}`)];
  }
  getSlots() {
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
export class components_add extends FlowGraphComponent {}
export class components_watch extends FlowGraphComponent {
  getSlots() {
    return mithril("div.text", {
      textContent: this.code.getInputValue(0),
    });
  }
}
export class components_ticker extends FlowGraphComponent {}
export class components_branch extends FlowGraphComponent {}
export class components_box extends FlowGraphComponent {}
export class components_button extends FlowGraphComponent {
  getSlots() {
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
  }
}
