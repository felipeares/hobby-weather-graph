import "./index.css";
import Years from "./data/data_min.json";

class GraphComponent {
  constructor(graph_container) {
    // get the parent object and the size properties
    this.graph_container = graph_container;
    this.parent_width = this.graph_container.getBoundingClientRect().width;
    this.parent_height = this.graph_container.getBoundingClientRect().height;

    // graph alert properties and sizing
    this.max_temp = 45;
    this.alert_temp = 35;
    this.max_per = 40;
    this.graph_radio = (this.max_per / 100) * this.parent_width;

    // run
    this.run();
  }

  /* --------------------- SVG BUILDERS --------------------- */
  createMainSvg() {
    const main_svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    main_svg.setAttribute("width", this.parent_width);
    main_svg.setAttribute("height", this.parent_height);
    main_svg.classList.add("main-svg");
    this.graph_container.appendChild(main_svg);
    return main_svg;
  }

  createTitle(main_svg) {
    // create group
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("title-group");
    main_svg.appendChild(group);

    // create text
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.classList.add("title");
    text.innerHTML = "Santago, Chile - temperaturas sobre los 35ºC 1980-2019";
    group.appendChild(text);

    let subtitle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    subtitle.classList.add("subtitle");
    subtitle.innerHTML =
      "*Temperatura del Aire Seco Estación Quinta Normal, Santiago. meteochile.gob.cl";
    subtitle.setAttribute("y", "2.5%");
    group.appendChild(subtitle);

    // create line
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList.add("title-line");
    line.setAttribute("x1", "0%");
    line.setAttribute("x2", "94%");
    line.setAttribute("y1", "0%");
    line.setAttribute("y2", "0%");
    group.appendChild(line);
  }

  createGraphGroup(main_svg) {
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("graph-group");
    main_svg.appendChild(group);
    return group;
  }

  drawInnerCircles(graph_svg) {
    let circles = [];
    const params = [
      // max temp
      {
        r: this.max_per,
        c: "outter"
      },
      // alert temp
      {
        r: Math.round((this.alert_temp / this.max_temp) * this.max_per),
        c: "inner-3"
      },
      // 25 ºC
      {
        r: Math.round((25 / this.max_temp) * this.max_per),
        c: "inner-2"
      },
      // 15 ºC
      {
        r: Math.round((15 / this.max_temp) * this.max_per),
        c: "inner-1"
      }
    ];
    for (let c of params) {
      let circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", "50%");
      circle.setAttribute("cy", "50%");
      circle.setAttribute("r", c.r + "%");
      circle.classList.add("axis-circle", c.c);
      graph_svg.appendChild(circle);
      circles.push(circle);
    }
    return circles;
  }

  drawInnerLinesSeparator(graph_svg) {
    let lines = [];
    for (let i = 1; i <= 12; i++) {
      let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", "50%");
      line.setAttribute("y1", "50%");
      line.setAttribute("x2", "50%");
      line.setAttribute("y2", "10%");
      line.setAttribute(
        "transform",
        `rotate(${(i - 1) * (360 / 12)}, 
        ${Math.round(this.parent_width / 2)}, 
        ${Math.round(this.parent_width / 2)})`
      );
      line.classList.add("month-separator");
      graph_svg.appendChild(line);
      lines.push(line);
    }
    return lines;
  }

  drawMonthsTexts(graph_svg) {
    let texts = [];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septriembre",
      "octubre",
      "noviembre",
      "diciembre"
    ];
    for (let i = 1; i <= 12; i++) {
      // crate the text element
      let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "50%");
      text.setAttribute("y", "9%");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute(
        "transform",
        `rotate(
          ${(i - 1) * (360 / 12) + 360 / (12 * 2)},
          ${Math.round(this.parent_width / 2)},
          ${Math.round(this.parent_width / 2)}
        )`
      );
      text.classList.add("month-text");
      text.innerHTML = months[i - 1];
      graph_svg.appendChild(text);
      texts.push(text);
    }
    return texts;
  }

  createGraphLabels(graph_svg) {
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("chart-labels");
    group.innerHTML = `
      <rect class="color-label inner-1"></rect>
      <rect class="color-label inner-2"></rect>
      <rect class="color-label inner-3"></rect>
      <rect class="color-label outter"></rect>
      <text class="label-text inner-1">00-15ºC</text>
      <text class="label-text inner-2">16-25ºC</text>
      <text class="label-text inner-3">26-35ºC</text>
      <text class="label-text outter">36-45ºC</text>
    `;
    graph_svg.appendChild(group);
    return group;
  }

  createPathsGroup(graph_svg) {
    let path_group = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    path_group.classList.add("paths");
    graph_svg.appendChild(path_group);
    return path_group;
  }

  createYearsPaths(years, path_group) {
    let years_paths = {};
    for (let year of years) {
      let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path_group.appendChild(path);
      years_paths[year.year] = path;
    }
    return years_paths;
  }

  getCoordinatesFromPoint(p) {
    const angle =
      (p.m - 1) * ((2 * Math.PI) / 12) + ((2 * Math.PI) / 12 / 31) * (p.d - 1);
    const x = (p.t / this.max_temp) * this.graph_radio * Math.sin(angle);
    const y = -1 * ((p.t / this.max_temp) * this.graph_radio) * Math.cos(angle);
    return [Math.round(100 * x) / 100, Math.round(100 * y) / 100];
  }

  getSleepTimeOnMonth(month, year) {
    const delay = year <= 2000 ? 0 : 10;
    if (month == 11) return delay * 1.0;
    if (month == 12) return delay * 2.5;
    if (month == 1) return delay * 2.0;
    if (month == 2) return delay * 2.0;
    if (month == 3) return delay * 1.5;
    if (month == 4) return delay * 1.0;
    return delay * 0.0;
  }

  drawAlertCricle(path_group, p) {
    const coord = this.getCoordinatesFromPoint(p);
    let circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", coord[0]);
    circle.setAttribute("cy", coord[1]);
    circle.setAttribute("r", "1%");
    circle.classList.add("alert-circle");
    path_group.appendChild(circle);
  }

  createYearText(graph_svg) {
    // create group
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("year-text");
    graph_svg.appendChild(group);

    let subtitle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    subtitle.classList.add("year-subtitle");
    subtitle.innerHTML = "AÑO";
    group.appendChild(subtitle);

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.classList.add("year-text");
    text.innerHTML = "";
    text.setAttribute("x", "-1.0%");
    text.setAttribute("y", "6%");
    group.appendChild(text);
    return text;
  }

  updateYearText(years_text, year) {
    years_text.innerHTML = year;
  }

  createBubble(graph_svg) {
    // first create group
    let path_group = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    path_group.classList.add("bubble-group");
    graph_svg.appendChild(path_group);

    // create alert bubble
    let circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.classList.add("bubble");
    path_group.appendChild(circle);

    // create bubble text
    let text_bubble = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    text_bubble.classList.add("text-bubble");
    text_bubble.setAttribute("x", "50%");
    text_bubble.setAttribute("y", "50%");
    text_bubble.setAttribute("text-anchor", "middle");
    text_bubble.innerHTML = 0;
    path_group.appendChild(text_bubble);

    // create bubble subtitle
    let subtitle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    subtitle.classList.add("text-bubble-subtitle");
    subtitle.setAttribute("x", "50%");
    subtitle.setAttribute("y", "52.5%");
    subtitle.setAttribute("text-anchor", "middle");
    subtitle.innerHTML = "ALERTAS";
    path_group.appendChild(subtitle);

    // return object with elements
    return { group: path_group, bubble: circle, text: text_bubble, n: 0 };
  }

  async updateBubble(bubble) {
    // update first class
    if (bubble.n == 0) {
      bubble.group.classList.add("changed");
    }

    // update text
    bubble.n += 1;
    bubble.text.innerHTML = bubble.n;

    // set and unset class
    bubble.group.classList.add("updated");
    await new Promise(resolve => setTimeout(resolve, 600));
    bubble.group.classList.remove("updated");
  }

  createFinalTextGroup(graph_svg, acumulative_cases) {
    // get the % for the last xx years
    const years = 10;
    const final = acumulative_cases[acumulative_cases.length - 1];
    const diff = final - acumulative_cases[acumulative_cases.length - years];
    const perc = Math.round((100 * diff) / final);

    // first create group
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("final-text-group");
    graph_svg.appendChild(group);

    // create texts
    const texts = [
      { t: "En los últimos 40 años", c: "ft-1" },
      { t: "hubo", c: "ft-2" },
      { t: "días", c: "ft-3" },
      { t: "donde la temperatura", c: "ft-4" },
      { t: `máxima superó los ${this.alert_temp}ºC`, c: "ft-5" },
      { t: perc + "%", c: "ft-6" },
      { t: "de los casos ocurrieron", c: "ft-7" },
      { t: `en los últimos ${years} años`, c: "ft-8" }
    ];
    for (let t of texts) {
      // create an inner group for CSS translate use
      let text_group = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      text_group.classList.add("final-text", t.c);
      group.appendChild(text_group);

      // create the text
      let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.innerHTML = t.t;
      text_group.appendChild(text);
    }
    return group;
  }

  /* ------------------------- DATA ------------------------- */
  async getRemoteData(url) {
    const years = await fetch(url).then(r => r.json());
    return years;
  }

  async getRealData() {
    return Years;
  }

  /* ------------------------- MAIN ------------------------- */
  async run() {
    console.time("total");

    // get data
    const years = await this.getRealData();

    // create a svg object and append it to the parent
    const main_svg = this.createMainSvg();

    // create title
    this.createTitle(main_svg);

    // create a group containing the graph
    const graph_svg = this.createGraphGroup(main_svg);

    // draw the inner circles (ºC axis)
    this.drawInnerCircles(graph_svg);

    // draw the month lines separators
    this.drawInnerLinesSeparator(graph_svg);

    // draw the month text
    this.drawMonthsTexts(graph_svg);

    // draw the labels
    this.createGraphLabels(graph_svg);

    // wait for viewer to catch on
    await new Promise(resolve => setTimeout(resolve, 1500));

    // draw graph path
    // create group
    const path_group = this.createPathsGroup(graph_svg);

    // create paths elements for all years
    let years_paths = this.createYearsPaths(years, path_group);

    // create years text
    let years_text = this.createYearText(graph_svg);

    // draw the alert bubble
    let bubble = this.createBubble(graph_svg);

    // initiate the acumulative cases
    let acumulative_cases = [];

    // DRAW!
    let first_alert = false;
    let years_passed = 0;
    for (let year of years) {
      // get the year path
      let path = years_paths[year.year];

      // update text
      this.updateYearText(years_text, year.year);

      // draw the first point
      const p = year.graph_points[0];
      const coord = this.getCoordinatesFromPoint(p);
      let d = `M ${coord[0]} ${coord[1]} `;

      // if temperature above alert_temp
      if (p.t > this.alert_temp) {
        this.drawAlertCricle(path_group, p);
        this.updateBubble(bubble);
      }

      // draw the rest
      for (let p of year.graph_points) {
        // wait to render
        if (!first_alert) {
          if (years_passed <= 2) {
            if (p.m == 12 || p.m <= 4) {
              await new Promise(resolve => setTimeout(resolve, 10));
            } else if (p.d % 4 == 0) {
              await new Promise(resolve => setTimeout(resolve, 0));
            }
          }
          if (p.d % 6 == 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        } else {
          if (p.m == 12 || p.m <= 4) {
            await new Promise(resolve => setTimeout(resolve, 10));
          } else if (p.d % 4 == 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        // draw line
        const coord = this.getCoordinatesFromPoint(p);
        d += `L ${coord[0]} ${coord[1]} `;
        path.setAttribute("d", d);

        // if temperature above alert_temp
        if (p.t > this.alert_temp) {
          first_alert = true;
          this.drawAlertCricle(path_group, p);
          this.updateBubble(bubble);
        }
      }

      // change year class
      path.classList.add(["old-year"]);

      // passed
      years_passed += 1;

      // save acumulative
      const a = bubble.n;
      acumulative_cases.push(a);
    }

    // start final animation
    bubble.group.classList.add("ended");

    // create final text group
    this.createFinalTextGroup(graph_svg, acumulative_cases);

    console.timeEnd("total");
  }
}

export default GraphComponent;
