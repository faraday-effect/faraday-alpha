<template>
  <div v-if="isScheduleValid()">
    <div class="title text-center">Schedule</div>
    <v-data-table
      :headers="headers"
      :items="classSchedule.classDays"
      class="elevation-1"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr
            v-for="classDay in items"
            :key="classDay.id"
            :class="{
              'in-date-range': classDay.inDateRange,
              'first-day-of-week': classDay.firstDayOfWeek
            }"
          >
            <td>{{ classDay.firstDayOfWeek ? classDay.week : "" }}</td>
            <td>{{ classDay.inDateRange ? "" : classDay.nthClassDay }}</td>
            <td>{{ classDay.fullDate() }}</td>
            <td>{{ classDay.topics.join(", ") }}</td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ScheduleTable",

  props: {
    classSchedule: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      headers: [
        { text: "Week", value: "week", width: "10%" },
        { text: "Day", value: "nthClassDay", width: "10%" },
        { text: "Date", value: "date", width: "25%" },
        { text: "Topic", value: "topics", width: "55%" }
      ]
    };
  },

  methods: {
    isScheduleValid() {
      return Object.keys(this.classSchedule).length > 0;
    }
  }
});
</script>

<style scoped>
.v-data-table >>> table {
  /* Allow the <tr> top border to appear on the first day of each week. */
  border-collapse: collapse;
}

.first-day-of-week {
  border-top: solid teal 2px;
}

.in-date-range {
  background: rgba(0, 128, 128, 0.2);
}
</style>
