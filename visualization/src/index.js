import GraphComponent from "./components/graph.component/index.js";
import "./index.css";

(function() {
  // create graph container
  const graph_container = document.createElement("div");
  graph_container.classList.add("graph-container");
  document.body.appendChild(graph_container);

  // create graph and append it to the the graph container
  const graph_component = new GraphComponent(graph_container);
})();
