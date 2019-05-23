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

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { NavItemType } from "./layout.types";

@Component
export default class NavItem extends Vue {
  /** Item to display */
  @Prop() item!: NavItemType;

  /** Is the current item a child? */
  isChild: boolean = false;
}
</script>
