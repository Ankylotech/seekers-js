<template>
    <div>
    <label for="applications">Choose an Application:  </label>
    <select name="applications" id="applications">
        <option v-for="apps in applications" :key="apps" :value="apps">
            {{apps}}
        </option>
    </select>
    </div>
</template>

<script>
    export default {
        name: "Applications",
        data: function() {
            return {
                applications: []
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
                        console.log("got this Data: " + apps);
                    })
                });
            }
        }
    }

</script>

<style scoped>

</style>