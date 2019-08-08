<!--
Some of the functionality here is from the `returnable` mixin.
  - `return-value` prop - value to return if save() isn't called
  - `save` method - update return value
Cf. https://www.youtube.com/watch?v=YUf7lPzYljw
-->

<template>
  <v-menu
    ref="menu"
    v-model="isVisible"
    :close-on-content-click="false"
    :return-value.sync="value"
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="value"
        v-on="on"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
      ></v-text-field>
    </template>
    <v-date-picker v-model="value">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="isVisible = false">Cancel</v-btn>
      <v-btn text color="primary" @click="setDate">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "FormDatePicker",
  props: {
    value: String,
    label: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isVisible: false
    };
  },
  methods: {
    setDate() {
      this.$refs.menu.save(this.value);
      this.$emit("input", this.value);
    }
  }
});
</script>
