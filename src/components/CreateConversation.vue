<template>
  <div class="create-conversation">
    <h6>Create a new conversation</h6>
    <form @submit.prevent="createConversation">
      <input
        class="modal-input form-control"
        type="text"
        placeholder="Conversation title"
        v-model="title"
      />
      <input
        class="modal-input form-control"
        type="email"
        placeholder="User email"
        required
        v-model="email"
      />

      <div class="buttons">
        <button class="modal-btn btn btn-primary" type="submit">Create Conversation</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      email: ""
    };
  },
  methods: {
    createConversation() {
      this.$store
        .dispatch("chatrooms/createConversation", {
          title: this.title,
          email: this.email
        })
        .then(crId => {
          console.log(crId);
          this.$emit("eventSuccess");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang='scss'>
.create-conversation {
  text-align: center;
}
</style>