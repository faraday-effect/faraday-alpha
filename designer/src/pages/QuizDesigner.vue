<template>
  <q-page padding>
    <p class="text-h6">Quiz Designer</p>

    <div class="row q-col-gutter-md">
      <!-- Title -->
      <q-input
        v-model="$v.quiz.title.$model"
        class="col-8"
        label="Title"
        :error="$v.quiz.title.$error"
        error-message="This field is required."
        bottom-slots
      ></q-input>

      <!-- Type -->
      <q-select
        v-model="$v.quiz.type.$model"
        class="col-4"
        label="Type"
        :options="quizTypes"
        :error="$v.quiz.type.$error"
        error-message="Required"
        bottom-slots
      ></q-select>
    </div>

    <!-- Description -->
    <div class="q-py-md">
      <p class="text-subtitle1">
        Description
        <span v-if="$v.quiz.description.$error" class="text-negative"
          >&mdash; Required Field</span
        >
      </p>
      <q-editor
        v-model="$v.quiz.description.$model"
        :toolbar="[['bold', 'italic', 'underline', 'strike'], ['undo', 'redo']]"
      ></q-editor>
    </div>

    <div v-if="isType('true-false')">
      <p>No additional options are required.</p>
    </div>

    <div v-else-if="isType('multiple-choice')">
      <p class="text-subtitle1">Multiple Choice</p>
      <div v-for="idx in 5" :key="idx" class="row">
        <q-input
          v-model="choices[idx - 1]"
          class="col-6"
          label="Choice"
        ></q-input>
        <q-radio
          v-model="correctChoice"
          :val="idx - 1"
          class="col-6"
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
        :disable="$v.$invalid"
        @click="submitMe"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { required } from "vuelidate/lib/validators";

import { Vue, Component } from "vue-property-decorator";
import { validationMixin } from "vuelidate";

@Component({
  mixins: [validationMixin],
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
  }
})
export default class QuizDesigner extends Vue {
  quiz = {
    title: "",
    description: "",
    type: null
  };
  choices = [];
  correctChoice = undefined;
  quizTypes = [
    { value: "true-false", label: "True-False" },
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "multiple-dropdowns", label: "Multiple Dropdowns" },
    { value: "matching", label: "Matching" },
    { value: "fill-the-blank", label: "Fill in the Blank" }
  ];

  isType(type: string) {
    return this.quiz.type && this.quiz.type === type;
  }

  submitMe() {
    this.$v.$touch();
    if (this.$v.$invalid) {
      console.log("INVALID");
    }
  }
}
</script>
