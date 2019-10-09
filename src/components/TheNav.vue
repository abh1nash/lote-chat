<template>
  <nav class="navigation flex-column">
    <div class="navbar-brand">
      <h3>
        Lote
        <b>Chat</b>
      </h3>
    </div>
    <ul class="nav">
      <li class="nav-item">
        <a :class="[{'notice': notice },'btn btn-outline-primary']" href="#">
          <font-awesome-icon :icon="['fas', 'comment-dots']" />
        </a>
      </li>
      <li class="nav-item">
        <a class="btn btn-outline-primary" href="#">
          <font-awesome-icon class="gradient-btn" :icon="['fas', 'user']" />
        </a>
      </li>
    </ul>
    <div class="gap"></div>
    <div @click="$emit('showModal', 'settings')" class="auth-user-info">
      <div class="auth-user-avatar">
        <img :src="avatar" :alt="displayName" class="avatar" />
      </div>
      <div class="auth-user-dname">{{displayName}}</div>
      <router-link :to="{name: 'logout'}" class="btn btn-danger signout">Sign Out</router-link>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  mixins: [asyncDataStatus],

  computed: {
    ...mapState({
      unreadMsgs: "unreadMsgs"
    }),
    notice() {
      return this.unreadMsgs.length > 0;
    },
    authUser() {
      return this.$store.getters["users/userInfo"](
        this.$store.getters["authUser"]
      );
    },
    displayName() {
      return this.authUser.name;
    },
    avatar() {
      return this.authUser.avatar;
    }
  }
};
</script>

<style>
</style>