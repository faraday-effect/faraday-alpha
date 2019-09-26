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
      <v-card class="dropzone">
        <v-card-title>DROP ZONE</v-card-title>
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

// Some code based on
// - https://alligator.io/js/drag-and-drop-interactjs/
// - https://css-tricks.com/swipeable-card-stack-using-vue-js-and-interact-js/

interface Card {
  id: number;
  dropped: boolean;
  xOffset: number;
  yOffset: number;
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
      this.allCards.push({
        id: i,
        dropped: false,
        xOffset: 0.0,
        yOffset: 0.0
      });
    });
  },

  mounted() {
    console.log("MOUNTED");

    interact(".item").draggable({
      onstart: event => console.log("START", event),

      onend: event => console.log("END", event),

      onmove: event => {
        const target = event.target;
        const card = this.allCards.find(card => card.id == parseInt(target.id));

        if (card) {
          const deltaX = event.dx;
          const deltaY = event.dy;

          card.xOffset += deltaX;
          card.yOffset += deltaY;

          target.style.transform = `translate(${card.xOffset}px, ${card.yOffset}px)`;
        } else {
          throw new Error(`Can't find card with ID '${target.id}'`);
        }
      }
    });

    interact(".dropzone").dropzone({
      accept: ".item",

      ondropactivate: event => {
        const item = event.relatedTarget;
        const dropZone = event.target;
        item.classList.add("dragging");
        dropZone.classList.add("drop-active");
      },

      ondropdeactivate: event => {
        const item = event.relatedTarget;
        const dropZone = event.target;
        item.classList.remove("dragging", "cannot-drop");
        dropZone.classList.remove("drop-active");
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

<style scoped>
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
  z-index: 2;
  background: red !important;
}
.cannot-drop {
  background: blue !important;
}
.can-drop {
  background: orange !important;
}
.drop-active {
  border: dashed 4px chocolate;
}
</style>
