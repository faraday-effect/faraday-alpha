<template>
  <v-app>
    <AppBar />

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppBar from "@/layouts/AppBar.vue";

export default Vue.extend({
  components: {
    AppBar
  }
});
</script>
