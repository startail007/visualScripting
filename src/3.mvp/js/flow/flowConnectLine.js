import * as FlowBox from "./flowBox";
import { Vector, VectorE } from "../../../js/vector";
import { Float } from "../../../js/float";
import mithril from "mithril";

export class Model extends FlowBox.Model {
  init() {
    super.init();
    this.startPos = [0, 0];
    this.endPos = [0, 0];
    this.output = null;
    this.input = null;
  }
  setStartPos(pos) {
    this.startPos = pos;
  }
  getStartPos() {
    return this.startPos;
  }
  setEndPos(pos) {
    this.endPos = pos;
  }
  getEndPos() {
    return this.endPos;
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
    this.model.addClass("flowConnectLine");
    this.view.vnodeClass(this.model.getClass());
    this.view.vnodeLine(this.model.getStartPos(), this.model.getEndPos());
    this.setDisplay(false);
  }
  setStartPos(pos) {
    this.model.setStartPos(pos);
    this.update();
  }
  setEndPos(pos) {
    this.model.setEndPos(pos);
    this.update();
  }
  getAllChildren() {
    return [];
  }
  viewUpdate() {
    const output = this.model.getOutput();
    if (output?.view?.el) {
      const outputComponent = output.model.getParent();
      const outputPos = outputComponent.model.getPos();
      this.model.setStartPos(Vector.add(outputPos, output.getPointPos()));
    }
    const input = this.model.getInput();
    if (input?.view?.el) {
      const inputComponent = input.model.getParent();
      const inputPos = inputComponent.model.getPos();
      this.model.setEndPos(Vector.add(inputPos, input.getPointPos()));
    }
    this.view.vnodeLine(this.model.getStartPos(), this.model.getEndPos());
    this.view.render();
  }
  runConnect() {
    const output = this.model.getOutput();
    const input = this.model.getInput();
    if (output && input) {
      const type = output.model.getType();
      if (type == input.model.getType()) {
        const outputComponent = output.model.getParent();
        const inputComponent = input.model.getParent();
        if (inputComponent != outputComponent) {
          const outputNum = output.model.getIndex();
          const inputNum = input.model.getIndex();
          const main = this.model.getMain();
          const graph = main.model.getGraph();
          const bool = output.model.getLines().some((el) => el.model.getInput() == input);
          if (!bool) {
            if (type != "Exec") {
              input.model.getParent().removeInputLines(input.model.getIndex());
            }
            graph.connect(outputComponent, outputNum, inputComponent, inputNum);
          }
        }
      }
    }
  }
  clearPut() {
    this.model.setOutput(null);
    this.model.setInput(null);
  }
  dragstart(startComponent, endPos) {
    this.model.setOutput(startComponent);
    this.setEndPos(endPos);
    this.setDisplay(true);
    const main = this.model.getMain();
    main.setOperate("connectLine");
    this.setState("active", true);
  }
  drag(endPos) {
    this.setEndPos(endPos);
  }
  dragend() {
    if (this.model.getState("active")) {
      this.setState("active", false);
      this.runConnect();
      this.clearPut();
      this.setDisplay(false);
      const main = this.model.getMain();
      main.setOperate("");
    }
  }
}
export class View extends FlowBox.View {
  init() {
    super.init();
    this.d = null;
  }
  vnodeLine(startPos, endPos) {
    this.d = this.getLinePath(startPos, endPos);
  }
  viewVnode(content) {
    return mithril(
      "svg",
      {
        class: `${this.class} ${this.state}`,
        style: { ...this.style },
        ...this.events,
      },
      [
        mithril("path.line", {
          d: this.d,
          class: `line`,
        }),
        mithril("g", this.animation),
      ]
    );
  }
  getLinePath(startPos, endPos) {
    const v = Vector.mul(Vector.sub(endPos, startPos), [1, 0.05]);
    v[0] = Float.clamp(Math.abs(v[0]), 40, 150);
    return `M ${startPos} C ${Vector.add(startPos, v)} ${Vector.add(endPos, Vector.scale(v, -1))} ${endPos}`;
  }
  resetRect() {}
}
