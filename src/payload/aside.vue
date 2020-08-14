<template>
  <el-aside :width="isCollapse?'64px':'200px'">
    <el-col :span="12">
      <div class="title">
        <h5 v-show="!isCollapse">后台管理系统</h5>
      </div>
      <el-menu
        :default-active="this.$route.path"
        background-color="#20222a"
        text-color="#fff"
        active-text-color="#409eff"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <div class="toggle-button" @click="isCollapse=!isCollapse">
          <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
        </div>
        <el-submenu :index="(index+1).toString()" v-for="(item,index) in menuList" :key="index">
          <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span slot="title">{{item.authName}}</span>
          </template>
          <el-menu-item-group v-for="(item1,ind) in item.children" :key="ind">
            <el-menu-item :index=" '/'+item1.path">
              <i class="el-icon-menu"></i>
              {{item1.authName}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-aside>
</template>
<script>
export default {
  data() {
    // 在渲染页面前就需要挂载数据对象
    return {
      menuList: "",
      iconsObj: {
        "125": "iconfont el-icon-user-solid",
        "103": "iconfont el-icon-s-grid",
        "101": "iconfont el-icon-s-management",
        "102": "iconfont el-icon-s-order",
        "145": "iconfont el-icon-s-data"
      },
      isCollapse: false
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    //获取所有的菜单
    getMenuList() {
      this.$axios
        .get("menus")
        .then(response => {
          const res = response.data;
          if (res.meta.status === 200) {
            this.menuList = res.data;
          } else {
            this.$message.error(res.meta.msg);
          }
        })
        .catch(() => {
          this.$message.error("获取失败");
        });
    }
  }
};
</script>
<style lang='stylus'>
.el-submenu__title
  font-size 16px
  text-align left
.title
  height 60px
.el-col h5
  margin 30px 0 0
.el-menu
  border none
.el-col-12
  width 200px
.el-col-12 h5
  font-size 20px
a
  text-decoration none
  color #fff
.el-menu-item
  font-size 16px
.toggle-button
  background-color #4a5064
  font-size 20px
  font-weight bold
  letter-spacing 0.3em
  text-align center
  color #fff
  cursor pointer
  line-height 30px
</style>