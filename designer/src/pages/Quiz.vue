<template>
  <q-page padding class="row q-col-gutter-sm">
    <!-- Keyboard shortcuts -->
    <div class="col-4">
      <div class="text-h6 text-center">Designer</div>
      <q-list bordered separator>
        <q-item
          clickable
          v-ripple
          v-for="option in menuOptions"
          v-bind:key="option.key"
        >
          <q-item-section avatar>
            <Keys v-bind:content="option.key" />
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
        v-bind:questionNumber="idx"
        v-bind:key="idx"
        v-bind:title="question.title"
        v-bind:text="question.text"
        v-bind:details="question.details"
      >
        <template v-slot="{ details }">
          <component
            v-bind:is="componentForQuestionType(question.type)"
            v-bind:details="details"
          />
        </template>
      </quiz-question>
    </div>
  </q-page>
</template>

<script lang="ts" lang="ts">
import TrueFalseQuestion from "components/quiz/TrueFalse";
import MultipleChoiceQuestion from "components/quiz/MultipleChoice";
import FillTheBlankQuestion from "components/quiz/FillOneBlank";
import MatchingQuestion from "components/quiz/Matching";
import MultipleDropdowns from "components/quiz/MultipleDropdowns";
import Keys from "components/Keys";
import Mousetrap from "mousetrap";
import QuizQuestion from "components/quiz/QuizQuestion";

const questionTypeMap = {
  "true-false": "TrueFalseQuestion",
  "multiple-choice": "MultipleChoiceQuestion",
  "fill-the-blank": "FillTheBlankQuestion",
  matching: "MatchingQuestion",
  "multiple-dropdowns": "MultipleDropdowns"
};

import Vue from 'vue'

export default Vue.extend({
  name: "QuizPage",
  components: {
    Keys,
    TrueFalseQuestion,
    MultipleChoiceQuestion,
    FillTheBlankQuestion,
    MatchingQuestion,
    MultipleDropdowns,
    QuizQuestion
  },
  mounted() {
    Mousetrap.bind(["N", "n"], () => console.log("New Quiz"));
    Mousetrap.bind(["L", "l"], () => console.log("List Quizzes"));
    Mousetrap.bind(["E", "e"], () => console.log("Edit Quiz"));
    Mousetrap.bind(["D", "d"], () => console.log("Delete Quiz"));

    this.$axios.get("/api/quizzes/1").then(resp => {
      this.title = resp.data.title;
      this.questions = resp.data.questions;
    });
  },
  data() {
    return {
      response: null,
      menuOptions: [
        {
          key: "N",
          label: "New Quiz"
        },
        {
          key: "L",
          label: "List Quizzes"
        },
        {
          key: "E",
          label: "Edit Quiz"
        },
        {
          key: "D",
          label: "Delete Quiz"
        }
      ],
      title: "A Quiz",
      questions: []
    };
  },
  methods: {
    componentForQuestionType(questionType) {
      if (questionType in questionTypeMap) {
        return questionTypeMap[questionType];
      }
    }
  }
});
</script>
