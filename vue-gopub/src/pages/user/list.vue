<template>
  <div class="panel">
    <panel-title :title="$route.meta.title">
      <router-link style="float: left; margin-right: 10px" :to="{name: 'register'}" tag="span">
        <el-button type="primary" icon="plus">添加</el-button>
      </router-link>
    </panel-title>

    <div class="panel-body">
      <el-table
        v-loading="load_data"
        :data="table_data"
        element-loading-text="拼命加载中"
        border
        style="width: 100%;"
      >
        <el-table-column prop="id" label="id" width="80"/>
        <el-table-column prop="realname" label="名称" width="100"/>
        <el-table-column prop="updated_at" label="上线时间" width="180"/>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="created_at" label="创建时间" width="180"/>
        <el-table-column prop="role" label="	角色" width="100">
          <template slot-scope="props">
            <span>{{ props.row.role | getRole }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="props">
            <router-link :to="{name: 'register', query: {id: props.row.id}}" tag="span">
              <el-button icon="edit">修改</el-button>
            </router-link>
            <el-button type="danger" icon="delete" @click="delete_data(props.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script type="text/javascript">
import { panelTitle } from "components";
import { portUser } from "common/port_uri";
export default {
  name: "Userlist",
  filters: {
    getRole: function(value) {
      if (value == 1) {
        return "管理员";
      } else if (value == 10) {
        return "全部预发布用户";
      } else if (value == 20) {
        return "单个项目用户";
      }
      return value;
    }
  },
  components: {
    panelTitle
  },
  data() {
    return {
      table_data: null,
      load_data: true
    };
  },
  created() {
    this.get_table_data();
  },
  methods: {
    submit_search(value) {
      this.select_info = value;
      this.$message({
        message: value,
        type: "success"
      });
      this.get_table_data();
    },
    //刷新
    on_refresh() {
      this.select_info = "";
      this.get_table_data();
    },
    //获取数据
    get_table_data() {
      this.load_data = true;
      this.$http
        .get(portUser.users)
        .then(({ data: { data } }) => {
          this.table_data = data;
          this.load_data = false;
        })
        .catch(() => {
          this.load_data = false;
        });
    }
  }
};
</script>
