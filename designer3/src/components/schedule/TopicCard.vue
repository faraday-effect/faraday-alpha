<template>
  <v-card class="my-1" :hover="true">
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title>{{ topic.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ topic.description }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <CardMenu
          :card="topic"
          @update-card="$emit('update-topic', topic)"
          @delete-card="$emit('delete-topic', topic)"
        />
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CardMenu from "@/components/schedule/CardMenu.vue";

export default Vue.extend({
  name: "TopicCard",
  components: {
    CardMenu
  },
  props: {
    topic: {
      type: Object
    }
  }
});
</script>
