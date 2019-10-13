<template>
  <span :title="fullDate">{{parsedDate}}</span>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
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
    ...mapState({
      dateDifference: "dateDifference"
    }),
    fullDate() {
      if (this.date) {
        if (typeof this.date === "number") {
          return moment(this.date);
        } else {
          return moment(this.date.toDate());
        }
      } else {
        return "just now";
      }
    }
  },
  methods: {
    dateFromNow() {
      if (this.date) {
        if (typeof this.date === "number") {
          this.parsedDate = moment(this.date)
            .add(this.dateDifference, "ms")
            .fromNow();
        } else {
          this.parsedDate = moment(this.date.toDate())
            .add(this.dateDifference, "ms")
            .fromNow();
        }
      } else {
        this.parsedDate = "just now";
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