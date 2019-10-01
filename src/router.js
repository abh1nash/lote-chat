import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Chat from "./views/Chat.vue";
import store from "./store/";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "chat",
      component: Chat,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/logout",
      name: "logout",
      beforeEnter(to, from, next) {
        store.dispatch("users/signOut").then(() => next({ name: "login" }));
      }
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.authUserId) {
      next({
        name: "login"
        // query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (store.state.authUserId) {
      next({ name: "chat" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
