<template>
  <p class="q-pa-lg">
    <template v-for="(item, idx) in parseTemplate(details.template)">
      <span v-if="item.type === 'text'" :key="idx">{{ item.content }}</span>
      <q-select
        v-else
        :key="idx"
        v-model="response[item.label]"
        outlined
        dense
        :options="details.choices[item.label]"
        class="inline-select"
      ></q-select>
    </template>
  </p>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["details"],
  methods: {
    parseTemplate(template) {
      // Find the dropdowns.
      const ddRe = /\[[\w-]+]/g;
      let ddLabels = [];
      let match = null;
      while ((match = ddRe.exec(template)) !== null) {
        ddLabels.push(match[0].slice(1, -1));
      }

      // Extract text
      let textData = template.split(ddRe);

      // Stitch together the two lists.
      let result = [];
      let labelIdx = 0;
      for (let txt of textData) {
        txt = txt.trim().replace(/\s+/, " ");
        if (txt.length) {
          result.push({ type: "text", content: txt });
        }
        if (labelIdx < ddLabels.length) {
          result.push({ type: "dropdown", label: ddLabels[labelIdx++] });
        }
      }

      return result;
    }
  }
})
export default class MultipleDropdowns extends Vue {
  response: [];
}
</script>

<style scoped>
.inline-select {
  display: inline-block;
}
</style>
