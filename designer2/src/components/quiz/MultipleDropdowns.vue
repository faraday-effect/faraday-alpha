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
import { Vue, Component, Prop } from "vue-property-decorator";
import {
  MultipleDropdownsQuestion,
  MultipleDropdownsElement
} from "./quiz.types";

@Component
export default class MultipleDropdowns extends Vue {
  @Prop(Object) question!: MultipleDropdownsQuestion;

  response: Object[] = [];

  parseTemplate(template: string): MultipleDropdownsElement[] {
    // Find the dropdowns.
    const ddRe = /\[[\w-]+]/g;
    let ddLabels: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = ddRe.exec(template)) !== null) {
      ddLabels.push(match[0].slice(1, -1));
    }

    // Extract text
    let textData = template.split(ddRe);

    // Stitch together the two lists.
    let result: MultipleDropdownsElement[] = [];
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
</script>

<style scoped>
.inline-select {
  display: inline-block;
}
</style>
