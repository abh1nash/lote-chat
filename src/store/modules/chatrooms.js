import Vue from "vue";
import firebase from "firebase/app";
import "firebase/database";

export default {
  namespaced: true,
  state: {},
  mutations: {
    userTypingUpd(state, { crId, value }) {
      Vue.set(state[crId], "typing", value);
    }
  },
  actions: {
    listenChatroom({ dispatch }, crId) {
      dispatch(
        "listenDoc",
        { collection: "chatrooms", document: crId },
        { root: true }
      );
    },
    fetchChatroom({ dispatch, commit }, crId) {
      return new Promise((resolve, reject) => {
        dispatch(
          "fetchDbItem",
          { collection: "chatrooms", document: crId },
          { root: true }
        )
          .then(doc => {
            commit(
              "setItem",
              { parent: "chatrooms", name: crId, value: doc },
              { root: true }
            );
            resolve(doc);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    deleteChatroom({ dispatch }, { crId, uid }) {
      return new Promise((resolve, reject) => {
        dispatch(
          "checkExistence",
          {
            collection: "chatrooms",
            document: crId
          },
          { root: true }
        ).then(exists => {
          if (exists) {
            const removeUserFromChatroom = dispatch(
              "users/deleteChatroomFromUser",
              { crId, uid },
              { root: true }
            );
            const deleteChatroom = dispatch(
              "deleteDoc",
              { collection: "chatrooms", document: crId },
              { root: true }
            );

            Promise.all([removeUserFromChatroom, deleteChatroom])
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err);
              });
          } else {
            reject(
              new Error(
                "The chatroom does not exist or has already been removed."
              )
            );
          }
        });
      });
    },
    viewedChatroom({ commit, dispatch, rootGetters }) {
      return new Promise((resolve, reject) => {
        dispatch(
          "deleteFieldValue",
          {
            collection: "chatrooms",
            document: rootGetters["activeConversation"],
            fieldValue: [`unread.${rootGetters["authUser"]}`]
          },
          { root: true }
        )
          .then(() => {
            dispatch(
              "notify",
              {
                crId: rootGetters["activeConversation"],
                remove: true
              },
              { root: true }
            );
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    createConversation({ dispatch, rootState, rootGetters }, { title, email }) {
      return new Promise((resolve, reject) => {
        dispatch(
          "checkExistence",
          {
            collection: "users",
            data: { field: "email", opStr: "==", value: email }
          },
          { root: true }
        ).then(({ exists, docs }) => {
          if (exists) {
            //if the user with the given email exists in database
            const authUser = rootGetters["users/userInfo"](
              rootState.authUserId
            );
            if (email == authUser.email) {
              //check if the user has provided their own email
              reject(new Error("You cannot create monologues."));
            } else {
              //else proceed creating a chatroom
              const authUserId = rootState.authUserId;
              const newUserId = docs[0].data().uid;

              const chatroomSchema = {
                members: {
                  [`${authUserId}`]: authUserId
                },
                type: "single",
                title,
                initiator: authUserId,
                invited: {
                  [`${newUserId}`]: newUserId
                },
                msgCount: 0,
                lastMsg: null,
                lastMsgTime: Date.now(),
                unread: {}
              };

              dispatch(
                //create chatroom entity in db
                "addItemToDb",
                {
                  collection: "chatrooms",
                  data: { ...chatroomSchema }
                },
                { root: true }
              )
                .then(docRef => {
                  const addChatroomToUser = dispatch(
                    //add the chatroom id to the initiator user
                    "users/addChatroomToUser",
                    { crId: docRef.id, uid: authUserId },
                    { root: true }
                  );
                  const addInviteToNewUser = dispatch(
                    //add the chatroom id invite to the new user
                    "users/addInviteToUser",
                    { crId: docRef.id, uid: newUserId },
                    { root: true }
                  );

                  Promise.all([addChatroomToUser, addInviteToNewUser])
                    .then(() => {
                      resolve(docRef.id); // everything ok, resolve chatroom id
                    })
                    .catch(err => {
                      reject(err);
                    });
                })
                .catch(err => {
                  reject(err);
                });
            }
          } //if the user with given email doesn't exist in the database
          else {
            reject(new Error("User with the given email does not exist."));
          }
        });
      });
    },

    typingMode({ commit }, { crId, uid, content }) {
      const rtd = firebase.database();
      rtd
        .ref(`${crId}/${uid}`)
        .set({ content, lastKeyStroke: Date.now(), user: uid });
    },

    typingEnd({ commit }, { crId, uid }) {
      const rtd = firebase.database();
      rtd.ref(`${crId}/${uid}`).remove();
    },

    typingStatusUpd({ commit }, { crId, stop }) {
      const rtd = firebase.database().ref(crId);
      if (stop) {
        rtd.off();
      } else {
        rtd.on("value", snapshot => {
          commit("userTypingUpd", { crId, value: snapshot.val() });
        });
      }
    }
  },
  getters: {
    chatroomAssociatedUsers: state => crId =>
      Object.keys(state[crId].members).length +
      Object.keys(state[crId].invited).length,
    chatroomInitiator: state => crId => state[crId].initiator,
    chatroomInfo: state => crId => state[crId],
    chatroomActiveTime(state, getters, rootState, rootGetters) {
      return crId => {
        let activeRoom = getters["chatroomInfo"](crId);
        if (activeRoom.type == "single") {
          if (state[crId].members) {
            let lastActivityTime;
            Object.keys(state[crId].members).forEach(user => {
              if (user != rootGetters["authUser"]) {
                lastActivityTime = rootGetters["users/userInfo"](user)
                  .lastActivity;
              }
            });
            return lastActivityTime;
          } else {
            return null;
          }
        } else {
          return getters["chatroomInfo"](crId).lastMsgTime;
        }
      };
    },
    chatroomTitle(state, getters, rootState, rootGetters) {
      return crId => {
        if (!crId) {
          return "No conversation selected.";
        } else if (state[crId].title.length > 0) {
          return state[crId].title;
        } else if (
          state[crId].title.length == 0 &&
          state[crId].type == "single"
        ) {
          let title;
          Object.keys(state[crId].members).forEach(member => {
            if (member != rootGetters["authUser"]) {
              title = rootGetters["users/userInfo"](member).name;
            }
          });

          if (!title) {
            Object.keys(state[crId].invited).forEach(member => {
              if (member != rootGetters["authUser"]) {
                title = rootGetters["users/userInfo"](member).name;
              }
            });
          }

          return title;
        } else {
          return "An Untitled Group";
        }
      };
    }
  }
};
