export default {
  namespaced: true,
  state: {},
  mutations: {},
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
                lastMsgTime: Date.now()
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
    }
  },
  getters: {
    chatroomAssociatedUsers: state => crId =>
      Object.keys(state[crId].members).length +
      Object.keys(state[crId].invited).length,
    chatroomInitiator: state => crId => state[crId].initiator
  }
};
