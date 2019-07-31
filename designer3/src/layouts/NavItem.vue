<template>
  <div>
    <v-list-tile
      v-if="!item.children || item.children.length === 0"
      :to="{ name: item.route }"
    >
      <v-list-tile-action v-if="item.icon && !isChild">
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>{{ item.title }}</v-list-tile-title>
    </v-list-tile>

    <v-list-group v-else :sub-group="isChild" no-action>
      <v-list-tile slot="activator" :to="{ name: item.route }">
        <v-list-tile-action v-if="item.icon && !isChild">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>

      <NavItem
        v-for="child in item.children"
        :key="child.route"
        :item="child"
        :isChild="true"
      />
    </v-list-group>
  </div>
</template>

<script>
export default {
  props: {
    item: null
  },

  data: function() {
    return {
      isChild: false
    };
  }
};
</script>
