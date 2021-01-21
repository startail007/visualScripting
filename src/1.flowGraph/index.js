import "./index.scss";
import FlowGraph from "./js/flow/flowGraph";

const flowGraph = new FlowGraph("#graph");

flowGraph.addValue("a0", 3);
flowGraph.addValue("a1", 6);
flowGraph.addValue("a2", true);
const flowGraphComponent01 = flowGraph.addComponent("getValue", { refName: "a0" }, { pos: [300, 200] });
const flowGraphComponent02 = flowGraph.addComponent("add", undefined, { pos: [600, 100] });
const flowGraphComponent03 = flowGraph.addComponent("watch", undefined, { pos: [900, 200] });
const flowGraphComponent04 = flowGraph.addComponent("add", undefined, { pos: [600, 400] });
const flowGraphComponent05 = flowGraph.addComponent("getValue", { refName: "a1" }, { pos: [300, 400] });
const flowGraphComponent06 = flowGraph.addComponent("button", undefined, { pos: [300, 900] });
const flowGraphComponent07 = flowGraph.addComponent("setValue", { refName: "a0", value: 100 }, { pos: [600, 900] });
const flowGraphComponent08 = flowGraph.addComponent("ticker", undefined, { pos: [300, 600] });
const flowGraphComponent09 = flowGraph.addComponent("branch", undefined, { pos: [600, 600] });
const flowGraphComponent10 = flowGraph.addComponent("getValue", { refName: "a2" }, { pos: [350, 700] });
const flowGraphComponent11 = flowGraph.addComponent("box", undefined, { pos: [900, 500] });
const flowGraphComponent12 = flowGraph.addComponent("box", undefined, { pos: [900, 700] });
const flowGraphComponent13 = flowGraph.addComponent("getValue", { refName: "a0" }, { pos: [300, 50] });
const flowGraphComponent14 = flowGraph.addComponent("watch", undefined, { pos: [1000, 800] });
const flowGraphComponent15 = flowGraph.addComponent("watch", undefined, { pos: [800, 100] });

flowGraph.connect(flowGraphComponent01, 0, flowGraphComponent02, 0);
flowGraph.connect(flowGraphComponent05, 0, flowGraphComponent02, 1);
flowGraph.connect(flowGraphComponent01, 0, flowGraphComponent04, 1);
flowGraph.connect(flowGraphComponent02, 0, flowGraphComponent04, 0);
flowGraph.connect(flowGraphComponent04, 0, flowGraphComponent03, 0);
flowGraph.connect(flowGraphComponent06, 0, flowGraphComponent07, 0);

flowGraph.connect(flowGraphComponent08, 0, flowGraphComponent09, 0);
flowGraph.connect(flowGraphComponent09, 0, flowGraphComponent11, 0);
flowGraph.connect(flowGraphComponent09, 1, flowGraphComponent12, 0);
flowGraph.connect(flowGraphComponent10, 0, flowGraphComponent09, 1);
flowGraph.connect(flowGraphComponent09, 2, flowGraphComponent14, 0);

//flowGraph.unconnect(flowGraphComponent01, 0, flowGraphComponent02, 0);
//flowGraph.unconnect(flowGraphComponent09, 0, flowGraphComponent11, 0);

const update = (time) => {
  requestAnimationFrame(update);
  if (Math.random() > 0.5) {
    flowGraph.setValue("a2", !flowGraph.getValue("a2"));
  }
};
update();
