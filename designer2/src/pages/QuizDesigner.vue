<template>
  <v-container grid-list-md>
    <!-- Title and description -->
    <h6 class="title">Quiz Designer</h6>
    <v-text-field label="Quiz Title" v-model="quizTitle"></v-text-field>
    <v-textarea
      label="Description"
      rows="2"
      auto-grow
      v-model="quizDescription"
    >
    </v-textarea>

    <!-- Questions -->
    <h6 class="title">Questions</h6>
    <v-layout row wrap>
      <v-flex xs12 md3>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">
              Add a Question
            </v-btn>
          </template>
          <v-list>
            <v-list-tile
              v-for="uiDetail in uiDetails"
              :key="uiDetail.prefix"
              @click="addBuilder(uiDetail.builder)"
            >
              <v-list-tile-title>
                {{ uiDetail.name }}
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-list>
          <v-list-tile
            v-for="(questionBuilder, idx) in questionBuilders"
            :key="idx"
          >
            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ questionBuilder.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12 md9>
        <QuestionBuilder
          v-for="(questionBuilder, idx) in questionBuilders"
          :key="idx"
        >
          <component :is="questionBuilder"></component>
        </QuestionBuilder>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { Question, QuestionType } from "@/components/quiz/quiz.types";
import QuestionBuilder from "@/components/quiz/QuestionBuilder.vue";

import FillOneBlankBuilder from "@/components/quiz/FillOneBlankBuilder.vue";
import MatchingBuilder from "@/components/quiz/MatchingBuilder.vue";
import MultipleChoiceBuilder from "@/components/quiz/MultipleChoiceBuilder.vue";
import MultipleDropdownsBuilder from "@/components/quiz/MultipleDropdownsBuilder.vue";
import TrueFalseBuilder from "@/components/quiz/TrueFalseBuilder.vue";

import { questionTypeUiDetails } from "@/helpers/quiz.helper";

@Component({
  components: {
    QuestionBuilder,
    FillOneBlankBuilder,
    MatchingBuilder,
    MultipleChoiceBuilder,
    MultipleDropdownsBuilder,
    TrueFalseBuilder
  }
})
export default class QuizDesigner extends Vue {
  quizTitle = "";
  quizDescription = "";
  questionBuilders: QuestionBuilder[] = [];
  uiDetails = questionTypeUiDetails;

  addBuilder(builder: QuestionBuilder) {
    console.log(`Add ${builder} question`);
    builder.questionTitle = "My Title";
    builder.questionText = "Description of this question."
    this.questionBuilders.push(builder);
    console.log("BUILDERS", this.questionBuilders);
  }
}
</script>
