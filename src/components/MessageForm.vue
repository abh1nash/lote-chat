<template>
  <div class="msg-form">
    <form class="form">
      <div class="input-group">
        <input class="msg form-control" type="text" placeholder="What do you wish to say?" />
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
export default {};
</script>

<style>
</style>