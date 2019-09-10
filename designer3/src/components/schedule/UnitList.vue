<template>
  <div v-if="units.length > 0">
    <div class="title text-center">
      <v-badge>
        <template #badge>{{ units.length }}</template>
        Units
      </v-badge>
    </div>

    <draggable v-model="units" :group="{ name: 'units' }">
      <UnitCard
        v-for="unit in units"
        :key="unit.id"
        :unit="unit"
        @card-clicked="cardClicked"
        ref="unitCards"
      />
    </draggable>

    <v-btn class="ma-4" @click="addDialogVisible = true">Add</v-btn>
    <UnitAddDialog :visible.sync="addDialogVisible" @save="createUnit" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import draggable from "vuedraggable";
import { Unit } from "@/types";
import UnitCard from "@/components/schedule/UnitCard.vue";
import UnitAddDialog from "@/components/schedule/UnitAddDialog.vue";
import { VueApolloComponent } from "vue-apollo/types/apollo-provider";

export default Vue.extend({
  components: {
    draggable,
    UnitCard,
    UnitAddDialog
  },

  props: {
    offering: {
      type: Object
    }
  },

  data() {
    return {
      addDialogVisible: false
    };
  },

  methods: {
    createUnit(unit: Unit) {},

    cardClicked(unitId: number) {
      // FIXME: Get rid of the nuclear `any` option.
      (this.$refs.unitCards as any[]).forEach(unitCardComponent => {
        // Make sure only the clicked card is activated.
        if (unitCardComponent.unit.id === unitId) {
          unitCardComponent.activate();
          this.$emit("unit-selected", unitCardComponent.unit);
        } else {
          unitCardComponent.deactivate();
        }
      });
    }
  },

  computed: {
    units(): Unit[] {
      return this.offering ? this.offering.units : [];
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
