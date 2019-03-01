<template>
  <div class="q-pa-lg">
    <!--<p>{{ details.template }}</p>-->
    <!--<p>{{ parseTemplate(details.template) }}</p>-->
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
      template = template.trim();

      if (template.length === 0) {
        return [];
      }

      const words = template.trim().split(/\s+/);
      return words;
    }
  }
};
</script>
