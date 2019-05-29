<template>
  <v-card>
    <v-card-title>
      <div>
        <h4 class="grey--text">Question {{ questionNumber }} ({{ type }})</h4>
        <h3 class="headline">{{ title }}</h3>
        <div>{{ text }}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <slot :details="details"></slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Question } from "./quiz.types";

@Component
export default class QuizQuestion extends Vue {
  @Prop() type!: string;
  @Prop() questionNumber!: number;
  @Prop() title!: string;
  @Prop() text!: string;
  @Prop() details!: object;
}
</script>
