<template>
  <div id="users">
    <header>
      <!-- 面包屑管理区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: this.$route.path }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>选择商品分类：
      <!-- 选中的时候的数据值 -->
      <el-cascader
        v-model="selectkeys"
        :options="cataoptions"
        :props="csscaderProps"
        expandTrigger="hover"
        style="width:300px;margin:15px;"
        @change="getcates"
      ></el-cascader>
      <!-- 静态参数 和动态参数-->
      <el-tabs v-model="activeName" @tab-click="getcates">
        <el-tab-pane label="动态参数" name="many">
          <!-- 动态参数添加 -->
          <el-button
            type="primary"
            @click="addcatadialogVisible=true"
            style="margin-bottom:15px"
            :disabled="isBtndisabled"
          >添加参数</el-button>
          <el-table :data="acitvetableData" border stripe style="width: 100%">
            <el-table-column type="expand" width="50px">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(item,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleTagClose(scope.row,i)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputTagValue"
                  v-model="scope.row.inputvals"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column prop="cat_id" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editshowcate(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParamsById(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性添加 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            @click="addcatadialogVisible=true"
            style="margin-bottom:15px"
            :disabled="isBtndisabled"
          >添加属性</el-button>
          <el-table :data="statictableData" border stripe style="width: 100%">
            <el-table-column type="expand" width="50px">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(item,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleTagClose(scope.row,i)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputTagValue"
                  v-model="scope.row.inputTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column prop="cat_id" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editshowcate(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParamsById(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 静态属性和动态属性的添加 -->
    <el-dialog
      :title="'添加'+addText"
      :visible.sync="addcatadialogVisible"
      width="50%"
      @close="addcatareset"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="80px"
      >
        <el-form-item :label="addText" prop="attr_name">
          <el-input v-model="addCateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcatadialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="catadataSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 静态属性和动态属性编辑 -->
    <el-dialog
      :title="'编辑'+addText"
      :visible.sync="editcatadialogVisible"
      width="50%"
      @close="editcatareset"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="80px"
      >
        <el-form-item :label="addText" prop="attr_name">
          <el-input v-model="editCateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editcatadialogVisible = false">取 消</el-button>
        <el-button type="primary" @click=" editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      csscaderProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      cataoptions: [],
      selectkeys: [],
      //   动态参数数据
      acitvetableData: [],
      statictableData: [],
      //   获取参数数据
      activeName: "many",
      //   添加属性
      addcatadialogVisible: false,
      addCateForm: {
        attr_name: "",
        attr_vals: ""
      },
      addCateFormRules: {
        attr_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 编辑动态属性
      editcatadialogVisible: false,
      editCateForm: {
        attr_name: "",
        attr_vals: ""
      },
      editCateFormRules: {
        attr_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    isBtndisabled() {
      if (this.selectkeys.length === 0) {
        return true;
      } else {
        return false;
      }
    },
    //  三级分类的id
    cateid() {
      if (this.selectkeys.length !== 3) {
        return false;
      } else {
        return this.selectkeys[2];
      }
    },
    addText() {
      if (this.activeName == "only") {
        return "静态属性";
      } else {
        return "动态参数";
      }
    }
  },
  created() {
    this.getCataList();
  },
  methods: {
    async getCataList() {
      let { data: res } = await this.$axios.get("categories");
      if (res.meta.status == 200) {
        //   为商品列表数据赋值
        this.cataoptions = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    //级联静动态参数获取
    // 级联参数发生变化的时候就调用
    async getcates() {
      if (this.selectkeys.length !== 3) {
        return false;
      }
      let { data: res } = await this.$axios.get(
        `categories/${this.cateid}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        //   为商品列表数据赋值
        return this.$message.error(res.meta.msg);
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals == "" ? [] : item.attr_vals.split(" ");
        // 添加属性框的按钮
        // 避免一个改变全部改变
        item.inputTagValue = false;
        item.inputvals = "";
      });
      if (this.activeName === "many") {
        this.acitvetableData = res.data;
      } else {
        this.statictableData = res.data;
      }
    },
    // 动态参数编辑按钮
    editcatareset() {
      this.$refs.editCateFormRef.resetFields();
    },
    editshowcate(paramsInfo) {
      //paramsInfo中没有对象，直接深拷贝一份，也没必要从服务端重新获取了
      //如果直接赋值，则为引用，表格上的数据也会随对话框中数据的修改而实时改变
      this.editCateForm = { ...paramsInfo };
      this.editcatadialogVisible = true;
    },
    // 编辑数据添加
    editParams() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (valid) {
          let { data: res } = await this.$axios.put(
            `categories/${this.cateid}/attributes/${this.editCateForm.attr_id}`,
            {
              attr_name: this.editCateForm.attr_name,
              attr_sel: this.activeName
            }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("修改失败");
          }
          this.getcates();
          this.editcatadialogVisible = false;
        } else {
          this.$message.error("请正确填写信息");
        }
      });
    },
    // 添加数据请求
    catadataSubmit() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (valid) {
          let { data: res } = await this.$axios.post(
            `categories/${this.cateid}/attributes`,
            {
              attr_name: this.addCateForm.attr_name,
              attr_sel: this.activeName
            }
          );
          if (res.meta.status !== 201) {
            return this.$message.error("添加失败");
          }
          this.addcatadialogVisible = false;
          this.$message.success(res.meta.msg);
          this.getcates();
        } else {
          this.$message.error("请正确填写信息");
        }
      });
    },
    addcatareset() {
      this.$refs.addCateFormRef.resetFields();
    },
    // 静态属性删除按钮
    removeParamsById(id) {
      this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { data: res } = await this.$axios.delete(
            `categories/${this.cateid}/attributes/${id}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getcates();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //确定添加tag
    handleInputConfirm(row) {
      if (row.inputvals.trim().length === 0) {
        // 如果检验不合格的时候就直接清空数据
        row.inputvals = "";
        row.inputTagValue = false;
        return;
      }
      row.attr_vals.push(row.inputvals);
      row.inputvals = "";
      row.inputTagValue = false;
      this.saveInputvals(row);
    },
    // 添加tag的数据请求
    async saveInputvals(row) {
      let { data: res } = await this.$axios.put(
        `categories/${this.cateid}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success("更新成功");
    },
    // tag-input的显示与隐藏
    showInput(row) {
      row.inputTagValue = true;
    },
    // 删除tag
    handleTagClose(row, i) {
      row.attr_vals.splice(i, 1);
      this.saveInputvals(row);
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
  .el-tag
    margin 10px 10px 0 0
  .el-table .el-input
    width 100px
</style>