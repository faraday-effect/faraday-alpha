<template>
  <v-container>
    <v-progress-circular v-if="$apollo.loading" indeterminate />
    <v-row v-else>
      <v-col cols="3">
        <div class="title text-center">
          <v-badge>
            <template #badge>{{ units.length }}</template>
            Units
          </v-badge>
        </div>
        <UnitCard v-for="unit in units" :key="unit.id" :unit="unit" />
      </v-col>

      <v-col cols="3">
        <div class="title text-center">
          <v-badge>
            <template #badge>{{ topics.length }}</template>
            Topics
          </v-badge>
        </div>
        <draggable v-model="topics" ghost-class="ghost">
          <TopicCard
            v-for="topic in topics"
            :key="topic.id"
            :topic="topic"
            @update-topic="editTopic"
            @delete-topic="deleteTopic"
          />
        </draggable>
        <v-btn class="ma-4" @click="addDialogVisible = true">Add</v-btn>
      </v-col>

      <v-col cols="6">
        <div class="title text-center">Schedule</div>
        <ScheduleTable :class-schedule="classSchedule" />
      </v-col>
      <TopicAddDialog :visible.sync="addDialogVisible" @save="createTopic" />
      <TopicUpdateDialog
        :visible.sync="updateDialogVisible"
        :topic="updateModel"
        @save="updateTopic"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import draggable from "vuedraggable";
import { plainToClass } from "class-transformer";
import { ClassSchedule, Section, Topic, Unit } from "@/types";
import {
  CREATE_TOPIC_MUTATION,
  DELETE_TOPIC_MUTATION,
  ONE_SECTION_QUERY,
  UPDATE_TOPIC_MUTATION
} from "@/graphql";
import TopicCard from "@/components/schedule/TopicCard.vue";
import ScheduleTable from "@/components/schedule/ScheduleTable.vue";
import TopicAddDialog from "@/components/schedule/TopicAddDialog.vue";
import TopicUpdateDialog from "@/components/schedule/TopicUpdateDialog.vue";
import UnitCard from "@/components/schedule/UnitCard.vue";

export default Vue.extend({
  components: {
    draggable,
    TopicCard,
    ScheduleTable,
    TopicAddDialog,
    TopicUpdateDialog,
    UnitCard
  },

  apollo: {
    section: {
      query: ONE_SECTION_QUERY,
      variables: {
        sectionId: 13 // FIXME: hard-coded value
      },
      update(data) {
        const section = plainToClass(Section, data.section);
        const schedule = new ClassSchedule(section);
        schedule.scheduleTopics();
        return section;
      }
    }
  },

  data() {
    return {
      section: {} as Section,
      addDialogVisible: false,
      updateDialogVisible: false,
      updateModel: {} as Topic
    };
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
              unitId: 28 // FIXME: hard-wired value
            }
          }
        })
        .then(result => {
          if (result.data) {
            const newTopic = plainToClass(Topic, result.data.createTopic);
            this.section.addTopic(newTopic);
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
            this.section.updateTopic(updatedTopic);
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
          this.section.deleteTopic(topic.id);
        })
        .catch(err => {
          throw err;
        });
    }
  },

  computed: {
    classSchedule: function(): ClassSchedule {
      const schedule = new ClassSchedule(this.section);
      schedule.scheduleTopics();
      return schedule;
    },

    units: {
      get: function(): Unit[] {
        return this.section.offering.units;
      },
      set: function(newValue: Unit[]) {
        this.section.offering.units = newValue;
      }
    },

    topics: {
      get: function(): Topic[] {
        return this.section.offering.units[0].topics;
      },
      set: function(newValue: Topic[]) {
        this.section.offering.units[0].topics = newValue;
      }
    }
  }
});
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: teal;
}
</style>
