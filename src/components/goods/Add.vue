<template>
  <div id="users">
    <header>
      <!-- 面包屑管理区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: this.$route.path }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品添加</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <el-steps :active="(activeIndex-0)" :space="200" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="Addform" label-position="top" :rules="rules" ref="addform">
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTagsLeave"
          @tab-click="tagChecked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="Addform.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="Addform.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="Addform.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="Addform.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 绑定到显示的选中的东西 -->
              <el-cascader
                v-model="Addform.goods_cat"
                :options="cateList"
                expandTrigger="hover"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 多选框 的特性 -->
            <el-form-item :label="item.attr_name" v-for="item in getSetting" :key="item.id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1 ,i) in item.attr_vals " :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 直接一个form表单就完成了 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in  onlyTableDate"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headers"
              :on-success="successFile"
              list-type="picture"
            >
              <el-dialog
                title="图片预览"
                :visible.sync="dialogVisible"
                width="50%"
                style="text-align:left;font-weight:bold"
              >
                <img :src="previmgURL" alt class="previmg" />
              </el-dialog>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="Addform.goods_introduce"></quill-editor>
            <el-button type="primary" @click="preventUP" style="margin-top:15px">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0",
      Addform: {
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_name: "",
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cart: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      // 获取选择项的内容
      cateList: [],
      cateProps: {
        // 显示的内容
        label: "cat_name",
        // 选中的内容
        value: "cat_id",
        children: "children"
      },
      // 获取参数内容
      getSetting: [],
      onlyTableDate: [],
      // 图片上传的参数
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      headers: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previmgURL: "",
      dialogVisible: false
    };
  },
  computed: {
    cateId() {
      if (this.Addform.goods_cat.length === 3) {
        return this.Addform.goods_cat[2];
      }
    }
  },
  created() {
    this.getGoodList();
  },
  methods: {
    async getGoodList() {
      let { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.cateList = res.data;
    },
    handleChange() {
      // 只允许选中三级选项时显示获取id类名
      if (this.Addform.goods_cat.length !== 3) {
        this.Addform.goods_cat = [];
      }
    },
    // 在离开基本信息前做好切换
    beforeTagsLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.Addform.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    //在选择条被选中的时候触发
    async tagChecked() {
      if (this.activeIndex === "1") {
        let { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取数据失败");
        }
        this.getSetting = res.data;
        this.getSetting.forEach(item => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(",");
        });
      }
      if (this.activeIndex === "2") {
        let { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取数据失败");
        }
        this.onlyTableDate = res.data;
      }
    },
    // 图片上传的相关函数
    // 图片预览
    handlePreview(file) {
      this.previmgURL = file.response.data.url;
      this.dialogVisible = true;
    },
    // 图片上传
    handleRemove(files) {
      let removepath = files.response.data.tmp_path;
      // 获取将要删除的图片的临时路径 从pics数组中，找到这个对应的索引值，调用数组的splice方法，把图片信息对象，从pics数组中移出
      let i = this.Addform.pics.findIndex(x => x.pic == removepath);
      this.Addform.pics.splice(i, 1);
    },
    successFile(response) {
      let files = { pic: response.data.tmp_path };
      this.Addform.pics.push(files);
    },
    // 准备上传
    preventUP() {
      this.$refs.addform.validate(async valid => {
        if (valid) {
          // 深复制
          const form = _.cloneDeep(this.Addform);
          form.goods_cat = form.goods_cat.join(",");
          // 处理动态参数
          this.getSetting.forEach(item => {
            let newinfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" ")
            };
            this.Addform.attrs.push(newinfo);
          });
          // 处理静态属性
          this.onlyTableDate.forEach(item => {
            let newinfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.Addform.attrs.push(newinfo);
          });
          form.attrs = this.Addform.attrs;
          // 发送请求
          let { data: res } = await this.$axios.post("goods", form);
          if (res.meta.status !== 201) {
            return  this.$message.error(res.meta.msg);
          }
          this.$message.success("添加商品成功");
          this.$router.push('/goods')
        } else {
          this.$message.error("表单必填项没有填完整");
        }
      });
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
  .el-steps
    margin 15px 0
  .el-step__title
    font-size 13px
  .el-checkbox
    margin 0 10px 0 0
  .previmg
    width 100%
.ql-editor
  min-height 300px
</style>
