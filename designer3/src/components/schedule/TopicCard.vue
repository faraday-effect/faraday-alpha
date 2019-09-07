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
          <v-list-item @click="$emit('delete-topic', topic.id)">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-text>
      <div>{{ topic.description }}</div>
      <div>{{ topic.classDay.shortDate() }}</div>
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
