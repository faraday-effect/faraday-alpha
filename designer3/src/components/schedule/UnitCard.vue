<template>
  <v-card @click="$emit('card-clicked', unit.id)" class="my-1" :hover="true">
    <v-list-item three-line>
      <v-list-item-icon>
        <v-icon v-show="active" large color="primary">mdi-check</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ unit.title }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ unit.description }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <CardMenu
          @update-card="$emit('update-unit', unit)"
          @delete-card="$emit('delete-unit', unit)"
        />
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CardMenu from "@/components/schedule/CardMenu.vue";

export default Vue.extend({
  name: "UnitCard",

  components: {
    CardMenu
  },

  props: {
    unit: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      active: false
    };
  },

  methods: {
    activate() {
      this.active = true;
    },
    deactivate() {
      this.active = false;
    }
  }
});
</script>
