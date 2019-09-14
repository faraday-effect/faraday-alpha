<template>
  <div class="text-center ma-2">
    <v-snackbar color="warning" v-model="visible">
      {{ message }}
      <v-btn text @click="$emit('update:visible', false)">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Notification",

  props: {
    message: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  }
});
</script>
