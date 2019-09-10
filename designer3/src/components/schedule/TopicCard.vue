<template>
  <v-card class="my-1" :hover="true">
    <v-card-title>
      {{ topic.title }}
      <div class="flex-grow-1"></div>

      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="$emit('update-topic', topic)">
            <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
            <v-list-item-content>Edit</v-list-item-content>
          </v-list-item>
          <v-list-item @click="$emit('delete-topic', topic)">
            <v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
            <v-list-item-content>Delete</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-text>
      <div>{{ topic.description }}</div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Topic } from "@/types";

export default Vue.extend({
  name: "TopicCard",
  props: {
    topic: Topic
  }
});
</script>
