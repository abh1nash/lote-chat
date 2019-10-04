import Vue from "vue";
import Vuex from "vuex";

import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

import chatrooms from "./modules/chatrooms";
import users from "./modules/users";
import messages from "./modules/messages";
import listeners from "./modules/listeners";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    chatrooms,
    users,
    messages,
    listeners
  },
  state,
  mutations,
  actions,
  getters
});
