<template>
  <div id="users">
    <header>
      <!-- 面包屑管理区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: this.$route.path }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-card>
      <div id="explorer" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
// 1.引入包
import echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  //   基于准备好的dom，初始化echarts实例
  async mounted() {
    let myChart = echarts.init(document.getElementById("explorer"));
    let { data: res } = await this.$axios.get("reports/type/1");
    console.log(res);
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg);
    }
    // 准备数据和配置项
    //合并对象数据
    const options = _.merge(res.data, this.options);
    // 展示数据
    myChart.setOption(options);
  }
};
</script>
<style lang="stylus">
#users
  header
    padding-bottom 20px
  .el-table
    margin-bottom 20px
  .cell
    text-align center
    font-weight normal
  .el-card
    box-shadow 0 1px 1px rgba(0, 0, 0, 0.15)
  .el-button
    margin-bottom 10px
.el-tag
  margin 10px
.bdtop
  border-top 1px solid #eeeeee
.bdbottom
  border-bottom 1px solid #eeeeee
.vcenter
  display flex
  align-items center
</style>