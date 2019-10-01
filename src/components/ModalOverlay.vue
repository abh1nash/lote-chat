<template>
  <div @click.self.prevent="$emit('closeModal')" class="modal">
    <div class="modal-container">
      <button @click="$emit('closeModal')" class="close-btn btn btn-outline-danger">&#x2715;</button>
      <CreateConversation v-if="type=='create'" />
      <JoinConversation v-if="type=='join'" />
    </div>
  </div>
</template>

<script>
import CreateConversation from "./CreateConversation";
import JoinConversation from "./JoinConversation";
export default {
  props: {
    type: {
      required: true,
      type: String
    },
    crId: {
      required: false
    }
  },
  components: {
    CreateConversation,
    JoinConversation
  }
};
</script>

<style lang="scss">
.modal {
  z-index: 1000;
  display: flex;
  background: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;

  .modal-container {
    background: #fff;
    width: 450px;
    border-radius: 20px;
    padding: 20px;
    position: relative;
  }

  .close-btn {
    border-radius: 50%;
    position: absolute;
    right: 5px;
    top: 5px;
    transform: scale(0.7);
  }
  h6 {
    text-transform: uppercase;
    font-weight: 700;
  }

  .modal-btn {
    margin: 10px 5px;
  }

  .modal-input {
    margin-top: 10px;
    border-radius: 20px;
  }
}
</style>