import { TitleFields } from "@/components/multi-morph/muti-morph.types";
import { RootState } from "@/store/index";
import { Module } from "vuex";

export interface MultiMorphTitleState {
  rawData: TitleFields;
  markdown: string;
  latex: string;
}

const MultiMorphTitleModule: Module<MultiMorphTitleState, RootState> = {
  namespaced: true,

  state: {
    rawData: {} as TitleFields,
    markdown: "",
    latex: ""
  },

  mutations: {
    setRawData(state, value: TitleFields) {
      state.rawData = value;
    },

    setMarkdown(state, value: string) {
      state.markdown = value;
    },

    setLaTeX(state, value: string) {
      state.latex = value;
    }
  }
};

export default MultiMorphTitleModule;
