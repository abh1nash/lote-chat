<template>
  <div
    @click="toggleActive"
    v-if="asyncDataStatus_ready"
    :class="[{'active':active}, {'unread':unread},'conversation']"
  >
    <div class="cr-info">
      <div class="convo-icon">
        <img v-if="avatar" :src="avatar" :alt="title" />
        <div v-else class="cr-icon">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>
      </div>
      <div class="convo-info">
        <div class="convo-title">{{title}}</div>
        <div v-if="lastMsg && !invite && !peopleList" class="convo-last-msg">{{lastMsg}}</div>
        <div
          v-else-if="!lastMsg && !invite && !peopleList"
          class="convo-last-msg null"
        >No messages yet.</div>
        <div v-else-if="peopleList" class="convo-last-msg null">
          <span class="mr-1">Active</span>
          <AppDate :date="lastMsgTime" />
        </div>
        <div v-else class="convo-invite">
          <div class="invitation">Invitation for Conversation</div>
          <div class="actions">
            <button @click="acceptInvite" class="btn btn-success">Accept</button>
            <button @click="declineInvite" class="btn btn-danger">Decline</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!peopleList" class="extras">
      <div class="gap"></div>
      <div class="time">
        <AppDate :date="lastMsgTime" />
      </div>
    </div>
  </div>
</template>

<script>
import asyncDataStatus from "@/mixins/asyncDataStatus";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  mixins: [asyncDataStatus],
  props: {
    crId: {
      required: true
    },
    invite: {
      type: Boolean
    },
    peopleList: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      activeConversation: "activeConversation",
      chatroomInfo: "chatrooms/chatroomInfo",
      chatroomTitle: "chatrooms/chatroomTitle",
      chatroomAvatar: "chatrooms/chatroomAvatar",
      chatroomAssociatedUsers: "chatrooms/chatroomAssociatedUsers",
      authUser: "authUser"
    }),

    ...mapState({ msgsReadyStatus: "msgsReadyStatus" }),
    active() {
      return this.crId == this.activeConversation;
    },
    conversation() {
      return this.chatroomInfo(this.crId);
    },
    unread() {
      let unreadStatus = this.conversation.unread
        ? Object.keys(this.conversation.unread).includes(this.authUser)
        : false;

      return unreadStatus;
    },
    lastMsg() {
      return this.conversation.lastMsg;
    },
    lastMsgTime() {
      return this.conversation.lastMsgTime;
    },
    title() {
      return this.chatroomTitle(this.crId);
    },
    avatar() {
      return this.chatroomAvatar(this.crId);
    },
    members() {
      return Object.keys(this.conversation.members);
    },
    invited() {
      return Object.keys(this.conversation.invited);
    }
  },
  methods: {
    ...mapActions({
      acceptInviteRequest: "users/acceptInvite",
      declineInviteRequest: "users/declineInvite",
      notify: "notify",
      msgsReady: "msgsReady",
      msgsNotReady: "msgsNotReady",
      stopListening: "listeners/stopListening",
      listenMessages: "messages/listenMessages",
      typingStatusUpd: "chatrooms/typingStatusUpd",
      viewedChatroom: "chatrooms/viewedChatroom",
      listenChatroom: "chatrooms/listenChatroom",
      fetchChatroom: "chatrooms/fetchChatroom",
      listenUser: "users/listenUser",
      fetchUser: "users/fetchUser",
      updateActiveRoom: "updateActiveRoom",
      fetchMessages: "messages/fetchMessages",
      deleteChatroomRequest: "chatrooms/deleteChatroom"
    }),
    acceptInvite() {
      this.acceptInviteRequest({
        crId: this.crId,
        uid: this.authUser
      })
        .then(() => {
          this.notify({ crId: this.crId, remove: true }); //remove notification
        })
        .catch(err => {
          console.log(err);
        });
    },
    declineInvite() {
      this.declineInviteRequest({
        crId: this.crId,
        uid: this.authUser
      })
        .then(() => {
          this.notify({ crId: this.crId, remove: true }); //remove notification
        })
        .catch(err => {
          console.log(err);
        });
    },

    toggleActive() {
      if (this.invite) return;

      if (this.msgsReadyStatus) {
        this.msgsNotReady();
      }
      if (this.activeConversation != this.crId) {
        if (this.activeConversation) {
          this.stopListening({
            name: "messages",
            id: this.activeConversation
          });

          this.typingStatusUpd({
            crId: this.crId,
            stop: true
          });
          //stop listeners
        }
        this.updateActiveRoom(this.crId);
        this.fetchMessages()
          .then(() => {
            this.listenMessages();
            this.typingStatusUpd({ crId: this.crId }); //start listeners
            this.viewedChatroom(); //remove unread marker
            this.msgsReady();
            this.notify({ crId: this.crId, remove: true }); //remove notification
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.stopListening({
          name: "messages",
          id: this.activeConversation
        });
        this.typingStatusUpd({
          crId: this.crId,
          stop: true
        });
        this.updateActiveRoom(null);
      }
    },

    deleteChatroom() {
      this.deleteChatroomRequest({
        crId: this.crId,
        uid: this.authUser
      })
        .then(() => {
          this.fetched();
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  created() {
    this.fetchChatroom(this.crId)
      .then(({ members, invited, type }) => {
        if (this.peopleList && type == "group") return;

        this.listenChatroom(this.crId);

        if (this.unread || this.invite) {
          this.notify({ crId: this.crId });
        }

        if (this.chatroomAssociatedUsers(this.crId) < 2) {
          this.deleteChatroom();
        } else {
          let fetchUsers = [...this.members, ...this.invited].map(user => {
            return new Promise((resolve, reject) => {
              this.fetchUser(user)
                .then(() => {
                  if (
                    user != this.authUser &&
                    !Object.keys(this.$store.state.listeners.users).includes(
                      user
                    )
                  ) {
                    this.listenUser(user);
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
      })
      .catch(err => {
        console.log(err);
      });
  },

  updated() {
    if (this.unread || this.invite) {
      this.notify({ crId: this.crId });
    }
  },

  destroyed() {
    this.stopListening({
      name: "chatrooms",
      id: this.crId
    });

    if (this.crId == this.activeConversation) {
      this.updateActiveRoom(null);
    }
  }
};
</script>

<style>
</style>