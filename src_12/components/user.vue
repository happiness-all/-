<template>
  <div id="users">
    <header>
      <h3>
        首页
        <span>/管理员管理</span>
      </h3>
      <el-button type="primary" size="80*80">创建用户</el-button>
    </header>
    <el-table :data="tableData" border default-expand-all style="width: 100%" :load="load" lazy>
      <el-table-column prop="code" label="用户编号" width="280">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="角色" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.roles}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="admin" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.admin}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="times" label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.times}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <el-button type="success">启用</el-button>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="1"></el-pagination>
  </div>
</template>
<script>
import moment from "moment-js";
export default {
  data() {
    return {
      tableData: [
        {
          //目前为止id为1的时候设置成功
          admin: "admin",
          roles: "系统管理员",
          code: "7f",
          times: moment().format("YYYY-MM-DD HH:mm")
        }
      ]
    };
  },
  methods: {
    handleEdit(index, row) {},
    handleDelete(index, row) {
      if (index === undefined) {
      } else {
        let info = confirm("你确定要删除这一类目吗？");
        if (info) {
          this.tableData.splice(index, 1);
        }
      }
    },

    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([]);
      }, 1000);
      setTimeout(() => {
        resolve([
          {
            name: "分类管理",
            icon: "王小虎",
            type: "菜单",
            id: 21,
            menus: "/category"
          }
        ]);
      }, 1000);
    }
  }
};
</script>
<style lang="stylus">
#users
  background-color #f9fbf7
  border 1px solid #ddd
  padding 20px 0
  header
    padding 10px
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
header .el-button--primary
  background-color #108f6b
h3
  margin-bottom 30px
  font-family '新宋体'
  span
    font-weight normal
    color #606266
</style>