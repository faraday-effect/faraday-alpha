<template>
  <v-container>
    <v-progress-circular v-if="$apollo.loading" indeterminate />
    <div v-else>
      <v-row>
        <v-col cols="6">
          <OfferingPicker v-model="offeringId" />
        </v-col>
        <v-col cols="6">
          <SectionPicker />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <UnitList />
        </v-col>

        <v-col cols="3">
          <TopicList />
        </v-col>

        <v-col cols="6">
          <div class="title text-center">Schedule</div>
          <ScheduleTable :class-schedule="classSchedule" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { plainToClass } from "class-transformer";
import { ClassSchedule, Section, Topic } from "@/types";
import { ONE_SECTION_QUERY } from "@/graphql";
import ScheduleTable from "@/components/schedule/ScheduleTable.vue";
import UnitList from "@/components/schedule/UnitList.vue";
import TopicList from "@/components/schedule/TopicList.vue";
import OfferingPicker from "@/components/schedule/OfferingPicker.vue";
import SectionPicker from "@/components/schedule/SectionPicker.vue";

export default Vue.extend({
  components: {
    UnitList,
    TopicList,
    ScheduleTable,
    OfferingPicker,
    SectionPicker
  },

  apollo: {
    section: {
      query: ONE_SECTION_QUERY,
      variables: {
        sectionId: 13 // FIXME: hard-coded value
      },
      update(data) {
        const section = plainToClass(Section, data.section);
        const schedule = new ClassSchedule(section);
        schedule.scheduleTopics();
        return section;
      }
    }
  },

  data() {
    return {
      offeringId: NaN,
      section: {} as Section
    };
  },

  computed: {
    classSchedule: function(): ClassSchedule {
      const schedule = new ClassSchedule(this.section);
      schedule.scheduleTopics();
      return schedule;
    }
  }
});
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.5;
  background: teal;
}
</style>
