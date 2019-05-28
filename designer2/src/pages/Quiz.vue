<template>
  <div>
    <h1 class="headline">A Quiz</h1>
    <p>..{{ quizQuestions }}..</p>
    <h2>Courses</h2>
    <p>..{{ courses }}..</p>
    <h2>Departments</h2>
    <p>..{{ departments }}..</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import gql from "graphql-tag";

@Component({
  apollo: {
    courses: require("../graphql/allCourses.gql"),
    departments: require("../graphql/allDepartments.gql"),
    quizQuestions: require("../graphql/allQuestions.gql")
  }
})
export default class Quiz extends Vue {
  quizQuestions: any = null;
  courses: any[] = [];
  departments: any[] = [];

  foo() {
    console.log(this.$apollo);
  }
}
</script>
