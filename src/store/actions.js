import firebase from "firebase/app";
import "firebase/firestore";

export default {
  addItemToDb({ commit }, { collection, document, data }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      if (document) {
        db.collection(collection)
          .doc(document)
          .set(data)
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      } else {
        db.collection(collection)
          .add(data)
          .then(docRef => {
            resolve(docRef);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  },

  checkExistence({}, { collection, document, data }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      if (!data) {
        db.collection(collection)
          .doc(document)
          .get()
          .then(snap => {
            resolve(snap.exists);
          })
          .catch(err => {
            reject(err);
          });
      } else if (!document) {
        db.collection(collection)
          .where(data.field, data.opStr, data.value)
          .get()
          .then(snap => {
            resolve({ exists: snap.docs.length > 0, docs: snap.docs });
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  },
  updateDbItem({}, { collection, document, data }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection(collection)
        .doc(document)
        .update(data)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  listenDoc({ commit }, { collection, document }) {
    const db = firebase.firestore();

    db.collection(collection)
      .doc(document)
      .onSnapshot(doc => {
        console.log(doc.data());
        commit("setItem", {
          parent: collection,
          name: document,
          value: doc.data()
        });
      });
  },
  deleteDoc({}, { collection, document }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection(collection)
        .doc(document)
        .delete()
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  deleteFieldValue({}, { collection, document, fieldValue }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection(collection)
        .doc(document)
        .update({
          [`${fieldValue}`]: firebase.firestore.FieldValue.delete()
        })
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateActiveRoom({ commit, getters }, crId) {
    commit("setItem", { name: "activeConversation", value: crId });

    if (crId) {
      commit("setItem", {
        name: "activeWindowTitle",
        value: getters["chatrooms/chatroomInfo"](crId).title
      });
      commit("setItem", {
        name: "activeWindowTime",
        value: getters["chatrooms/chatroomInfo"](crId).lastMsgTime
      });
    }
  },

  msgsNotReady({ commit }) {
    commit("setItem", { name: "msgsReady", value: false });
  },

  msgsReady({ commit }) {
    commit("setItem", { name: "msgsReady", value: true });
  },
  fetchDbItem({}, { collection, document }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection(collection)
        .doc(document)
        .get()
        .then(snapshot => {
          resolve(snapshot.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
