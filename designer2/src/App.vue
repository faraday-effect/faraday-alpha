<template>
  <DefaultLayout />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

@Component({
  components: {
    DefaultLayout
  }
})
export default class App extends Vue {}
</script>
