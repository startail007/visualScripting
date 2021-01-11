import "./index.scss";
import FlowGraph from "../js/flow/flowGraph";

const flowGraph = new FlowGraph("#graph");
flowGraph.createValue("a0", 3);
flowGraph.createValue("a1", 6);
flowGraph.createValue("a2", true);
const flowGraphComponent01 = flowGraph.addComponent("getValue", { refIndex: 0 }, { pos: [100, 200] });
const flowGraphComponent02 = flowGraph.addComponent("add", undefined, { pos: [400, 100] });
const flowGraphComponent03 = flowGraph.addComponent("watch", undefined, { pos: [700, 200] });
const flowGraphComponent04 = flowGraph.addComponent("add", undefined, { pos: [400, 400] });
const flowGraphComponent05 = flowGraph.addComponent("getValue", { refIndex: 1 }, { pos: [100, 400] });
const flowGraphComponent06 = flowGraph.addComponent("button", undefined, { pos: [100, 900] });
const flowGraphComponent07 = flowGraph.addComponent("setValue", { refIndex: 0, value: 100 }, { pos: [400, 900] });
const flowGraphComponent08 = flowGraph.addComponent("ticker", undefined, { pos: [100, 600] });
const flowGraphComponent09 = flowGraph.addComponent("branch", undefined, { pos: [400, 600] });
const flowGraphComponent10 = flowGraph.addComponent("getValue", { refIndex: 2 }, { pos: [150, 700] });
const flowGraphComponent11 = flowGraph.addComponent("box", undefined, { pos: [700, 500] });
const flowGraphComponent12 = flowGraph.addComponent("box", undefined, { pos: [700, 700] });
const flowGraphComponent13 = flowGraph.addComponent("getValue", { refIndex: 0 }, { pos: [100, 50] });
const flowGraphComponent14 = flowGraph.addComponent("watch", undefined, { pos: [800, 800] });
const flowGraphComponent15 = flowGraph.addComponent("watch", undefined, { pos: [600, 100] });

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

const update = (time) => {
  requestAnimationFrame(update);
  if (Math.random() > 0.99) {
    flowGraph.setValue(2, !flowGraph.getValue(2));
  }
};
update();
