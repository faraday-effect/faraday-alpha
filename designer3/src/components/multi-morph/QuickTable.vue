<template>
  <div>
    <table>
      <tbody>
        <tr v-for="(row, rowIdx) in data" :key="rowIdx">
          <td v-for="(col, colIdx) in row" :key="colIdx">
            <div
              contenteditable="true"
              style="display: inline-block"
              :id="`${rowIdx}-${colIdx}`"
              @input="changeMe"
            >
              {{ col }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="addRow">Add Row</button>
    <button @click="addCol">Add Col</button>
    <button @click="dumpData">Dump Data</button>
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
    dumpData() {
      console.log(this.data);
    },
    changeMe(event) {
      const td = event.target;
      const [row, col] = td.id.split("-");
      const newValue = td.innerText;
      console.log(row, col, newValue);
      console.log(this.data);
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
