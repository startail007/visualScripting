import { objEventDrag } from "../../../js/mithrilSupply";
import { rectCollisionRect } from "../../../js/supply";
import * as FlowBox from "./flowBox";
export class Model extends FlowBox.Model {
  constructor() {
    super();
    this.list = [];
  }
  setList(list) {
    this.list = list;
  }
  getList() {
    return this.list.slice();
  }
}
export class Presenter extends FlowBox.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.model.setDisplay(false);
  }
  calcSelectList(list) {
    if (list) {
      const selectRect = this.model.getRect();
      this.model.setList(
        list.filter((el) => {
          const pos = el.model.getPos();
          const size = el.view.getSize();
          return rectCollisionRect(pos, size, selectRect.pos, selectRect.size);
        })
      );
    }
    return this.model.getList();
  }
  selectRun(callback) {
    this.model.getList().forEach((el) => {
      callback(el);
    });
  }
  activeSelectList() {
    this.model.getList().forEach((el) => {
      el.setState("select", true);
    });
  }
  unactiveSelectList() {
    this.model.getList().forEach((el) => {
      el.setState("select", false);
    });
    this.model.setList([]);
  }
  setSelectList(list) {
    this.model.setList(list);
  }
  viewUpdate() {
    this.view.render();
  }
}
export class View extends FlowBox.View {
  init() {
    this.class = "selectRect";
  }
}
