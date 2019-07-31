<template>
  <v-app>
    <AppBar />

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import AppBar from "@/layouts/AppBar";

export default {
  components: {
    AppBar
  }
};
</script>
