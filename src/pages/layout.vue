<template>
  <el-container>
    <el-aside width="200px">
      <asided></asided>
    </el-aside>
    <el-container>
      <el-header height="75px">
        admin
        <el-dropdown placement="top">
          <i class="el-icon-setting" style="display:block"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>退出</el-dropdown-item>
            <el-dropdown-item>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import asided from "./aside";
export default {
  components: {
    asided
  }
};
</script>
<style lang='stylus'>
body {
  overflow-y: scroll;
  overflow-x: hidden;
}

body> .el-container {
  margin-bottom: 40px;
  width: 1356px;
}

.el-main {
  background-color: #e5e5e5;
  color: #666;
  text-align: left;
  width: 1156px;
}

* {
  padding: 0;
  margin: 0;
}

.el-aside {
  background-color: #20222a;
  color: #ffffff;
  text-align: center;
  overflow: hidden;
  height: 1000px;
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
</style>
