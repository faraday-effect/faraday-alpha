<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" :options="details.choices" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { MultipleChoiceQuestion } from "../../../../shared/types/quiz.types";

@Component
export default class MultipleChoice extends Vue {
  @Prop(Object) question!: MultipleChoiceQuestion;

  response: Object[] = [];
}
</script>
