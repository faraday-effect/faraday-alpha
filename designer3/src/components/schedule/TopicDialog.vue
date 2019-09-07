<template>
  <v-dialog v-model="isVisible" persistent max-width="500px">
    <template v-slot:activator="{ on }">
      <v-btn class="ma-4" v-on="on">Add</v-btn>
    </template>
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
        <v-btn text @click="emitAdd">Add</v-btn>
        <v-btn text @click="resetDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TopicDialog",

  data() {
    return {
      isVisible: false,
      formData: {
        title: "",
        description: ""
      }
    };
  },

  methods: {
    emitAdd() {
      this.$emit("add-topic", this.formData);
      this.resetDialog();
    },
    resetDialog() {
      this.formData.title = "";
      this.formData.description = "";
      this.isVisible = false;
    }
  }
});
</script>
