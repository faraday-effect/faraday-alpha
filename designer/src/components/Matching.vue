<template>
  <q-card bordered style="margin: 2em 0">
    <q-card-section>
      <p class="text-overline">Question {{ questionNumber + 1 }}</p>
      <p class="text-h6">{{ details.title }}</p>
      <p>{{ details.text }}</p>
    </q-card-section>

    <q-separator />

    <div class="q-pa-lg">
      <div
        class="row items-center justify-start"
        v-for="(pair, idx) in details.pairs"
        v-bind:key="idx"
      >
        <div class="col-2">
          {{ pair[0] }}
        </div>
        <div class="col-2">
          <q-select
            label="Your Answer"
            v-model="answer[idx]"
            v-bind:options="choices()"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: "MultipleDropdownsQuestion",
  props: ["questionNumber", "details"],
  data() {
    return {
      answer: []
    };
  },
  methods: {
    choices() {
      return this.details.pairs.map(pair => pair[1]);
    }
  }
};
</script>
