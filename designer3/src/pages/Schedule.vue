<template>
  <v-container>
    <v-progress-circular v-if="$apollo.loading" indeterminate />
    <div v-else>
      <v-row>
        <v-col cols="6">
          <OfferingPicker @offering-selected="updateSelectedOffering" />
        </v-col>
        <v-col cols="6">
          <SectionPicker
            :sections="availableSections"
            @section-selected="updateSelectedSection"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <UnitList :units="units" />
        </v-col>

        <v-col cols="3">
          <TopicList :topics="topics" />
        </v-col>

        <v-col cols="6">
          <ScheduleTable :class-schedule="classSchedule" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { ClassSchedule, Offering, Section, Topic, Unit } from "@/types";
import OfferingPicker from "@/components/schedule/OfferingPicker.vue";
import SectionPicker from "@/components/schedule/SectionPicker.vue";
import TopicList from "@/components/schedule/TopicList.vue";
import UnitList from "@/components/schedule/UnitList.vue";
import ScheduleTable from "@/components/schedule/ScheduleTable.vue";

export default Vue.extend({
  components: {
    OfferingPicker,
    SectionPicker,
    UnitList,
    TopicList,
    ScheduleTable
  },

  data() {
    return {
      availableSections: [] as Section[],
      selectedSection: (null as any) as Section,
      selectedOffering: (null as any) as Offering,
      classSchedule: {} as ClassSchedule
    };
  },

  methods: {
    updateSelectedOffering(offering: Offering) {
      this.selectedOffering = offering;
      this.availableSections = offering.sections;
    },

    updateSelectedSection(section: Section) {
      this.selectedSection = section;
      this.classSchedule = new ClassSchedule(
        this.selectedOffering,
        this.selectedSection
      );
      this.classSchedule.scheduleTopics(this.selectedOffering.units[0].topics);
    }
  },

  computed: {
    units(): Unit[] {
      return this.selectedOffering ? this.selectedOffering.units : [];
    },

    topics(): Topic[] {
      return this.selectedOffering ? this.selectedOffering.units[0].topics : [];
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
