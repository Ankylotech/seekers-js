<template>
  <div>
    <v-card id="timeline" v-if="hasLoaded">
      <v-card-title id="devicename"> {{ device }}</v-card-title>
      <v-divider light/>
      <v-row v-if="values.length > 0" justify="space-around">
        <v-checkbox v-for="value in values" :key="value" :class="color(value) + '--text'" :color="color(value)"
                    :label="value" :value="value" v-model="showTimeline"></v-checkbox>
      </v-row>
      <v-card v-else>
        <h2> Loading Device Data. Please Wait. </h2>
        <v-progress-linear indeterminate></v-progress-linear>
      </v-card>
      <v-divider light/>
      <svg :id="device">
      </svg>
    </v-card>
    <v-card v-else>
      <h2> Loading Device Timeline. Please Wait. </h2>
      <v-progress-linear indeterminate></v-progress-linear>
    </v-card>
  </div>
</template>

<script>
const d3 = require('d3');

export default {
  data() {
    return {
      data: {},
      hasLoaded: true,
      showTimeline: [],
      values: [],
      dateBorders: {}
    };
  },
  props: {
    application: String,
    device: String,
    colors: Object,
    token: String
  },
  updated() {
    this.getChart();
  },
  methods: {
    getChart: function () {
      const selector = "#" + this.device;
      let svg = d3.select(selector);
      svg.selectAll('*').remove();
      const margin = ({top: 20, right: 40, bottom: 30, left: 40});
      const height = 120;
      const width = 400;
      svg.attr("viewBox", [0, 0, width, height]);
      let focusText = d3.select(selector);
      let focus = d3.select(selector);
      let data = [];
      let focusReq = this.showTimeline.length === 1;
      let y = d3.scaleLinear()
          .domain([0, 100])
          .range([height - margin.bottom, margin.top])


      let bisect = d3.bisector(function (d) {
        return d.date;
      }).left;

      // What happens when the mouse move -> show the annotations at the right positions.
      function mouseover() {
        if (focusReq) {
          focus.style("opacity", 1)
          focusText.style("opacity", 1)
        }
      }

      let unit = this.unit(this.showTimeline[0]);
      let dateMax = this.dateBorders.max;

      function mousemove() {
        if (focusReq) {
          // recover coordinate we need
          let x0 = x.invert(d3.mouse(this)[0]);
          let i = bisect(data, x0, 1);
          let selectedData = data[i];
          let text = selectedData.value + " " + unit
          if (selectedData) {
            focus
                .attr("cx", x(selectedData.date.toString()))
                .attr("cy", y(selectedData.value))
            focusText
                .html(text)
                .attr("x", x(selectedData.date) + 5)
                .attr("y", 15)
            if (x(selectedData.date) > x(dateMax) / 2) {
              focusText.attr("x", x(selectedData.date) - text.length * 9)
                  .attr("text-anchor", "right")
            }
          }
        }
      }

      function mouseout() {
        if (focusReq) {
          focus.style("opacity", 0)
          focusText.style("opacity", 0)
        }
      }


      let xAxis = g => g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x).ticks(width / 60).tickSizeOuter(0))
      let x = d3.scaleUtc()
          .domain([this.dateBorders.min, this.dateBorders.max])
          .range([margin.left, width - margin.right])

      svg.append("g")
          .call(xAxis);
      Object.keys(this.data).forEach((key) => {
        if (this.showTimeline.includes(key)) {
          data = [];
          let min = d3.min(this.data[key], d => d.value);
          let max = d3.max(this.data[key], d => d.value);
          let yAxis = g => g
              .attr("transform", `translate(${margin.left},0)`)
              .call(d3.axisLeft(y).ticks(height / 40))

          svg.append("text")
              .attr("text-anchor", "end")
              .attr("y", -margin.left + 20)
              .attr("x", -margin.top)
              .text("Y axis title")

          if (this.showTimeline.length > 1) {

            this.data[key].forEach((datapoint) => {
              if (min !== max) data.push({
                value: (datapoint.value - min) * 100 / (max - min),
                date: datapoint.date
              });
              else data.push({
                value: 50,
                date: datapoint.date
              });
            })
          } else {
            this.data[key].forEach((datapoint) => {
              data.push(datapoint)
            })
            y = d3.scaleLinear()
                .domain([min, max])
                .range([height - margin.bottom, margin.top])
          }
          svg.append("g")
              .call(yAxis);


          let line = d3.line()
              .defined(d => !isNaN(d.value))
              .x(d => x(d.date))
              .y(d => y(d.value))


          svg.append("path")
              .datum(data)
              .attr("fill", "none")
              .attr("stroke-width", 0.75)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("d", line)
              .attr("stroke", this.color(key))
              .attr("id", key);
          if (focusReq) {
            focus = svg
                .append('g')
                .append('circle')
                .style("fill", "none")
                .attr("stroke", "black")
                .attr('r', 2)
                .style("opacity", 0)

            // Create the text that travels along the curve of chart
            focusText = svg
                .append('g')
                .append('text')
                .style("opacity", 0)
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "middle")
          }
        }
      })
      svg.append('rect')
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr('width', width)
          .attr('height', height)
          .on('mouseover', mouseover)
          .on('mousemove', mousemove)
          .on('mouseout', mouseout);
    },
    getData: async function (application = this.application) {
      fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/devices/' + this.device).then((response) => {
        response.json().then((applicationData) => {
          for (let i = 0; i < applicationData.length; i++) {
            let datapoint = applicationData[i];
            let date = new Date(1970, 0, 1, 4).setSeconds(datapoint.uploadedAt._seconds);
            if (!this.dateBorders.min || date < this.dateBorders.min) this.dateBorders.min = date;
            if (!this.dateBorders.max || date > this.dateBorders.max) this.dateBorders.max = date;
            delete datapoint.uploadedAt;
            Object.keys(datapoint).sort().forEach((key) => {
              if (!this.values.includes(key)) {
                this.values.push(key);
              }
              if (!this.data[key]) this.data[key] = [];
              this.data[key].push(Object.assign({date: date, value: datapoint[key]}, {y: this.unit(key)}));
            });
          }
          this.getChart();
        })
      });

    },
    color: function (value) {
      let color = this.colors[value];
      if (!color) color = "#4682b4";
      return color;
    },
    unit: function (value) {
      switch (value) {
        case 'co2':
          return 'ppm';
        case 'temperature':
          return '°C';
        case 'light':
          return 'Lux';
        case 'vdd':
          return 'V';
        case 'humidity':
          return '%Rh';
        default:
          return '';
      }
    }

  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>

input {
  margin-left: 10px;
}

.axis + .axis g text {
  display: none;
}

#co2 {
  color: red;
}

#temperature {
  color: blue;
}

#humidity {
  color: #00ffff;
}

#light {
  color: orange;
}

#motion {
  color: #556b2f;
}
</style>