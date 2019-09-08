<template>
  <v-dialog v-model="visible" persistent max-width="500px">
    <v-card>
      <v-card-title>Add a topic</v-card-title>
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
        <v-btn text @click="reset">Cancel</v-btn>
        <v-btn text @click="emitSave">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TopicAddDialog",

  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  data() {
    return {
      formData: {
        title: "",
        description: ""
      }
    };
  },

  methods: {
    emitSave() {
      this.$emit("save", this.formData);
      this.reset();
    },
    reset() {
      this.formData.title = "";
      this.formData.description = "";
      this.$emit("update:visible", false);
    }
  }
});
</script>
