<template>
  <div class="msg-form">
    <form @submit.prevent="sendMsg" class="form">
      <div class="input-group">
        <input
          class="msg form-control"
          v-model="content"
          @keyup="typing"
          type="text"
          placeholder="What do you wish to say?"
        />
        <div class="input-group-append">
          <button class="send-btn btn btn-primary" type="submit">
            <font-awesome-icon :icon="['fas','paper-plane']" />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      content: "",
      type: "text",
      typingTimeout: null
    };
  },
  computed: {
    ...mapGetters({
      activeConversation: "activeConversation",
      authUser: "authUser"
    })
  },
  methods: {
    typing() {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(this.typingStop, 20000);
      } else {
        this.typingTimeout = setTimeout(this.typingStop, 20000);
      }
      this.$store.dispatch("chatrooms/typingMode", {
        crId: this.activeConversation,
        uid: this.authUser,
        content: this.content
      });
    },
    typingStop() {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
        this.typingTimeout = null;
      }
      this.$store.dispatch("chatrooms/typingEnd", {
        crId: this.activeConversation,
        uid: this.authUser
      });
    },
    sendMsg() {
      let msgContent = this.content;
      this.content = "";
      this.$store.dispatch("chatrooms/viewedChatroom");
      if (msgContent.trim().length > 0) {
        //avoid sending message if there is no content
        this.typingStop();
        this.$store
          .dispatch("messages/sendMessage", {
            content: msgContent,
            type: this.type
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style>
</style>