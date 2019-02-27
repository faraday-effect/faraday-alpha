<template>
  <quiz-question>
    <div class="q-pa-lg">
      <q-option-group v-model="answer" v-bind:options="choices" />
    </div>
  </quiz-question>
</template>

<script>
import QuizQuestion from "./QuizQuestion";

export default {
  name: "TrueFalseQuestion",
  components: { QuizQuestion },
  data() {
    return {
      answer: null,
      choices: [
        { label: "True", value: true },
        { label: "False", value: false }
      ]
    };
  }
};
</script>
