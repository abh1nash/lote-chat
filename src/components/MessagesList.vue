<template>
  <div class="messages">
    <header>
      <div class="cr-icon">
        <font-awesome-icon :icon="['fas', 'user']" />
      </div>
      <div class="cr-title">
        <h3>Lote's Favorite Group</h3>
      </div>
    </header>
    <div class="chat-view"></div>
    <MessageForm />
  </div>
</template>

<script>
import MessageForm from "./MessageForm";
export default {
  components: {
    MessageForm
  }
};
</script>

<style>
.chat-view {
  background: linear-gradient(
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.8)
    ),
    url("../assets/pattern.jpg");
}
</style>