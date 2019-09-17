<template>
  <v-menu>
    <template #activator="{ on }">
      <v-btn x-small v-on="on" tabindex="-1">
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <!-- Add left -->
      <v-list-item @click="$emit('add-left', column)">
        <v-list-item-icon>
          <v-icon>mdi-table-column-plus-before</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Add left</v-list-item-title>
      </v-list-item>

      <!-- Add right -->
      <v-list-item @click="$emit('add-right', column)">
        <v-list-item-icon>
          <v-icon>mdi-table-column-plus-after</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Add right</v-list-item-title>
      </v-list-item>

      <!-- Remove -->
      <v-list-item
        @click="$emit('remove', column)"
        :disabled="columnCount <= 1"
      >
        <v-list-item-icon>
          <v-icon>mdi-table-column-remove</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Delete</v-list-item-title>
      </v-list-item>

      <v-divider />
      <v-subheader>Alignment</v-subheader>

      <!-- Alignment -->
      <v-list-item @click="$emit('align-left', column)">
        <v-list-item-icon>
          <v-icon>mdi-format-align-left</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Left</v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('align-center', column)">
        <v-list-item-icon>
          <v-icon>mdi-format-align-center</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Center</v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('align-right', column)">
        <v-list-item-icon>
          <v-icon>mdi-format-align-right</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Right</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ColumnMenu",

  props: {
    column: {
      type: Number,
      required: true
    },
    columnCount: {
      type: Number,
      required: true
    }
  }
});
</script>
