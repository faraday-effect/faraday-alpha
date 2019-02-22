<template>
  <q-card bordered style="margin: 2em 0">
    <q-card-section>
      <p class="text-overline">Question {{ questionNumber + 1 }}</p>
      <p class="text-h6">{{ details.title }}</p>
      <p>{{ details.text }}</p>
    </q-card-section>

    <q-separator />
    <div class="q-pa-lg">
      <p>{{ details.template }}</p>
      <p>{{ parseTemplate(details.template) }}</p>
    </div>
  </q-card>
</template>

<script>
export default {
  name: "MultipleChoiceQuestion",
  props: ["questionNumber", "details"],
  data() {
    return {
      answer: null
    };
  },
  methods: {
    parseTemplate(template) {
      const words = template.trim().split(/\s+/);
      // for (let word of words) {
      //   if (word.match(/\[\w-]+\]/)) {
      //
      //   }
      // }
      return words;
    }
  }
};
</script>
