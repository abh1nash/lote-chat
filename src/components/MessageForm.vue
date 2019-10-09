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
      <label title="Send an image" class="file-input" for="image-upload">
        <font-awesome-icon :icon="['fas','image']" />
        <span v-if="filesList.length>0 && type=='image'">
          <span class="filename ml-2">{{filesList.length>1?'Multiple Images':filesList[0]}}</span>
          <button class="btn btn-close" @click.prevent="discardImage" title="Discard Image">&#x2715;</button>
        </span>
      </label>
      <input id="image-upload" type="file" @change="uploadImage" />
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
      typingTimeout: null,
      filesList: [],
      mediaUrls: []
    };
  },
  computed: {
    ...mapGetters({
      activeConversation: "activeConversation",
      authUser: "authUser"
    })
  },
  methods: {
    uploadImage(e) {
      Object.values(e.target.files).forEach(file => {
        this.$store
          .dispatch("uploadFile", { file, fileType: "image" })
          .then(({ url, filename }) => {
            this.mediaUrls.push(url);
            this.filesList.push(filename);
            this.type = "image";
          });
      });
    },

    discardImage() {
      this.filesList = [];
      this.mediaUrls = [];
      this.type = "text";
    },

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
            type: this.type,
            mediaUrls: this.mediaUrls
          })
          .then(() => {
            this.filesList = [];
            this.mediaUrls = [];
            this.type = "text";
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