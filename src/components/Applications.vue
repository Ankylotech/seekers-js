<template>
    <div>
        <div id="dynamic-component-demo" class="demo">
            <p>
                <button
                        v-for="tab in tabs"
                        v-bind:key="tab"
                        v-bind:class="['tab-button', { active: currentTab === tab }]"
                        v-on:click="currentTab = tab"
                >
                    {{ tab }}
                </button>
            </p>
            <p>
                <component v-on:application-change="application=$event" v-bind:is="currentTabComponent" class="tab" v-bind:application="application"></component>
            </p>
        </div>
    </div>
</template>

<script>
    import Timeline from "./Timeline/Chart.vue";
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
            application: String
        },
        computed: {
            currentTabComponent: function() {
                console.log('app: ' + this.application);
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