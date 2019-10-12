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
      if (typeof this.date === "number") {
        return moment(this.date);
      } else {
        return moment(this.date.toDate());
      }
    }
  },
  methods: {
    dateFromNow() {
      if (typeof this.date === "number") {
        this.parsedDate = moment(this.date).fromNow();
      } else {
        this.parsedDate = moment(this.date.toDate()).fromNow();
      }
    }
  },
  mounted() {
    this.dateFromNow();
    setInterval(this.dateFromNow, 1000);
  }
};
</script>

<style>
</style>