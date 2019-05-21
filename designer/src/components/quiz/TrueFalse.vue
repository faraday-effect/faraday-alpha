<template>
  <div class="q-pa-lg">
    <q-option-group v-model="response" :options="choices"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { KeysToOneValue } from "../../../../shared/types/quiz.types";

@Component
export default class TrueFalseComponent extends Vue {
  choices: KeysToOneValue<Boolean> = {
    True: true,
    False: false
  };
}
</script>
