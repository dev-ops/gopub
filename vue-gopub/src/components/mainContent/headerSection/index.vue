<template>
  <div class="header-section">
    <search/>
    <menu-right/>
  </div>
</template>
<script type="text/javascript">
import menuRight from "./menuRight";
import search from "components/search";

export default {
  name: "HeaderSection",
  components: {
    menuRight,
    search
  },
  methods: {
    submit_search(value) {
      this.$message({
        message: value,
        type: "success"
      });
    }
  }
};
</script>
