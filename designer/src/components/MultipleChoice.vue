<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" v-bind:options="details.choices" />
  </div>
</template>

<script>
export default {
  name: "MultipleChoiceQuestion",
  props: ["details"],
  data() {
    return {
      response: null
    };
  }
};
</script>
