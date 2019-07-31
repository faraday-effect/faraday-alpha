<template>
  <div>
    <h1 class="headline">A Quiz</h1>
    <quiz-question
      v-for="question in quizQuestions"
      :key="question.id"
      :question="question"
    >
      <template>
        <component :is="component(question.type)" />
      </template>
    </quiz-question>
    <pre>{{ quizQuestions }}</pre>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import gql from "graphql-tag";

import { Question, QuestionType } from "@/components/quiz/quiz.types";
import QuestionAsker from "@/components/quiz/QuestionAsker.vue";

@Component({
  apollo: {
    quizQuestions: require("@/graphql/allQuestions.gql")
  },
  components: {
    QuestionAsker
  }
})
export default class Quiz extends Vue {
  quizQuestions: Question[] = [];
}
</script>
