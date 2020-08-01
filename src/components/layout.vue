<template>
  <el-container>
    <el-aside width="200px">
      <asided></asided>
    </el-aside>
    <el-container>
      <el-header height="75px">
        admin
        <i class="el-icon-setting"></i>
      </el-header>
      <el-main>
        <h3>
          首页
          <span>/菜单列表</span>
        </h3>
        <div>
          <el-button type="primary" size="80*80">添加</el-button>
        </div>
        <maintable />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import asided from "./aside";
import maintable from "./main_table";
export default {
  components: {
    asided,
    maintable
  }
};
</script>
<style lang="" >
* {
  padding: 0;
  margin: 0;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: right;
  line-height: 75px;
  font-size: 16px;
  width: 1156px;
  margin-right: 40px;
}
.el-aside {
  background-color: #20222a;
  color: #ffffff;
  text-align: center;
  overflow: hidden;
  height: 760px;
}

.el-main {
  background-color: #e5e5e5;
  color: #666;
  text-align: left;
  width: 1156px;
}

.el-main h3 span {
  font-weight: normal;
  color: #606266;
}
.el-main h3 {
  margin-bottom: 30px;
}
body > .el-container {
  margin-bottom: 40px;
  width: 1356px;
}
</style>
