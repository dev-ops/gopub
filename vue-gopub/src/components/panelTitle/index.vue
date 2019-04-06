<template>
  <div class="panel-title">
    <span v-if="title" v-text="title"/>
    <div class="fr">
      <slot/>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "PabelTitle",
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
