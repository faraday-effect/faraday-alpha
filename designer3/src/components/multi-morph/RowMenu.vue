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
          <v-icon>mdi-table-row-plus-before</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Add above</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-table-row-plus-after</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Add below</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-table-row-remove</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Delete</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "RowMenu"
});
</script>

<style scoped></style>
