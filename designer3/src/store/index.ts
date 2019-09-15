import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
import titleSegment from "./title-segment.store";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [pathify.plugin],
  modules: {
    titleSegment
  }
});
