<template>
  <nav class="navigation flex-column">
    <div class="navbar-brand">
      <h3>
        Lote
        <b>Chat</b>
      </h3>
    </div>
    <ul class="nav">
      <li class="nav-item">
        <a class="notice btn btn-outline-primary" href="#">
          <font-awesome-icon :icon="['fas', 'comment-dots']" />
        </a>
      </li>
      <li class="nav-item">
        <a class="btn btn-outline-primary" href="#">
          <font-awesome-icon class="gradient-btn" :icon="['fas', 'user']" />
        </a>
      </li>
    </ul>
    <div class="gap"></div>
    <a href class="btn btn-danger signout">Sign Out</a>
  </nav>
</template>

<script>
export default {};
</script>

<style>
</style>