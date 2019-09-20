<template>
  <div>
    <v-text-field label="Title" v-model="title" />
    <v-text-field label="Subtitle" v-model="subtitle" />
    <v-text-field label="Author" v-model="author" />
    <v-text-field label="Date" v-model="date" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TitleEditor",

  props: {
    segmentId: {
      type: Number,
      required: true
    }
  },

  // Tried to do this beforeCreate() but neither the props nor segmentId were yet defined.
  created() {
    console.log("BEFORE CREATE", this.$props);

    this.$store.state.titleSegment[this.segmentId] = {
      title: `TITLE-${this.segmentId}`,
      subtitle: `SUBTITLE-${this.segmentId}`,
      author: `AUTHOR-${this.segmentId}`,
      date: `DATE-${this.segmentId}`
    };

    console.log("STATE AFTER SETUP", this.$store.state);
  },

  computed: {
    title: {
      get(): string {
        console.log(this.$store.state);
        return this.$store.state.titleSegment[this.segmentId].title;
      },
      set(value: string) {
        this.$store.commit("titleSegment/updateTitle", {
          segmentId: this.segmentId,
          title: value
        });
      }
    },
    subtitle: {
      get(): string {
        console.log(this.$store.state);
        return this.$store.state.titleSegment[this.segmentId].subtitle;
      },
      set(value: string) {
        this.$store.commit("updateSubtitle", {
          segmentId: this.segmentId,
          details: { subtitle: value }
        });
      }
    },
    author: {
      get(): string {
        console.log(this.$store.state);
        return this.$store.state.titleSegment[this.segmentId].author;
      },
      set(value: string) {
        this.$store.commit("updateAuthor", {
          segmentId: this.segmentId,
          details: { author: value }
        });
      }
    },
    date: {
      get(): string {
        console.log(this.$store.state);
        return this.$store.state.titleSegment[this.segmentId].date;
      },
      set(value: string) {
        this.$store.commit("updateDate", {
          segmentId: this.segmentId,
          details: { date: value }
        });
      }
    }
  }
});
</script>
