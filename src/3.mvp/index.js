import "./index.scss";
import mithril, { render } from "mithril";
import * as FlowMain from "./js/flow/flowMain";
import * as FlowGraph from "./js/flow/flowGraph";
import * as Components from "./js/flow/flowComponentExtension";

const el = document.getElementById("graph");
const flowMain = new FlowMain.Presenter();
flowMain.setMain();
mithril.mount(el, flowMain.view);

flowMain.addValue("a0", 1);
flowMain.addValue("a1", 1);

const graph = flowMain.getGraph();

const flowVnode0 = new Components.FlowGetValue.Presenter({ refName: "a0" });
graph.addChild(flowVnode0);
flowVnode0.setPos([200, 200]);

const flowVnode1 = new Components.FlowAdd.Presenter();
graph.addChild(flowVnode1);
flowVnode1.setPos([500, 200]);

const flowVnode2 = new Components.FlowGetValue.Presenter({ refName: "a1" });
graph.addChild(flowVnode2);
flowVnode2.setPos([200, 400]);

const flowVnode3 = new Components.FlowWatch.Presenter();
graph.addChild(flowVnode3);
flowVnode3.setPos([800, 600]);

const flowVnode4 = new Components.FlowButton.Presenter();
graph.addChild(flowVnode4);
flowVnode4.setPos([100, 600]);

const flowVnode5 = new Components.FlowSetValue.Presenter({ refName: "a0" });
graph.addChild(flowVnode5);
flowVnode5.setPos([400, 600]);

graph.connect(flowVnode0, 0, flowVnode1, 0);
graph.connect(flowVnode2, 0, flowVnode1, 1);
graph.connect(flowVnode1, 0, flowVnode5, 1);
graph.connect(flowVnode4, 0, flowVnode5, 0);
graph.connect(flowVnode5, 0, flowVnode3, 0);
graph.connect(flowVnode5, 1, flowVnode3, 1);
