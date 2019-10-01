export default {
  data() {
    return {
      asyncDataStatus_ready: false
    };
  },
  methods: {
    fetched() {
      this.asyncDataStatus_ready = true;
    }
  }
};
