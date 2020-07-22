<template>
    <div>
        <svg v-if="hasLoaded" :id="device">

        </svg>
        <h4 v-else> Loading Device Timeline. Please Wait</h4>
    </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        data() {
            return {
                data: {},
                hasLoaded: false
            };
        },
        props: {
            application: String,
            device: String
        },
        methods: {
            getChart: function () {
                Object.values(this.data).forEach((data) => {
                    console.log(data)
                    let margin = ({top: 20, right: 30, bottom: 30, left: 40})
                    let height = 200
                    let width = 500
                    let selector = "#" + this.device;
                    let svg;
                    svg = d3.select(selector);
                    svg.attr("viewBox", [0, 0, width, height]);
                    let yAxis = g => g
                        .attr("transform", `translate(${margin.left},0)`)
                        .call(d3.axisLeft(y))
                        .call(g => g.select(".domain").remove())
                        .call(g => g.select(".tick:last-of-type text").clone()
                            .attr("x", 3)
                            .attr("text-anchor", "start")
                            .attr("font-weight", "bold")
                            .text(data.y))
                    let y = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.value)]).nice()
                        .range([height - margin.bottom, margin.top])
                    let xAxis = g => g
                        .attr("transform", `translate(0,${height - margin.bottom})`)
                        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
                    let x = d3.scaleUtc()
                        .domain(d3.extent(data, d => d.date))
                        .range([margin.left, width - margin.right])
                    let line = d3.line()
                        .defined(d => !isNaN(d.value))
                        .x(d => x(d.date))
                        .y(d => y(d.value))

                    svg.append("g")
                        .call(xAxis);

                    svg.append("g")
                        .call(yAxis);

                    svg.append("path")
                        .datum(data)
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1.5)
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("d", line);
                })
            },
            getData: async function(application = this.application){
                this.hasLoaded = false;
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/devices/' + this.device).then((response) => {
                    response.json().then((applicationData) => {
                        this.hasLoaded = true;
                        for(let i = 0; i < applicationData.length; i++){
                            let datapoint = applicationData[i];
                            let date = datapoint.uploadedAt._seconds;
                            delete datapoint.uploadedAt;
                            Object.keys(datapoint).forEach((key) => {

                                if(!this.data[key]) this.data[key] = [];
                                this.data[key].push(Object.assign({date: date, value: datapoint[key]},{y:'ppm'}));
                            });
                        }
                        this.getChart();
                    })
                });

            }

        },
        mounted() {
            this.getData();
        }
    };
</script>

<style>
    .range-input {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
    }
    input {
        margin-left: 10px;
    }
</style>