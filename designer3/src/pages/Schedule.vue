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
          <UnitList :units="units" @unit-selected="updateSelectedUnit" />
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
      selectedOffering: (null as any) as Offering,
      selectedUnit: (null as any) as Unit,

      availableSections: [] as Section[],
      selectedSection: (null as any) as Section,

      classSchedule: {} as ClassSchedule
    };
  },

  methods: {
    updateSelectedOffering(offering: Offering) {
      this.selectedOffering = offering;
      this.availableSections = offering.sections;
    },

    updateSelectedUnit(unit: Unit) {
      this.selectedUnit = unit;
      this.updateClassSchedule();
    },

    updateSelectedSection(section: Section) {
      this.selectedSection = section;
      this.updateClassSchedule();
    },

    updateClassSchedule() {
      if (this.isReadyToSchedule()) {
        console.log("Can't create schedule");
        return;
      }

      this.classSchedule = new ClassSchedule(
        this.selectedOffering,
        this.selectedSection
      );
      this.classSchedule.scheduleTopics(this.selectedUnit.topics);
    },

    isReadyToSchedule(): boolean {
      return (
        this.selectedOffering !== null &&
        this.selectedSection !== null &&
        this.selectedUnit !== null
      );
    }
  },

  computed: {
    units(): Unit[] {
      return this.selectedOffering ? this.selectedOffering.units : [];
    },

    topics(): Topic[] {
      return this.selectedUnit ? this.selectedUnit.topics : [];
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
