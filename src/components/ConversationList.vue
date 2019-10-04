<template>
  <div class="convo-list">
    <header>
      <h5>Conversations</h5>
      <div class="actions">
        <button
          @click.prevent="$emit('showModal', 'create', null)"
          title="Create a new conversation"
          class="btn btn-white"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </button>

        <button @click.prevent="$emit('showModal', 'join', null)" class="btn btn-white">
          <font-awesome-icon title="Join a conversation" :icon="['fas', 'sign-in-alt']" />
        </button>
      </div>
    </header>
    <div class="cr-list">
      <ConversationListItem
        v-for="invitation in invitesList"
        :crId="invitation"
        :key="invitation"
        :invite="true"
      />
      <ConversationListItem
        v-for="conversation in conversationList"
        :crId="conversation"
        :key="conversation"
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
    },
    invitesList() {
      return this.user.invites ? Object.keys(this.user.invites) : [];
    }
  }
};
</script>