<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"/>
    <div v-loading="load_data" class="panel-body" element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="20">
          <el-form label-width="100px">
            <el-form-item label="项目名称:" label-width="100px">
              <el-select v-model="pro_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="on_submit_loading" @click="on_git_log">查询</el-button>
              <el-button type="primary" :loading="on_submit_loading" @click="on_submit_form">更新</el-button>
              <el-button @click="$router.back()">返回</el-button>
            </el-form-item>
          </el-form>
          <terminal v-if="pro_id" :task-id="-3"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
import { panelTitle, terminal } from "components";
import { portConf, portGit } from "common/port_uri";

export default {
  name: "Gitpull",
  components: {
    panelTitle,
    terminal
  },
  data() {
    return {
      projects: null,
      options: [],
      pro_id: [],
      load_data: false,
      on_submit_loading: false
    };
  },
  created() {
    this.get_project_data();
  },
  methods: {
    //获取数据
    get_project_data() {
      this.load_data = true;
      this.$http
        .get(portConf.list)
        .then(({ data: { data } }) => {
          let opData = [];
          for (let i in data.table_data) {
            if (data.table_data[i].level == 2) {
              let value = data.table_data[i].id;
              let env = "";
              if (data.table_data[i].level == 1) {
                env = "测试环境";
              }
              if (data.table_data[i].level == 2) {
                env = "预发布环境";
              }
              if (data.table_data[i].level == 3) {
                env = "正式环境";
              }
              let lable = env + "-" + data.table_data[i].name;
              opData.push({ label: lable, value: value });
            }
          }
          this.projects = data.table_data;
          this.options = opData;
          this.load_data = false;
        })
        .catch(() => {
          this.load_data = false;
        });
    },
    //提交
    on_submit_form() {
      this.on_submit_loading = true;
      if (this.pro_id) {
        this.$http
          .get(portGit.gitpull, {
            params: {
              projectId: this.pro_id
            }
          })
          .then(({ data: { data } }) => {
            console.log(data);

            this.on_submit_loading = false;
          })
          .catch(() => {
            this.on_submit_loading = false;
          });
      }
    },
    on_git_log() {
      this.on_submit_loading = true;
      if (this.pro_id) {
        this.$http
          .get(portGit.gitlog, {
            params: {
              projectId: this.pro_id
            }
          })
          .then(({ data: { data } }) => {
            console.log(data);
            this.on_submit_loading = false;
          })
          .catch(() => {
            this.on_submit_loading = false;
          });
      }
    }
  }
};
</script>
