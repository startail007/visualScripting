import * as FlowBox from "./flowBox";
import { objEventDrag } from "../../../js/mithrilSupply";
import * as FlowSelect from "./flowSelect";
import * as FlowLine from "./flowLine";
import mithril from "mithril";
import { arrayRemove } from "../../../js/supply";
export class Model extends FlowBox.Model {
  constructor() {
    super();
    this.lines = [];
    this.operate = "";
    this.select = null;
  }
  addLine(component) {
    this.lines.push(component);
  }
  removeLine(component) {
    arrayRemove(this.lines, component);
  }
  getLines() {
    return this.lines.slice();
  }
  setOperate(val) {
    this.operate = val;
  }
  getOperate() {
    return this.operate;
  }
  setSelect(component) {
    this.select = component;
  }
  getSelect() {
    return this.select;
  }
}
export class Presenter extends FlowBox.Presenter {
  init(modelClass = Model, viewClass = View) {
    super.init(modelClass, viewClass);
    const select = new FlowSelect.Presenter();
    select.setParent(this);
    this.model.setSelect(select);
    this.on("selectDrag", (move) => {
      this.model.getSelect().selectRun((el) => {
        el.movePos(move);
      });
    });
  }
  connect(outComponent, outNum, inComponent, inNum) {
    const output = outComponent.model.getOutput(outNum);
    const input = inComponent.model.getInput(inNum);
    output.addRelevance(input);
    const component = new FlowLine.Presenter();
    component.connection(output, input);
    component.setParent(this);
    this.model.addLine(component);
    output.model.addLine(component);
    input.model.addLine(component);
    outComponent.flowRun();

    /*this.view.once("update", () => {
      component.update();
    });*/
  }
  removeLine(line) {
    const output = line.model.getOutput();
    const input = line.model.getInput();

    output.removeRelevance(input);
    this.model.removeLine(line);
    output.model.removeLine(line);
    input.model.removeLine(line);

    output.model.getParent().setInputValue(output.model.getIndex(), undefined);
    output.setState("active", false);

    input.model.getParent().setInputValue(input.model.getIndex(), undefined);
    input.setState("active", false);
    input.model.getParent().triggerReset();
  }
  viewUpdate() {
    this.view.vnodeLines(this.model.getLines());
    this.view.vnodeChildren(this.model.getChildren());
    this.view.vnodeSelect(this.model.getSelect());
    this.view.render();
  }
  setOperate(operate, ...data) {
    const oldOperate = this.model.getOperate();
    if (oldOperate != operate) {
      this.model.setOperate(operate);
      if (oldOperate == "select") {
        const select = this.model.getSelect();
        select.setDisplay(false);
      } else if (oldOperate == "selectActive") {
        const select = this.model.getSelect();
        select.unactiveSelectList();
      } else if (oldOperate == "connectLine") {
      }
      if (operate == "select") {
        const select = this.model.getSelect();
        select.setDisplay(true);
      } else if (operate == "selectActive") {
        const select = this.model.getSelect();
        const selectList = select.calcSelectList(data[0]);
        if (selectList.length) {
          select.activeSelectList();
        } else {
          this.setOperate("");
        }
      } else if (operate == "connectLine") {
      } else if (operate == "connectLineEnd") {
      }
    }
  }
  setSelectRect(pos, size) {
    const select = this.model.getSelect();
    select.setRect(pos, size);
  }
  getOperate() {
    return this.model.getOperate();
  }
}
export class View extends FlowBox.View {
  init() {
    this.class = "flowMain";
    this.lines = [];
    this.select = null;
  }
  vnodeSelect(select) {
    //if (select) {
    this.select = select.view.vnode;
    /*} else {
      this.select = null;
    }*/
  }
  vnodeLines(lines) {
    this.lines = lines.map((el) => el.view.vnode);
  }
  viewVnode(content) {
    const vnode = [
      mithril("svg.svg", { width: "100%", height: "100%" }, this.lines),
      mithril("div.boxs", content ?? this.children),
      mithril("div.front", this.select),
    ];
    return super.viewVnode(vnode);
  }
  eventsVnode() {
    return {
      ...objEventDrag({
        start: (ev) => {
          this.presenter.setSelectRect(ev.dragRect.pos, ev.dragRect.size);
          this.presenter.setOperate("select");
        },
        drag: (ev) => {
          if (this.presenter.getOperate() == "select") {
            this.presenter.setSelectRect(ev.dragRect.pos, ev.dragRect.size);
          }
        },
        end: (ev) => {
          if (this.presenter.getOperate() == "select") {
            this.presenter.setSelectRect(ev.dragRect.pos, ev.dragRect.size);
            this.presenter.setOperate("selectActive", this.presenter.getChildren());
          }
        },
      }),
    };
  }
}
