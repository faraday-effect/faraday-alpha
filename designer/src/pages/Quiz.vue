<template>
  <q-page padding>
    <h6>A Quiz</h6>
    <component
      v-for="(question, idx) in questions"
      v-bind:is="componentForQuestionType(question.type)"
      v-bind:key="idx"
      v-bind:questionNumber="idx"
      v-bind:details="question"
    />
  </q-page>
</template>

<script>
import TrueFalseQuestion from "components/TrueFalse";
import MultipleChoiceQuestion from "components/MultipleChoice";
import FillTheBlankQuestion from "components/FillTheBlank";
import MatchingQuestion from "components/Matching";
import MultipleDropdowns from "components/MultipleDropdowns";

const questionTypeMap = {
  "true-false": "TrueFalseQuestion",
  "multiple-choice": "MultipleChoiceQuestion",
  "fill-the-blank": "FillTheBlankQuestion",
  matching: "MatchingQuestion",
  "multiple-dropdowns": "MultipleDropdowns"
};

export default {
  name: "QuizPage",
  components: {
    TrueFalseQuestion,
    MultipleChoiceQuestion,
    FillTheBlankQuestion,
    MatchingQuestion,
    MultipleDropdowns
  },
  data() {
    return {
      answer: null,
      questions: [
        {
          type: "true-false",
          title: "Pyramid Identity",
          text: "The Pyramid of Doom is the same thing as Callback Hell."
        },
        {
          type: "multiple-dropdowns",
          title: "Complete the Sentence",
          text: "Choose the proper terms.",
          template: "We've been discussing the [pyramid] of [dooom].",
          choices: {
            pyramid: ["Pyramid", "Sphere", "Tringle"],
            doom: ["Doom", "Influence", "Love"]
          }
        },
        {
          type: "matching",
          title: "Match-O-Matic",
          text: "Choose the best match for each term",
          pairs: [
            ["Pyramid", "Doom"],
            ["Sphere", "Influence"],
            ["Love", "Triangle"]
          ]
        },
        {
          type: "fill-the-blank",
          title: "The Problem with Doom",
          text: "What's so bad about Doom?"
        },
        {
          type: "multiple-choice",
          title: "Our Topic",
          text: "What have we been studying of late?",
          choices: [
            { label: "Pyramid of Doom", value: 1 },
            { label: "Circle of Life", value: 2 },
            { label: "Love Triangle", value: 3 }
          ]
        }
      ]
    };
  },
  methods: {
    componentForQuestionType(questionType) {
      if (questionType in questionTypeMap) {
        return questionTypeMap[questionType];
      }
    }
  }
};
</script>
