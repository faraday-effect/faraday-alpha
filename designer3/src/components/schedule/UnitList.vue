<template>
  <div>
    <div class="title text-center">
      <v-badge>
        <template #badge>{{ units.length }}</template>
        Units
      </v-badge>
    </div>
    <draggable v-model="units" :group="{ name: 'units' }">
      <UnitCard v-for="unit in units" :key="unit.id" :unit="unit" />
    </draggable>
    <v-btn class="ma-4" @click="addDialogVisible = true">Add</v-btn>
    <UnitAddDialog :visible.sync="addDialogVisible" @save="createUnit" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import draggable from "vuedraggable";
import { plainToClass } from "class-transformer";
import { ClassSchedule, Section, Topic, Unit } from "@/types";
import { ONE_SECTION_QUERY } from "@/graphql";
import UnitCard from "@/components/schedule/UnitCard.vue";
import UnitAddDialog from "@/components/schedule/UnitAddDialog.vue";

export default Vue.extend({
  components: {
    draggable,
    UnitCard,
    UnitAddDialog
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
      section: {} as Section,
      addDialogVisible: false,
      updateModel: {} as Topic
    };
  },

  methods: {},

  computed: {
    units: {
      get: function(): Unit[] {
        return this.section.offering.units;
      },
      set: function(newValue: Unit[]) {
        this.section.offering.units = newValue;
      }
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
