import Vue from "vue";
export default {
  namespaced: true,
  state: {
    users: {},
    chatrooms: {},
    messages: {}
  },
  mutations: {
    setListener(state, { parent, name, value }) {
      Vue.set(state[parent], name, value);
    }
  },
  actions: {
    addListener({ state, commit }, { name, id, value }) {
      if (!state[name].id) {
        commit("setListener", { parent: name, name: id, value });
      }
    },
    stopListening({ state }, { name, id }) {
      state[name][id]();
      console.log("stopped ", name, id);
    }
  }
};
