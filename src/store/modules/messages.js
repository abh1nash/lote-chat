import firebase from "firebase/app";
import "firebase/firestore";
import Vue from "vue";

export default {
  namespaced: true,
  state: {},
  mutations: {
    setMessages(state, { crId, msgs }) {
      Vue.set(state, crId, msgs);
    },
    addMessage(state, { crId, msg }) {
      state[crId].push(msg);
    }
  },
  actions: {
    sendMessage({ dispatch, rootGetters }, msg) {
      return new Promise((resolve, reject) => {
        const msgData = {
          content: msg.content,
          type: msg.type,
          mediaUrl: msg.mediaUrl || null,
          sender: rootGetters["authUser"],
          chatroom: rootGetters["activeConversation"],
          removed: false,
          reactors: {},
          reactions: {
            likes: {},
            dislikes: {},
            happy: {},
            angry: {}
          },
          time: Date.now()
        };

        const chatroomUpd = dispatch(
          "updateDbItem",
          {
            collection: "chatrooms",
            document: rootGetters["activeConversation"],
            data: {
              lastMsg: msg.content,
              lastMsgTime: msgData.time,
              msgCount: firebase.firestore.FieldValue.increment(1)
            }
          },
          { root: true }
        );

        const db = firebase.firestore();
        const addMsg = db
          .collection("chatrooms")
          .doc(rootGetters["activeConversation"])
          .collection("msgs")
          .add(msgData);

        const updateLastActivity = dispatch(
          "users/updateLastActivity",
          {},
          {
            root: true
          }
        );
        Promise.all([chatroomUpd, addMsg, updateLastActivity])
          .then(docRef => {
            resolve(docRef);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    fetchMessages({ commit, rootGetters }) {
      return new Promise((resolve, reject) => {
        const db = firebase.firestore();

        db.collection("chatrooms")
          .doc(rootGetters["activeConversation"])
          .collection("msgs")
          .orderBy("time")
          .limit(100)
          .get()
          .then(snapshot => {
            let msgs = snapshot.docs.map(doc => doc.data());
            commit("setMessages", {
              crId: rootGetters["activeConversation"],
              msgs
            });
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    listenMessages({ commit, rootGetters, state }, removeListener) {
      const db = firebase.firestore();
      let crId = rootGetters["activeConversation"];

      let liveUpdCount = 0;
      const unsubscribe = db
        .collection("chatrooms")
        .doc(crId)
        .collection("msgs")
        .orderBy("time")
        .onSnapshot(snapshot => {
          if (liveUpdCount < 1) {
            //add everything from the first snapshot
            let msgs = snapshot.docs.map(doc => doc.data());
            commit("setMessages", {
              crId: rootGetters["activeConversation"],
              msgs
            });
          } else {
            //add new data from second update onwards
            snapshot.docChanges().forEach(change => {
              if (change.type == "added") {
                commit("addMessage", {
                  crId: rootGetters["activeConversation"],
                  msg: change.doc.data()
                });
              }
            });
          }

          liveUpdCount++;
        });

      if (removeListener) {
        unsubscribe();
      }
    }
  },
  getters: {
    msgs: state => crId => state[crId]
  }
};
