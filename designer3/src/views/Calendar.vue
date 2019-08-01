<template>
  <v-container>
    <h1>Fall 2019</h1>
    <v-layout>
      <v-flex>
        <v-sheet height="1200">
          <v-calendar
            type="custom-weekly"
            :start="start"
            :end="end"
            :events="events"
            event-color="primary"
          ></v-calendar>
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: function() {
    return {
      start: "2019-08-26",
      end: "2019-12-12",
      events: [
        {
          name: "Classes Start",
          start: "2019-08-27"
        },
        {
          name: "Classes End",
          start: "2019-12-06"
        },
        {
          name: "Fall Break",
          start: "2019-10-11",
          end: "2019-10-14"
        },
        {
          name: "Thanksgiving",
          start: "2019-11-27",
          end: "2019-12-01"
        },
        {
          name: "Finals",
          start: "2019-12-09",
          end: "2019-12-12"
        }
      ]
    };
  }
});
</script>
