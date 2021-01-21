import { Vector, VectorE } from "../../../js/vector";
import { Float } from "../../../js/float";
import mithril from "mithril";
import FlowVnode from "./flowVnode";
export default class FlowLine extends FlowVnode {
  constructor() {
    super();
    this._startPos = [0, 0];
    this._endPos = [0, 0];
    this._center = [0, 0];
    this._totalLength = 0;
  }
  connect(outComponent, outNum, inComponent, inNum) {
    this.output = { component: outComponent, num: outNum };
    this.input = { component: inComponent, num: inNum };
    this.type = outComponent.code.outputList[outNum].type;
  }
  updateData() {
    super.updateData();
    this._totalLength = this.el.getTotalLength();
    const pos = this.el.getPointAtLength(this._totalLength * 0.5);
    VectorE.set(this._center, pos.x, pos.y);
  }
  viewVnode(content) {
    return [
      mithril("path.line", {
        class: `${this.type} ${this.state.active ? "active" : ""}  ${this.state.hover ? "hover" : ""}`,
        d: this.getLinePath(this.startPos, this.endPos),
      }),
      (() => {
        if (this.state.active) {
          const s = 2;
          return new Array(5).fill().map((el, index, array) => {
            return mithril(
              "circle",
              { cx: 0, cy: 0, r: 5, fill: "rgb(219, 18, 18)" },
              mithril("animateMotion", {
                dur: s + "s",
                path: this.getLinePath(this.startPos, this.endPos),
                repeatCount: "indefinite",
                rotate: "auto",
                begin: `${s * (index / array.length) - s}s`,
              })
            );
          });
        }
      })(),
      mithril("circle", {
        cx: this._center[0],
        cy: this._center[1],
        r: 10,
        fill: "#09c",
        onclick: () => {
          this.parent.unconnect(this.output.component, this.output.num, this.input.component, this.input.num);
          console.log("aaa");
        },
      }),
    ];
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
    this.reset();
  }
  get endPos() {
    return this._endPos;
  }
  set endPos(pos) {
    VectorE.set(this._endPos, ...pos);
    this.reset();
  }
}
