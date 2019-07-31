<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" :options="details.choices" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { MultipleChoiceQuestion } from "./quiz.types";
import QuestionBuilder from "./QuestionBuilder.vue";

@Component
export default class MultipleChoiceBuilder extends QuestionBuilder {
  @Prop(Object) question!: MultipleChoiceQuestion;

  response: Object[] = [];
}
</script>
