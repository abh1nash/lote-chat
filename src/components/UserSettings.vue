<template>
  <div class="user-settings">
    <h6>Settings</h6>
    <form @submit.prevent="saveSettings">
      <div class="settings-container">
        <div class="avatar">
          <img :src="avatar || user(authId).avatar" :alt="user(authId).name" />
          <div class="new-picture">
            <label class="file-input" for="user-new-avatar-img">
              <span>
                <font-awesome-icon :icon="['fas','image']" />
                <span class="ml-2 filename">Choose an Image</span>
              </span>
            </label>
            <input type="file" id="user-new-avatar-img" @change="uploadImage" />
            <p>
              <b>or</b>
            </p>
            <input
              class="form-control"
              type="text"
              v-model="avatar"
              placeholder="Link to your avatar"
            />
          </div>
        </div>

        <div class="ml-3 info">
          <label for="user-display-name">
            <b>Display Name</b>
          </label>
          <input class="form-control" type="text" id="user-display-name" v-model="username" />

          <label class="mt-3" for="user-phone-number">
            <b>Phone Number</b>
          </label>
          <input class="form-control" type="text" id="user-phone-number" v-model="phone" />

          <div class="buttons mt-3">
            <button class="btn btn-primary" type="submit">Save Updates</button>
          </div>

          <div v-if="error" class="mt-3 alert alert-danger">{{error}}</div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      username: "",
      avatar: "",
      phone: "",
      error: ""
    };
  },
  methods: {
    ...mapActions({
      uploadFile: "uploadFile",
      updateUser: "users/updateUser"
    }),
    uploadImage(e) {
      this.uploadFile({ file: e.target.files[0], fileType: "image" })
        .then(({ url, filename }) => {
          this.avatar = url;
        })
        .catch(err => {
          this.error = err.message;
        });
    },

    saveSettings() {
      this.updateUser({
        name: this.username,
        phone: this.phone,
        avatar: this.avatar
      })
        .then(() => {
          this.$emit("eventSuccess");
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  },
  computed: {
    ...mapGetters({
      authId: "authUser",
      user: "users/userInfo"
    })
  },
  mounted() {
    this.avatar = this.user(this.authId).avatar;
    this.username = this.user(this.authId).name;
  }
};
</script>

<style lang='scss'>
.settings-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  .avatar {
    text-align: center;
    img {
      object-fit: cover;
      width: 200px;
      height: 200px;
      border-radius: 50%;
    }

    input {
      margin-top: 10px;
    }

    .new-picture {
      text-align: center;

      #user-new-avatar-img {
        opacity: 0;
        position: absolute;
        z-index: -1;
      }
    }
  }

  .buttons {
    text-align: right;
  }

  .btn-outline-danger {
    border-radius: 20px;
  }
}
</style>