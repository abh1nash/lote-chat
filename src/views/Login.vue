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
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    googleLogin() {
      this.$store
        .dispatch("users/googleLogin")
        .then(() => {
          this.$router.push({ name: "chat" });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
