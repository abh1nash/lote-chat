<template>
  <span :title="fullDate">{{parsedDate}}</span>
</template>

<script>
import moment from "moment";
export default {
  props: {
    date: {
      required: true
    }
  },
  data() {
    return {
      parsedDate: ""
    };
  },
  computed: {
    fullDate() {
      return moment(this.date);
    }
  },
  methods: {
    dateFromNow() {
      this.parsedDate = moment(this.date).fromNow();
    }
  },
  mounted() {
    setInterval(this.dateFromNow, 1000);
  }
};
</script>

<style>
</style>