<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"/>
    <div v-loading="load_data" class="panel-body" element-loading-text="拼命加载中">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目:">{{ task.Title }}</el-form-item>
            <span v-if="project.RepoType=='git'">
              <el-form-item label="分支:">{{ task.Branch }}</el-form-item>
              <el-form-item label="哈希:">{{ task.CommitId }}</el-form-item>
            </span>
            <span v-if="project.RepoType=='file'">
              <el-form-item label="包地址:">{{ task.CommitId }}</el-form-item>
            </span>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目:">{{ project.Name }}</el-form-item>
            <el-form-item label="环境:">{{ levelEnv }}</el-form-item>
            <el-form-item label="发布版本库:">{{ project.ReleaseTo }}</el-form-item>
            <el-form-item label="发布版本库:">{{ project.ReleaseTo }}</el-form-item>
            <el-form-item label="发布ip:">
              <span v-for="n in getHost" :key="n">
                {{ n }}
                <br>
              </span>
            </el-form-item>
          </el-col>
          <el-form-item>
            <el-button @click="$router.back()">返回</el-button>
          </el-form-item>
        </el-row>
      </el-form>

      <terminal :task-id="task.Id"/>
    </div>
  </div>
</template>
<script type="text/javascript">
import { panelTitle, terminal } from "components";
import { portTask, portConf } from "common/port_uri";
export default {
  name: "Searchrelease",
  components: {
    panelTitle,
    terminal
  },
  data() {
    return {
      task: {},
      project: {},
      form: {
        Branch: null,
        Title: null,
        CommitId: null,
        ProjectId: this.$route.params.id * 1
      },
      route_id: this.$route.params.id,
      is_log: this.$route.params.is_log,
      load_data: false,
      on_submit_loading: false,
      rules: {
        Branch: [{ required: true, message: "分支不能为空", trigger: "blur" }],
        CommitId: [
          { required: true, message: "Commit不能为空", trigger: "blur" }
        ],
        Title: [{ required: true, message: "标题不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    getHost: function() {
      let hosts = this.project.Hosts;
      if (hosts && hosts != "") {
        return hosts.split("\r\n");
      } else {
        return [];
      }
    },
    levelEnv: function() {
      let env = "";
      if (this.project.Level == 1) {
        env = "测试环境";
      }
      if (this.project.Level == 2) {
        env = "预发布环境";
      }
      if (this.project.Level == 3) {
        env = "正式环境";
      }
      return env;
    }
  },
  created() {
    if (this.route_id) {
      this.get_task();
    } else {
      this.$message({
        message: "任务id不存在",
        type: "warning"
      });
      setTimeout(() => {
        this.$router.back();
      }, 500);
    }
  },
  methods: {
    get_task() {
      this.load_data = true;
      this.$http
        .get(portTask.get, {
          params: {
            taskId: this.route_id
          }
        })
        .then(({ data: { data } }) => {
          this.task = data;
          this.get_project();
        })
        .catch(() => {
          this.load_data = false;
        });
    },
    get_project() {
      this.load_data = true;
      this.$http
        .get(portConf.get, {
          params: {
            projectId: this.task.ProjectId
          }
        })
        .then(({ data: { data } }) => {
          this.project = data;
          this.load_data = false;
        })
        .catch(() => {
          this.load_data = false;
        });
    },
    //提交
    on_submit_form() {
      this.on_submit_loading = true;
      this.$http
        .get(portTask.release, {
          params: {
            taskId: this.route_id
          }
        })
        .then(() => {
          this.$message({
            message: "部署开始",
            type: "success"
          });
          this.on_submit_loading = false;
        })
        .catch(() => {
          this.on_submit_loading = false;
        });
    }
  }
};
</script>
