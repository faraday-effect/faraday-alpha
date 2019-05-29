<template>
  <div class="q-pa-lg">
    <q-input v-model="response" label="Your Answer" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { FillOneBlankQuestion } from "./quiz.types";

@Component
export default class FillOneBlank extends Vue {
  @Prop(Object) question!: FillOneBlankQuestion;

  response: Object[] = [];
}
</script>
