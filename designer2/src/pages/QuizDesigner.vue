<template>
  <v-container grid-list-md>
    <!-- Title and description -->
    <h6 class="title">Quiz Designer</h6>
    <v-text-field label="Quiz Title" v-model="quizTitle"></v-text-field>
    <v-textarea label="Description" rows="2" auto-grow> </v-textarea>

    <!-- Questions -->
    <h6 class="title">Questions</h6>
    <v-layout row wrap>
      <v-flex xs12 md3>
        <v-list>
          <v-list-tile v-for="i in 6" :key="i" :to="`/${i}`">
            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ `Zippy ${i}` }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12 md9>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id tempora
          repellat vitae officia dolore laudantium ipsam modi, reiciendis nulla
          nihil eveniet quae molestias necessitatibus, aut accusantium!
          Accusamus blanditiis quidem corrupti!
        </p>
      </v-flex>
    </v-layout>
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
