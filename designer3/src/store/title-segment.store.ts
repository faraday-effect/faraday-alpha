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

interface UpdatePayload {
  segmentId: number;
}

export interface UpdateTitlePayload extends UpdatePayload {
  title: string;
}

export interface UpdateSubtitlePayload extends UpdatePayload {
  subtitle: string;
}

export interface UpdateAuthorPayload extends UpdatePayload {
  author: string;
}

export interface UpdateDatePayload extends UpdatePayload {
  date: string;
}

const mutations: MutationTree<TitleSegmentState> = {
  updateTitle(state: TitleSegmentState, payload: UpdateTitlePayload) {
    state[payload.segmentId].title = payload.title;
  },

  updateSubtitle(state: TitleSegmentState, payload: UpdateSubtitlePayload) {
    state[payload.segmentId].subtitle = payload.subtitle;
  },

  updateAuthor(state: TitleSegmentState, payload: UpdateAuthorPayload) {
    state[payload.segmentId].author = payload.author;
  },

  updateDate(state: TitleSegmentState, payload: UpdateDatePayload) {
    state[payload.segmentId].date = payload.date;
  }
};

const module: Module<TitleSegmentState, RootState> = {
  namespaced: true,
  state: {} as TitleSegmentState,
  mutations
};

export default module;
