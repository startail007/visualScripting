import Listener from "../../../js/listener";

export default class vnodeBasic extends Listener {
  constructor() {
    super();
    this._redraw = true;
    this.on("beforeupdate", () => this._redraw);
    this.on("view", () => this.viewVnode());
    this.on("update", () => {
      this._redraw = false;
    });
  }
  oninit(vnode) {
    this.fire("init", vnode);
  }
  oncreate(vnode) {
    this.fire("create", vnode);
  }
  onbeforeupdate(vnode) {
    return this.get("beforeupdate", 0, vnode);
  }
  onupdate(vnode) {
    this.fire("update", vnode);
  }
  view(vnode) {
    return this.get("view", 0, vnode);
  }
  viewVnode() {}
  setRedraw(val) {
    this._redraw = val;
  }
}
