<template>
  <v-app-bar app>
    <ToolBar />

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app-bar>
</template>

<script>
import ToolBar from "./ToolBar.vue";

export default {
  components: {
    ToolBar
  }
};
</script>
