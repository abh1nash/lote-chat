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
          <button
            @click.prevent="displayEmojiSelector=!displayEmojiSelector"
            title="Insert Emoji"
            class="emoji-btn btn btn-primary"
          >
            <font-awesome-icon :icon="['fas','smile-wink']" />
          </button>
        </div>
        <div class="input-group-append">
          <button class="send-btn btn btn-primary" title="Send Message" type="submit">
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
      <picker
        v-if="displayEmojiSelector"
        :data="emojiIndex"
        :style="{ position: 'absolute', bottom: '115px', right: '0px', height: '250px' }"
        set="emojione"
        :emojiSize="18"
        :native="true"
        :showSearch="false"
        :showSkinTone="false"
        :showPreview="false"
        :showCategories="false"
        @select="addEmoji"
      />
    </form>
  </div>
</template>

<script>
import "emoji-mart-vue-fast/css/emoji-mart.css";

import data from "emoji-mart-vue-fast/data/emojione.json";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

import { mapGetters } from "vuex";
export default {
  components: {
    Picker
  },
  data() {
    return {
      content: "",
      type: "text",
      typingTimeout: null,
      filesList: [],
      mediaUrls: [],
      displayEmojiSelector: false,
      emojiIndex: new EmojiIndex(data, {
        exclude: ["flags"]
      })
    };
  },
  computed: {
    ...mapGetters({
      activeConversation: "activeConversation",
      authUser: "authUser"
    })
  },
  methods: {
    addEmoji(e) {
      this.content += e.native;
    },

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