<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="panel">
          <div class="panel-body" style="margin-top:-5px;margin-bottom:-5px">
            <div style="height: 30px;margin-top:5px;margin-bottom:-7px">
              <div style="float:left;color:#8492A6" class="infobox-icon">
                <i class="ace-icon fa fa-desktop"/>
              </div>
              <div style="float:left;margin-left:10px;" class="infobox-data">
                <span class="infobox-data-number">
                  <strong style="color: #8492A6">{{ hostsum }}</strong> 个服务器
                </span>
              </div>

              <div style="float:left;margin-left:70px;color:#FF4949" class="infobox-icon">
                <i class="ace-icon fa fa-users"/>
              </div>
              <div style="float:left;margin-left:10px" class="infobox-data">
                <span class="infobox-data-number">
                  <strong style="color: #FF4949">{{ totalmem }}</strong> 位用户
                </span>
              </div>

              <div style="float:left;margin-left:70px;color:#324057" class="infobox-icon">
                <span class="el-icon-date"/>
              </div>
              <div style="float:left;margin-left:10px" class="infobox-data">
                <span class="infobox-data-number">
                  <strong style="color: #324057">{{ totalproject }}</strong> 个项目
                </span>
              </div>

              <div style="float:left;margin-left:70px;color:#20A0FF" class="infobox-icon">
                <i class="el-icon-upload2"/>
              </div>
              <div style="float:left;margin-left:10px" class="infobox-data">
                <span class="infobox-data-number">
                  <strong style="color: #20A0FF">{{ totalpub }}</strong> 次发布
                </span>
              </div>

              <div style="float:left;margin-left:70px;color: #13CE66" class="infobox-icon">
                <i class="el-icon-check"/>
              </div>
              <div style="float:left;margin-left:10px" class="infobox-data">
                <span class="infobox-data-number">
                  <strong style="color: #13CE66">{{ totalpubsuccess }}%</strong>发布成功率
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="panel">
          <panel-title :title="msg1"/>
          <div class="panel-body">
            <div ref="chartsA" style="height: 500px"/>
          </div>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="panel" style="margin-left: 10px">
          <panel-title :title="msg2"/>
          <div class="panel-body">
            <div ref="chartsB" style="height: 500px"/>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="panel" style="margin-left: 10px">
          <panel-title :title="msg3"/>
          <div class="panel-body">
            <div ref="chartsC" style="height: 500px"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="panel">
          <panel-title title="项目发布列表"/>
          <div class="panel-body">
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
              <el-tab-pane label="本日" name="chartsD">
                <div ref="chartsD" :style="{ height: mapHeight + 'px'}"/>
              </el-tab-pane>
              <el-tab-pane label="本周" name="chartsE">
                <div ref="chartsE" :style="{ height: mapHeight + 'px'}"/>
              </el-tab-pane>
              <el-tab-pane label="本月" name="chartsF">
                <div ref="chartsF" :style="{ height: mapHeight + 'px'}"/>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/javascript">
import { panelTitle } from "components";
import { portTask } from "common/port_uri";
export default {
  name: "Home",
  components: {
    panelTitle
  },
  data() {
    return {
      echarts_instance: null,
      msg1: "本日共发布",
      msg2: "本周共发布",
      msg3: "本月共发布",
      mapHeight: 2000,
      activeName: "chartsD",
      totalmem: null,
      totalpub: null,
      totalproject: null,
      totalpubsuccess: null,
      hostsum: null
    };
  },
  created() {
    this.get_echarts_instance();
  },
  destroyed() {
    this.echarts_instance = null;
  },
  methods: {
    handleClick(tab) {
      if (tab.name == "chartsD") {
        this.create_charts(tab.name, "dayBypro");
      }
      if (tab.name == "chartsE") {
        this.create_charts(tab.name, "weekBypro");
      }
      if (tab.name == "chartsF") {
        this.create_charts(tab.name, "monthBypro");
      }
    },
    get_echarts_instance() {
      //按需引入 ECharts 图表和组件，这里先全部引入
      require(["echarts"], echarts => {
        this.echarts_instance = echarts;
        this.create_chartsA();
        this.create_chartsB();
        this.create_chartsC();
        this.create_totalmen();
        this.create_charts("chartsD", "dayBypro");
      });
    },
    create_totalmen() {
      this.$http
        .get(portTask.chart, {
          params: {
            taskType: "total"
          }
        })
        .then(({ data: { data } }) => {
          this.totalmem = data.totalmen;
          this.totalproject = data.totalproject;
          this.totalpub = data.totalpub;
          this.totalpubsuccess = data.totalpubsuccess;
          if (data.totalpub) {
            this.totalpubsuccess =
              (this.totalpubsuccess / data.totalpub).toFixed(2) * 100;
          }
          this.hostsum = data.hostsum;
        })
        .catch(() => {});
    },
    create_chartsA() {
      let _dom = this.$refs.chartsA;
      let myChart = this.echarts_instance.init(_dom);
      this.$http
        .get(portTask.chart, {
          params: {
            taskType: "day"
          }
        })
        .then(({ data: { data } }) => {
          let chartData = [];
          let chartTitleData = [];
          let total = 0;
          for (let i in data) {
            total = total + data[i].task_count * 1;
            chartData.push({ value: data[i].task_count, name: data[i].name });
            chartTitleData.push(data[i].name);
          }
          this.msg1 = "本日共发布" + total + "单";
          let option = {
            title: {
              text: "本日发布",
              x: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              left: "left",
              data: chartTitleData
            },
            series: [
              {
                name: "发布类别",
                type: "pie",
                radius: "60%",
                center: ["50%", "60%"],
                data: chartData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };

          myChart.setOption(option);
        })
        .catch(() => {});
    },
    create_chartsB() {
      let _dom = this.$refs.chartsB;
      let myChart = this.echarts_instance.init(_dom);
      this.$http
        .get(portTask.chart, {
          params: {
            taskType: "week"
          }
        })
        .then(({ data: { data } }) => {
          let chartData = [];
          let chartTitleData = [];
          let total = 0;
          for (let i in data) {
            total = total + data[i].task_count * 1;
            chartData.push({ value: data[i].task_count, name: data[i].name });
            chartTitleData.push(data[i].name);
          }
          this.msg2 = "本周共发布" + total + "单";
          let option = {
            title: {
              text: "本周发布",
              x: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              left: "left",
              data: chartTitleData
            },
            series: [
              {
                name: "发布类别",
                type: "pie",
                radius: "60%",
                center: ["50%", "60%"],
                data: chartData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };

          myChart.setOption(option);
        })
        .catch(() => {});
    },
    create_chartsC() {
      let _dom = this.$refs.chartsC;
      let myChart = this.echarts_instance.init(_dom);
      this.$http
        .get(portTask.chart, {
          params: {
            taskType: "month"
          }
        })
        .then(({ data: { data } }) => {
          let chartData = [];
          let chartTitleData = [];
          let total = 0;
          data.sort(function(a, b) {
            return a.task_count > b.task_count;
          });
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            total = total + data[i].task_count * 1;
            chartData.push({ value: data[i].task_count, name: data[i].name });
            chartTitleData.push(data[i].name);
          }
          this.msg3 = "本月共发布" + total + "单";
          let option = {
            title: {
              text: "本月发布",
              x: "center"
            },
            tooletp: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              left: "left",
              data: chartTitleData
            },
            series: [
              {
                name: "发布类别",
                type: "pie",
                radius: "60%",
                center: ["50%", "60%"],
                data: chartData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };

          myChart.setOption(option);
        })
        .catch(() => {});
    },
    create_charts(ref, query) {
      this.$http
        .get(portTask.chart, {
          params: {
            taskType: query
          }
        })
        .then(({ data: { data } }) => {
          let chartData = [];
          let chartTitleData = [];
          let dataSort = [];
          for (let i = 0; i < data.length; i++) {
            dataSort.push({
              name: data[i].name,
              task_count: data[i].task_count / 1
            });
          }
          dataSort.sort(function(a, b) {
            return a.task_count - b.task_count;
          });
          for (let i = 0; i < dataSort.length; i++) {
            chartData.push(dataSort[i].task_count);
            chartTitleData.push(dataSort[i].name);
          }
          let option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "line" // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: ["发布次数"]
            },
            grid: {
              left: "16px",
              right: "16px",
              bottom: "16px",
              top: "40px",
              containLabel: true
            },
            yAxis: [
              {
                type: "category",
                data: chartTitleData,
                axisLabel: {
                  interval: 0
                }
              }
            ],
            xAxis: [
              {
                type: "value"
              }
            ],
            series: [
              {
                name: "发布次数",
                type: "bar",
                data: chartData
              }
            ]
          };
          let _dom = this.$refs[ref];
          _dom.style.height = data.length * 20 + 200 + "px";
          let myChart = this.echarts_instance.init(_dom);
          myChart.setOption(option);
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" type="text/css" rel="stylesheet/scss">
</style>
