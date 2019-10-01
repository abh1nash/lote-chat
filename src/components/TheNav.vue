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
        <a class="notice btn btn-outline-primary" href="#">
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
    <div v-if="asyncDataStatus_ready" class="auth-user-info">
      <div class="auth-user-avatar">
        <img :src="user(authId).avatar" :alt="user(authId).name" class="avatar" />
      </div>
      <div class="auth-user-dname">{{user(authId).name}}</div>
      <router-link :to="{name: 'logout'}" class="btn btn-danger signout">Sign Out</router-link>
    </div>
  </nav>
</template>

<script>
import asyncDataStatus from "@/mixins/asyncDataStatus";
import { mapGetters } from "vuex";
export default {
  mixins: [asyncDataStatus],

  created() {
    this.$store
      .dispatch("users/fetchUser", this.$store.state.authUserId)
      .then(() => {
        this.fetched();
      });
  },
  computed: {
    ...mapGetters({
      user: "users/userInfo",
      authId: "authUser"
    })
  }
};
</script>

<style>
</style>