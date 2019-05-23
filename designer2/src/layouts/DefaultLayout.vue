<template>
  <v-app>
    <ToolBar />

    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import ToolBar from "./ToolBar.vue";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    ToolBar
  }
})
export default class DefaultLayout extends Vue {}
</script>
