<template>
  <q-card bordered style="margin: 2em 0">
    <q-card-section>
      <p class="text-overline">Question {{ questionNumber + 1 }}</p>
      <p class="text-h6">{{ details.title }}</p>
      <p>{{ details.text }}</p>
    </q-card-section>

    <q-separator />
    <div class="q-pa-lg">
      <q-option-group v-model="answer" v-bind:options="choices" />
    </div>
  </q-card>
</template>

<script>
export default {
  name: "TrueFalseQuestion",
  props: ["questionNumber", "details"],
  data() {
    return {
      answer: null,
      choices: [
        { label: "True", value: true },
        { label: "False", value: false }
      ]
    };
  }
};
</script>
