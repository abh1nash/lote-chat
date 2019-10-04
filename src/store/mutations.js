import Vue from "vue";
export default {
  setItem(state, { parent, name, value }) {
    if (parent) {
      Vue.set(state[parent], name, value);
    } else {
      Vue.set(state, name, value);
    }
  },
  setMsgNotice(state, { crId, remove }) {
    if (remove) {
      state.unreadMsgs.splice(state.unreadMsgs.indexOf(crId));
    } else {
      if (!Object.keys(state.unreadMsgs).includes(crId)) {
        state.unreadMsgs.push(crId);
      }
    }
  }
};
