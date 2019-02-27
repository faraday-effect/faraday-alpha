<template>
  <div class="q-pa-lg">
    <p>{{ details.template }}</p>
    <p>{{ parseTemplate(details.template) }}</p>
  </div>
</template>

<script>
export default {
  name: "MultipleDropdowns",
  props: ["details"],
  data() {
    return {
      response: null
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
