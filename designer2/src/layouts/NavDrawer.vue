<template>
  <v-navigation-drawer app v-model="drawerVisible">
    <v-list>
      <NavItem v-for="item in menuItems" :key="item.route" :item="item" />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import NavItem from "./NavItem.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import { NavItemType } from "./layout.types";

@Component({
  components: { NavItem }
})
export default class NavDrawer extends Vue {
  @Prop({ default: false }) initialVisibility!: boolean;

  drawerVisible: boolean = this.initialVisibility;

  get menuItems(): NavItemType[] {
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
  }

  toggle() {
    this.drawerVisible = !this.drawerVisible;
  }
}
</script>
