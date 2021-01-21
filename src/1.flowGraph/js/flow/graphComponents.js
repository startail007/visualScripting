import FlowViewComponent from "./flowViewComponent";
import mithril from "mithril";

export class component_getValue extends FlowViewComponent {
  getTitle() {
    return [super.getTitle(), mithril("div", `變數 ${this.code.properties.refName}`)];
  }
  getSlots() {
    return mithril("div.refvalue", `${this.code.getValue()}`);
  }
}
export class component_setValue extends FlowViewComponent {
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
export class component_add extends FlowViewComponent {}
export class component_watch extends FlowViewComponent {
  getSlots() {
    return mithril("div.text", {
      textContent: this.code.getInputValue(0),
    });
  }
}
export class component_ticker extends FlowViewComponent {}
export class component_branch extends FlowViewComponent {}
export class component_box extends FlowViewComponent {}
export class component_button extends FlowViewComponent {
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
