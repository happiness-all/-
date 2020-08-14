<template>
  <div id="users">
    <header>
      <!-- 面包屑管理区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: this.$route.path }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-card>
      <div style="margin:0 0 15px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              clearable
              v-model="userinfo.query"
              @clear="getGoodList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="goodsAdd">添加商品</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="goodsdata" border style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="130px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="110px"></el-table-column>
        <el-table-column prop="upd_time" label="创建时间" width="160px">
          <template slot-scope="scope">
            <span>{{scope.row.upd_time|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="getEditgoods(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页管理 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userinfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="userinfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsdata: [],
      userinfo: {
        query: "",
        pagenum: 5,
        pagesize: 5
      },
      total: 0
    };
  },
  // 获取数据
  created() {
    this.getGoodList();
  },
  methods: {
    async getGoodList() {
      let { data: res } = await this.$axios.get("goods", {
        params: this.userinfo
      });
      if (res.meta.status == 200) {
        //   为商品列表数据赋值
        this.total = res.data.total;
        this.goodsdata = res.data.goods;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    handleCurrentChange(newPage) {
      this.userinfo.pagenum = newPage;
      this.getGoodList();
    },
    handleSizeChange(newSize) {
      this.userinfo.pagesize = newSize;
      this.getGoodList();
    },
    // 删除列表数据
    deleteById(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { data: res } = await this.$axios.delete(`goods/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.getGoodList();
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加商品的导航
    goodsAdd() {
      this.$router.push("/goods/add");
    },
    getEditgoods(id) {
      this.$router.push(`/goods/edit/${id}`);
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
    font-weight normal
  .el-pager li:not(.disabled).active
    background-color #8dd35f
  .el-pagination
    text-align right
  .el-card
    box-shadow 0 1px 1px rgba(0, 0, 0, 0.15)
</style>
