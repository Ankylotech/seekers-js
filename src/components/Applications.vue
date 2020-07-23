<template>
    <div>
        <div id="dynamic-component-demo" class="demo">
                <button
                        v-for="tab in tabs"
                        v-bind:key="tab"
                        v-bind:class="['tab-button', { active: currentTab === tab }]"
                        v-on:click="currentTab = tab"
                >
                    {{ tab }}
                </button>
                <keep-alive>
                    <Dashboard v-if="currentTabComponent==='Dashboard'" :application="application" :ID="ID"/>
                    <Timeline v-else :application="application" :ID="ID"/>
                </keep-alive>
        </div>
    </div>
</template>

<script>
    import Timeline from "./Timeline/Timeline.vue";
    import Dashboard from "./Dashboard/Dashboard.vue"
    export default {
        name: "Applications",
        components: {
            Timeline,
            Dashboard
        },
        data: function() {
            return {
                tabs: ['Dashboard','Timeline'],
                currentTab: 'Dashboard'
            };
        },
        props: {
            application: String,
            ID: String
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
        padding: 4px 200px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        border: 1px solid darkslategray;
        cursor: pointer;
        background: #f0f0f0;
        margin-bottom: -10px;
        margin-right: -1px;
        font-size: 20px;
        clip-path: polygon(0 0, 95% 0, 100% 100%, 0% 100%);
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