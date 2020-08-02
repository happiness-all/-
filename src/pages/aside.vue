<template>
  <el-col :span="12">
    <h5>后台管理系统</h5>
    <el-menu
      default-active
      @open="handleOpen"
      @close="handleClose"
      background-color="#20222a"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </template>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">系统设置</span>
        </template>
        <el-menu-item-group>
          <router-link to="/menu">
            <el-menu-item index="1-1">菜单管理</el-menu-item>
          </router-link>
          <router-link to="/role">
            <el-menu-item index="1-2">角色管理</el-menu-item>
          </router-link>
          <router-link to="/user">
            <el-menu-item index="1-3">管理员管理</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span slot="title">商城管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/category">
            <el-menu-item index="2-1">商品分类</el-menu-item>
          </router-link>
          <router-link to="/specs">
            <el-menu-item index="2-2">商品规格</el-menu-item>
          </router-link>
          <router-link to="/goods">
            <el-menu-item index="2-3">商品管理</el-menu-item>
          </router-link>
          <router-link to="/member">
            <el-menu-item index="2-4">会员管理</el-menu-item>
          </router-link>
          <router-link to="/banner">
            <el-menu-item index="2-5">轮播图管理</el-menu-item>
          </router-link>
          <router-link to="/seckill">
            <el-menu-item index="2-6">秒杀活动</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-col>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang='stylus'>
.el-submenu__title {
  font-size: 16px;
}

.el-col h5 {
  margin: 30px 0;
}

.el-menu {
  border: none;
}

.el-col-12 {
  width: 200px;
}

.el-col-12 h5 {
  font-size: 16px;
}

a {
  text-decoration: none;
  color: #fff;
}

.el-menu-item {
  font-size: 16px;
}
</style>