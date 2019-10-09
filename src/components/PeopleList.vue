<template>
  <div class="convo-list">
    <header>
      <h5>People</h5>
    </header>
    <div class="cr-list">
      <ConversationListItem
        v-for="conversation in conversationList"
        :crId="conversation"
        :key="conversation"
        :peopleList="true"
      />
    </div>
  </div>
</template>
<script>
import ConversationListItem from "./ConversationListItem";

export default {
  components: {
    ConversationListItem
  },

  computed: {
    user() {
      return this.$store.getters["users/userInfo"](this.authId);
    },

    authId() {
      return this.$store.getters["authUser"];
    },

    conversationList() {
      return this.user.chatrooms ? Object.keys(this.user.chatrooms) : [];
    }
  }
};
</script>