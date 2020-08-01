<template>
  <div id="app">
    <el-table
      ref="tabletree"
      size="mini"
      :data="data"
      :height="tableheight"
      row-key="code"
      border
      v-loading="loading"
      lazy
      :load="list"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" width="300" header-align="center">
        <template slot="header">
          名称
          <el-link type="primary" v-on:click="fold" style="float:right;">折叠全部</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="代码" width="100" align="center"></el-table-column>
      <el-table-column width="200" align="center">
        <template slot="header">
          <el-link type="primary" v-on:click="addRoot">新建项目</el-link>
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <el-link type="primary" v-on:click="addChild(scope.row)">新建子项</el-link>
            <el-link type="warning" v-on:click="edit(scope.row)">修改</el-link>
            <el-link type="danger" v-on:click="del(scope.row.code)">删除</el-link>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column></el-table-column>
    </el-table>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      data: [],
      loading: false,
      tableheight: 500
    };
  },
  methods: {
    list(tree, treeNode, resolve) {
      var that = this;
      this.loading = true;
    },
    fold() {
      var els = this.$el.getElementsByClassName(
        "el-table__expand-icon el-table__expand-icon--expanded"
      );
      for (var i = 0; i < els.length; i++) {
        els[i].click();
      }
    },
    addRoot() {},
    addChild(row) {},
    edit(row) {},
    del(code) {}
  },
  mounted() {
    this.list();
    this.$nextTick(function() {
      this.tableheight = window.innerHeight - 10;
      var self = this;
      window.onresize = function() {
        self.tableheight = window.innerHeight - 10;
      };
    });
  }
};
</script>