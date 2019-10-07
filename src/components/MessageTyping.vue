<template>
  <div v-if="msg.content.length>0" class="usr-msg-group">
    <div class="avatar">
      <img :src="user.avatar" :alt="user.name + 'is typing'" />
    </div>
    <div class="msg">{{msg.content}}</div>
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
      userInfo: "users/userInfo"
    }),
    user() {
      return this.userInfo(this.msg.user);
    }
  }
};
</script>

<style>
</style>