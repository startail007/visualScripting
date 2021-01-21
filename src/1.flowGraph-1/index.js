import "./index.scss";
import mithril from "mithril";
import { FlowGraph } from "./js/flow/flowView";

const el = document.getElementById("graph");
const flowGraph = new FlowGraph();
flowGraph.addValue("a0", 0);
flowGraph.addValue("a1", 1);
const component0 = flowGraph.addComponent("getValue", { refName: "a0" });
component0.pos = [100, 100];
const component1 = flowGraph.addComponent("watch");
component1.pos = [400, 100];
const component2 = flowGraph.addComponent("add");
component2.pos = [400, 400];
const component3 = flowGraph.addComponent("getValue", { refName: "a1" });
component3.pos = [100, 400];

const component4 = flowGraph.addComponent("button");
component4.pos = [100, 600];
const component5 = flowGraph.addComponent("setValue", { refName: "a0" });
component5.pos = [400, 600];
flowGraph.once("create", () => {
  flowGraph.connect(component0, 0, component2, 0);
  flowGraph.connect(component3, 0, component2, 1);
  flowGraph.connect(component2, 0, component1, 0);
  flowGraph.connect(component2, 0, component5, 1);
  flowGraph.connect(component4, 0, component5, 0);
});
mithril.mount(el, flowGraph);

const update = (time) => {
  requestAnimationFrame(update);
};
update();
