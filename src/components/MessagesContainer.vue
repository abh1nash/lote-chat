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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MessageListItem from "./MessageListItem";
import MessageTyping from "./MessageTyping";

export default {
  components: {
    MessageListItem,
    MessageTyping
  },
  methods: {
    updateScroll(el) {
      el.scrollTop = el.scrollHeight;
    },
    checkScrollEvent() {
      this.$refs["container"].addEventListener("scroll", this.viewedMsg);
    },
    removeScrollEvent() {
      this.$refs["container"].removeEventListener("scroll", this.viewedMsg);
    },
    viewedMsg() {
      this.$store.dispatch("chatrooms/viewedChatroom");
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
      authUser: "authUser"
    }),

    messagesList() {
      return this.msgs(this.activeConversation);
    },

    typingList() {
      if (this.activeConversation) {
        let usersTyping = this.chatroomInfo(this.activeConversation).typing;
        if (usersTyping) {
          return Object.values(usersTyping).filter(
            value => value.user != this.authUser
          );
        } else return [];
      }
    }
  }
};
</script>

<style>
</style>