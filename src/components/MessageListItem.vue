<template>
  <div class="row">
    <div :class="['msg-container', {'sent': sentMsg}]">
      <div v-if="!sentMsg" class="usr-img">
        <img :src="avatar" :alt="name" />
      </div>
      <div class="msg-group">
        <div v-if="!!msg.mediaUrls && msg.mediaUrls.length > 0" class="msg-media">
          <a v-for="url in msg.mediaUrls" :key="url" :href="url" target="_blank">
            <img :src="url" alt="Image" />
          </a>
        </div>
        <div class="msg">{{msg.content}}</div>
        <div class="msg-time">
          <AppDate :date="msg.time" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    msg: {
      required: true
    }
  },
  computed: {
    ...mapGetters({
      authId: "authUser",
      userInfo: "users/userInfo"
    }),
    sentMsg() {
      return this.msg.sender == this.authId;
    },
    name() {
      return this.userInfo(this.msg.sender).name;
    },
    avatar() {
      return this.userInfo(this.msg.sender).avatar;
    }
  }
};
</script>

<style>
</style>