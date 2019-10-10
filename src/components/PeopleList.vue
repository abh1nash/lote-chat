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
import { mapGetters } from "vuex";

export default {
  components: {
    ConversationListItem
  },

  computed: {
    ...mapGetters({
      userInfo: "users/userInfo",
      authId: "authUser"
    }),
    user() {
      return this.userInfo(this.authId);
    },

    conversationList() {
      return this.user.chatrooms ? Object.keys(this.user.chatrooms) : [];
    }
  }
};
</script>