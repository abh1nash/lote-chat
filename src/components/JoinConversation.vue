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

      <div v-if="error" class="alert alert-danger">{{error}}</div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      crId: "",
      error: ""
    };
  },
  computed: {
    ...mapGetters({
      authUser: "authUser"
    })
  },
  methods: {
    ...mapActions({
      checkMembershipEligibility: "users/checkMembershipEligibility",
      acceptInvite: "users/acceptInvite"
    }),
    joinChatroom() {
      this.checkMembershipEligibility({
        crId: this.crId,
        uid: this.authUser
      }).then(isEligible => {
        if (isEligible) {
          this.acceptInvite({
            crId: this.crId,
            uid: this.authUser
          })
            .then(() => {
              this.$emit("eventSuccess");
            })
            .catch(err => {
              this.error = err.message;
            });
        } else {
          this.error = "Not eligible to join that room.";
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