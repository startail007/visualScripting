import { calcRect, rectCollisionRect } from "../../../js/supply";
import { VectorE } from "../../../js/vector";
import * as FlowBox from "./flowBox";
export class Model extends FlowBox.Model {
  init() {
    super.init();
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
    this.model.addClass("selectRect");
    this.view.vnodeClass(this.model.getClass());
    this.setDisplay(false);
    this.pinPos = [0, 0];
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
  getAllChildren() {
    return [];
  }
  viewUpdate() {
    this.view.render();
  }
  dragstart(pos) {
    this.unactiveSelectList();
    this.setRect(pos, [0, 0]);
    this.setDisplay(true);
    VectorE.set(this.pinPos, ...pos);
    const main = this.model.getMain();
    main.setOperate("select");
    this.setState("active", true);
  }
  drag(pos) {
    const rect = calcRect(this.pinPos, pos);
    this.setRect(rect.pos, rect.size);
  }
  dragend(children) {
    if (this.model.getState("active")) {
      this.setState("active", false);
      const selectList = this.calcSelectList(children);
      if (selectList.length) {
        this.activeSelectList();
      }
      this.setDisplay(false);
      const main = this.model.getMain();
      main.setOperate("");
    }
  }
  selectOne(component) {
    this.unactiveSelectList();
    this.setSelectList([component]);
    this.activeSelectList();
  }
}
export class View extends FlowBox.View {}
