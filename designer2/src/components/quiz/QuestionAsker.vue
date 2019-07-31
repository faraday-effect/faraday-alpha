o<template>
  <v-card class="my-3 pa-2">
    <v-card-title>
      <div>
        <h4 class="grey--text">
          Question {{ question.questionNumber }} ({{ question.type }})
        </h4>
        <h3 class="headline">{{ question.title }}</h3>
        <div>{{ question.text }}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <slot>[question details here]</slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Question } from "./quiz.types";

@Component
export default class QuestionAsker extends Vue {
  @Prop() question!: Question;
}
</script>
