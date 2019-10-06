<template>
  <div class="msg-form">
    <form @submit.prevent="sendMsg" class="form">
      <div class="input-group">
        <input
          class="msg form-control"
          v-model="content"
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
export default {
  data() {
    return {
      content: "",
      type: "text"
    };
  },
  methods: {
    sendMsg() {
      let msgContent = this.content;
      this.content = "";
      this.$store.dispatch("chatrooms/viewedChatroom");
      if (msgContent.trim().length > 0) {
        //avoid sending message if there is no content
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