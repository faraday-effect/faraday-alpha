import { RootState } from "@/store/index";
import { Module, MutationTree } from "vuex";

interface TitleDetails {
  title?: string;
  subtitle?: string;
  author?: string;
  date?: string;
}

export interface TitleSegmentState {
  [segmentId: number]: TitleDetails;
}

interface UpdateTitlePayload {
  segmentId: number;
  title: string;
}

const mutations: MutationTree<TitleSegmentState> = {
  updateTitle(state: TitleSegmentState, payload: UpdateTitlePayload) {
    state[payload.segmentId].title = payload.title;
  }
};

const module: Module<TitleSegmentState, RootState> = {
  namespaced: true,
  state: {} as TitleSegmentState,
  mutations
};

export default module;
