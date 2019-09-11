<template>
  <v-dialog v-model="visible" persistent max-width="500px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
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
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-btn text @click="save">{{ action }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Unit } from "@/types";

export default Vue.extend({
  name: "UnitDialog",

  props: {
    title: {
      type: String,
      default: "SET A TITLE PROP"
    },
    action: {
      type: String,
      default: "SET AN ACTION"
    },
    unit: {
      type: Object
    },
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
      } as Unit
    };
  },

  watch: {
    unit: {
      handler: function(newUnit: Unit) {
        this.formData = newUnit;
      }
    }
  },

  methods: {
    save() {
      this.$emit("save", this.formData);
      this.clear();
      this.close();
    },
    cancel() {
      this.clear();
      this.close();
    },
    clear() {
      this.formData.title = "";
      this.formData.description = "";
    },
    close() {
      this.$emit("update:visible", false);
    }
  }
});
</script>
