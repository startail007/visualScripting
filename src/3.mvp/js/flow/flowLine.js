import * as FlowBox from "./flowBox";
import { Vector, VectorE } from "../../../js/vector";
import { Float } from "../../../js/float";
import mithril from "mithril";

export class Model extends FlowBox.Model {
  constructor() {
    super();
    this.output = null;
    this.input = null;
  }
  setOutput(component) {
    this.output = component;
  }
  getOutput() {
    return this.output;
  }
  setInput(component) {
    this.input = component;
  }
  getInput() {
    return this.input;
  }
}
export class Presenter extends FlowBox.Presenter {
  connection(output, input) {
    this.model.setOutput(output);
    this.model.setInput(input);
  }
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
  }
  viewUpdate() {
    const output = this.model.getOutput();
    const input = this.model.getInput();
    if (output.view.el && input.view.el) {
      const outputLoc = output.view.getLoc();
      const outputSize = output.view.getSize();
      const outputPos = output.model.getParent().model.getStyle().pos;

      const inputLoc = input.view.getLoc();
      const inputSize = input.view.getSize();
      const inputPos = input.model.getParent().model.getStyle().pos;
      this.view.vnodeLine(
        Vector.add(Vector.add(outputPos, outputLoc), [outputSize[0] - 10, 0.5 * outputSize[1]]),
        Vector.add(Vector.add(inputPos, inputLoc), [10, 0.5 * inputSize[1]])
      );
    }
    this.view.render();
  }
  removeSelf() {
    this.model.getParent().removeLine(this);
  }
}
export class View extends FlowBox.View {
  init() {
    this.class = "flowLine";
    this.d = null;
    this.center = [0, 0];
  }
  vnodeLine(startPos, endPos) {
    this.d = this.getLinePath(startPos, endPos);
    this.center = Vector.mix(startPos, endPos, 0.5);
    const s = 2;
    this.animation = new Array(5).fill().map((el, index, array) => {
      return mithril(
        "circle",
        { cx: 0, cy: 0, r: 5, fill: "rgb(219, 18, 18)" },
        mithril("animateMotion", {
          dur: s + "s",
          path: this.d,
          repeatCount: "indefinite",
          rotate: "auto",
          begin: `${s * ((index + 1) / array.length) - s}s`,
        })
      );
    });
  }
  viewVnode(content) {
    return [
      mithril("path.line", {
        d: this.d,
        class: `${this.class} ${this.state}`,
        style: { ...this.style },
        ...this.events,
      }),
      mithril(
        "g",
        {
          style: {
            display: /(\b|\s)active(\b|\s)/.test(this.state) ? undefined : "none",
          },
        },
        this.animation
      ),
      mithril("circle", {
        cx: this.center[0],
        cy: this.center[1],
        r: 10,
        fill: "#09c",
        onclick: () => {
          this.presenter.removeSelf();
        },
      }),
    ];
  }
  getLinePath(startPos, endPos) {
    const v = Vector.mul(Vector.sub(endPos, startPos), [1, 0.05]);
    v[0] = Float.clamp(Math.abs(v[0]), 40, 150);
    return `M ${startPos} C ${Vector.add(startPos, v)} ${Vector.add(endPos, Vector.scale(v, -1))} ${endPos}`;
  }
}
