<template>
  <v-navigation-drawer app v-model="drawerVisible">
    <!-- Heading -->
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Designer
        </v-list-item-title>
        <v-list-item-subtitle>
          Faraday
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list v-for="item in navItems" :key="item.route" dense nav>
      <!-- No children -->
      <v-list-item v-if="!item.children" :to="item.route">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <!-- With children -->
      <v-list-group v-else :prepend-icon="item.icon" no-action>
        <template v-slot:activator>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </template>

        <v-list-item
          v-for="child in item.children"
          :key="child.route"
          :to="child.route"
        >
          <v-list-item-icon>
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ child.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-divider v-if="item.divider"></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    initialVisibility: {
      type: Boolean,
      default: null
    }
  },
  data: function() {
    return {
      drawerVisible: this.initialVisibility,
      navItems: [
        {
          title: "Home",
          route: "home",
          icon: "mdi-home",
          divider: true
        },
        {
          title: "Calendar",
          route: "calendar",
          icon: "mdi-calendar"
        },
        {
          title: "Quizzes",
          route: "quizzes",
          icon: "mdi-check",
          children: [
            {
              title: "Design",
              route: "quiz-designer",
              icon: "mdi-pencil"
            },
            {
              title: "Preview",
              route: "quiz-preview",
              icon: "mdi-glasses"
            }
          ]
        },
        {
          title: "About Faraday",
          route: "about",
          icon: "mdi-school"
        }
      ]
    };
  },

  methods: {
    toggle: function() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
};
</script>
