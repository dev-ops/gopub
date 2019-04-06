<template>
  <div class="bottom-toolbar ofh">
    <el-row>
      <el-col :span="24">
        <div class="fl">
          <slot name="handler"/>
        </div>
        <div class="fr">
          <slot name="page"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "BottomToolBar"
};
</script>
