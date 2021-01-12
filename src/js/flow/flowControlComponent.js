import { Float } from "../float";
import Listener from "../listener";
import { completeAssign } from "../objectSupply";
const bubbleLoop = (control, fun) => {
  if (control) {
    let bool = true;
    fun(control, {
      stopPropagation() {
        bool = false;
      },
    });
    if (bool) {
      bubbleLoop(control.parent, fun);
    }
  }
};
/*const sinkLoop = (control, fun) => {
  if (control) {
    for (let i = 0; i < control.children.length; i++) {
      const el = control.children[i];
      const c = fun(el);
      if (c ?? true) {
        sinkLoop(el, fun);
      }
    }
  }
};*/
const pointDeepHitTest = (mousePos, control) => {
  if (control && pointHitTest(mousePos, control.collisionGraph)) {
    for (let i = 0; i < control.children.length; i++) {
      const el = control.children[i];
      const temp = pointDeepHitTest(mousePos, el);
      if (temp) {
        return temp;
      }
    }
    return control;
  }
};
const pointCollisionRect = (pos0, pos1, size1) => {
  return pos0[0] <= pos1[0] + size1[0] && pos1[0] <= pos0[0] && pos0[1] <= pos1[1] + size1[1] && pos1[1] <= pos0[1];
};
const pointHitTest = (pos, collisionGraph) => {
  if (collisionGraph.type == "rect") {
    return pointCollisionRect(pos, collisionGraph.pos, collisionGraph.size);
  }
};
const setTop = (list, topList) => {
  const sortFun = (a, b) => b?.src?.zindex - a?.src?.zindex;
  const otherList = list.filter((el) => !topList.find((item) => el.id === item.id));
  topList.sort(sortFun);
  otherList.sort(sortFun);
  const temp = [...topList, ...otherList];
  temp.forEach((el, index, array) => {
    if (el.src) {
      el.src.zindex = array.length - index;
    }
  });
  list.sort(sortFun);
};
export default class FlowControlComponent extends Listener {
  constructor(id) {
    super();
    this.id = id ?? Float.guid();
    this.parent = null;
    this.collisionGraph = null;
    this.children = [];
    this.src = null;
  }
  setCollisionGraph(collisionGraph) {
    this.collisionGraph = collisionGraph;
  }
  rectHitTest(pos, size) {
    const rectCollisionRect = (pos0, size0, pos1, size1) => {
      return (
        pos0[0] <= pos1[0] + size1[0] &&
        pos1[0] <= pos0[0] + size0[0] &&
        pos0[1] <= pos1[1] + size1[1] &&
        pos1[1] <= pos0[1] + size0[1]
      );
    };
    if (this.collisionGraph.type == "rect") {
      return rectCollisionRect(pos, size, this.collisionGraph.pos, this.collisionGraph.size);
    }
  }
  add(control) {
    control.parent = this;
    this.children.push(control);
  }
  pointDeepHitTest(mousePos) {
    return pointDeepHitTest(mousePos, this);
  }
  setTop(topList) {
    setTop(this.children, topList);
  }
  bubbleFire(type, mainEv, ...data) {
    mainEv = mainEv ?? {};
    bubbleLoop(this, (el, ev) => {
      completeAssign(mainEv, { stopPropagation: ev.stopPropagation });
      el.fire(type, mainEv, ...data);
    });
  }
}
