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
          <el-submenu v-else :index="item.path">
            <template slot="title">
              <i class="icon fa" :class="item.icon"/>
              <span class="text" v-text="item.title"/>
            </template>
            <el-menu-item
              v-for="(sub_item, sub_index) in item.child"
              :key="sub_index"
              class="menu-list"
              :index="sub_item.path"
            >
              <!--<i class="icon fa" :class="sub_item.icon"></i>-->
              <span class="text" v-text="sub_item.title"/>
            </el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </div>
  </div>
</template>
<script type="text/javascript">
import store from "store";
export default {
  name: "LeftSlide",
  data() {
    let Role = store.state.user_info.user.Role;
    if (Role == 1) {
      return {
        nav_menu_data: [
          {
            title: "主页",
            path: "/home",
            icon: "fa-home"
          },
          {
            title: "项目配置",
            path: "/conf/list",
            icon: "el-icon-menu"
          },
          {
            title: "上线单",
            path: "/task",
            icon: "fa-table",
            child: [
              {
                title: "全部上线单",
                path: "/task/list"
              },
              {
                title: "我的上线单",
                path: "/task/mylist"
              },
              {
                title: "创建上线单",
                path: "/task/create"
              }
            ]
          },
          {
            title: "其他操作",
            path: "/other",
            icon: "fa-bar-chart-o",
            child: [
              {
                title: "agent状态查询",
                path: "/p2p/check",
                icon: "ace-icon fa fa-desktop"
              }
            ]
          },
          {
            title: "用户管理",
            path: "/user",
            icon: "el-icon-setting",
            child: [
              {
                title: "用户列表",
                path: "/user/list",
                icon: "ace-icon fa fa-desktop"
              }
            ]
          }
        ]
      };
    } else {
      return {
        nav_menu_data: [
          {
            title: "主页",
            path: "/home",
            icon: "fa-home"
          },
          {
            title: "上线单",
            path: "/task",
            icon: "fa-table",
            child: [
              {
                title: "我的上线单",
                path: "/task/mylist"
              },
              {
                title: "创建上线单",
                path: "/task/create"
              }
            ]
          }
        ]
      };
    }
  }
};
</script>
