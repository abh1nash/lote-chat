import firebase from "firebase/app";
import "firebase/auth";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
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
                resolve();
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
    }
  },
  getters: {}
};
