<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"/>
    <div v-loading="load_data" class="panel-body" element-loading-text="拼命加载中">
      <terminal :task-id="-1"/>
    </div>
  </div>
</template>
<script type="text/javascript">
import { panelTitle, terminal } from "components";
import { portConf } from "common/port_uri";

export default {
  name: "ConfDetection",
  components: {
    panelTitle,
    terminal
  },
  data() {
    return {
      route_id: this.$route.params.id,
      load_data: false
    };
  },
  created() {
    if (this.route_id) {
      this.detection_data();
    } else {
      this.$message({
        message: "项目id不存在",
        type: "warning"
      });
      setTimeout(() => {
        this.$router.push({
          name: "confList"
        });
      }, 500);
    }
  },
  methods: {
    detection_data() {
      this.$http
        .get(portConf.detection, {
          params: {
            projectId: this.route_id
          }
        })
        .then(() => {
          this.$message({
            message: "检测成功",
            type: "success"
          });
        })
        .catch(() => {});
    }
  }
};
</script>
