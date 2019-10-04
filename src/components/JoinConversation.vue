<template>
  <div class="join-conversation">
    <h6>Join a conversation</h6>
    <form @submit.prevent="joinChatroom">
      <input
        class="modal-input form-control"
        type="text"
        placeholder="ID of the converstaion"
        v-model="crId"
        required
      />

      <div class="buttons">
        <button class="modal-btn btn btn-primary" type="submit">Join Conversation</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      crId: ""
    };
  },
  methods: {
    joinChatroom() {
      this.$store
        .dispatch("users/checkMembershipEligibility", {
          crId: this.crId,
          uid: this.$store.getters["authUser"]
        })
        .then(isEligible => {
          if (isEligible) {
            this.$store
              .dispatch("users/acceptInvite", {
                crId: this.crId,
                uid: this.$store.getters["authUser"]
              })
              .then(() => {
                this.$emit("eventSuccess");
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            console.log("Not eligible to join that room.");
          }
        });
    }
  }
};
</script>

<style lang='scss'>
.join-conversation {
  text-align: center;
}
</style>