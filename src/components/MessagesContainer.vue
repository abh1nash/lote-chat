<template>
  <div
    @mouseover="checkScrollEvent"
    @mouseout="removeScrollEvent"
    class="container"
    ref="container"
  >
    <MessageListItem v-for="(msg, index) in messagesList" :msg="msg" :key="index" />

    <div v-if="typingList" class="typing-hint">
      <MessageTyping v-for="item in typingList" :key="item.user" :msg="item" />
    </div>

    <div v-if="readUsersList.length>0" class="read-by">
      <div class="seen-icon">
        <font-awesome-icon :icon="['fas', 'eye']" />
      </div>
      <div class="users">
        <div
          v-for="user in readUsersList"
          :key="user"
          :title="'Seen by '+userInfo(user).name"
          class="avatar"
        >
          <img :src="userInfo(user).avatar" :alt="userInfo(user).name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import MessageListItem from "./MessageListItem";
import MessageTyping from "./MessageTyping";

export default {
  components: {
    MessageListItem,
    MessageTyping
  },
  methods: {
    ...mapActions({
      viewedMsg: "chatrooms/viewedChatroom"
    }),
    updateScroll(el) {
      el.scrollTop = el.scrollHeight;
    },
    checkScrollEvent() {
      this.$refs["container"].addEventListener("scroll", this.viewedMsg);
    },
    removeScrollEvent() {
      this.$refs["container"].removeEventListener("scroll", this.viewedMsg);
    }
  },
  mounted() {
    this.updateScroll(this.$refs["container"]);
  },
  updated() {
    this.updateScroll(this.$refs["container"]);
  },
  computed: {
    ...mapGetters({
      activeConversation: "activeConversation",
      msgs: "messages/msgs",
      chatroomInfo: "chatrooms/chatroomInfo",
      authUser: "authUser",
      userInfo: "users/userInfo"
    }),

    messagesList() {
      return this.msgs(this.activeConversation);
    },

    readUsersList() {
      const unreadUsers = Object.keys(
        this.chatroomInfo(this.activeConversation).unread
      );
      const readUsers = Object.keys(
        this.chatroomInfo(this.activeConversation).members
      ).filter(
        member => member != this.authUser && !unreadUsers.includes(member)
      );

      return readUsers;
    },

    typingList() {
      if (this.activeConversation) {
        let usersTyping = this.chatroomInfo(this.activeConversation).typing;
        if (usersTyping) {
          return Object.values(usersTyping).filter(
            value => value.user != this.authUser
          );
        } else return [];
      } else return null;
    }
  }
};
</script>

<style>
</style>