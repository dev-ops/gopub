<template>
  <div v-if="get_user_info.login" class="menu-right">
    <div class="notification-menu">
      <el-dropdown trigger="click" class="notification-list">
        <div class="notification-btn">
          <img :src="get_user_info.user.Avatar" alt="">
          <span v-text="get_user_info.user.Realname"/>
          <span class="icon"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="dropdown-menu">
          <el-dropdown-item class="dropdown-list">
            <a href="javascript:" class="dropdown-btn" @click="user_click(1)">
              <i class="icon fa fa-user"/>
              <span>个人信息</span>
            </a>
          </el-dropdown-item>
          <el-dropdown-item class="dropdown-list">
            <a href="javascript:" class="dropdown-btn" @click="user_click(2)">
              <i class="icon fa fa-cog"/>
              <span>注册用户</span>
            </a>
          </el-dropdown-item>
          <el-dropdown-item class="dropdown-list">
            <a href="javascript:" class="dropdown-btn" @click="user_click(0)">
              <i class="icon fa fa-sign-out"/>
              <span>安全退出</span>
            </a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script type="text/javascript">
import { portUser } from "common/port_uri";
import { mapGetters, mapActions } from "vuex";
import { GET_USER_INFO } from "store/getters/type";
import { SET_USER_INFO } from "store/actions/type";
import store from "store";
const USER_OUT = 0;
const USER_INFO = 1;
const ADMIN_SETTING = 2;

export default {
  name: "MenuRight",
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO
    })
  },
  methods: {
    ...mapActions({
      set_user_info: SET_USER_INFO
    }),
    //退出
    user_out() {
      this.$confirm("此操作将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.post(portUser.logout).then(({ data: { msg } }) => {
            this.$message({
              message: msg,
              type: "success"
            });
            this.set_user_info(null);
            setTimeout(() => {
              this.$router.replace({ name: "login" });
            }, 500);
          });
        })
        .catch(() => {});
    },
    user_info() {
      this.$router.push({ path: "/user/changepasswd" });
      //个人信息
    },
    admin_setting() {
      if (store.state.user_info.user.Role == 1) {
        this.$router.push({ path: "/user/register" });
      }
    },
    user_click(type) {
      switch (type) {
        case USER_OUT:
          //退出
          this.user_out();
          break;
        case USER_INFO:
          //个人信息
          this.user_info();
          break;
        case ADMIN_SETTING:
          //密码修改
          this.admin_setting();
          break;
      }
    }
  }
};
</script>
