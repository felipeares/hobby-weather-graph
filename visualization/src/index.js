import GraphComponent from "./components/graph.component/index.js";
import "./index.css";

(function() {
  // check if SAFARI (doesn't work there)
  const isSafari =
    navigator.vendor &&
    navigator.vendor.indexOf("Apple") > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf("CriOS") == -1 &&
    navigator.userAgent.indexOf("FxiOS") == -1;

  // create graph container
  const graph_container = document.createElement("div");
  graph_container.classList.add("graph-container");
  if (isSafari) graph_container.classList.add("safari");
  document.body.appendChild(graph_container);

  // create and append graph component
  const graph_component = new GraphComponent(graph_container);

  // create the bottom label
  const label = document.createElement("div");
  label.classList.add("label");
  label.innerHTML = `
    <p>felipeares - 2019</p>
    <p class="sm">revisa el código en <a href="https://github.com/felipeares/hobby-weather-graph">github</a></p>
  `;
  document.body.appendChild(label);
})();
