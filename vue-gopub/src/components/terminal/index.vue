<template>
  <div>
    <el-row v-show="isShowStep">
      <el-col :span="24">
        <el-steps :active="action">
          <el-step title="步骤 1" description="权限、目录检查"/>
          <el-step title="步骤 2" description="pre-deploy任务"/>
          <el-step title="步骤 3" description="代码检出"/>
          <el-step title="步骤 4" description="post-deploy任务"/>
          <el-step title="步骤 5" description="同步至服务器"/>
          <el-step title="步骤 6" description="全量更新(pre-release、更新版本、post-release)"/>
        </el-steps>
      </el-col>
    </el-row>
    <div
      style="margin: 5px 5px 0px; padding: 3px; border: 1px dashed rgb(0, 160, 198); background-color: rgb(0,0,0);"
    >
      <code style="background-color: rgb(0, 0, 0);color:#00ff00">
        <br>
        <span v-for="n in showText" :key="n" :style="{'color': n.color}">
          <pre style=" white-space: pre-wrap;" v-html="n.text"/>
          <br>
        </span>
        <br>
      </code>
    </div>
  </div>
</template>
<script type="text/javascript">
import { portRecord } from "common/port_uri";
export default {
  name: "Terminal",
  props: ["taskId", "isJson"],
  data() {
    return {
      showText: [],
      taskid: this.taskId * 1,
      action: 0,
      time: Date.parse(new Date()) / 1000 - 10
    };
  },
  computed: {
    test1: function() {
      return this.get_data();
    },
    isShowStep: function() {
      return this.taskId * 1 > 0;
    }
  },
  created() {
    this.get_data();
    this.intervalid1 = setInterval(this.get_data, 2000);
  },
  beforeDestroy() {
    this.time = Date.parse(new Date()) / 1000;
    clearInterval(this.intervalid1);
  },
  methods: {
    get_data() {
      this.$http
        .get(portRecord.list, {
          params: {
            taskId: this.taskId,
            time: this.time
          }
        })
        .then(({ data: { data } }) => {
          this.showText = [];
          let action = 0;
          let color = "#00ff00";
          for (let i = 0; i < data.length; i++) {
            // let text=data[i].command+"<br>"+data[i].memo
            if (data[i].status == "0") {
              color = "red";
            }
            this.showText.push({ text: data[i].command, color });
            let text = data[i].memo;
            try {
              text = JSON.parse(data[i].memo);
            } catch (e) {
              console.error(e);
            }
            if (typeof text == "string") {
              this.showText.push({ text: data[i].memo, color });
            } else if (
              Object.prototype.toString.call(text) == "[object Array]"
            ) {
              for (let j = 0; j < text.length; j++) {
                try {
                  this.showText.push({
                    text: "IP:" + text[j].Host,
                    color
                  });
                  if (text[j].ErrorInfo) {
                    this.showText.push({
                      text: "错误结果:\n" + text[j].Result,
                      color
                    });
                  } else {
                    this.showText.push({
                      text: "执行结果:\n" + text[j].Result,
                      color
                    });
                  }
                  if (text[j].ErrorInfo) {
                    this.showText.push({
                      text: "错误:" + text[j].ErrorInfo,
                      color
                    });
                  }
                  this.showText.push({ text: "=============", color });
                } catch (e) {
                  console.log(e);
                }
              }
              // this.showText.push({text: this.formatJson(text), "color": color})
            } else {
              this.showText.push({
                text: "执行结果:\n" + text.Result,
                color
              });
              if (text.ErrorInfo) {
                this.showText.push({
                  text: "错误:" + text.ErrorInfo,
                  color
                });
              }
              this.showText.push({ text: "=============", color });
              //  this.showText.push({text: this.formatJson(text), "color": color})
            }
            if (action < data[i].action / 10) {
              action = data[i].action / 10;
            }
          }
          if (action == 10) {
            setTimeout(clearInterval(this.intervalid1), 5000);
            this.showText.push({ text: "发布完成", color });
          }
          this.action = action;
        })
        .catch(() => {});
    },
    formatJson(json, options) {
      let formatted = "",
        pad = 0,
        PADDING = "    "; // one can also use '\t' or a different number of spaces

      // optional settings
      options = options || {};
      // remove newline where '{' or '[' follows ':'
      options.newlineAfterColonIfBeforeBraceOrBracket =
        options.newlineAfterColonIfBeforeBraceOrBracket === true ? true : false;
      // use a space after a colon
      options.spaceAfterColon =
        options.spaceAfterColon === false ? false : true;

      // begin formatting...
      if (typeof json !== "string") {
        // make sure we start with the JSON as a string
        json = JSON.stringify(json);
      } else {
        // is already a string, so parse and re-stringify in order to remove extra whitespace
        json = JSON.parse(json);
        json = JSON.stringify(json);
      }

      // add newline before and after curly braces
      json = json.replace(/([{}])/g, "\r\n$1\r\n");

      // add newline before and after square brackets
      json = json.replace(/([[]])/g, "\r\n$1\r\n");

      // add newline after comma
      json = json.replace(/(,)/g, "$1\r\n");

      // remove multiple newlines
      json = json.replace(/(\r\n\r\n)/g, "\r\n");

      // remove newlines before commas
      json = json.replace(/\r\n,/g, ",");

      // optional formatting...
      if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        json = json.replace(/:\r\n\{/g, ":{");
        json = json.replace(/:\r\n\[/g, ":[");
      }
      if (options.spaceAfterColon) {
        json = json.replace(/:/g, ":");
      }
      for (let index in json.split("\r\n")) {
        let node = json.split("\r\n")[index];
        let i = 0,
          indent = 0,
          padding = "";

        if (node.match(/\{$/) || node.match(/\[$/)) {
          indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else {
          indent = 0;
        }

        for (i = 0; i < pad; i++) {
          padding += PADDING;
        }

        formatted += padding + node + "\r\n";
        pad += indent;
      }
      return formatted;
    }
  }
};
</script>
