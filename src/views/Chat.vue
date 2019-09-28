<template>
  <div class="d-flex">
    <TheNav class="col-2 col-xl-1" />
    <ConversationList class="col-4" />
    <MessagesList class="col-6 col-xl-7" />
  </div>
</template>

<script>
import TheNav from "@/components/TheNav";
import ConversationList from "@/components/ConversationList";
import MessagesList from "@/components/MessagesList";
export default {
  components: {
    TheNav,
    ConversationList,
    MessagesList
  }
};
</script>

<style>
</style>