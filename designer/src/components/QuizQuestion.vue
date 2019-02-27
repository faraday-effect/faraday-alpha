<template>
  <q-card bordered style="margin: 2em 0">
    <q-card-section>
      <p class="text-overline">Question {{ questionNumber + 1 }}</p>
      <p class="text-h6">{{ details.title }}</p>
      <p>{{ details.text }}</p>
    </q-card-section>

    <q-separator />

    <slot></slot>
  </q-card>
</template>

<script>
export default {
  name: "QuizQuestion",
  props: ["questionNumber", "details"]
};
</script>

<style scoped></style>
