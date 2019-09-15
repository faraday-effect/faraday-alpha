import { make } from "vuex-pathify";

const state = {
  title: "",
  subtitle: "",
  author: "",
  date: ""
};

export default {
  namespaced: true,
  state,
  mutations: make.mutations(state)
};
