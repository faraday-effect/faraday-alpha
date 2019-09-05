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
              <v-list-item-subtitle
                >{{ topic.description }}
              </v-list-item-subtitle>
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
import draggable from "vuedraggable";
import { ONE_OFFERING_QUERY, Offering } from "@/graphql/catalog.graphql";

export default Vue.extend({
  apollo: {
    offering: {
      query: ONE_OFFERING_QUERY,
      variables: {
        offeringId: 7
      },
      update(data) {
        return new Offering(data.offering);
      }
    }
  },
  components: {
    draggable
  },
  data() {
    return {
      offering: Object
    };
  },
  computed: {
    topics() {
      return this.offering.units[0].topics;
    }
  }
});
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
