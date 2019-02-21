<template>
  <q-page padding>
    <q-card bordered class="question-card">
      <q-card-section>
        <p class="text-overline">Question 4</p>
        <p class="text-h6">{{ details.title }}</p>
        <p>{{ details.text }}</p>
      </q-card-section>

      <q-separator />
      <div class="q-pa-lg">
        <q-option-group v-model="answer" :options="options" />
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "TrueFalse",
  data() {
    return {
      answer: null,
      details: {
        title: "Pyramid Identity",
        text: "The Pyramid of Doom is the same thing as Callback Hell."
      },
      options: [
        { label: "True", value: true },
        { label: "False", value: false }
      ]
    };
  }
};
</script>

<style scoped>
.question-card {
  max-width: 250px;
}
</style>
