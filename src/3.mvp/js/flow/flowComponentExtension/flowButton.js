import * as FlowBlock from "../flowBlock";
import mithril from "mithril";
export class Model extends FlowBlock.Model {}
export class Presenter extends FlowBlock.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.addOutput("out", 0, "Exec");
    this.model.setTitle("button");
    this.view.vnodeTitle(this.model.getTitle());
  }
}
export class View extends FlowBlock.View {
  viewVnode(content) {
    const vnode = mithril(
      "button",
      {
        onmousedown: (ev) => {
          ev.stopPropagation();
        },
        onclick: (ev) => {
          this.presenter.execTrigger(0);
        },
      },
      "按鈕"
    );
    return super.viewVnode(vnode);
  }
}
