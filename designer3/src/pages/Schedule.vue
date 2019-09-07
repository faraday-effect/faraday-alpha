<template>
  <v-container>
    <v-progress-circular
      v-if="$apollo.loading"
      indeterminate
    ></v-progress-circular>
    <v-row v-else>
      <v-col cols="3">
        <v-list>
          <draggable v-model="topics" ghost-class="ghost">
            <v-list-item two-line v-for="topic in topics" :key="topic.id">
              <v-list-item-icon>
                <v-icon>mdi-drag-horizontal</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ topic.title }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{ topic.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </draggable>
        </v-list>
      </v-col>
      <v-col cols="9">
        <v-data-table
          :headers="headers"
          :items="classSchedule.classDays"
          class="elevation-1"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
                :class="{
                  'in-date-range': item.inDateRange,
                  'first-day-of-week': item.firstDayOfWeek
                }"
              >
                <td>{{ item.firstDayOfWeek ? item.week : "" }}</td>
                <td>{{ item.inDateRange ? "" : item.nthClassDay }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.topics.join(", ") }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import draggable from "vuedraggable";
import { plainToClass } from "class-transformer";
import { ClassSchedule, Section, Topic } from "@/types";
import { ONE_SECTION_QUERY } from "@/graphql";

export default Vue.extend({
  components: {
    draggable
  },

  apollo: {
    section: {
      query: ONE_SECTION_QUERY,
      variables: {
        sectionId: 13 // FIXME: hard-coded value
      },
      update(data) {
        return plainToClass(Section, data.section);
      }
    }
  },

  data() {
    return {
      section: {} as Section,
      headers: [
        { text: "Week", value: "week", width: "10%" },
        { text: "Day", value: "nthClassDay", width: "10%" },
        { text: "Date", value: "date", width: "20%" },
        { text: "Topic", value: "topics", width: "60%" }
      ]
    };
  },

  computed: {
    classSchedule: function(): ClassSchedule {
      const schedule = new ClassSchedule(this.section);
      schedule.scheduleClasses();
      return schedule;
    },

    topics: {
      get: function(): Topic[] {
        return this.section.offering.units[0].topics;
      },
      set: function(newValue: Topic[]) {
        this.section.offering.units[0].topics = newValue;
      }
    }
  }
});
</script>

<style scoped>
.v-data-table >>> table {
  border-collapse: collapse;
}

.first-day-of-week {
  border-top: solid coral 2px;
}

.in-date-range {
  background: rgba(255, 127, 80, 0.21);
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
