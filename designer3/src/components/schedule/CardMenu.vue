<template>
  <v-menu bottom left>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item @click="$emit('update-card')">
        <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
        <v-list-item-content>Edit</v-list-item-content>
      </v-list-item>
      <v-list-item @click="$emit('delete-card')">
        <v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
        <v-list-item-content>Delete</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({ name: "CardMenu" });
</script>
