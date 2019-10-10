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
        <button
          @click.prevent="navSwitch('conversation')"
          :class="[{'notice': notice },'btn ', {'active':activeChatroomList=='conversation'}]"
          href="#"
        >
          <font-awesome-icon :icon="['fas', 'comment-dots']" />
        </button>
      </li>
      <li class="nav-item">
        <button
          @click.prevent="navSwitch('people')"
          :class="['btn ', {'active':activeChatroomList=='people'}]"
          href="#"
        >
          <font-awesome-icon class="gradient-btn" :icon="['fas', 'user']" />
        </button>
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
import { mapState, mapGetters } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  mixins: [asyncDataStatus],

  methods: {
    navSwitch(to) {
      this.$store.dispatch("navSwitch", to);
    }
  },

  computed: {
    ...mapState({
      unreadMsgs: "unreadMsgs",
      activeChatroomList: "activeChatroomList"
    }),

    ...mapGetters({
      userInfo: "users/userInfo",
      authUser: "authUser"
    }),

    notice() {
      return this.unreadMsgs.length > 0;
    },
    user() {
      return this.userInfo(this.authUser);
    },
    displayName() {
      return this.user.name;
    },
    avatar() {
      return this.user.avatar;
    }
  }
};
</script>

<style>
</style>