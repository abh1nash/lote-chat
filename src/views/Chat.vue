<template>
  <div>
    <div class="d-flex">
      <TheNav class="col-2 col-xl-1" @showModal="displayModal" />
      <ConversationList v-if="activeList=='conversation'" class="col-4" @showModal="displayModal" />
      <PeopleList v-else-if="activeList=='people'" class="col-4" @showModal="displayModal" />
      <MessagesList class="col-6 col-xl-7" @showModal="displayModal" />
    </div>
    <ModalOverlay v-if="renderModal" :type="modalFor" :crId="chatroomId" @closeModal="closeModal" />
  </div>
</template>

<script>
import TheNav from "@/components/TheNav";
import ConversationList from "@/components/ConversationList";
import PeopleList from "@/components/PeopleList";
import MessagesList from "@/components/MessagesList";
import ModalOverlay from "@/components/ModalOverlay";
import { mapState } from "vuex";
export default {
  data() {
    return {
      renderModal: false,
      modalFor: null,
      chatroomId: null
    };
  },
  components: {
    TheNav,
    ConversationList,
    PeopleList,
    MessagesList,
    ModalOverlay
  },
  methods: {
    displayModal(type, crId) {
      this.renderModal = true;
      this.chatroomId = crId;
      this.modalFor = type;
    },
    closeModal() {
      this.renderModal = false;
      this.chatroomId = null;
      this.modalFor = null;
    }
  },
  computed: {
    ...mapState({
      activeList: "activeChatroomList"
    })
  }
};
</script>

<style>
</style>