<template>
  <q-page padding class="row q-col-gutter-sm">
    <!-- Keyboard shortcuts -->
    <div class="col-4">
      <div class="text-h6 text-center">Designer</div>
      <q-list bordered separator>
        <q-item
          v-for="option in menuOptions"
          :key="option.key"
          v-ripple
          clickable
        >
          <q-item-section avatar>
            <Keys :content="option.key" />
          </q-item-section>
          <q-item-section>{{ option.label }}</q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Quiz content -->
    <div class="col">
      <div class="text-h6 text-center">{{ title }}</div>
      <quiz-question
        v-for="(question, idx) in questions"
        :key="idx"
        :question-number="idx"
        :title="question.title"
        :text="question.text"
        :details="question.details"
      >
        <template v-slot="{ details }">
          <component
            :is="componentForQuestionType(question.type)"
            :details="details"
          />
        </template>
      </quiz-question>
    </div>
  </q-page>
</template>

<script lang="ts">
import TrueFalseQuestion from "components/quiz/TrueFalse.vue";
import MultipleChoiceQuestion from "components/quiz/MultipleChoice.vue";
import FillTheBlankQuestion from "components/quiz/FillOneBlank.vue";
import MatchingQuestion from "components/quiz/Matching.vue";
import MultipleDropdowns from "components/quiz/MultipleDropdowns.vue";
import QuizQuestion from "components/quiz/QuizQuestion.vue";

import { Quiz, Question } from "../components/quiz/quiz.types";
import { AxiosResponse } from "axios";

import Keys from "components/Keys.vue";
import Mousetrap from "mousetrap";

const questionTypeMap: {
  [questionType: string]: string;
} = {
  "true-false": "TrueFalseQuestion",
  "multiple-choice": "MultipleChoiceQuestion",
  "fill-the-blank": "FillTheBlankQuestion",
  matching: "MatchingQuestion",
  "multiple-dropdowns": "MultipleDropdowns"
};

import { AxiosStatic } from "axios";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    Keys,
    TrueFalseQuestion,
    MultipleChoiceQuestion,
    FillTheBlankQuestion,
    MatchingQuestion,
    MultipleDropdowns,
    QuizQuestion
  }
})
export default class QuizPage extends Vue {
  response = null;
  menuOptions = [
    { key: "N", label: "New Quiz" },
    { key: "L", label: "List Quizzes" },
    { key: "E", label: "Edit Quiz" },
    { key: "D", label: "Delete Quiz" }
  ];
  title = "A Quiz";
  questions: Question[] = [];

  mounted() {
    Mousetrap.bind(["N", "n"], () => console.log("New Quiz"));
    Mousetrap.bind(["L", "l"], () => console.log("List Quizzes"));
    Mousetrap.bind(["E", "e"], () => console.log("Edit Quiz"));
    Mousetrap.bind(["D", "d"], () => console.log("Delete Quiz"));

    (this.$axios as AxiosStatic)
      .get("/api/quizzes/1")
      .then((resp: AxiosResponse<Quiz>) => {
        this.title = resp.data.title;
        this.questions = resp.data.questions;
      });
  }

  componentForQuestionType(questionType: string) {
    if (questionType in questionTypeMap) {
      return questionTypeMap[questionType];
    }
  }
}
</script>
