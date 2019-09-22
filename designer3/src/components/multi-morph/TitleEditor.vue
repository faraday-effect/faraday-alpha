<template>
  <div>
    <v-text-field
      label="Title"
      :value="title"
      @input="updated('title', $event)"
    />
    <v-text-field
      label="Subtitle"
      :value="subtitle"
      @input="updated('subtitle', $event)"
    />
    <v-text-field
      label="Author"
      :value="author"
      @input="updated('author', $event)"
    />
    <v-text-field label="Date" :value="date" @input="updated('date', $event)" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TitleFields } from "@/components/multi-morph/muti-morph.types";

export default Vue.extend({
  name: "TitleEditor",

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      title: "",
      subtitle: "",
      author: "",
      date: ""
    } as TitleFields;
  },

  methods: {
    updated(field: string, value: string) {
      this.$data[field] = value;
      this.$emit("input", {
        title: this.title,
        subtitle: this.subtitle,
        author: this.author,
        date: this.date
      } as TitleFields);
    }
  },

  watch: {
    value: {
      handler(v: TitleFields) {
        this.title = v.title;
        this.subtitle = v.subtitle;
        this.author = v.author;
        this.date = v.date;
      },
      immediate: true
    }
  }
});
</script>
