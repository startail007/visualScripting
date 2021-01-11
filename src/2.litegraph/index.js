import * as glmatrix from "gl-matrix";
import { Vector } from "../js/vector";
import { Float } from "../js/float";
import "litegraph.js/css/litegraph.css";
import { LGraph, LGraphCanvas, LiteGraph, LGraphNode } from "litegraph.js";
import "./index.scss";

{
  class SumClass {
    constructor() {
      this.addInput("play", LiteGraph.ACTION);
      this.addOutput("onFinish", LiteGraph.EVENT);

      this.addInput("A", "number", { color_on: "#f00" });
      this.addInput("B", "number");

      this.addOutput("A+B", "number");

      //console.log(LiteGraph.ACTION, LiteGraph.EVENT);

      this.properties = { precision: 1, color: "red", surname: "smith" };

      this.addWidget(
        "number",
        "數值",
        0,
        (value, widget, node) => {
          console.log(value);
        },
        { min: 0, max: 100, step: 1 }
      );

      this.addWidget(
        "slider",
        "滑塊",
        0.5,
        (value, widget, node) => {
          console.log(value);
        },
        { min: 0, max: 1 }
      );
      this.addWidget(
        "combo",
        "選項",
        this.properties.color,
        (value, widget, node) => {
          console.log(value, this.properties);
        },
        { values: ["red", "green", "blue"], property: "color" }
      );

      this.addWidget(
        "text",
        "名字",
        this.properties.surname,
        (value, widget, node) => {
          console.log(value);
        },
        { property: "surname" }
      );
    }
    onMouseDown(e) {
      //console.log("aaa");
      //LiteGraph.ContextMenu(["aaa"], { event: e });

      const entries = [];
      entries.push({
        value: "aaa",
        content: "aaa",
        callback: (node, options, e, prev_menu, callback) => {
          console.log(node);
        },
        has_submenu: true,
      });
      entries.push({
        value: "aasdasdaa",
        content: "asdasd",
        callback: (node, options, e, prev_menu, callback) => {
          console.log(node);
          const menu0 = new LiteGraph.ContextMenu(entries0, {
            event: e,
            callback: () => {
              console.log("bbb");
            },
            parentMenu: prev_menu,
          });
        },
        has_submenu: true,
      });

      const entries0 = [];
      entries0.push({ value: "aaa", content: "aaa", has_submenu: false });

      const menu = new LiteGraph.ContextMenu(entries, {
        event: e,
      });
    }
    onAction(action, data) {
      if (action == "play") {
        //console.log("aaa", this);
        this.triggerSlot(0, { asdasd: "asdasd" });
      }
    }
    onStart() {}
    onStop() {}
    onSelected() {}
    onDeselected() {}
    onExecute() {
      let A = this.getInputData(1);
      if (A === undefined) A = 0;
      let B = this.getInputData(2);
      if (B === undefined) B = 0;
      this.setOutputData(1, A + B);
    }
  }
  SumClass.title = "Sum";
  SumClass.title_color = "#345";
  SumClass.shape = LiteGraph.ROUND_SHAPE;
  LiteGraph.registerNodeType("basic/sum", SumClass);
}
{
  class InitClass {
    constructor() {
      this.addOutput("onInit", LiteGraph.EVENT);
      this.properties = { precision: 1 };
    }
    onStart() {
      this.triggerSlot(0);
    }
  }
  InitClass.title = "Init";
  InitClass.title_color = "#345";
  InitClass.shape = LiteGraph.ROUND_SHAPE;
  LiteGraph.registerNodeType("events/init", InitClass);
}
{
  class DrawWaveClass {
    constructor() {
      this.addInput("update", LiteGraph.ACTION);
      this.addInput("A", "array");
      //this.data = new Float32Array(32);
    }
    onAction(action, data) {
      if (action == "update") {
        this.data = this.getInputData(1) || new Float32Array(1024);
        /*this.data.forEach((val, index, array) => {
          array[index] = Float.mix(-1, 1, Math.random());
        });*/
      }
    }
    onGetInputs() {
      //console.log("aaa");
    }
    getMenuOptions() {
      console.log("wwwww");
      return [];
    }
    getExtraMenuOptions() {
      console.log("www");
      return [
        {
          content: "AAA",
          has_submenu: false,
          disabled: false,
          callback: () => {},
        },
      ];
    }
    onDrawForeground(ctx, graphcanvas) {
      if (this.flags.collapsed) return;
      const pos = [5, 5];
      const size = Vector.sub(this.size, [10, 10]);
      ctx.save();
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(...pos, ...size);
      ctx.restore();
      if (this.data) {
        ctx.save();
        ctx.strokeStyle = "rgb(255,255,255)";
        this.data.forEach((val, index, array) => {
          const rate = [index / (array.length - 1), Float.inverseMix(0, 255, val)];
          const loc = [Float.mix(pos[0], pos[0] + size[0], rate[0]), Float.mix(pos[1], pos[1] + size[1], rate[1])];
          if (index === 0) {
            ctx.moveTo(...loc);
          } else {
            ctx.lineTo(...loc);
          }
        });
        ctx.stroke();
        ctx.restore();
      }
    }
  }
  DrawWaveClass.title = "DrawWave";
  DrawWaveClass.title_color = "#345";
  DrawWaveClass.shape = LiteGraph.ROUND_SHAPE;
  DrawWaveClass.size = [200, 200];
  LiteGraph.registerNodeType("basic/drawWave", DrawWaveClass);
}
/*{
  const Sum = (a, b) => a + b;
  LiteGraph.wrapFunctionAsNode("math/sum", Sum, ["Number", "Number"], "Number");
}*/

const graph = new LGraph();
/*function LGraphCanvas0() {
  this.constructor(...arguments);
}
LGraphCanvas0.prototype = LGraphCanvas.prototype;*/
//LGraphCanvas0.prototype.constructor = LGraphCanvas;

/*class LGraphCanvas0 extends LGraphCanvas {
  constructor() {
    super(...arguments);
  }
  getCanvasMenuOptions() {
    console.log("aaa");
    return [];
  }
  getExtraMenuOptions(a, b) {
    console.log("waaa", a, b);
    return [
      {
        content: "ABC",
        has_submenu: false,
        callback: () => {},
      },
    ];
  }
}
LGraphCanvas0.prototype = LGraphCanvas.prototype;
LGraphCanvas0.prototype.constructor = LGraphCanvas;
//const canvas = new LGraphCanvas0("#mycanvas", graph);*/

LGraphCanvas.prototype.getMenuOptions = function () {
  const options = [
    {
      title: "新增節點",
      content: "Add Node",
      has_submenu: true,
      callback: LGraphCanvas.onMenuAdd,
    },
    {
      title: "測試選單",
      content: "test",
      has_submenu: true,
      callback: (node, options, e, prev_menu, callback) => {
        new LiteGraph.ContextMenu(
          [
            {
              title: "測試項目",
              content: "testItem",
              has_submenu: false,
              callback: () => {},
            },
          ],
          {
            event: e,
            callback: () => {
              console.log("bbb");
            },
            parentMenu: prev_menu,
          }
        );
      },
    },
    {
      title: "新增群組",
      content: "Add Group",
      callback: LGraphCanvas.onGroupAdd,
    },
  ];
  if (this._graph_stack && this._graph_stack.length > 0) {
    options.push(null, {
      content: "Close subgraph",
      callback: this.closeSubgraph.bind(this),
    });
  }
  return options;
};
/*LGraphCanvas.prototype.getExtraMenuOptions = function () {
  return [
    {
      content: "ABC",
      has_submenu: false,
      callback: () => {},
    },
  ];
};*/

const canvas = new LGraphCanvas("#mycanvas", graph);

//console.log(graph, canvas);

//console.log(LiteGraph);

/*const node_const = LiteGraph.createNode("basic/const");
node_const.pos = [200, 200];
graph.add(node_const);
node_const.setValue(4.5);

const node_watch = LiteGraph.createNode("basic/watch");
node_watch.pos = [700, 200];
graph.add(node_watch);

node_const.connect(0, node_watch, 0);*/

/*_.wrap(nodes["basic/sum"].prototype, "collapse", (collapse) => {
  alert("don't collapse this one!");
  // collapse()
});*/

const node_init = LiteGraph.createNode("events/init");
node_init.pos = [600, 400];
graph.add(node_init);

const node_sum = LiteGraph.createNode("basic/sum");
node_sum.pos = [800, 400];
graph.add(node_sum);

node_init.connect(0, node_sum, 0);

const node_timer = LiteGraph.createNode("events/timer");
node_timer.pos = [50, 400];
node_timer.properties.interval = 1000 / 12;
graph.add(node_timer);

const node_drawWave = LiteGraph.createNode("basic/drawWave");
node_drawWave.pos = [250, 400];
graph.add(node_drawWave);

node_timer.connect(0, node_drawWave, 0);

//添加節點功能
/*LiteGraph.addNodeMethod("abcd", () => {
  console.log("asdasd");
});
console.log(node_sum.abcd);*/

/*const node_time = LiteGraph.createNode("basic/time");
node_time.pos = [200, 500];
graph.add(node_time);

const node_console = LiteGraph.createNode("basic/console");
node_console.mode = LiteGraph.ALWAYS;
node_console.pos = [700, 500];
graph.add(node_console);

node_time.connect(0, node_console, 1);*/

//graph.start();

/*const nodes = LiteGraph.registered_node_types;
// console.log(nodes["basic/sum"]);
// console.log(nodes["audio/analyser"]);
// console.log(nodes["audio/adsr"]);
// console.log(nodes["basic/boolean"]);
for (let key in nodes) {
  LiteGraph.unregisterNodeType(nodes[key]);
}
console.log(canvas.getExtraMenuOptions);*/

let bool = false;
const go_btn = document.getElementById("go_btn");
go_btn.addEventListener("click", () => {
  bool = !bool;
  if (bool) {
    graph.start();
    go_btn.textContent = "stop";
  } else {
    graph.stop();
    go_btn.textContent = "start";
  }
});
go_btn.click();
