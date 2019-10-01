import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/";
import AppDate from "./components/AppDate";
import "./registerServiceWorker";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faCommentDots,
  faPaperPlane,
  faPlus,
  faSignInAlt,
  faVideo,
  faHeadphones,
  faInfo
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch("users/updateAuthUser", user.uid);
  }
});

library.add(
  faGoogle,
  faInfo,
  faHeadphones,
  faVideo,
  faUser,
  faSignInAlt,
  faPlus,
  faCommentDots,
  faPaperPlane
);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("AppDate", AppDate);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
