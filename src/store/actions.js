import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import uuidv1 from "uuid/v1";

export default {
  navSwitch({ commit }, value) {
    commit("setItem", { name: "activeChatroomList", value });
  },
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

  listenDoc({ commit, dispatch }, { collection, document }) {
    const db = firebase.firestore();

    const unsubscribe = db
      .collection(collection)
      .doc(document)
      .onSnapshot(doc => {
        doc.metadata.hasPendingWrites
          ? null
          : commit("setItem", {
              parent: collection,
              name: document,
              value: doc.data()
            });
      });

    dispatch("listeners/addListener", {
      name: collection,
      id: document,
      value: unsubscribe
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
  },

  msgsNotReady({ commit }) {
    commit("setItem", { name: "msgsReady", value: false });
  },

  msgsReady({ commit }) {
    commit("setItem", { name: "msgsReady", value: true });
  },
  notify({ commit }, { crId, remove }) {
    commit("setMsgNotice", { crId, remove });
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
  },

  uploadFile(context, { file, fileType }) {
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();

      if (fileType == file.type.split("/")[0]) {
        const fileName = uuidv1();
        const fileExt = file.name.split(".").pop();
        const fileRef = storageRef.child(`${fileType}/${fileName}.${fileExt}`);

        fileRef.put(file).then(() => {
          fileRef
            .getDownloadURL()
            .then(url => {
              resolve({ url, filename: file.name });
            })
            .catch(err => {
              switch (err.code) {
                case "storage/object-not-found":
                  reject(new Error("File not found on server."));
                  break;

                case "storage/unauthorized":
                  reject(
                    new Error("You don't have permission to view the file.")
                  );
                  break;

                case "storage/canceled":
                  reject(new Error("Upload cancelled."));
                  break;

                default:
                  reject(new Error("Error occurred during the file upload."));
                  break;
              }
            });
        });
      } else {
        reject(new Error("Invalid file type."));
      }
    });
  }
};
