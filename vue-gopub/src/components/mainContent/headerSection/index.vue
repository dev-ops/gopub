<template>
  <div class="header-section">
    <menu-right/>
    <search class="menu-search"/>
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
