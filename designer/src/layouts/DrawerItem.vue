<template>
  <q-item :to="{ name: link_name }">
    <q-item-section avatar>
      <q-icon :name="icon_name" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class DrawerItem extends Vue {
  @Prop() link_name!: string;
  @Prop() icon_name!: string;
  @Prop() label!: string;
  @Prop() caption!: string;
}
</script>
