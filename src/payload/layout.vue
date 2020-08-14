<template>
  <el-container>
    <asided></asided>
    <el-container>
      <el-header height="60px">
        admin
        <el-dropdown placement="top" @command="handleCommand">
          <i class="el-icon-setting" style="display:block;color:#fff;font-size:20px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command>退出</el-dropdown-item>
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
import axios from "axios";
export default {
  components: {
    asided
  },

  methods: {
    handleCommand() {
      // 清空token并返回登录页
      window.sessionStorage.clear();
      this.$router.replace("/login");
    }
  }
};
</script>
<style lang='stylus'>
body
  overflow-y scroll
  overflow-x auto
  min-width 1366px
body> .el-container
  margin-bottom 40px
.el-main
  background-color #eaedf1
  color #666
  text-align left
*
  padding 0
  margin 0
.el-aside
  background-color #20222a
  color #ffffff
  text-align center
  overflow hidden
  min-height 800px
.el-header
  background-color #373d41
  color #333
  text-align right
  line-height 60px
  font-size 16px
</style>
