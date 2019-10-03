<template>
  <div
    @click="toggleActive"
    v-if="asyncDataStatus_ready"
    :class="[{'active':active}, {'unread':unread},'conversation']"
  >
    <div class="cr-info">
      <div class="convo-icon">
        <img :src="avatar" :alt="title" />
      </div>
      <div class="convo-info">
        <div class="convo-title">{{title}}</div>
        <div v-if="lastMsg && !invite" class="convo-last-msg">{{lastMsg}}</div>
        <div v-else-if="!lastMsg && !invite" class="convo-last-msg null">No messages yet.</div>
        <div v-else class="convo-invite">
          <div class="invitation">Invitation for Conversation</div>
          <div class="actions">
            <button @click="acceptInvite" class="btn btn-success">Accept</button>
            <button @click="declineInvite" class="btn btn-danger">Decline</button>
          </div>
        </div>
      </div>
    </div>
    <div class="extras">
      <div class="gap"></div>
      <div class="time">
        <AppDate :date="lastMsgTime" />
      </div>
    </div>
  </div>
</template>

<script>
import asyncDataStatus from "@/mixins/asyncDataStatus";
export default {
  mixins: [asyncDataStatus],
  props: {
    crId: {
      required: true
    },
    invite: {
      type: Boolean
    }
  },
  methods: {
    acceptInvite() {
      this.$store
        .dispatch("users/acceptInvite", {
          crId: this.crId,
          uid: this.$store.state.authUserId
        })
        .then(() => {
          console.log("accepted invite");
        })
        .catch(err => {
          console.log(err);
        });
    },
    declineInvite() {
      this.$store
        .dispatch("users/declineInvite", {
          crId: this.crId,
          uid: this.$store.state.authUserId
        })
        .then(() => {
          console.log("invite deleted");
        })
        .catch(err => {
          console.log(err);
        });
    },

    toggleActive() {
      if (this.invite) return;

      if (this.$store.state.msgsReady) {
        this.$store.dispatch("msgsNotReady");
      }
      if (this.$store.state.activeConversation != this.crId) {
        if (this.$store.state.activeConversation) {
          this.$store.dispatch("messages/listenMessages", true); //stop listener
        }
        this.$store.dispatch("updateActiveRoom", this.crId);
        this.$store
          .dispatch("messages/fetchMessages")
          .then(() => {
            this.$store.dispatch("messages/listenMessages"); //start listener
            this.$store.dispatch("chatrooms/viewedChatroom"); //remove unread marker
            this.$store.dispatch("msgsReady");
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$store.dispatch("updateActiveRoom", null);
      }
    },

    deleteChatroom() {
      this.$store
        .dispatch("chatrooms/deleteChatroom", {
          crId: this.crId,
          uid: this.$store.state.authUserId
        })
        .then(() => {
          this.fetched();
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    active() {
      return this.crId == this.$store.state.activeConversation;
    },
    conversation() {
      return this.$store.state.chatrooms[this.crId];
    },
    unread() {
      let val = Object.keys(this.conversation.unread).includes(
        this.$store.state.authUserId
      );
      if (val) {
        this.$store.dispatch("notify", true);
      } else {
        this.$store.dispatch("notify");
      }
      return val;
    },
    lastMsg() {
      return this.conversation.lastMsg;
    },
    lastMsgTime() {
      return this.conversation.lastMsgTime;
    },
    title() {
      return this.$store.getters["chatrooms/chatroomTitle"](this.crId);
    },
    avatar() {
      if (this.conversation.type == "single") {
        let otherUser;
        this.members.forEach(member => {
          if (member != this.$store.state.authUserId) {
            otherUser = member;
          }
        });
        if (!otherUser) {
          this.invited.forEach(member => {
            if (member != this.$store.state.authUserId) {
              otherUser = member;
            }
          });
        }
        // console.log(otherUser);
        return otherUser ? this.$store.state.users[otherUser].avatar : null;
      } else if (this.conversation.avatar) {
        return this.conversation.avatar;
      }
    },
    members() {
      return Object.keys(this.conversation.members);
    },
    invited() {
      return Object.keys(this.conversation.invited);
    }
  },
  created() {
    this.$store
      .dispatch("chatrooms/fetchChatroom", this.crId)
      .then(({ members, invited }) => {
        this.$store.dispatch("chatrooms/listenChatroom", this.crId);

        const associatedUsers = [
          ...Object.keys(members),
          ...Object.keys(invited)
        ];

        if (associatedUsers.length < 2) {
          this.deleteChatroom();
        } else {
          let fetchUsers = associatedUsers.map(user => {
            return new Promise((resolve, reject) => {
              this.$store
                .dispatch("users/fetchUser", user)
                .then(() => {
                  if (user != this.$store.state.authUserId) {
                    this.$store.dispatch("users/listenUser", user);
                  }
                  resolve();
                })
                .catch(err => {
                  reject(err);
                });
            });
          });

          Promise.all(fetchUsers)
            .then(() => {
              this.fetched();
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
  }
};
</script>

<style>
</style>