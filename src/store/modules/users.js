import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Vue from "vue";
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    addChatroomToUser({ dispatch }, { crId, uid }) {
      return new Promise((resolve, reject) => {
        dispatch(
          "updateDbItem",
          {
            collection: "users",
            document: uid,
            data: { [`chatrooms.${crId}`]: crId }
          },
          { root: true }
        )
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    deleteChatroomFromUser({ dispatch }, { crId, uid }) {
      return new Promise((resolve, reject) => {
        dispatch(
          "deleteFieldValue",
          {
            collection: "users",
            document: uid,
            fieldValue: [`chatrooms.${crId}`]
          },
          { root: true }
        )
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    inviteUser({ dispatch }, { crId, email }) {
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
            let uid = docs[0].data().uid;

            const addInviteToUser = dispatch("addInviteToUser", { crId, uid });
            const addInviteToChatroom = dispatch(
              "updateDbItem",
              {
                collection: "chatrooms",
                document: crId,
                data: { [`invited.${uid}`]: uid }
              },
              { root: true }
            );

            Promise.all([addInviteToChatroom, addInviteToUser])
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err);
              });
          } else {
            reject(new Error("There is no user with given email address."));
          }
        });
      });
    },

    addInviteToUser({ dispatch }, { crId, uid }) {
      return new Promise((resolve, reject) => {
        dispatch(
          "updateDbItem",
          {
            collection: "users",
            document: uid,
            data: { [`invites.${crId}`]: crId }
          },
          { root: true }
        )
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    acceptInvite({ dispatch, rootGetters }, { crId, uid }) {
      return new Promise((resolve, reject) => {
        //add user to chatroom's members
        let chatroomType =
          Object.keys(rootGetters["chatrooms/chatroomInfo"](crId).members)
            .length >= 2
            ? "group"
            : "single";

        const addUserToChatroom = dispatch(
          "updateDbItem",
          {
            collection: "chatrooms",
            document: crId,
            data: { [`members.${uid}`]: uid, type: chatroomType }
          },
          { root: true }
        );
        //add chatroom to user's chatroom list
        const addChatroomToUser = dispatch("addChatroomToUser", { crId, uid });
        //delete invite entry from user db
        const deleteInvite = dispatch(
          "deleteFieldValue",
          {
            collection: "users",
            document: uid,
            fieldValue: [`invites.${crId}`]
          },
          { root: true }
        );

        //delete user from chatroom's invite list
        const deleteInviteFromChatroom = dispatch(
          "deleteFieldValue",
          {
            collection: "chatrooms",
            document: crId,
            fieldValue: [`invited.${uid}`]
          },
          { root: true }
        );

        Promise.all([addChatroomToUser, addUserToChatroom])
          .then(() => {
            Promise.all([deleteInvite, deleteInviteFromChatroom])
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    declineInvite({ dispatch, rootGetters }, { crId, uid }) {
      return new Promise((resolve, reject) => {
        let chatroomDeleted = false;
        if (rootGetters["chatrooms/chatroomAssociatedUsers"](crId) == 2) {
          dispatch(
            "chatrooms/deleteChatroom",
            {
              crId,
              uid: rootGetters["chatrooms/chatroomInitiator"](crId)
            },
            { root: true }
          )
            .then(() => {
              chatroomDeleted = true;
            })
            .catch(err => {
              reject(err);
            });
        }
        const deleteInvite = dispatch(
          "deleteFieldValue",
          {
            collection: "users",
            document: uid,
            fieldValue: [`invites.${crId}`]
          },
          { root: true }
        );
        const deleteInviteFromChatroom = chatroomDeleted
          ? new Promise(res => {
              res();
            })
          : dispatch(
              "deleteFieldValue",
              {
                collection: "chatrooms",
                document: crId,
                fieldValue: [`invited.${uid}`]
              },
              { root: true }
            );
        Promise.all([deleteInvite, deleteInviteFromChatroom])
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    checkMembershipEligibility({ dispatch }, { crId, uid }) {
      return new Promise((resolve, reject) => {
        dispatch(
          //check existence of chatroom
          "checkExistence",
          { collection: "chatrooms", document: crId },
          { root: true }
        )
          .then(exists => {
            if (exists) {
              dispatch(
                "checkExistence",
                {
                  //check if user is invited to the chatroom
                  collection: "chatrooms",
                  data: { field: `invited.${uid}`, opStr: "==", value: uid }
                },
                { root: true }
              ).then(({ exists }) => {
                if (exists) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
            } else {
              resolve(false);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    updateLastActivity({ dispatch, rootState }) {
      return new Promise((resolve, reject) => {
        dispatch(
          "updateDbItem",
          {
            collection: "users",
            document: rootState.authUserId,
            data: {
              lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            }
          },
          { root: true }
        )
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    updateAuthUser({ commit }, uid) {
      commit("setItem", { name: "authUserId", value: uid }, { root: true });
    },

    googleLogin({ dispatch }) {
      return new Promise((resolve, reject) => {
        firebase
          .auth()
          .signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(result => {
            const user = {
              name: result.user.displayName,
              email: result.user.email,
              phone: result.user.phoneNumber || null,
              avatar: result.user.photoURL,
              uid: result.user.uid,
              registeredAt: parseInt(result.user.metadata.a),
              invites: {},
              chatrooms: {}
            };

            dispatch(
              "checkExistence",
              { collection: "users", document: user.uid },
              { root: true }
            ).then(isInDb => {
              if (isInDb) {
                dispatch("updateAuthUser", user.uid);
                dispatch("updateLastActivity").then(() => {
                  resolve();
                });
              } else {
                dispatch(
                  "addItemToDb",
                  {
                    collection: "users",
                    document: user.uid,
                    data: user
                  },
                  { root: true }
                )
                  .then(() => {
                    dispatch("updateAuthUser", user.uid);
                    resolve();
                  })
                  .catch(err => {
                    reject(err);
                  });
              }
            });

            // console.log(isInDb);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    signOut({ dispatch }) {
      return new Promise((resolve, reject) => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            dispatch("updateAuthUser", null);
            resolve();
          })
          .catch(err => reject(err));
      });
    },

    listenUser({ dispatch }, uid) {
      dispatch(
        "listenDoc",
        {
          collection: "users",
          document: uid
        },
        { root: true }
      );
    },

    fetchUser({ dispatch, commit }, uid) {
      return new Promise((resolve, reject) => {
        dispatch(
          "fetchDbItem",
          { collection: "users", document: uid },
          { root: true }
        )
          .then(doc => {
            commit(
              "setItem",
              { parent: "users", name: doc.uid, value: doc },
              { root: true }
            );
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    updateUser({ dispatch, rootState }, { name, phone, avatar }) {
      return new Promise((resolve, reject) => {
        dispatch(
          "updateDbItem",
          {
            collection: "users",
            document: rootState.authUserId,
            data: {
              name,
              phone,
              avatar,
              lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            }
          },
          { root: true }
        )
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  },
  getters: {
    userInfo: state => uid => state[uid]
  }
};
