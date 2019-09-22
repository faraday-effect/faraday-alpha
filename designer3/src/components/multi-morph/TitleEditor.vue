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
import {
  UpdateAuthorPayload,
  UpdateDatePayload,
  UpdateSubtitlePayload,
  UpdateTitlePayload
} from "@/store/title-segment.store";

export default Vue.extend({
  name: "TitleEditor",

  props: {
    segmentId: {
      type: Number,
      required: true
    }
  },

  // On creation of this component, create a new entry in the Vuex module.
  // Tried to do this beforeCreate() but neither the props nor segmentId were yet defined.
  created() {
    Vue.set(this.$store.state.titleSegment, this.segmentId, {
      title: "",
      subtitle: "",
      author: "",
      date: ""
    });
  },

  computed: {
    title: {
      get(): string {
        return this.$store.state.titleSegment[this.segmentId].title;
      },
      set(value: string) {
        this.$store.commit("titleSegment/updateTitle", {
          segmentId: this.segmentId,
          title: value
        } as UpdateTitlePayload);
      }
    },

    subtitle: {
      get(): string {
        return this.$store.state.titleSegment[this.segmentId].subtitle;
      },
      set(value: string) {
        this.$store.commit("titleSegment/updateSubtitle", {
          segmentId: this.segmentId,
          subtitle: value
        } as UpdateSubtitlePayload);
      }
    },

    author: {
      get(): string {
        return this.$store.state.titleSegment[this.segmentId].author;
      },
      set(value: string) {
        this.$store.commit("titleSegment/updateAuthor", {
          segmentId: this.segmentId,
          author: value
        } as UpdateAuthorPayload);
      }
    },

    date: {
      get(): string {
        return this.$store.state.titleSegment[this.segmentId].date;
      },
      set(value: string) {
        this.$store.commit("titleSegment/updateDate", {
          segmentId: this.segmentId,
          date: value
        } as UpdateDatePayload);
      }
    }
  }
});
</script>
