<template>
  <div class="left-side">
    <div class="left-side-inner">
      <router-link to="/" class="logo block">
        <div style="color: white">自动发布系统</div>
      </router-link>
      <el-menu class="menu-box" theme="dark" router :default-active="$route.path">
        <div v-for="(item, index) in nav_menu_data" :key="index">
          <el-menu-item
            v-if="typeof item.child === 'undefined'"
            class="menu-list"
            :index="item.path"
          >
            <i class="icon fa" :class="item.icon"/>
            <span class="text" v-text="item.title"/>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "LeftSlideTologin",
  data() {
    return {
      nav_menu_data: [
        {
          title: "退出",
          path: "/user/login",
          icon: "fa-arrow-left"
        }
      ]
    };
  }
};
</script>
