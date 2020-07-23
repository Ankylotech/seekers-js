<template>
    <div>
        <div id="timeline" v-if="hasLoaded">
            <br>
            <span id="Deviename"> {{device}} </span>
            <span v-for="value in values" :key="value">
                <input checked type="checkbox"  :value="value" v-model="showTimeline" >
                <label :id="value" :for="value">{{value}}</label>
            </span>
            <br>
            <svg  :id="device">
                Loading, please Wait
            </svg>
        </div>
        <h4 v-else> Loading Device Timeline. Please Wait</h4>
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
            colors: Object
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
                let yAxis = g => g
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(y).ticks(height/40))
                let y = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height - margin.bottom, margin.top])

                let xAxis = g => g
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(x).ticks(width / 60).tickSizeOuter(0))
                let x = d3.scaleUtc()
                    .domain([this.dateBorders.min,this.dateBorders.max])
                    .range([margin.left, width - margin.right])

                svg.append("g")
                    .call(yAxis);

                svg.append("g")
                    .call(xAxis);
                Object.keys(this.data).forEach((key) => {
                    if(this.showTimeline.includes(key)) {
                        let data = this.data[key];
                        let min = d3.min(data, d => d.value);
                        let max = d3.max(data, d => d.value);


                        data.forEach((datapoint) => {
                            if(min !== max) datapoint.value = (datapoint.value-min)*100/(max-min);
                            else datapoint.value = 50;
                        })


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
                if (!color) color = "steelblue";
                return color;
            }

        },
        mounted() {
            this.getData();
            this.color();
        }
    };
</script>

<style scoped>
    #timeline {
        border: 4px solid black;
    }

    #Deviename {
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
    label {
        font-size: 30px;
        -webkit-text-stroke: 1px gray;
        color: steelblue;
    }
    #co2 {
        color: red;
    }
    #temperature {
        color: blue;
    }
    #humidity {
        color: aqua;
    }
    #light {
        color: orange;
    }
    #motion {
        color: darkolivegreen;
    }
</style>