<template>
  <div class="create-conversation">
    <h6>Create a new conversation</h6>
    <form @submit.prevent="submit">
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
    <div v-if="error" class="alert alert-danger">{{error}}</div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      title: "",
      email: "",
      error: ""
    };
  },
  methods: {
    ...mapActions({
      createConversation: "chatrooms/createConversation"
    }),
    submit() {
      this.createConversation({
        title: this.title,
        email: this.email
      })
        .then(crId => {
          this.$emit("eventSuccess");
        })
        .catch(err => {
          this.error = err.message;
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