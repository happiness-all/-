<template>
  <div id="users">
    <header>
      <!-- 面包屑管理区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: this.$route.path }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-card>
      <!-- 添加分类管理区域 -->
      <el-button type="primary" @click="addcateList" style="margin-bottom:15px">添加分类</el-button>
      <!-- 必须有列和行 -->
      <tree-table
        :data="cartData"
        :columns="columns"
        :expand-type="false"
        :show-index="true"
        index-text="序号"
        border
        :selection-type="false"
      >
        <template slot="istrue" slot-scope="scope">
          <i class="el-icon-error" style="color:#109997" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-success" style="color:#109997" v-else></i>
        </template>
        <template slot="getorders" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="optioned" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editcatelist(scope.row.cat_id)"
          >编辑</el-button>
          <el-popconfirm
            title="确定删除吗？"
            icon="el-icon-delete"
            @onConfirm="removeCateById(scope.row.cat_id)"
          >
            <el-button size="mini" type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加按钮对话框 -->
    <el-dialog title="添加分类" :visible.sync="catadialogVisible" width="50%" @close="catareset">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <!-- v-model是一个数组 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cateProps"
            @change="handleChange"
            style="width:100%"
            clearable
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="catadialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="catadataSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑按钮对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editdialogVisible" width="50%">
      <el-form :model="editCateForm" ref="editCateFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edidCatesubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cartData: [],
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 表格数据的列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "400px"
        },
        {
          // 标题名
          label: "是否有效",
          // 是否注册成模板及自定义名称
          type: "template",
          template: "istrue",
          minWidth: "50px"
        },
        {
          label: "排序",
          type: "template",
          template: "getorders"
        },
        {
          label: "操作",
          type: "template",
          template: "optioned"
        }
      ],
      catadialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //级联选择器的数据
      parentCateList: [],
      cateProps: {
        expandTrigger: "hover",
        // 显示的内容
        label: "cat_name",
        // 选中的内容
        value: "cat_id",
        children: "children"
      },
      selectedKeys: [],
      //编辑修改
      editdialogVisible: false,
      editCateForm: {
        cat_name: ""
      },
      cateId: 0
    };
  },
  created() {
    this.getCartList();
  },
  methods: {
    //   获取页面的数据
    async getCartList() {
      let { data: res } = await this.$axios.get("categories", {
        params: this.queryinfo
      });
      if (res.meta.status == 200) {
        //   为商品列表数据赋值
        this.cartData = res.data.result;
        this.total = res.data.total;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    // 分页管理
    handleSizeChange(val) {
      this.queryinfo.pagesize = val;
      this.getCartList();
    },
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val;
      this.getCartList();
    },
    async addcateList() {
      let { data: res } = await this.$axios.get("categories", {
        params: {
          type: 2
        }
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.parentCateList = res.data;
      this.catadialogVisible = true;
    },
    catareset() {
      // 监听对话框关闭之后清空数据
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    handleChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_level = this.selectedKeys.length;
        // 最后一个算数的pid
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 添加分类数据请求
    catadataSubmit() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (valid) {
          let { data: res } = await this.$axios.post(
            "categories",
            this.addCateForm
          );
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg);
          }
          this.getCartList();
          this.catadialogVisible = false;
          this.$message.success("添加成功");
        } else {
          console.log("校验失败");
          return false;
        }
      });
    },
    // 获取编辑分类数据
    async editcatelist(id) {
      this.cateId = id;
      let { data: res } = await this.$axios.get(`categories/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.editCateForm = res.data;
      this.editdialogVisible = true;
    },
    // 编辑分类发送
    edidCatesubmit() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (valid) {
          let { data: res } = await this.$axios.put(
            `categories/${this.cateId}`,
            this.editCateForm
          );
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getCartList();
          this.editdialogVisible = false;
          this.$message.success("添加成功");
        } else {
          console.log("校验失败");
          return false;
        }
      });
    },
    // 删除分类
    async removeCateById(id) {
      let { data: res } = await this.$axios.delete(`categories/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success("删除成功");
      this.getCartList();
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