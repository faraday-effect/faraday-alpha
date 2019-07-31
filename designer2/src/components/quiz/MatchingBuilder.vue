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
import QuestionBuilder from "./QuestionBuilder.vue";

@Component
export default class MatchingBuilder extends QuestionBuilder {
  @Prop(Object) question!: MatchingQuestion;

  response: Object[] = [];
}
</script>
