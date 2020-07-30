<template>
    <div>
        <v-card id="timeline" v-if="hasLoaded">
            <v-card-text id="devicename" > {{device}} </v-card-text>
            <v-row v-if="values.length > 0" justify="space-around">
                <v-checkbox v-for="value in values" :key="value" :class="color(value) + '--text'"  :color="color(value)" :label="value" :value="value" v-model="showTimeline" ></v-checkbox>
            </v-row>
            <v-card v-else>
                <h2> Loading Device Data. Please Wait. </h2>
                <v-progress-linear indeterminate></v-progress-linear>
            </v-card>
            <svg  :id="device">
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



                let xAxis = g => g
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(x).ticks(width / 60).tickSizeOuter(0))
                let x = d3.scaleUtc()
                    .domain([this.dateBorders.min,this.dateBorders.max])
                    .range([margin.left, width - margin.right])

                svg.append("g")
                    .call(xAxis);
                Object.keys(this.data).forEach((key) => {
                    if(this.showTimeline.includes(key)) {
                        let data = [];
                        let min = d3.min(this.data[key], d => d.value);
                        let max = d3.max(this.data[key], d => d.value);
                        let yAxis = g => g
                            .attr("transform", `translate(${margin.left},0)`)
                            .call(d3.axisLeft(y).ticks(height/40))
                        let y;

                        if(this.showTimeline.length > 1) {
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
                          y = d3.scaleLinear()
                              .domain([0, 100])
                              .range([height - margin.bottom, margin.top])
                        }else {
                          this.data[key].forEach((datapoint) => {
                            data.push(datapoint)
                          })
                          y = d3.scaleLinear()
                              .domain([min,max])
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
                            .attr("id",key);
                    }
                })
            },
            getData: async function(application = this.application){
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/devices/' + this.device).then((response) => {
                    response.json().then((applicationData) => {
                        for(let i = 0; i < applicationData.length; i++){
                            let datapoint = applicationData[i];
                            let date = new Date(1970,0,1,4).setSeconds(datapoint.uploadedAt._seconds);
                            if(!this.dateBorders.min || date < this.dateBorders.min) this.dateBorders.min = date;
                            if(!this.dateBorders.max || date > this.dateBorders.max) this.dateBorders.max = date;
                            delete datapoint.uploadedAt;
                            Object.keys(datapoint).sort().forEach((key) => {
                                if(!this.values.includes(key)) {
                                    this.values.push(key);
                                }
                                if(!this.data[key]) this.data[key] = [];
                                this.data[key].push(Object.assign({date: date, value: datapoint[key]},{y:'ppm'}));
                            });
                        }
                        this.getChart();
                    })
                });

            },
            color: function(value){
                let color = this.colors[value];
                if (!color) color = "#4682b4";
                return color;
            }

        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>
    #devicename {
        font-size: 40px;
        font-weight: bold;
        padding-left: 20px;
        padding-top: 40px;
    }

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