<template>
  <div class="messages">
    <header>
      <div class="cr-info">
        <div class="cr-icon">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>
        <div class="cr-title">
          <h3>Lote's Favorite Group</h3>
          <div class="activity">Active 5 minutes ago</div>
          <div class="actions">
            <div class="buttons">
              <button title="Video Call" class="btn btn-white">
                <font-awesome-icon :icon="['fas', 'video']" />
              </button>

              <button title="Audio Call" class="btn btn-white">
                <font-awesome-icon :icon="['fas', 'headphones']" />
              </button>

              <button title="Members" class="btn btn-white">
                <font-awesome-icon :icon="['fas', 'info']" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="chat-view">
      <div class="container" ref="container">
        <div class="row">
          <div class="msg-container">
            <div class="usr-img">
              <img src="https://placeimg.com/500/500/people" />
            </div>
            <div class="msg-group">
              <div class="msg">I am a message</div>
              <div class="msg-time">a moment ago</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="msg-container sent">
            <div class="msg-group">
              <div class="msg">Yeah, I got that. Can you elaborate?</div>
              <div class="msg-time">a moment ago</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="msg-container">
            <div class="usr-img">
              <img src="https://placeimg.com/500/500/people" />
            </div>
            <div class="msg-group">
              <div class="msg">Howdy, mate?</div>
              <div class="msg">alright?</div>
              <div class="msg-time">a moment ago</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="msg-container sent">
            <div class="msg-group">
              <div class="msg">Pretty Good</div>
              <div class="msg">how 'bout you</div>
              <div class="msg-time">a moment ago</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="msg-container">
            <div class="usr-img">
              <img src="https://placeimg.com/500/500/people" />
            </div>
            <div class="msg-group">
              <div class="msg">me too</div>
              <div class="msg-time">a moment ago</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="msg-container sent">
            <div class="msg-group">
              <div class="msg">Yeah, I got that. Can you elaborate?</div>
              <div class="msg-time">a moment ago</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="msg-container">
            <div class="usr-img">
              <img src="https://placeimg.com/500/500/people" />
            </div>
            <div class="msg-group">
              <div class="msg">me too</div>
              <div class="msg-time">a moment ago</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="msg-container">
            <div class="usr-img">
              <img src="https://placeimg.com/500/500/people" />
            </div>
            <div class="msg-group">
              <div
                class="msg"
              >k saro hepeko hou malai aruko billa handa chai hudaina tmerlai yo sangeet jhan ma chai arule usko billa garda ni support garxu uhh chai merai billa gardai basxa</div>
              <div class="msg-time">a moment ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MessageForm />
  </div>
</template>

<script>
import MessageForm from "./MessageForm";
export default {
  components: {
    MessageForm
  },
  methods: {
    updateScroll(el) {
      el.scrollTop = el.scrollHeight;
    }
  },
  mounted() {
    this.updateScroll(this.$refs["container"]);
  }
};
</script>

<style>
.chat-view {
  background: linear-gradient(
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.8)
    ),
    url("../assets/pattern.jpg");
}
</style>