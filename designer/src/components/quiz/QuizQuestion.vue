<template>
  <q-card bordered style="margin: 2em 0">
    <q-card-section>
      <p class="text-overline">Question {{ questionNumber + 1 }}</p>
      <p class="text-h6">{{ title }}</p>
      <p>{{ text }}</p>
    </q-card-section>

    <q-separator />

    <slot :details="details"></slot>
  </q-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "QuizQuestion",
  props: {
    questionNumber: Number,
    title: String,
    text: String,
    details: Object
  }
});
</script>
