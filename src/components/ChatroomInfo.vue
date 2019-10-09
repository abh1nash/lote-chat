<template>
  <div class="chatroom-info">
    <div class="cr-title">
      <div class="avatar">
        <img v-if="avatar" :src="avatar" alt="Conversation Icon" />
        <div v-else class="cr-icon">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>
      </div>
      <div v-if="!editMode" class="ml-3 title">
        <h6 class="d-inline">{{title}}</h6>
        <button @click="editMode=true" class="btn btn-primary ml-2">
          <font-awesome-icon :icon="['fas','pencil-alt']" />
        </button>
      </div>
      <div v-else class="ml-3 title">
        <form @submit.prevent="save">
          <input
            class="form-control mb-2"
            type="text"
            placeholder="Enter new name for the conversation"
            v-model="changedTitle"
          />
          <label
            class="file-input mr-2"
            for="cr-new-avatar-img"
            v-if="chatroomInfo(activeConversation).type=='group'"
          >
            <span>
              <font-awesome-icon :icon="['fas','image']" />
              <span class="ml-2 filename">Choose an Image</span>
            </span>
          </label>
          <input
            type="file"
            id="cr-new-avatar-img"
            @change="uploadImage"
            v-if="chatroomInfo(activeConversation).type=='group'"
          />
          <button class="btn btn-primary" type="submit">Save</button>
          <button @click="editMode=false" class="btn btn-outline-danger ml-2">Cancel</button>
        </form>
      </div>
    </div>
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
      avatar: "",
      title: "",
      inviteUserEmail: "",
      error: "",
      editMode: false,
      changedTitle: ""
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
    },

    save() {
      this.$store
        .dispatch("chatrooms/updateChatroom", {
          crId: this.activeConversation,
          title: this.changedTitle,
          avatar: this.avatar
        })
        .then(() => {
          this.$emit("eventSuccess");
        })
        .catch(err => {
          this.error = err.message;
        });
    },

    uploadImage(e) {
      this.$store
        .dispatch("uploadFile", { file: e.target.files[0], fileType: "image" })
        .then(({ url, filename }) => {
          this.avatar = url;
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  },

  computed: {
    ...mapGetters({
      activeConversation: "activeConversation",
      chatroomTitle: "chatrooms/chatroomTitle",
      chatroomAvatar: "chatrooms/chatroomAvatar",
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
    this.title = this.chatroomTitle(this.activeConversation);
    this.avatar = this.chatroomAvatar(this.activeConversation);
  }
};
</script>

<style lang='scss'>
</style>