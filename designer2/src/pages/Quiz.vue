<template>
  <div>
    <h1 class="headline">A Quiz</h1>
    <p>..{{ quizQuestions }}..</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import gql from "graphql-tag";

@Component({
  apollo: {
    quizQuestions: require("../graphql/allQuestions.gql")
  }
})
export default class Quiz extends Vue {
  quizQuestions: any = null;

  foo() {
    console.log(this.$apollo);
  }
}
</script>
