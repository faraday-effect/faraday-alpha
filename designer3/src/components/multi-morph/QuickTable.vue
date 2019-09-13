<template>
  <div>
    <table>
      <tbody>
        <tr>
          <td />
          <td v-for="(row, rowIdx) in data[0]" :key="`col-menu-${rowIdx}`">
            <ColumnMenu />
          </td>
        </tr>
        <tr v-for="(row, rowIdx) in data" :key="rowIdx">
          <td>
            <RowMenu />
          </td>
          <td v-for="(col, colIdx) in row" :key="colIdx">
            <div
              class="datum"
              contenteditable="true"
              v-text="col"
              style="display: inline-block"
              :id="`${rowIdx}-${colIdx}`"
              @blur="updateCell"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="addRow">Add Row</button>
    <button @click="addCol">Add Col</button>
    <div>{{ data }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RowMenu from "@/components/multi-morph/RowMenu.vue";
import ColumnMenu from "@/components/multi-morph/ColumnMenu.vue";

export default Vue.extend({
  name: "QuickTable",

  components: { RowMenu, ColumnMenu },

  data() {
    return {
      data: [
        ["alpha", "beta", "gamma", "delta"],
        ["one", "two", "three", "four"]
      ]
    };
  },

  methods: {
    addRow() {
      this.data.push(["red", "orange", "yellow", "green"]);
    },

    addCol() {
      this.data.forEach(row => row.push("salad"));
    },

    updateCell(event: any) {
      const lostFocus = event.target;
      const gotFocus = event.relatedTarget;
      console.log("BLUR", lostFocus, gotFocus);

      const [row, col] = lostFocus.id.split("-");
      const newValue = lostFocus.innerText;
      console.log(`(${row}, ${col}) => ${newValue}`);
      this.$set(this.data[row], col, newValue);
    }
  }
});
</script>

<style>
.datum {
  background: lightgray;
  border: thin dashed coral;
  min-height: 1em;
  min-width: 4em;
}
</style>
