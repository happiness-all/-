<template>
  <div id="users">
    <header>
      <!-- 面包屑管理区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: this.$route.path }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <!-- 卡片管理 -->
    <el-card>
      <el-table :data="rightsData" border style="width: 100%" lazy stripe>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level=='0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level=='1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level=='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页管理 -->
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-size="10"
          :total="total"
          :page-sizes="[10]"
          layout=" prev, pager, next"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      rightsData: [],
      currPage: 1,
      total: 48
    };
  },
  created() {
    this.getRights();
  },
  methods: {
    async getRights() {
      let { data: res } = await this.$axios.get("rights/list ");
      if (res.meta.status == 200) {
        this.tableData = res.data;
        this.total = this.tableData.length;
        // 这是前端分页的最重要一点，就是截取想要的数据项
        this.rightsData = this.tableData.slice(
          (this.currPage - 1) * 10,
          this.currPage * 10
        );
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getRights();
    }
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
  .el-pager li:not(.disabled).active
    background-color #8dd35f
  .el-pagination
    text-align right
  .el-card
    box-shadow 0 1px 1px rgba(0, 0, 0, 0.15)
</style>