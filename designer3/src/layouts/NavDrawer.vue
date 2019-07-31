<template>
  <v-navigation-drawer app v-model="drawerVisible">
    <v-list>
      <NavItem v-for="item in menuItems" :key="item.route" :item="item" />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import NavItem from "./NavItem.vue";

export default {
  components: {
    NavItem
  },
  props: {
    initialVisibility: Boolean
  },
  data: function() {
    return {
      drawerVisible: this.initialVisibility
    };
  },
  methods: {
    menuItems: function() {
      return [
        {
          title: "Home",
          route: "home",
          icon: "home",
          divider: true
        },
        {
          title: "Quizzes",
          route: "quizzes",
          icon: "check",
          children: [
            {
              title: "Design",
              route: "quiz-designer"
            },
            {
              title: "Preview",
              route: "quiz-preview"
            }
          ]
        },
        {
          title: "About Faraday",
          route: "about",
          icon: "school"
        }
      ];
    },

    toggle: function() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
};
</script>
