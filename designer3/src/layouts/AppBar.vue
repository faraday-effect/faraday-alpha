<template>
  <div>
    <NavDrawer ref="drawer" />

    <v-app-bar app>
      <v-app-bar-nav-icon v-on:click="toggleNavDrawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="headline text-uppercase">
        <span>Faraday</span>
        <span class="font-weight-light">Designer</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        text
        href="https://github.com/faraday-effect/faraday"
        target="_blank"
      >
        <span class="mr-2">GitHub</span>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import NavDrawer from "./NavDrawer";

export default {
  components: {
    NavDrawer
  },
  methods: {
    toggleNavDrawer() {
      this.$refs.drawer.toggle();
    }
  }
};
</script>
