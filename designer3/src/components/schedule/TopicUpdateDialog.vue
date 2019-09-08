<template>
  <v-dialog v-model="visible" persistent max-width="500px">
    <v-card>
      <v-card-title>Edit a topic</v-card-title>
      <v-card-text>
        <v-text-field
          label="Title"
          v-model="formData.title"
          required
        ></v-text-field>
        <v-text-field
          label="Description"
          v-model="formData.description"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="$emit('update:visible', false)">Cancel</v-btn>
        <v-btn text @click="$emit('save', formData)">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TopicUpdateDialog",

  props: {
    topic: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  data() {
    return {
      formData: {}
    };
  },

  watch: {
    topic: {
      handler: function(newVal) {
        this.formData = { ...newVal };
      },
      immediate: true
    }
  }
});
</script>
