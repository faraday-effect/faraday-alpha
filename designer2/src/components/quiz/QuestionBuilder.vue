<template>
  <v-card class="my-3 pa-2">
    <v-card-title>
      <span class="grey--text">Question 17 ({{ type }})</span>
    </v-card-title>

    <v-card-text>
      <v-text-field label="Title" v-model="questionTitle"></v-text-field>
      <v-textarea label="Text" rows="2" auto-grow v-model="questionText">
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <slot>[question details here]</slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { QuestionType } from "./quiz.types";

@Component
export default class QuestionBuilder extends Vue {
  @Prop() type!: QuestionType;

  questionTitle: string = "";
  questionText: string = "";
}
</script>
