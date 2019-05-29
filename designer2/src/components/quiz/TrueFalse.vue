<template>
  <div>FLIBBY {{ choices }}</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { KeysToOneValue } from "./quiz.types";

@Component
export default class TrueFalseComponent extends Vue {
  choices: KeysToOneValue<Boolean> = {
    True: true,
    False: false
  };
}
</script>
