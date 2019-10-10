<template>
  <div class="login d-flex flex-center">
    <div class="card login-card">
      <div class="navbar-brand">
        <h3>
          Lote
          <b>Chat</b>
        </h3>
      </div>
      <h4>Login</h4>
      <p>Start conversing now by logging with your Google account!</p>
      <button @click.prevent="googleLogin" class="btn btn-primary google-login">
        <font-awesome-icon :icon="['fab','google']" class="mr-3" />Login with Google
      </button>
      <div v-if="error" class="alert alert-danger">{{error}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: ""
    };
  },
  methods: {
    googleLogin() {
      this.error = "";
      this.$store
        .dispatch("users/googleLogin")
        .then(() => {
          this.$store
            .dispatch("users/fetchUser", this.$store.getters["authUser"])
            .then(() => {
              this.$store.dispatch(
                "users/listenUser",
                this.$store.getters["authUser"]
              );
              this.$router.push({ name: "chat" });
            });
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  }
};
</script>
