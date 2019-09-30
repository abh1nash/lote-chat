import Vue from "vue";
export default {
  setItem(state, { name, value }) {
    Vue.set(state, name, value);
  }
};
