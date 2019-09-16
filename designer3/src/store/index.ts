import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";

import titleSegmentStore from "./title-segment.store";
import tableSegmentStore from "./table-segment.store";

Vue.use(Vuex);

export interface RootState {}

export default new Vuex.Store<RootState>({
  plugins: [pathify.plugin],
  modules: {
    titleSegment: titleSegmentStore,
    tableSegment: tableSegmentStore
  }
});
