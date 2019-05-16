<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" :options="choices" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

interface TrueFalseChoice {
  label: string;
  value: boolean;
}

@Component
class TrueFalseComponent extends Vue {
  choices = [{ label: "True", value: true }, { label: "False", value: false }];
  response: TrueFalseChoice | null = null;
}
</script>
