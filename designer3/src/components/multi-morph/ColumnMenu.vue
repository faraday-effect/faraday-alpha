<template>
  <v-menu>
    <template #activator="{ on }">
      <v-btn x-small v-on="on">
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-table-column-plus-before</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Add left</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-table-column-plus-after</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Add right</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-table-column-remove</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Delete</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ColumnMenu"
});
</script>

<style scoped></style>
