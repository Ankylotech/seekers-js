<template>
    <div>
        <label for="applications">Choose an Application:  </label>
        <select name="applications" id="applications">
            <option v-for="apps in applications" :key="apps" :value="apps">
                {{apps}}
            </option>
        </select>
        <div id="dynamic-component-demo" class="demo">
            <button
                    v-for="tab in tabs"
                    v-bind:key="tab"
                    v-bind:class="['tab-button', { active: currentTab === tab }]"
                    v-on:click="currentTab = tab"
            >
                {{ tab }}
            </button>

            <component v-bind:is="currentTabComponent" class="tab"></component>
        </div>
    </div>
</template>

<script>
    import Timeline from "./Chart.vue";
    import Dashboard from "./Dashboard.vue"
    export default {
        name: "Applications",
        components: {
            Timeline,
            Dashboard
        },
        data: function() {
            return {
                applications: [],
                tabs: ['Dashboard','Timeline'],
                currentTab: 'Dashboard'
            };
        },
        mounted() {
            this.fetchApplicationsList()
        },
        methods: {
            fetchApplicationsList() {
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/').then((response) => {
                    response.json().then((apps) => {
                        this.applications = apps;
                    })
                });
            }
        },
        computed: {
            currentTabComponent: function() {
                return this.currentTab;
            }
        }
    }

</script>

<style scoped>
    .tab-button {
        padding: 6px 10px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        border: 1px solid #ccc;
        cursor: pointer;
        background: #f0f0f0;
        margin-bottom: -1px;
        margin-right: -1px;
    }
    .tab-button:hover {
        background: #e0e0e0;
    }
    .tab-button.active {
        background: #e0e0e0;
    }
    .tab {
        border: 1px solid #ccc;
        padding: 10px;
    }
</style>