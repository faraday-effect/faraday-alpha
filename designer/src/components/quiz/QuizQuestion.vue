<template>
  <q-card bordered style="margin: 2em 0">
    <q-card-section>
      <p class="text-overline">Question {{ question.questionNumber + 1 }}</p>
      <p class="text-h6">{{ question.title }}</p>
      <p>{{ question.text }}</p>
    </q-card-section>

    <q-separator />

    <slot :details="question.details"></slot>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Question } from "../../../../shared/types/quiz.types";

export default class QuizQuestion extends Vue {
  @Prop(Object) question!: Question;
}
</script>
