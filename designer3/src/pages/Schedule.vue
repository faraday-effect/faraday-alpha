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
          <UnitList
            :offering="selectedOffering"
            @unit-selected="updateSelectedUnit"
          />
        </v-col>

        <v-col cols="3">
          <TopicList :unit="selectedUnit" />
        </v-col>

        <v-col cols="6">
          <ScheduleTable
            v-if="isReadyToSchedule"
            :class-schedule="classSchedule"
          />
          <hint-list v-else>
            <hint-list-item v-if="!selectedOffering">
              Select a course offering
            </hint-list-item>
            <hint-list-item v-if="selectedOffering && !selectedUnit">
              Select a unit
            </hint-list-item>
            <hint-list-item v-if="selectedOffering && !selectedSection">
              Select a section
            </hint-list-item>
          </hint-list>
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
import HintListItem from "@/components/HintListItem.vue";
import HintList from "@/components/HintList.vue";

export default Vue.extend({
  components: {
    OfferingPicker,
    SectionPicker,
    UnitList,
    TopicList,
    ScheduleTable,
    HintList,
    HintListItem
  },

  data() {
    return {
      selectedOffering: (null as any) as Offering,
      selectedUnit: (null as any) as Unit,
      selectedSection: (null as any) as Section,

      availableSections: [] as Section[],

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
      if (this.isReadyToSchedule) {
        this.classSchedule = new ClassSchedule(
          this.selectedOffering,
          this.selectedSection
        );
        this.classSchedule.scheduleTopics(this.selectedUnit.topics);
      }
    }
  },

  computed: {
    isReadyToSchedule(): boolean {
      return (
        this.selectedOffering !== null &&
        this.selectedSection !== null &&
        this.selectedUnit !== null
      );
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
