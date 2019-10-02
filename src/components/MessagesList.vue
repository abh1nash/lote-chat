<template>
  <div class="messages">
    <div v-if="!activeConversation" class="overlay">
      <div class="text-info-white">Select a Conversation to begin!</div>
    </div>
    <header>
      <div class="cr-info">
        <div class="cr-icon">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>
        <div class="cr-title">
          <h3>{{activeTitle(activeConversation) || 'No conversation active.'}}</h3>
          <div class="activity">
            <span v-if="activeConversation">
              Active
              <AppDate :date="activeTime" />
            </span>
            <span v-else>You can see your conversations here.</span>
          </div>
          <div class="actions">
            <div class="buttons">
              <button title="Video Call" class="btn btn-white">
                <font-awesome-icon :icon="['fas', 'video']" />
              </button>

              <button title="Audio Call" class="btn btn-white">
                <font-awesome-icon :icon="['fas', 'headphones']" />
              </button>

              <button title="Members" class="btn btn-white">
                <font-awesome-icon :icon="['fas', 'info']" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="chat-view">
      <div v-if="displayMsgs" class="container" ref="container">
        <MessageListItem v-for="(msg, index) in messagesList" :msg="msg" :key="index" />
      </div>
    </div>

    <MessageForm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MessageForm from "./MessageForm";
import MessageListItem from "./MessageListItem";
export default {
  components: {
    MessageForm,
    MessageListItem
  },
  methods: {
    updateScroll(el) {
      el.scrollTop = el.scrollHeight;
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
      activeTitle: "chatrooms/chatroomTitle",
      activeTime: "activeTime",
      msgs: "messages/msgs"
    }),
    displayMsgs() {
      return this.$store.state.msgsReady;
    },
    messagesList() {
      return this.msgs(this.activeConversation);
    }
  }
};
</script>

<style>
.chat-view {
  background: linear-gradient(
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.8)
    ),
    url("../assets/pattern.jpg");
}
</style>