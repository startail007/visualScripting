import vnodeBasic from "./vnodeBasic";
import mithril from "mithril";
import { Float } from "../../../js/float";
import { Vector, VectorE } from "../../../js/vector";
import Listener from "../../../js/listener";
import { arrayRemove } from "../../../js/supply";

export class Model {
  constructor() {
    this.init();
  }
  init() {
    this.children = [];
    this.class = [];
    this.style = { pos: [0, 0], size: [0, 0], display: true };
    this.state = { active: false, select: false };
    this.relevanceList = [];
    this.id = Float.guid();
    this.parent = null;
    this.main = null;
  }
  getID() {
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
  setMain(component) {
    this.main = component;
  }
  getMain() {
    return this.main;
  }
  setDisplay(val) {
    this.style.display = val;
  }
  addClass(val) {
    this.class.push(val);
  }
  getClass(val) {
    return this.class;
  }
}
export class Presenter extends Listener {
  constructor(property) {
    super();
    this.property = property;
    this.init();
  }
  init(modelClass = Model, viewClass = View) {
    this.model = new modelClass();
    this.view = new viewClass(this);

    this.updateID = undefined;
    this.activeID = undefined;
    this.view.vnodeStyle({ display: this.model.getStyleCtx("display") });

    this.view.vnodeState(this.model.getStates());
    this.model.addClass("flowBox");
    this.view.vnodeClass(this.model.getClass());
  }
  setMain(component) {
    this.model.setMain(component);
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
  getAllChildren() {
    return this.model.getChildren();
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
  getID() {
    return this.model.getID();
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
  addClass(val) {
    this.model.addClass(val);
    this.view.vnodeClass(this.model.getClass());
    this.update();
  }
  getChildren() {
    return this.model.getChildren();
  }
  getParentView() {
    return this.model.getParent()?.view;
  }
  setActive(time = 0) {
    clearTimeout(this.activeID);
    this.setState("active", true);
    if (time && time > 0) {
      this.activeID = setTimeout(() => {
        this.setState("active", false);
      }, time);
    }
  }
}

export class View extends vnodeBasic {
  constructor(presenter) {
    super();
    this.presenter = presenter;
    this.init();
  }
  init() {
    this.children = [];
    this.style = {};
    this.events = this.eventsVnode();
    this.state = "";
    this.class = "";
    this._loc = [0, 0];
    this._size = [0, 0];
    this.el = null;
    this.vnode = mithril.vnode(this, this.presenter.getID());
    this.once("create", (vnode) => {
      this.el = vnode.dom;
      this.reLoc();
      const rect = this.el.getBoundingClientRect();
      VectorE.set(this._size, rect.width, rect.height);

      this.presenter.update();

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const rect = entry.contentRect;
        if (rect.width != this._size[0] || rect.height != this._size[1]) {
          VectorE.set(this._size, rect.width, rect.height);
          this.reLoc();
          this.presenter.update();
          this.presenter.getAllChildren().forEach((el) => {
            el.view.reLoc();
            el.update();
          });
        }
      });
      observer.observe(this.el);
    });
  }
  getLoc() {
    return this._loc;
  }
  getSize() {
    return this._size;
  }
  reLoc() {
    const rect = this.el.getBoundingClientRect();
    this.clientPos = [rect.x, rect.y];
    const parentPos = [0, 0];
    const component = this.presenter.getParentView();
    if (component) {
      VectorE.set(parentPos, ...component.clientPos);
    }
    VectorE.set(this._loc, ...Vector.sub(this.clientPos, parentPos));
  }
  render() {
    this.vnode = mithril.vnode(this, this.presenter.getID());
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
  vnodeClass(classList) {
    this.class = classList.join(" ");
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
