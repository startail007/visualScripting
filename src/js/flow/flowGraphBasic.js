import FlowGraphVnode from "./flowGraphVnode";
import mithril from "mithril";
export default class FlowGraphBasic extends FlowGraphVnode {
  constructor() {
    super();
    this._active = false;
    this._activeTime = -1;
    this._select = false;
    this._hover = false;
    this._dragHover = false;
  }
  onExecute(time) {
    if (this._activeTime >= 0) {
      if (time - this._activeTime < 500) {
        if (!this._active) {
          this._active = true;
          this.redraw = true;
          mithril.redraw();
        }
      } else {
        if (this._active) {
          this._active = false;
          this.redraw = true;
          mithril.redraw();
        }
      }
    }
  }
}
