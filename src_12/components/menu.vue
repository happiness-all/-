<template>
  <div>
    <h3>
      首页
      <span>/菜单列表</span>
    </h3>
    <el-button type="primary" size="80*80">添加</el-button>
    <el-table
      :data="tableData"
      row-key="id"
      border
      default-expand-all
      style="width: 100%"
      :load="load"
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="icon" label="图标" width="180">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="types" label="类型">
        <template slot-scope="scope">
          <el-button type="success" plain>{{scope.row.type}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="排序"></el-table-column>
      <el-table-column prop="menus" label="菜单URL"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          //目前为止id为1的时候设置成功
          name: "系统设置",
          icon: "el-icon-setting",
          type: "目录",
          id: 1,
          menus: "",
          children: [
            {
              name: "菜单管理",
              icon: "",
              type: "菜单",
              id: 13,
              menus: "/menu"
            },
            {
              name: "角色管理",
              icon: "",
              type: "菜单",
              id: 14,
              menus: "/role"
            },
            {
              name: "管理员管理",
              icon: "",
              type: "菜单",
              id: 15,
              menus: "/user"
            }
          ]
        },
        {
          name: "商城管理",
          icon: "el-icon-goods",
          type: "目录",
          id: 2,
          menus: "",
          children: [
            {
              name: "商品分类",
              icon: "",
              type: "菜单",
              id: 21,
              menus: "/category"
            },
            {
              name: "商品规格",
              icon: "",
              type: "菜单",
              id: 22,
              menus: "/specs"
            },
            {
              name: "商品管理",
              icon: "",
              type: "菜单",
              id: 23,
              menus: "/goods"
            },
            {
              name: "会员管理",
              icon: "",
              type: "菜单",
              id: 24,
              menus: "/member"
            },
            {
              name: "轮播图管理",
              icon: "",
              type: "菜单",
              id: 25,
              menus: "/banner"
            },
            {
              name: "秒杀活动",
              icon: "",
              type: "菜单",
              id: 26,
              menus: "/seckill"
            }
          ]
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
        resolve([
          {
            name: "菜单管理",
            icon: "王小虎",
            type: "菜单",
            id: 13,
            menus: "/menu"
          },
          {
            name: "角色管理",
            icon: "王小虎",
            type: "菜单",
            id: 14,
            menus: "/role"
          },
          {
            name: "管理员管理",
            icon: "王小虎",
            type: "菜单",
            id: 15,
            menus: "/user"
          }
        ]);
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
.cell
  text-align center
  font-weight normal
h3
  margin-bottom 30px
  font-family '新宋体'
  span
    font-weight normal
    color #606266
</style>