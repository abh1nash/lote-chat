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
      <MessagesContainer v-if="displayMsgs" />
    </div>

    <MessageForm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MessageForm from "./MessageForm";
import MessagesContainer from "./MessagesContainer";

export default {
  components: {
    MessageForm,
    MessagesContainer
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