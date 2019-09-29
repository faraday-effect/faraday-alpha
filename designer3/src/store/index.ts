import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
import MultiMorphTitleModule from "@/store/multi-morph.title";

Vue.use(Vuex);

export interface RootState {}

export default new Vuex.Store<RootState>({
  plugins: [pathify.plugin],
  modules: {
    title: MultiMorphTitleModule
  }
});
