import vnodeBasic from "./vnodeBasic";
import mithril from "mithril";
import { Float } from "../../../js/float";
import { Vector, VectorE } from "../../../js/vector";
import Listener from "../../../js/listener";
import { arrayRemove } from "../../../js/supply";

export class Model {
  constructor() {
    this.children = [];
    this.style = { pos: [0, 0], size: [0, 0], display: true };
    this.state = { active: false, select: false };
    this.relevanceList = [];
    this.id = Float.guid();
    this.parent = null;
  }
  getId() {
    return this.id;
  }
  addChild(component) {
    this.children.push(component);
  }
  removeChild(component) {
    arrayRemove(this.children, component);
  }
  getChildren() {
    return this.children.slice();
  }
  setPos(val) {
    VectorE.set(this.style.pos, ...val);
  }
  getPos() {
    return this.style.pos;
  }
  setSize(val) {
    VectorE.set(this.style.size, ...val);
  }
  getSize() {
    return this.style.size;
  }
  getRect() {
    return { pos: this.style.pos, size: this.style.size };
  }
  addRelevance(component) {
    this.relevanceList.push(component);
  }
  removeRelevance(component) {
    arrayRemove(this.relevanceList, component);
  }
  getRelevanceList() {
    return this.relevanceList.slice();
  }
  setState(name, val) {
    this.state[name] = val;
  }
  getState(name) {
    return this.state[name];
  }
  getStates() {
    return this.state;
  }
  getStyleCtx(name) {
    return this.style[name];
  }
  getStyle() {
    return this.style;
  }
  setParent(component) {
    this.parent = component;
  }
  getParent() {
    return this.parent;
  }
  setDisplay(val) {
    this.style.display = val;
  }
}
export class Presenter extends Listener {
  constructor() {
    super();
    this.updateID = undefined;
    this.init();
    this.view.vnodeStyle({ display: this.model.getStyleCtx("display") });
  }
  init(modelClass = Model, viewClass = View) {
    this.model = new modelClass();
    this.view = new viewClass(this);
    this.view.vnodeState(this.model.getStates());
  }
  setParent(component) {
    this.model.setParent(component);
  }
  addChild(component) {
    this.model.addChild(component);
    component.setParent(this);
    this.update();
  }
  removeChild(component) {
    this.model.removeChild(component);
    this.update();
  }
  setSize(val) {
    this.model.setSize(val);
    this.view.vnodeStyle({ size: val });
    this.update();
  }
  setPos(val) {
    this.model.setPos(val);
    this.view.vnodeStyle({ pos: val });
    this.update();
  }
  setRect(pos, size) {
    this.model.setPos(pos);
    this.model.setSize(size);
    this.view.vnodeStyle({ pos: pos, size: size });
    this.update();
  }
  movePos(val) {
    const pos = this.model.getPos();
    this.model.setPos(Vector.add(pos, val));
    this.view.vnodeStyle({ pos: pos });
    this.update();
  }
  setDisplay(val) {
    this.model.setDisplay(val);
    this.view.vnodeStyle({ display: val });
    this.update();
  }
  update() {
    clearTimeout(this.updateID);
    this.updateID = setTimeout(() => {
      this.viewUpdate();
    });
    this.parentUpdate();
  }
  viewUpdate() {
    this.view.vnodeChildren(this.model.getChildren());
    this.view.render();
  }
  parentUpdate() {
    const component = this.model.getParent();
    if (component) {
      component.update();
    }
  }
  getId() {
    return this.model.getId();
  }
  addRelevance(component) {
    this.model.addRelevance(component);
    component.model.addRelevance(this);
  }
  removeRelevance(component) {
    this.model.removeRelevance(component);
    component.model.removeRelevance(this);
  }
  setState(name, val) {
    this.model.setState(name, val);
    this.view.vnodeState(this.model.getStates());
    this.update();
  }
  getChildren() {
    return this.model.getChildren();
  }
  getParentView() {
    return this.model.getParent()?.view;
  }
}

export class View extends vnodeBasic {
  constructor(presenter) {
    super();
    this.presenter = presenter;
    this.children = [];
    this.style = {};
    this.events = this.eventsVnode();
    this.class = "flowBox";
    this._loc = [0, 0];
    this._size = [0, 0];
    this.el = null;
    this.vnode = mithril.vnode(this, this.presenter.getId());
    this.once("create", (vnode) => {
      this.el = vnode.dom;
      const pos = [0, 0];
      const parentPos = [0, 0];
      const rect = this.el.getBoundingClientRect();
      VectorE.set(pos, rect.x, rect.y);
      const component = this.presenter.getParentView();
      if (component) {
        const parentRect = component.el.getBoundingClientRect();
        VectorE.set(parentPos, parentRect.x, parentRect.y);
      }
      VectorE.set(this._loc, ...Vector.sub(pos, parentPos));
      VectorE.set(this._size, rect.width, rect.height);
      this.presenter.update();
    });
    this.init();
  }
  init() {}
  getLoc() {
    return this._loc;
  }
  getSize() {
    return this._size;
  }
  render() {
    this.vnode = mithril.vnode(this, this.presenter.getId());
    this.setRedraw(true);
  }
  vnodeChildren(children) {
    this.children = children.map((el) => el.view.vnode);
  }
  vnodeStyle(style) {
    if (style.pos != undefined) {
      this.style.left = `${style.pos[0]}px`;
      this.style.top = `${style.pos[1]}px`;
    }
    if (style.size != undefined) {
      this.style.width = `${style.size[0]}px`;
      this.style.height = `${style.size[1]}px`;
    }
    if (style.display != undefined) {
      this.style.display = style.display ? undefined : "none";
    }
  }
  vnodeState(state) {
    const temp = [];
    for (let key in state) {
      if (state[key]) {
        temp.push(key);
      }
    }
    this.state = temp.join(" ");
  }
  viewVnode(content) {
    return mithril(
      "div",
      { class: `${this.class} ${this.state}`, style: { ...this.style }, ...this.events },
      content ?? this.children
    );
  }
  eventsVnode() {
    return {};
  }
  setRedraw(val) {
    this._redraw = val;
    mithril.redraw();
  }
}

/*export class FlowAModel extends Model {
}
export class FlowAPresenter extends Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
  }
}
export class FlowAView extends View {}*/
