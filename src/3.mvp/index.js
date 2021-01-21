import "./index.scss";
import mithril from "mithril";
import * as FlowMain from "./js/flow/flowMain";
import * as Components from "./js/flow/flowComponentExtension";

const el = document.getElementById("graph");
const flowVnode = new FlowMain.Presenter();
mithril.mount(el, flowVnode.view);

const flowVnode0 = new Components.FlowGetValue.Presenter();
flowVnode.addChild(flowVnode0);
flowVnode0.setPos([200, 200]);

const flowVnode1 = new Components.FlowAdd.Presenter();
flowVnode.addChild(flowVnode1);
flowVnode1.setPos([500, 200]);

const flowVnode2 = new Components.FlowGetValue.Presenter();
flowVnode.addChild(flowVnode2);
flowVnode2.setPos([200, 400]);

const flowVnode3 = new Components.FlowAdd.Presenter();
flowVnode.addChild(flowVnode3);
flowVnode3.setPos([500, 400]);

const flowVnode4 = new Components.FlowWatch.Presenter();
flowVnode.addChild(flowVnode4);
flowVnode4.setPos([700, 400]);

const flowVnode5 = new Components.FlowButton.Presenter();
flowVnode.addChild(flowVnode5);
flowVnode5.setPos([100, 600]);

const flowVnode6 = new Components.FlowSetValue.Presenter();
flowVnode.addChild(flowVnode6);
flowVnode6.setPos([400, 600]);

const flowVnode7 = new Components.FlowGetValue.Presenter();
flowVnode.addChild(flowVnode7);
flowVnode7.setPos([250, 700]);

const flowVnode8 = new Components.FlowSetValue.Presenter();
flowVnode.addChild(flowVnode8);
flowVnode8.setPos([600, 600]);

const flowVnode9 = new Components.FlowAdd.Presenter();
flowVnode.addChild(flowVnode9);
flowVnode9.setPos([500, 700]);

const flowVnode10 = new Components.FlowWatch.Presenter();
flowVnode.addChild(flowVnode10);
flowVnode10.setPos([700, 700]);

//flowVnode.connect(flowVnode0, 0, flowVnode1, 0);
flowVnode.connect(flowVnode2, 0, flowVnode1, 1);
flowVnode.connect(flowVnode1, 0, flowVnode3, 0);
flowVnode.connect(flowVnode2, 0, flowVnode3, 1);
flowVnode.connect(flowVnode3, 0, flowVnode4, 0);

flowVnode.connect(flowVnode5, 0, flowVnode6, 0);
flowVnode.connect(flowVnode7, 0, flowVnode6, 1);
flowVnode.connect(flowVnode6, 0, flowVnode8, 0);
flowVnode.connect(flowVnode6, 1, flowVnode9, 0);
flowVnode.connect(flowVnode6, 1, flowVnode9, 1);
flowVnode.connect(flowVnode9, 0, flowVnode8, 1);
flowVnode.connect(flowVnode8, 1, flowVnode1, 0);
flowVnode.connect(flowVnode8, 1, flowVnode10, 0);

//console.log(mithril.vnode);
