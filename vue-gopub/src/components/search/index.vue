<template>
  <form @submit.prevent="submit_form" class="search-form">
    <el-input v-model="formValue" :placeholder="placeholder"/>
  </form>
</template>
<script type="text/javascript">
export default {
  name: "Search",
  props: {
    placeholder: {
      type: String,
      default: "Search here..."
    }
  },
  data() {
    return {
      formValue: ""
    };
  },
  computed: {
    valueIsNull() {
      return this.formValue.trim() === "";
    }
  },
  methods: {
    submit_form() {
      if (!this.valueIsNull) {
        this.$emit("search", this.formValue);
      }
      return false;
    }
  }
};
</script>
