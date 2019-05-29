<template>
  <div>
    <h1 class="headline">A Quiz</h1>
    <quiz-question
      v-for="(question, idx) in quizQuestions"
      :key="question.id"
      :type="question.type"
      :question-number="idx + 1"
      :title="question.title"
      :text="question.text"
      :details="question.details"
    >
      <template v-slot="{ details }">
        <component
          :is="componentForQuestionType(question.type)"
          :details="question.details"
        />
      </template>
    </quiz-question>
    <pre>{{ quizQuestions }}</pre>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import gql from "graphql-tag";

import { QuestionType, Question } from "../components/quiz/quiz.types";

import QuizQuestion from "../components/quiz/QuizQuestion.vue";
import FillOneBlankQuestion from "../components/quiz/FillOneBlank.vue";
import MatchingQuestion from "../components/quiz/Matching.vue";
import MultipleChoiceQuestion from "../components/quiz/MultipleChoice.vue";
import MultipleDropdownsQuestion from "../components/quiz/MultipleDropdowns.vue";
import TrueFalseQuestion from "../components/quiz/TrueFalse.vue";

@Component({
  apollo: {
    quizQuestions: require("../graphql/allQuestions.gql")
  },
  components: {
    QuizQuestion
  }
})
export default class Quiz extends Vue {
  quizQuestions: any = null;

  componentForQuestionType(type: QuestionType) {
    switch (type) {
      case QuestionType.FillOneBlank:
        return FillOneBlankQuestion;
      case QuestionType.Matching:
        return MatchingQuestion;
      case QuestionType.MultipleChoice:
        return MultipleChoiceQuestion;
      case QuestionType.MultipleDropdowns:
        return MultipleDropdownsQuestion;
      case QuestionType.TrueFalse:
        return TrueFalseQuestion;
    }
  }
}
</script>
