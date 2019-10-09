import firebase from "firebase/app";
import "firebase/firestore";
import Vue from "vue";

export default {
  namespaced: true,
  state: {},
  mutations: {
    setMessages(state, { crId, msgs }) {
      Vue.set(state, crId, msgs.reverse());
    },
    addMessage(state, { crId, msg }) {
      state[crId].push(msg);
    }
  },
  actions: {
    sendMessage({ dispatch, rootGetters }, msg) {
      return new Promise((resolve, reject) => {
        const activeUser = rootGetters["authUser"];
        const activeCr = rootGetters["activeConversation"];

        const msgData = {
          content: msg.content,
          type: msg.type,
          mediaUrls: msg.mediaUrls || null,
          sender: activeUser,
          chatroom: activeCr,
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

        let unread = {
          ...rootGetters["chatrooms/chatroomInfo"](activeCr).members
        };
        delete unread[activeUser];

        const chatroomUpd = dispatch(
          "updateDbItem",
          {
            collection: "chatrooms",
            document: activeCr,
            data: {
              lastMsg: msg.content,
              lastMsgTime: msgData.time,
              msgCount: firebase.firestore.FieldValue.increment(1),
              unread
            }
          },
          { root: true }
        );

        const db = firebase.firestore();
        const addMsg = db
          .collection("chatrooms")
          .doc(activeCr)
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
          .orderBy("time", "desc")
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
    listenMessages({ commit, rootGetters, dispatch }) {
      const db = firebase.firestore();
      let crId = rootGetters["activeConversation"];

      const unsubscribe = db
        .collection("chatrooms")
        .doc(crId)
        .collection("msgs")
        .orderBy("time", "desc")
        .limit(100)
        .onSnapshot(snapshot => {
          //add everything from the first snapshot
          let msgs = snapshot.docs.map(doc => doc.data());
          commit("setMessages", {
            crId,
            msgs
          });
          dispatch("updateActiveRoom", crId, { root: true });
        });

      dispatch(
        "listeners/addListener",
        {
          name: "messages",
          id: crId,
          value: unsubscribe
        },
        {
          root: true
        }
      );
    }
  },
  getters: {
    msgs: state => crId => state[crId]
  }
};
