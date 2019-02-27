<template>
  <q-page padding class="row q-col-gutter-sm">
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
    <div class="col">
      <div class="text-h6 text-center">A Quiz</div>
      <component
        v-for="(question, idx) in questions"
        v-bind:is="componentForQuestionType(question.type)"
        v-bind:key="idx"
        v-bind:questionNumber="idx"
        v-bind:details="question"
      />
    </div>
  </q-page>
</template>

<script>
import TrueFalseQuestion from "components/TrueFalse";
import MultipleChoiceQuestion from "components/MultipleChoice";
import FillTheBlankQuestion from "components/FillTheBlank";
import MatchingQuestion from "components/Matching";
import MultipleDropdowns from "components/MultipleDropdowns";
import Keys from "components/Keys";
import Mousetrap from "mousetrap";

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
    Keys,
    TrueFalseQuestion,
    MultipleChoiceQuestion,
    FillTheBlankQuestion,
    MatchingQuestion,
    MultipleDropdowns
  },
  mounted() {
    Mousetrap.bind(["N", "n"], () => console.log("New Quiz"));
    Mousetrap.bind(["L", "l"], () => console.log("List Quizzes"));
    Mousetrap.bind(["E", "e"], () => console.log("Edit Quiz"));
    Mousetrap.bind(["D", "d"], () => console.log("Delete Quiz"));
  },
  data() {
    return {
      answer: null,
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
