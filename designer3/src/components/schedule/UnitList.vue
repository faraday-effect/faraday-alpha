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
        @update-unit="editUnit"
        @delete-unit="deleteUnit"
        ref="unitCards"
      />
    </draggable>

    <v-btn class="ma-4" @click="addDialogVisible = true">Add</v-btn>

    <UnitDialog
      title="Add a unit"
      action="Add"
      :visible.sync="addDialogVisible"
      @save="createUnit"
    />
    <UnitDialog
      title="Update a unit"
      action="Update"
      :visible.sync="updateDialogVisible"
      :unit="updateModel"
      @save="updateUnit"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import draggable from "vuedraggable";
import { Unit } from "@/types";
import UnitCard from "@/components/schedule/UnitCard.vue";
import UnitDialog from "@/components/schedule/UnitDialog.vue";
import {
  CREATE_UNIT_MUTATION,
  DELETE_UNIT_MUTATION,
  UPDATE_UNIT_MUTATION
} from "@/graphql";
import { plainToClass } from "class-transformer";

export default Vue.extend({
  components: {
    draggable,
    UnitCard,
    UnitDialog
  },

  props: {
    offering: {
      type: Object
    }
  },

  data() {
    return {
      addDialogVisible: false,
      updateDialogVisible: false,
      updateModel: {} as Unit
    };
  },

  computed: {
    units: {
      get: function(): Unit[] {
        return this.offering ? this.offering.units : [];
      },
      set: function(units: Unit[]) {
        this.offering.units = units;
      }
    }
  },

  methods: {
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
    },

    createUnit(unit: Unit) {
      return this.$apollo
        .mutate<{ createUnit: Unit }>({
          mutation: CREATE_UNIT_MUTATION,
          variables: {
            createInput: {
              title: unit.title,
              description: unit.description,
              offeringId: this.offering.id
            }
          }
        })
        .then(result => {
          if (result.data) {
            const newUnit = plainToClass(Unit, result.data.createUnit);
            this.offering.addUnit(newUnit);
            return newUnit;
          }
        })
        .catch(err => {
          throw err;
        });
    },

    editUnit(unit: Unit) {
      this.updateModel = unit;
      this.updateDialogVisible = true;
    },

    updateUnit(unit: Unit) {
      return this.$apollo
        .mutate<{ updateUnit: Unit }>({
          mutation: UPDATE_UNIT_MUTATION,
          variables: {
            updateInput: {
              id: unit.id,
              title: unit.title,
              description: unit.description
            }
          }
        })
        .then(result => {
          if (result.data) {
            const updatedUnit = plainToClass(Unit, result.data.updateUnit);
            this.offering.updateUnit(updatedUnit);
            this.updateDialogVisible = false;
          }
        })
        .catch(err => {
          throw err;
        });
    },

    deleteUnit(unit: Unit) {
      return this.$apollo
        .mutate({
          mutation: DELETE_UNIT_MUTATION,
          variables: {
            unitId: unit.id
          }
        })
        .then(() => {
          this.offering.deleteUnit(unit.id);
        })
        .catch(err => {
          throw err;
        });
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
