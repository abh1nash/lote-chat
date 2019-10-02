import Vue from "vue";
import Vuex from "vuex";

import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

import chatrooms from "./modules/chatrooms";
import users from "./modules/users";
import messages from "./modules/messages";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    chatrooms,
    users,
    messages
  },
  state,
  mutations,
  actions,
  getters
});
