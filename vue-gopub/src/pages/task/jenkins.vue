<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"/>
    <div v-loading="load_data" class="panel-body" element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="20">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="上线单标题:" prop="Title">
              <el-input v-model="form.Title" placeholder="请输入标题" style="width: 500px;"/>
            </el-form-item>
            <el-form-item label="选取构建:" prop="Branch" label-width="100px">
              <el-select v-model="form.Branch" filterable placeholder="请选择" @change="get_commit">
                <el-option
                  v-for="item in branchData"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
              <el-button @click.stop="get_branch_data">
                <i class="fa fa-refresh"/>
              </el-button>
            </el-form-item>
            <el-form-item label="下载地址 :" label-width="100px" prop="CommitId">
              <el-input v-model="form.CommitId" style="width: 500px;"/>
            </el-form-item>
            <el-form-item label="灰度发布 :">
              <el-switch v-model="isShowHost" on-text="on" off-text="off">灰度发布</el-switch>
              <div>
                <el-select
                  v-if="isShowHost"
                  v-model="selectHosts"
                  multiple
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in Hosts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="on_submit_loading" @click="on_submit_form">立即提交</el-button>
              <el-button @click="$router.back()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
import { panelTitle } from "components";
import { portTask, portGit, portConf } from "common/port_uri";
import store from "store";
export default {
  name: "Jenkins",
  components: {
    panelTitle
  },
  data() {
    return {
      commitData: [],
      branchData: [],
      isShowHost: false,
      Hosts: [],
      selectHosts: [],
      ProjectData: null,
      form: {
        Branch: null,
        Title: null,
        CommitId: null,
        Hosts: null,
        ProjectId: this.$route.query.id * 1,
        UserId: store.state.user_info.user.Id
      },
      route_id: this.$route.query.id,
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
  created() {
    if (this.route_id) {
      this.get_branch_data();
      this.get_Project_data();
    } else {
      this.$message({
        message: "项目id不存在",
        type: "warning"
      });
      setTimeout(() => {
        this.$router.push({
          name: "taskMyList"
        });
      }, 500);
    }
  },
  methods: {
    get_Project_data() {
      this.load_data = true;
      this.$http
        .get(portConf.get, {
          params: {
            projectId: this.form.ProjectId
          }
        })
        .then(({ data: { data } }) => {
          this.ProjectData = data;
          this.Hosts = [];
          let ss = this.ProjectData.Hosts.match(
            /((\d+)\.(\d+)\.(\d+)\.(\d+):(\d+))|((\d+)\.(\d+)\.(\d+)\.(\d+))/g
          );
          for (let i = 0; i < ss.length; i++) {
            this.Hosts.push({ label: ss[i], value: ss[i] });
          }
          this.load_data = false;
        })
        .catch(() => {
          this.load_data = false;
        });
    },
    get_commit() {
      this.form.CommitId = null;

      for (let i = 0; i < this.branchData.length; i++) {
        console.log(this.branchData[i]);
        if (this.branchData[i].label == this.form.Branch) {
          this.form.CommitId = this.branchData[i].value;
        }
      }
    },
    get_branch_data() {
      this.load_data = true;
      this.commitData = [];
      this.form.Branch = null;
      this.form.CommitId = null;
      this.$http
        .get(portGit.jenkinsBranch, {
          params: {
            projectId: this.route_id
          }
        })
        .then(({ data: { data } }) => {
          let branchData = [];
          for (let i in data) {
            branchData.push({ label: data[i].build, value: data[i].tar_url });
          }
          this.branchData = branchData;
          this.load_data = false;
        })
        .catch(() => {
          this.load_data = false;
        });
    },
    //提交
    on_submit_form() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false;
        }
        this.on_submit_loading = true;
        if (this.isShowHost) {
          this.form.Title = this.form.Title + "-灰度";
          this.form.Hosts = this.selectHosts.toString();
        }
        this.$http
          .post(portTask.save, this.form)
          .then(() => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({
                name: "taskMyList"
              });
            }, 500);
          })
          .catch(() => {
            this.on_submit_loading = false;
          });
      });
    }
  }
};
</script>
