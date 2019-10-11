<template>
  <div @click="viewedMsg" class="messages">
    <div v-if="!activeConversation" class="overlay">
      <div class="text-info-white">Select a Conversation to begin!</div>
    </div>
    <header>
      <div class="cr-info">
        <img
          v-if="chatroomAvatar(activeConversation)"
          :src="chatroomAvatar(activeConversation)"
          :alt="chatroomTitle(activeConversation)"
        />
        <div v-else class="cr-icon">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>
        <div class="cr-title">
          <h3>{{chatroomTitle(activeConversation) || 'No conversation active.'}}</h3>
          <div class="activity">
            <span v-if="chatroomActiveTime(activeConversation)">
              Active
              <AppDate
                v-if="chatroomActiveTime(activeConversation)"
                :date="chatroomActiveTime(activeConversation)"
              />
              <span v-else>status available after invitation acceptance.</span>
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

              <button title="Info" @click="$emit('showModal', 'crInfo')" class="btn btn-white">
                <font-awesome-icon :icon="['fas', 'info']" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="d-lg-none close-conversation">
        <button @click="closeChat" class="btn btn-white" title="Close Conversation">&#x2715;</button>
      </div>
    </header>

    <div class="chat-view">
      <MessagesContainer v-if="displayMsgs && activeConversation" />
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

  methods: {
    viewedMsg() {
      if (!this.activeConversation) return;
      this.$store.dispatch("chatrooms/viewedChatroom");
    },
    closeChat() {
      this.$store.dispatch("listeners/stopListening", {
        name: "messages",
        id: this.activeConversation
      });
      this.typingStatusUpd({
        crId: this.activeConversation,
        stop: true
      });
      this.$store.dispatch("updateActiveRoom");
    }
  },

  computed: {
    ...mapGetters({
      activeConversation: "activeConversation",
      chatroomTitle: "chatrooms/chatroomTitle",
      chatroomAvatar: "chatrooms/chatroomAvatar",
      chatroomActiveTime: "chatrooms/chatroomActiveTime",
      msgs: "messages/msgs",
      displayMsgs: "msgReadyStatus"
    })
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