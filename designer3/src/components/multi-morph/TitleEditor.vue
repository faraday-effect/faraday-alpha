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
import { pick } from "lodash";

function latexHelper(cmd: string, arg: string) {
  return `\\${cmd}{${arg}}`;
}

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
      this.$store.commit("title/setRawData", this.asRawData());
      this.$store.commit("title/setMarkdown", this.asMarkdown());
      this.$store.commit("title/setLaTeX", this.asLaTeX());
    },

    asRawData() {
      return pick(this.$data, ["title", "subtitle", "author", "date"]);
    },

    asMarkdown(): string {
      return [
        `# ${this.title}`,
        `## ${this.subtitle}`,
        `** ${this.author} (${this.date}) **`
      ].join("\n");
    },

    asLaTeX(): string {
      return [
        latexHelper("title", this.title),
        latexHelper("subtitle", this.subtitle),
        latexHelper("author", this.author),
        latexHelper("date", this.date)
      ].join("\n");
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
