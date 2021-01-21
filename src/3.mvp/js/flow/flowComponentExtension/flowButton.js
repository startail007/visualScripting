import * as FlowBlock from "../flowBlock";
import mithril from "mithril";
export class Model extends FlowBlock.Model {}
export class Presenter extends FlowBlock.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.addOutput("out", 0, "Exec");
    this.view.vnodeTitle("button");
  }
  calcExports(inputsValue) {}
}
export class View extends FlowBlock.View {
  viewVnode(content) {
    const vnode = mithril(
      "button",
      {
        onclick: (ev) => {
          this.presenter.triggerFire(0, true);
        },
      },
      "按鈕"
    );
    return super.viewVnode(vnode);
  }
}
