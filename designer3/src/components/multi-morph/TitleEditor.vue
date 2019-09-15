<template>
  <div>
    <v-text-field label="Title" v-model="title" />
    <v-text-field label="Subtitle" v-model="subtitle" />
    <v-text-field label="Author" v-model="author" />
    <v-text-field label="Date" v-model="date" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { sync } from "vuex-pathify";

export default Vue.extend({
  name: "TitleEditor",

  mounted() {
    console.log(this.$store);
  },

  computed: {
    title: sync("titleSegment/title"),
    subtitle: sync("titleSegment/subtitle"),
    author: sync("titleSegment/author"),
    date: sync("titleSegment/date")
  }
});
</script>
