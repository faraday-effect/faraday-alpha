<template>
  <div>
    <table>
      <tbody>
        <tr v-for="(row, rowIdx) in data" :key="rowIdx">
          <td class="datum" v-for="(col, colIdx) in row" :key="colIdx">
            <div
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

export default Vue.extend({
  name: "QuickTable",

  methods: {
    addRow() {
      this.data.push(["red", "orange", "yellow", "green"]);
    },
    addCol() {
      this.data.forEach(row => row.push("salad"));
    },
    updateCell(event) {
      const lostFocus = event.target;
      const gotFocus = event.relatedTarget;
      console.log("BLUR", lostFocus, gotFocus);

      const [row, col] = lostFocus.id.split("-");
      const newValue = lostFocus.innerText;
      console.log(`(${row}, ${col}) => ${newValue}`);
      this.$set(this.data[row], col, newValue);
    }
  },

  data() {
    return {
      data: [
        ["alpha", "beta", "gamma", "delta"],
        ["one", "two", "three", "four"]
      ]
    };
  }
});
</script>

<style>
.datum {
  background: lightgray;
  border: thin dashed coral;
}
</style>
