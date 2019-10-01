import firebase from "firebase/app";
import "firebase/auth";
import Vue from "vue";
export default {
  namespaced: true,
  state: {},
  mutations: {
    setUser(state, { uid, data }) {
      if (!state[uid]) {
        state[uid] = {};
      }
      Vue.set(state, uid, data);
    }
  },
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
    acceptInvite({ dispatch }, { crId, uid }) {
      //delete invite entry from user db
      //add chatroom to user's chatroom list
      //delete user from chatroom's invite list
      //add user to chatroom's members
    },
    updateLastActivity({ dispatch, rootState }) {
      return new Promise((resolve, reject) => {
        dispatch(
          "updateDbItem",
          {
            collection: "users",
            document: rootState.authUserId,
            data: { lastActivity: Date.now() }
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
              registeredAt: parseInt(result.user.metadata.a)
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

    fetchUser({ dispatch, commit }, uid) {
      return new Promise((resolve, reject) => {
        dispatch(
          "fetchDbItem",
          { collection: "users", document: uid },
          { root: true }
        )
          .then(doc => {
            commit("setUser", { uid: doc.uid, data: doc });
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
