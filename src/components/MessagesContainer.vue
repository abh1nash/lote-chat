<template>
  <div class="container" ref="container">
    <MessageListItem v-for="(msg, index) in messagesList" :msg="msg" :key="index" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MessageListItem from "./MessageListItem";

export default {
  components: {
    MessageListItem
  },
  methods: {
    updateScroll(el) {
      el.scrollTop = el.scrollHeight;
    }
  },
  mounted() {
    this.updateScroll(this.$refs["container"]);
  },
  updated() {
    this.updateScroll(this.$refs["container"]);
  },
  computed: {
    ...mapGetters({
      activeConversation: "activeConversation",
      msgs: "messages/msgs"
    }),

    messagesList() {
      return this.msgs(this.activeConversation);
    }
  }
};
</script>

<style>
</style>