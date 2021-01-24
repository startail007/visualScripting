import { objEventDrag } from "../../../js/mithrilSupply";
import * as FlowBox from "./flowBox";
import * as Components from "./flowComponentExtension";
export class Model extends FlowBox.Model {}
export class Presenter extends FlowBox.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    this.model.addClass("flowMenuItem");
    this.view.vnodeClass(this.model.getClass());
    //this.model.setTitle("getValue" + " " + this.property.refName);
    //this.view.vnodeTitle(this.model.getTitle());
    console.log(this.property.refName);
  }
  event_dragstart(ev) {}
  event_drag(ev) {}
  event_dragend(ev) {
    //console.log("aaaaa", this.model.getID());
  }
  event_onmouseup() {}
}
export class View extends FlowBox.View {
  viewVnode(content) {
    return super.viewVnode("aaaa");
  }

  eventsVnode() {
    return {
      onmouseup: this.presenter.event_onmouseup.bind(this.presenter),
      onmousedown: objEventDrag({
        start: this.presenter.event_dragstart.bind(this.presenter),
        drag: this.presenter.event_drag.bind(this.presenter),
        end: this.presenter.event_dragend.bind(this.presenter),
      }),
    };
  }
}
