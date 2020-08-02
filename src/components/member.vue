<template>
  <div id="users">
    <header>
      <h3>
        首页
        <span>/会员列表</span>
      </h3>
    </header>
    <el-table :data="tableData" border default-expand-all style="width: 100%" :load="load" lazy>
      <el-table-column prop="mininame" label="昵称">
        <template slot-scope="scope">
          <span>{{scope.row.mininame}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="times" label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.times}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
          mininame: "小明",
          times: moment().format("YYYY-MM-DD HH:mm"),
          phone: 13326578867
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
#users {
  background-color: #f9fbf7;
  border: 1px solid #ddd;
  padding: 20px 0;

  header {
    padding: 10px;
    padding-bottom: 20px;
  }

  .el-table {
    margin-bottom: 20px;
  }

  .cell {
    text-align: center;
    font-weight: normal;
  }

  .el-pager li:not(.disabled).active {
    background-color: #8dd35f;
  }

  .el-pagination {
    text-align: right;
  }
}

header .el-button--primary {
  background-color: #108f6b;
}

h3 {
  margin-bottom: 30px;
  font-family: '宋体';

  span {
    font-weight: normal;
    color: #606266;
  }
}
</style>