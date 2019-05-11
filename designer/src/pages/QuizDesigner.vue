<template>
  <q-page padding>
    <p class="text-h6">Quiz Designer</p>

    <div class="row q-col-gutter-md">
      <!-- Title -->
      <q-input
        class="col-8"
        label="Title"
        v-model="$v.quiz.title.$model"
        v-bind:error="$v.quiz.title.$error"
        errorMessage="This field is required."
        bottom-slots
      ></q-input>

      <!-- Type -->
      <q-select
        class="col-4"
        label="Type"
        v-model="$v.quiz.type.$model"
        v-bind:options="quizTypes"
        v-bind:error="$v.quiz.type.$error"
        errorMessage="Required"
        bottom-slots
      ></q-select>
    </div>

    <!-- Description -->
    <div class="q-py-md">
      <p class="text-subtitle1">
        Description
        <span class="text-negative" v-if="$v.quiz.description.$error">
          &mdash; Required Field</span
        >
      </p>
      <q-editor
        v-model="$v.quiz.description.$model"
        v-bind:toolbar="[
          ['bold', 'italic', 'underline', 'strike'],
          ['undo', 'redo']
        ]"
      ></q-editor>
    </div>

    <div v-if="isType('true-false')">
      <p>No additional options are required.</p>
    </div>

    <div v-else-if="isType('multiple-choice')">
      <p class="text-subtitle1">Multiple Choice</p>
      <div class="row" v-for="idx in 5" v-bind:key="idx">
        <q-input
          class="col-6"
          v-model="choices[idx - 1]"
          label="Choice"
        ></q-input>
        <q-radio
          class="col-6"
          v-model="correctChoice"
          v-bind:val="idx - 1"
          label="Correct Answer"
        ></q-radio>
      </div>
    </div>

    <div v-else-if="isType('multiple-dropdowns')">
      <h1>Multiple Dropdowns</h1>
    </div>

    <div v-else-if="isType('matching')">
      <h1>Matching</h1>
    </div>

    <div v-else-if="isType('fill-the-blank')">
      <h1>Fill In the Blank</h1>
    </div>

    <div v-else>
      <p>None of the Above</p>
    </div>

    <div class="q-pt-md row justify-end">
      <q-btn
        label="Create Quiz"
        type="submit"
        color="primary"
        v-on:click="submitMe"
        v-bind:disable="$v.$invalid"
      />
    </div>
  </q-page>
</template>

<script lang="ts" lang="ts">
import { required } from "vuelidate/lib/validators";

import Vue from 'vue'

export default Vue.extend({
  name: "QuizDesigner",
  created() {
    this.quizTypes = [
      { value: "true-false", label: "True-False" },
      { value: "multiple-choice", label: "Multiple Choice" },
      { value: "multiple-dropdowns", label: "Multiple Dropdowns" },
      { value: "matching", label: "Matching" },
      { value: "fill-the-blank", label: "Fill in the Blank" }
    ];
  },
  data() {
    return {
      quiz: {
        title: "",
        description: "",
        type: null
      },
      choices: [],
      correctChoice: undefined
    };
  },
  validations: {
    quiz: {
      title: {
        required
      },
      description: {
        required
      },
      type: {
        required
      }
    }
  },
  methods: {
    isType: function(type) {
      return this.quiz.type && this.quiz.type.validator === type;
    },
    submitMe() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("INVALID");
      }
    }
  }
});
</script>
