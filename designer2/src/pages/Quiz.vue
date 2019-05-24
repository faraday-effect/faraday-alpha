<template>
  <div>
    <h1 class="headline">A Quiz</h1>
    <h2>Courses</h2>
    <p>..{{ courses }}..</p>
    <h2>Departments</h2>
    <p>..{{ departments }}..</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import gql from "graphql-tag";
// import { ApolloProvider } from "vue-apollo";

const courseQuery = gql`
  query allCourses {
    courses {
      id
      number
      title
      department {
        name
      }
      prefix {
        value
      }
    }
  }
`;

const deptQuery = gql`
  query allDepartments {
    departments {
      id
      name
      courses {
        title
        number
      }
    }
  }
`;

@Component({
  apollo: {
    courses: courseQuery,
    departments: deptQuery
  }
})
export default class Quiz extends Vue {
  courses: any[] = [];
  departments: any[] = [];

  foo() {
    console.log(this.$apollo);
  }
}
</script>
