<template>
  <v-radio-group v-model="response">
    <v-radio
      v-for="(choice, idx) in choices"
      :key="idx"
      :label="choice.label"
      :value="choice.value"
    ></v-radio>
  </v-radio-group>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TrueFalseComponent extends Vue {
  @Prop() details!: object;
  choices = [{ label: "True", value: true }, { label: "False", value: false }];
  response: boolean | null = null;
}
</script>
