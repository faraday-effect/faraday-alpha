<template>
  <div v-if="topics.length > 0">
    <div class="title text-center">
      <v-badge>
        <template #badge>{{ topics.length }}</template>
        Topics
      </v-badge>
    </div>
    <draggable v-model="topics" :group="{ name: 'topics' }">
      <TopicCard
        v-for="topic in topics"
        :key="topic.id"
        :topic="topic"
        @update-topic="editTopic"
        @delete-topic="deleteTopic"
      />
    </draggable>

    <v-btn class="ma-4" @click="addDialogVisible = true">Add</v-btn>
    <TopicDialog
      title="Add a topic"
      action="Add"
      :visible.sync="addDialogVisible"
      @save="createTopic"
    />
    <TopicDialog
      title="Update a topic"
      action="Update"
      :visible.sync="updateDialogVisible"
      :topic="updateModel"
      @save="updateTopic"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import draggable from "vuedraggable";
import { plainToClass } from "class-transformer";
import { Topic } from "@/types";
import {
  CREATE_TOPIC_MUTATION,
  DELETE_TOPIC_MUTATION,
  UPDATE_TOPIC_MUTATION
} from "@/graphql";
import TopicCard from "@/components/schedule/TopicCard.vue";
import TopicDialog from "@/components/schedule/TopicDialog.vue";

export default Vue.extend({
  components: {
    draggable,
    TopicCard,
    TopicDialog
  },

  props: {
    unit: {
      type: Object
    }
  },

  data() {
    return {
      addDialogVisible: false,
      updateDialogVisible: false,
      updateModel: {} as Topic
    };
  },

  computed: {
    topics: {
      get: function(): Topic[] {
        return this.unit ? this.unit.topics : [];
      },
      set: function(topics: Topic[]) {
        this.unit.topics = topics;
      }
    }
  },

  methods: {
    createTopic(topic: Topic) {
      return this.$apollo
        .mutate<{ createTopic: Topic }>({
          mutation: CREATE_TOPIC_MUTATION,
          variables: {
            createInput: {
              title: topic.title,
              description: topic.description,
              unitId: this.unit.id
            }
          }
        })
        .then(result => {
          if (result.data) {
            const newTopic = plainToClass(Topic, result.data.createTopic);
            this.unit.addTopic(newTopic);
            return newTopic;
          }
        })
        .catch(err => {
          throw err;
        });
    },

    editTopic(topic: Topic) {
      this.updateModel = topic;
      this.updateDialogVisible = true;
    },

    updateTopic(topic: Topic) {
      return this.$apollo
        .mutate<{ updateTopic: Topic }>({
          mutation: UPDATE_TOPIC_MUTATION,
          variables: {
            updateInput: {
              id: topic.id,
              title: topic.title,
              description: topic.description
            }
          }
        })
        .then(result => {
          if (result.data) {
            const updatedTopic = plainToClass(Topic, result.data.updateTopic);
            this.unit.updateTopic(updatedTopic);
            this.updateDialogVisible = false;
          }
        })
        .catch(err => {
          throw err;
        });
    },

    deleteTopic(topic: Topic) {
      return this.$apollo
        .mutate({
          mutation: DELETE_TOPIC_MUTATION,
          variables: {
            topicId: topic.id
          }
        })
        .then(() => {
          this.unit.deleteTopic(topic.id);
        })
        .catch(err => {
          throw err;
        });
    }
  }
});
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.5;
  background: teal;
}
</style>
