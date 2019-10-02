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
      this.$store
        .dispatch("messages/sendMessage", {
          content: this.content,
          type: this.type
        })
        .then(docRef => {
          this.content = "";
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>