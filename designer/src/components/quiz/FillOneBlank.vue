<template>
  <div class="q-pa-lg">
    <q-input v-model="response" label="Your Answer" />
  </div>
</template>

<script>
export default {
  name: "FillOneBlank",
  props: ["details"],
  data() {
    return {
      response: null
    };
  }
};
</script>
