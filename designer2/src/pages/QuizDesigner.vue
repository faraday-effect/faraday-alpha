<template>
  <v-container grid-list-md>
    <h6 class="title">Quiz Designer</h6>

    <!-- Title -->

    <v-text-field
      label="Quiz Title"
      disabled="true"
      v-model="quizTitle"
    ></v-text-field>

    <!-- Description -->

    <v-textarea label="Description" rows="2" disable="true"> </v-textarea>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { QuestionType } from "@/components/quiz/quiz.types";
import { required } from "vuelidate/lib/validators";

import QuizQuestion from "../components/quiz/QuizQuestion.vue";

@Component
export default class QuizDesigner extends Vue {
  quizTitle = "";
  quizQuestions: QuizQuestion[] = [];
  quizTypes = Object.keys(QuestionType).map(t => ({ value: t, text: t }));
}
</script>
