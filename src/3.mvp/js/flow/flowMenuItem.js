import { Vector } from "../../../js/vector";
import * as FlowBox from "./flowBox";
import * as Components from "./flowComponentExtension";
import * as FlowMenuItemC from "./flowMenuItemC";
import mithril from "mithril";
export class Model extends FlowBox.Model {
  init() {
    super.init();
    this.title = "";
    this.getButton = null;
    this.setButton = null;
  }
  setTitle(val) {
    this.title = val;
  }
  getTitle() {
    return this.title;
  }
  setGetButton(component) {
    this.getButton = component;
  }
  getGetButton() {
    return this.getButton;
  }
  setSetButton(component) {
    this.setButton = component;
  }
  getSetButton() {
    return this.setButton;
  }
}
export class Presenter extends FlowBox.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.model.addClass("flowMenuItem");
    this.view.vnodeClass(this.model.getClass());

    const getButton = new FlowMenuItemC.Presenter();
    getButton.setParent(this);
    this.model.setGetButton(getButton);

    const setButton = new FlowMenuItemC.Presenter();
    setButton.setParent(this);
    this.model.setSetButton(setButton);
  }
  setProperties(properties) {
    super.setProperties(properties);
    this.model.setTitle(this.model.getProperty("refName"));
    this.view.vnodeTitle(this.model.getTitle());

    this.model
      .getGetButton()
      .setProperties({ component: Components.FlowGetValue, title: "get", refName: this.model.getProperty("refName") });
    this.model
      .getSetButton()
      .setProperties({ component: Components.FlowSetValue, title: "set", refName: this.model.getProperty("refName") });
  }
  setMain(main) {
    super.setMain(main);

    this.model.getGetButton().setMain(main);
    this.model.getSetButton().setMain(main);

    this._value = main.model.getValue(this.model.getProperty("refName"));
    main.model.addValueNotification(this.model.getProperty("refName"), (val) => {
      this._value = val;
      this.update();
    });
  }
  getValue() {
    return this._value;
  }
  inputText_oninput(ev) {
    const value = ev.currentTarget.value;
    if (value !== "") {
      const main = this.model.getMain();
      main.model.setValue(this.model.getProperty("refName"), parseFloat(value));
    }
  }
  inputText_onblur(ev) {
    if (ev.currentTarget.value === "") {
      const main = this.model.getMain();
      ev.currentTarget.value = main.model.getValue(this.model.getProperty("refName"));
    }
  }
  viewUpdate() {
    this.view.vnodeGetButton(this.model.getGetButton());
    this.view.vnodeSetButton(this.model.getSetButton());
    this.view.render();
  }
}
export class View extends FlowBox.View {
  init() {
    super.init();
    this.title = null;
    this.getButton = null;
    this.setButton = null;
  }
  vnodeTitle(title) {
    this.title = mithril("div", title);
  }
  vnodeGetButton(component) {
    this.getButton = component.view.vnode;
  }
  vnodeSetButton(component) {
    this.setButton = component.view.vnode;
  }
  viewVnode(content) {
    //this.presenter.getProperty("refName")
    const vnode = [
      mithril("div.title", this.title),
      mithril("input.inputText", {
        type: "text",
        value: this.presenter.getValue(),
        oninput: this.presenter.inputText_oninput.bind(this.presenter),
        onblur: this.presenter.inputText_onblur.bind(this.presenter),
      }),
      [this.getButton, this.setButton],
    ];
    return super.viewVnode(vnode);
  }
}
