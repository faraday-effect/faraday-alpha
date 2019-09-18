<template>
  <v-container>
    <v-expansion-panels multiple>
      <MorphContainer header="Part 1">
        <MorphContainer header="Section 1">
          <component v-for="(child, idx) in children" :key="idx" :is="child" />
        </MorphContainer>
        <MorphContainer header="Section 2">
          <TitleSegment />
        </MorphContainer>
      </MorphContainer>
    </v-expansion-panels>

    <v-btn @click="randomSwap">RANDOM SWAP</v-btn>
    <p>{{ swapA }}, {{ swapB }}</p>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import random from "lodash/random";
import times from "lodash/times";

import MarkdownSegment from "@/components/multi-morph/MarkdownSegment.vue";
import TitleSegment from "@/components/multi-morph/TitleSegment.vue";
import TableSegment from "@/components/multi-morph/TableSegment.vue";
import MorphContainer from "@/components/multi-morph/MorphContainer.vue";

export default Vue.extend({
  components: {
    TableSegment,
    TitleSegment,
    MarkdownSegment,
    MorphContainer
  },

  data() {
    return {
      children: [
        "TitleSegment",
        "TableSegment",
        "MarkdownSegment",
        "MarkdownSegment",
        "TableSegment",
        "MarkdownSegment"
      ],
      swapA: -1,
      swapB: -1
    };
  },

  methods: {
    randomSwap() {
      const [a, b] = times(2, () => random(0, this.children.length - 1));
      this.swapA = a;
      this.swapB = b;
      const tmp = this.children[a];
      this.children[a] = this.children[b];
      this.children[b] = tmp;
    }
  }
});
</script>
