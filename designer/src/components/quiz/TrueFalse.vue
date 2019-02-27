<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" v-bind:options="choices" />
  </div>
</template>

<script>
export default {
  name: "TrueFalse",
  created() {
    this.choices = [
      { label: "True", value: true },
      { label: "False", value: false }
    ];
  },
  data() {
    return {
      response: null
    };
  }
};
</script>
