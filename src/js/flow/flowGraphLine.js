import { Vector, VectorE } from "../vector";
import { Float } from "../float";
import mithril from "mithril";
import FlowGraphBasic from "./flowGraphBasic";
import { completeAssign } from "../objectSupply";
export default class FlowGraphLine extends FlowGraphBasic {
  constructor() {
    super();
    this.root = null;
    this._startPos = [0, 0];
    this._endPos = [0, 0];
  }
  connect(outComponent, outNum, inComponent, inNum) {
    outComponent.addOutputLine(outNum, this);
    inComponent.addInputLine(inNum, this);
    this.output = { component: outComponent, num: outNum };
    this.input = { component: inComponent, num: inNum };
    this.type = outComponent.code.outputList[outNum].type;
  }
  view() {
    return mithril("path.line", {
      class: `${this.self.type} ${this.self._active ? "active" : ""}`,
      d: this.getLinePath(this.self._startPos, this.self._endPos),
    });
  }
  getLinePath(startPos, endPos) {
    const v = Vector.mul(Vector.sub(endPos, startPos), [1, 0.05]);
    v[0] = Float.clamp(Math.abs(v[0]), 40, 150);
    return `M ${startPos} C ${Vector.add(startPos, v)} ${Vector.add(endPos, Vector.scale(v, -1))} ${endPos}`;
  }
  get startPos() {
    return this._startPos;
  }
  set startPos(pos) {
    VectorE.set(this._startPos, ...pos);
    this.redraw = true;
    mithril.redraw();
  }
  get endPos() {
    return this._endPos;
  }
  set endPos(pos) {
    VectorE.set(this._endPos, ...pos);
    this.redraw = true;
    mithril.redraw();
  }
}
