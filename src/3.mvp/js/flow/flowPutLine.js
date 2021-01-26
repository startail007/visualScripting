import * as FlowBox from "./flowBox";
import { Vector } from "../../../js/vector";
import { Float } from "../../../js/float";
import mithril from "mithril";

export class Model extends FlowBox.Model {
  init() {
    super.init();
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
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.model.addClass("flowPutLine");
    this.view.vnodeClass(this.model.getClass());
  }
  connection(output, input) {
    this.model.setOutput(output);
    this.model.setInput(input);
    this.setState(output.model.getType(), true);
  }
  getAllChildren() {
    return [];
  }
  viewUpdate() {
    const output = this.model.getOutput();
    const input = this.model.getInput();
    if (output?.view?.el && input?.view?.el) {
      const outputComponent = output.model.getParent();
      const outputPos = outputComponent.model.getPos();
      const inputComponent = input.model.getParent();
      const inputPos = inputComponent.model.getPos();
      this.view.vnodeLine(Vector.add(outputPos, output.getPointPos()), Vector.add(inputPos, input.getPointPos()));
    }
    this.view.render();
  }
  circle_onclick() {
    const main = this.model.getMain();
    const graph = main.model.getGraph();
    graph.removeLine(this);
  }
}
export class View extends FlowBox.View {
  init() {
    super.init();
    this.d = null;
    this.center = [0, 0];
  }
  vnodeLine(startPos, endPos) {
    this.d = this.getLinePath(startPos, endPos);
    this.center = Vector.mix(startPos, endPos, 0.5);
    const s = 2;
    this.animation = new Array(5).fill().map((el, index, array) =>
      mithril(
        "circle",
        { cx: 0, cy: 0, r: 5, fill: "rgb(219, 18, 18)" },
        mithril("animateMotion", {
          dur: s + "s",
          path: this.d,
          repeatCount: "indefinite",
          rotate: "auto",
          begin: `${s * ((index + 1) / array.length) - s}s`,
        })
      )
    );
  }
  viewVnode(content) {
    return [
      mithril(
        "g",
        {
          class: `${this.class} ${this.state}`,
          style: { ...this.style },
          ...this.events,
        },
        [
          mithril("path", { d: this.d }),
          mithril("g.animation", this.animation),
          mithril("circle", {
            cx: this.center[0],
            cy: this.center[1],
            r: 10,
            fill: "#09c",
            onclick: this.presenter.circle_onclick.bind(this.presenter),
          }),
        ]
      ),
    ];
  }
  getLinePath(startPos, endPos) {
    const v = Vector.mul(Vector.sub(endPos, startPos), [1, 0.05]);
    v[0] = Float.clamp(Math.abs(v[0]), 40, 150);
    return `M ${startPos} C ${Vector.add(startPos, v)} ${Vector.add(endPos, Vector.scale(v, -1))} ${endPos}`;
  }
  resetRect() {}
}
