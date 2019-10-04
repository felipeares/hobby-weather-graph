const cheerio = require("cheerio");
const fetch = require("node-fetch");
const fs = require("fs");

class ClimaScraper {
  constructor() {}

  getAllDatesFromTo(from, to) {
    let dates = [];
    for (let y = from; y <= to; y++) {
      for (let m = 1; m <= 12; m++) {
        if (y == 2019 && m > 9) continue;
        dates.push([y, m]);
      }
    }
    return dates;
  }

  async getDaysInfo(year, month) {
    // build url
    const url = `https://climatologia.meteochile.gob.cl/application/mensuales/temperaturaMediaMensual/330020/${year}/${month}`;

    // get request response
    const res = await fetch(url);

    // get html text
    const html = await res.text();

    // get dom operator
    const $ = cheerio.load(html);

    // initiate month output
    let output = {
      y: year,
      m: month,
      values: []
    };

    // get all rows from main table
    $("tr.text-center").each(function() {
      // check for

      // get all row values in an array
      const values = $(this)
        .children("td.text-center")
        .map(function() {
          return $(this)
            .text()
            .replace(/[\\n\s]+/gi, "");
        })
        .get();

      // insert values into an object
      // only if get 10 elements
      if (values.length == 10) {
        output.values.push({
          d: values[0],
          t_12: values[1],
          t_00: values[2],
          t_min: values[3],
          t_min_time: values[4],
          t_max: values[5],
          t_max_time: values[6],
          mean_clim: values[7],
          mean_arit: values[8],
          data: values[9]
        });
      }
    });

    return output;
  }

  saveJsonFile(json, name) {
    fs.writeFileSync(name, JSON.stringify(json));
  }

  saveMinifiedData() {
    // open file
    let rawdata = fs.readFileSync("./data.json");
    let data = JSON.parse(rawdata);

    // iterate over the years, saving only the t_max value
    let years = {};
    for (let entry of data) {
      // check if year exists
      if (!years[entry.y]) {
        years[entry.y] = [];
      }

      // add new values for the month
      for (let value of entry.values) {
        years[entry.y].push({
          m: Number.parseInt(entry.m),
          d: Number.parseInt(value.d),
          t: Number.parseFloat(value.t_max)
        });
      }
    }

    // dict to array
    const output = Object.keys(years).map(year => {
      return {
        year: Number.parseInt(year),
        graph_points: years[year]
      };
    });

    // save
    this.saveJsonFile(output, "./data_min.json");
  }

  async run() {
    let output = [];
    const dates = this.getAllDatesFromTo(1980, 2019);

    let firs_year = dates[0][0];
    for (let date of dates) {
      const values = await this.getDaysInfo(date[0], date[1]);
      output.push(values);
      console.log(`extracted ${date[0]}/${date[1]}`);

      if (date[0] != firs_year) {
        firs_year = date[0];
        this.saveJsonFile(output, "./data.json");
        console.log(`saved year ${date[0]}`);
      }
    }
    this.saveJsonFile(output, "./data.json");
    console.log("saved final");

    this.saveMinifiedData();
    console.log("minified");
  }
}

const clima = new ClimaScraper();
clima.saveMinifiedData();
