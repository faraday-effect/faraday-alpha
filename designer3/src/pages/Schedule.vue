<template>
  <v-container>
    <v-progress-circular
      v-if="$apollo.loading"
      indeterminate
    ></v-progress-circular>
    <v-row v-else>
      <v-col cols="3">
        <div class="title text-center">Topics</div>
        <v-list class="elevation-1">
          <draggable v-model="topics" ghost-class="ghost">
            <v-list-item two-line v-for="topic in topics" :key="topic.id">
              <v-list-item-icon>
                <v-icon>mdi-drag-horizontal</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ topic.title }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{ topic.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </draggable>
        </v-list>
        <v-dialog v-model="addDialogVisible" persistent max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-4" v-on="on">Add</v-btn>
          </template>
          <v-card>
            <v-card-title>Add a topic</v-card-title>
            <v-card-text>
              <v-text-field
                label="Title"
                v-model="addTopicForm.title"
                required
              ></v-text-field>
              <v-text-field
                label="Description"
                v-model="addTopicForm.description"
                required
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn text @click="addTopic">Add</v-btn>
              <v-btn text @click="cancelTopic">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="9">
        <div class="title text-center">Schedule</div>
        <v-data-table
          :headers="headers"
          :items="classSchedule.classDays"
          class="elevation-1"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
                :class="{
                  'in-date-range': item.inDateRange,
                  'first-day-of-week': item.firstDayOfWeek
                }"
              >
                <td>{{ item.firstDayOfWeek ? item.week : "" }}</td>
                <td>{{ item.inDateRange ? "" : item.nthClassDay }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.topics.join(", ") }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
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

export default Vue.extend({
  components: {
    draggable
  },

  apollo: {
    section: {
      query: ONE_SECTION_QUERY,
      variables: {
        sectionId: 13 // FIXME: hard-coded value
      },
      update(data) {
        return plainToClass(Section, data.section);
      }
    }
  },

  data() {
    return {
      section: {} as Section,
      addDialogVisible: false,
      addTopicForm: {
        title: "",
        description: ""
      },
      headers: [
        { text: "Week", value: "week", width: "10%" },
        { text: "Day", value: "nthClassDay", width: "10%" },
        { text: "Date", value: "date", width: "20%" },
        { text: "Topic", value: "topics", width: "60%" }
      ]
    };
  },

  methods: {
    cancelTopic() {
      this.addTopicForm.title = "";
      this.addTopicForm.description = "";
      this.addDialogVisible = false;
    },
    addTopic() {
      this.$apollo
        .mutate<{ createTopic: Topic }>({
          mutation: CREATE_TOPIC_MUTATION,
          variables: {
            createInput: {
              title: this.addTopicForm.title,
              description: this.addTopicForm.description,
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

      this.cancelTopic();
    }
  },

  computed: {
    classSchedule: function(): ClassSchedule {
      const schedule = new ClassSchedule(this.section);
      schedule.scheduleClasses();
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
.v-data-table >>> table {
  border-collapse: collapse;
}

.first-day-of-week {
  border-top: solid coral 2px;
}

.in-date-range {
  background: rgba(255, 127, 80, 0.21);
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
