<template>
  <v-container>
    <v-layout justify-space-around align-center>
      <p>This is an about page</p>
      <v-btn>Alpha</v-btn>
      <v-btn>Beta</v-btn>
    </v-layout>

    <v-layout wrap>
      <v-flex xs12 md6 row justify-center>
        <p>This is an about page</p>
      </v-flex>
      <v-flex xs12 md6 row justify-space-around>
        <v-btn>Alpha</v-btn>
        <v-btn>Beta</v-btn>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" @click="on.click">
            From Scratch
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="onClick(item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">
            Drop down
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="onClick(item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-layout>

    <v-layout justify-center>
      <v-date-picker v-model="picker"></v-date-picker>
    </v-layout>

    <v-layout>
      <v-flex>
        <DatePicker label="Pick You a Date" v-model="theDatePicked" />
      </v-flex>
      <v-flex>
        <div>[{{ theDatePicked }}]</div>
      </v-flex>
    </v-layout>

    <!--    <v-layout>-->
    <!--      <DateRangeEditor title="Hello, Range"  />-->
    <!--    </v-layout>-->
  </v-container>
</template>

<script lang="ts">
import DatePicker from "@/components/DatePicker.vue";
import DateRangeEditor from "@/components/DateRangeEditor.vue";

export default {
  name: "AboutPage",

  components: { DatePicker, DateRangeEditor },

  data() {
    return {
      theRange: {},
      theDatePicked: "",
      picker: "",
      items: [
        { title: "Click Me 1" },
        { title: "Click Me 2" },
        { title: "Click Me 3" },
        { title: "Click Me 4" }
      ]
    };
  },

  methods: {
    onClick(d: string) {
      console.log("ON CLICK", d);
    }
  }
};
</script>
