import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
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

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
