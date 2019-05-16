<template>
  <div class="q-pa-lg">
    <div
      v-for="(pair, idx) in details.pairs"
      :key="idx"
      class="row items-center justify-start"
    >
      <div class="col-2">{{ pair[0] }}</div>
      <div class="col-2 q-py-xs">
        <q-select v-model="response[idx]" outlined dense :options="choices()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { MatchingQuestion } from "./quiz.types";

@Component
export default class Matching extends Vue {
  @Prop(Object) question!: MatchingQuestion;

  response: Object[] = [];

  choices() {
    return this.question.details.pairs.map(pair => pair[1]);
  }
}
</script>
