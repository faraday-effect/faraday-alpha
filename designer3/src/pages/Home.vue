<template>
  <v-container>
    <v-row>
      <v-card
        :id="card.id"
        class="item ma-1"
        draggable="true"
        v-for="card in readyCards"
        :key="card.id"
      >
        <v-card-title>Hello {{ card.id }}</v-card-title>
      </v-card>
    </v-row>
    <v-row>
      <v-card>
        <v-card-title class="dropzone">DROP ZONE</v-card-title>
        <v-card-text>
          <ul>
            <li v-for="card in droppedCards" :key="card.id">{{ card.id }}</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import interact from "interactjs";
import times from "lodash/times";

// Some code based on https://alligator.io/js/drag-and-drop-interactjs/

interface Card {
  id: number;
  dropped: boolean;
}

export default Vue.extend({
  name: "Home",

  data() {
    return {
      allCards: [] as Card[]
    };
  },

  computed: {
    readyCards(): Card[] {
      return this.allCards.filter(card => !card.dropped);
    },

    droppedCards(): Card[] {
      return this.allCards.filter(card => card.dropped);
    }
  },

  methods: {
    dropCard(idx: number) {
      this.allCards[idx].dropped = true;
    }
  },

  created() {
    times(12, i => {
      this.allCards.push({ id: i, dropped: false });
    });
  },

  mounted() {
    console.log("MOUNTED");

    interact(".item").draggable({
      onstart: event => console.log("START", event),

      onend: event => console.log("END", event),

      onmove: event => {
        const target = event.target;

        const dataX = target.getAttribute("data-x");
        const dataY = target.getAttribute("data-y");
        const initialX = parseFloat(dataX) || 0;
        const initialY = parseFloat(dataY) || 0;

        const deltaX = event.dx;
        const deltaY = event.dy;

        const newX = initialX + deltaX;
        const newY = initialY + deltaY;

        target.style.transform = `translate(${newX}px, ${newY}px)`;

        target.setAttribute("data-x", newX);
        target.setAttribute("data-y", newY);
      }
    });

    interact(".dropzone").dropzone({
      accept: ".item",

      ondropactivate: event => {
        const item = event.relatedTarget;
        item.classList.add("dragging");
      },

      ondropdeactivate: event => {
        const item = event.relatedTarget;
        item.classList.remove("dragging", "cannot-drop");
      },

      ondragenter: event => {
        const item = event.relatedTarget;
        item.classList.remove("cannot-drop");
        item.classList.add("can-drop");
      },

      ondragleave: event => {
        const item = event.relatedTarget;
        item.classList.remove("can-drop");
        item.classList.add("cannot-drop");
      },

      ondrop: event => {
        console.log("DROP", event);
        console.log(`Dropped ${event.relatedTarget.id}`);
        this.dropCard(event.relatedTarget.id);
      }
    });
  }
});
</script>

<style>
.item {
  touch-action: none;
  user-select: none;
  z-index: 1;
}
.dropzone {
  color: teal;
  min-width: 15em;
  min-height: 5em;
  z-index: 0;
}
.dragging {
  background: red !important;
}
.cannot-drop {
  background: blue !important;
}
.can-drop {
  background: orange !important;
}
</style>
