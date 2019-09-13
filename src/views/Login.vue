<template>
  <div class="container flex-center">
    <div class="card login-card">
      <h2>Login</h2>
      <form>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Your Username *" value />
        </div>
        <div class="form-group">
          <input type="password" class="form-control" placeholder="Your Password *" value />
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
        <div class="form-group">
          <a href="#" class="ForgetPwd">Forgot Password?</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.login-card {
  box-sizing: border-box;
  padding: 30px;
  width: 400px;
  text-align: center;
  border-radius: 20px;
  border: none;
  box-shadow: 0 10px 15px 0px #007bff;

  input {
    border-radius: 10px;
    border: none;
    background: #eee;
    box-shadow: none;

    &:focus {
      outline: none;
      border: none;
      box-shadow: 0 1px 3px 0px #007bff;
    }
  }
}
</style>
