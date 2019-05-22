<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>Faraday Designer</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <DrawerItem
          link_name="content-designer"
          icon_name="edit"
          label="Content Designer"
          caption="Add or update content"
        />
        <DrawerItem
          link_name="quiz-designer"
          icon_name="check"
          label="Quiz Designer"
          caption="Add or update a quiz"
        />
        <DrawerItem
          link_name="quiz"
          icon_name="check_box"
          label="Quiz Tester"
          caption="Try out a quiz"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// TODO: Update this to be TypeScript.
// I have not been able to switch to `lang="ts"` without
// losing the type of `this.$q`. It seems to work okay
// as JavaScript.
import DrawerItem from "../layouts/DrawerItem.vue";

export default {
  name: "MyLayout",
  components: {
    DrawerItem
  },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    };
  }
};
</script>
