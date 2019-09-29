<template>
  <div class="convo-list">
    <header>
      <h5>Conversations</h5>
      <div class="actions">
        <button title="Create a new conversation" class="btn btn-white">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </button>

        <button class="btn btn-white">
          <font-awesome-icon title="Join a conversation" :icon="['fas', 'sign-in-alt']" />
        </button>
      </div>
    </header>
    <div class="cr-list">
      <div class="active conversation">
        <div class="cr-info">
          <div class="convo-icon"></div>
          <div class="convo-info">
            <div class="convo-title">Lote's Favorite Group</div>
            <div
              class="convo-last-msg"
            >k saro hepeko hou malai aruko billa handa chai hudaina tmerlai yo sangeet jhan ma chai arule usko billa garda ni support garxu uhh chai merai billa gardai basxa</div>
          </div>
        </div>
        <div class="extras">
          <div class="gap"></div>
          <div class="time">2 hrs ago</div>
        </div>
      </div>

      <div class="conversation">
        <div class="cr-info">
          <div class="convo-icon"></div>
          <div class="convo-info">
            <div class="convo-title">Sangeet Giri</div>
            <div class="convo-last-msg">ahile ta sanchai xa</div>
          </div>
        </div>
        <div class="extras">
          <div class="gap"></div>
          <div class="time">10 mins ago</div>
        </div>
      </div>

      <div class="unread conversation">
        <div class="cr-info">
          <div class="convo-icon"></div>
          <div class="convo-info">
            <div class="convo-title">Roshan Timsina</div>
            <div class="convo-last-msg">oe kaha xau ahile</div>
          </div>
        </div>
        <div class="extras">
          <div class="gap"></div>
          <div class="time">1 hr ago</div>
        </div>
      </div>

      <div class="conversation">
        <div class="cr-info">
          <div class="convo-icon"></div>
          <div class="convo-info">
            <div class="convo-title">Anisha Karki</div>
            <div class="convo-last-msg">hello</div>
          </div>
        </div>
        <div class="extras">
          <div class="gap"></div>
          <div class="time">a moment ago</div>
        </div>
      </div>

      <div class="conversation">
        <div class="cr-info">
          <div class="convo-icon"></div>
          <div class="convo-info">
            <div class="convo-title">Bishal Dahal</div>
            <div class="convo-last-msg">voli colz jaane?</div>
          </div>
        </div>
        <div class="extras">
          <div class="gap"></div>
          <div class="time">a moment ago</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>