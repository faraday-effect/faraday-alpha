<template>
  <v-container>
    <v-progress-circular v-if="$apollo.loading" indeterminate />
    <v-row v-else>
      <v-col cols="3">
        <div class="title text-center">Topics</div>
        <draggable v-model="topics" ghost-class="ghost">
          <TopicCard
            v-for="topic in topics"
            :key="topic.id"
            :topic="topic"
            @delete-topic="deleteTopic"
          />
        </draggable>
        <TopicDialog @add-topic="addTopic" />
      </v-col>

      <v-col cols="9">
        <div class="title text-center">Schedule</div>
        <ScheduleTable :class-schedule="classSchedule" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import draggable from "vuedraggable";
import { plainToClass } from "class-transformer";
import { ClassSchedule, Section, Topic } from "@/types";
import { CREATE_TOPIC_MUTATION, ONE_SECTION_QUERY } from "@/graphql";
import TopicCard from "@/components/schedule/TopicCard.vue";
import ScheduleTable from "@/components/schedule/ScheduleTable.vue";
import TopicDialog from "@/components/schedule/TopicDialog.vue";

export default Vue.extend({
  components: {
    draggable,
    TopicCard,
    ScheduleTable,
    TopicDialog
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
      section: {} as Section
    };
  },

  methods: {
    deleteTopic(topicId: number) {
      this.section.deleteTopic(topicId);
    },
    addTopic(topic: any) {
      this.$apollo
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
    }
  },

  computed: {
    classSchedule: function(): ClassSchedule {
      const schedule = new ClassSchedule(this.section);
      schedule.scheduleTopics();
      return schedule;
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
  background: #c8ebfb;
}
</style>
