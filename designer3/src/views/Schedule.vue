<template>
  <v-container>
    <v-layout>
      <v-list>
        <draggable v-model="topics" ghost-class="ghost">
          <v-list-item two-line v-for="topic in topics" :key="topic.id">
            <v-list-item-icon>
              <v-icon>mdi-drag-horizontal</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ topic.title }}</v-list-item-title>
              <v-list-item-subtitle>{{
                topic.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </draggable>
      </v-list>
      <pre>
      {{ JSON.stringify(topics, null, 2) }}
      </pre>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_TOPICS_QUERY } from "@/graphql/syllabus.graphql";
import draggable from "vuedraggable";

export default Vue.extend({
  apollo: {
    topics: {
      query: ALL_TOPICS_QUERY
    }
  },
  components: {
    draggable
  }
});
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
