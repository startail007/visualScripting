import mithril from "mithril";
import FlowViewComponent from "./flowViewComponent";
import { objEventDrag } from "../../../js/mithrilSupply";
import { Vector } from "../../../js/vector";
export default class FlowViewBox extends FlowViewComponent {
  constructor(properties) {
    super(properties);
    this.class = "flowViewBox";

    this.event = objEventDrag({
      start: (ev) => {
        if (!this.state.select) {
          this.parent.setOperate("");
          this.parent.selectList = [this];
          this.parent.setOperate("selectActive");
        }
      },
      drag: (ev) => {
        this.parent.fire("selectDrag", ev);
      },
    });
    this.on("select", (ev) => {
      this.state.select = true;
    });
    this.on("unselect", (ev) => {
      this.state.select = false;
    });
    this.on("selectDrag", (ev) => {
      if (this.parent.operate == "selectActive") {
        if (this.state.select) {
          this.pos = Vector.add(this.pos, ev.movePos);
        }
      }
    });
  }
  viewVnode(content) {
    const vnode = [
      mithril("div.title", this.titleVnode()),
      mithril("div.wrap", [
        mithril("div.content", [
          mithril(
            "div.inputs",
            this.inputList.map((el) => mithril(el, { key: el.id }))
          ),
          mithril("div.slotContent", this.slotsVnode()),
          mithril(
            "div.outputs",
            this.outputList.map((el) => mithril(el, { key: el.id }))
          ),
        ]),
      ]),
    ];
    return super.viewVnode(vnode);
  }
  titleVnode() {
    return "";
  }
  slotsVnode() {
    return "";
  }
}
