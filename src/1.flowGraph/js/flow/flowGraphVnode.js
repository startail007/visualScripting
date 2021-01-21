import { Float } from "../../../js/float";
export default class FlowGraphVnode {
  constructor() {
    this._id = Float.guid();
    this.self = this;
    this.redraw = true;
  }
  onbeforeupdate(vnode, old) {
    if (vnode.attrs.redraw !== undefined) {
      this.self.redraw = vnode.attrs.redraw;
    }
    return this.self.redraw;
  }
  onupdate(vnode) {
    this.self.redraw = false;
  }
  view() {}
  get id() {
    return this._id;
  }
}
