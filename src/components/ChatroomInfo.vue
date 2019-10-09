<template>
  <div class="chatroom-info">
    <h6>{{chatroomTitle}}</h6>

    <form @submit.prevent="inviteUser" class="invitation">
      <input
        class="form-control"
        type="text"
        placeholder="Enter user's email to invite"
        v-model="inviteUserEmail"
      />
      <button class="btn btn-primary ml-2" type="submit">Invite</button>
    </form>

    <div v-if="error" class="alert alert-danger mt-3">{{error}}</div>

    <div class="associated-users">
      <div class="members">
        <b>Members</b>
        <div class="members-container">
          <div v-for="member in membersList" :key="member" class="user">
            <div class="avatar">
              <img :src="user(member).avatar" :alt="user(member).name" />
            </div>
            <div class="ml-1 info">
              <div class="name">{{user(member).name}}</div>
              <div class="activity">
                <span class="mr-1">Active</span>
                <AppDate :date="user(member).lastActivity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="invitedList.length>0" class="invited ml-3">
        <b>Invited Users</b>
        <div class="members-container">
          <div v-for="member in invitedList" :key="member" class="user">
            <div class="avatar">
              <img :src="user(member).avatar" :alt="user(member).name" />
            </div>
            <div class="ml-1 info">
              <div class="name">{{user(member).name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      chatroomTitle: "",
      inviteUserEmail: "",
      error: ""
    };
  },

  methods: {
    inviteUser() {
      this.$store
        .dispatch("users/inviteUser", {
          crId: this.activeConversation,
          email: this.inviteUserEmail
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  },

  computed: {
    ...mapGetters({
      activeConversation: "activeConversation",
      title: "chatrooms/chatroomTitle",
      chatroomInfo: "chatrooms/chatroomInfo",
      user: "users/userInfo"
    }),

    membersList() {
      return Object.keys(this.chatroomInfo(this.activeConversation).members);
    },

    invitedList() {
      return Object.keys(this.chatroomInfo(this.activeConversation).invited);
    }
  },

  mounted() {
    this.chatroomTitle = this.title(this.activeConversation);
  }
};
</script>

<style lang='scss'>
</style>