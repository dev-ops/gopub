<template>
  <footer v-once class="footer">Copyright &copy; {{ getYear }} 工具平台组 All Rights Reserved</footer>
</template>
<script type="text/javascript">
export default {
  name: "Vfooter",
  computed: {
    getYear() {
      return new Date().getFullYear();
    }
  }
};
</script>
