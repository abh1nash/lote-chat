import Vue from "vue";
export default {
  setItem(state, { parent, name, value }) {
    if (parent) {
      Vue.set(state[parent], name, value);
    } else {
      Vue.set(state, name, value);
    }
  },
  setMsgNotice(state, value) {
    if (value) {
      Vue.set(state, "unreadMsg", true);
    } else {
      Vue.set(state, "unreadMsg", false);
    }
  }
};
