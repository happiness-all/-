<template>
  <div id="users">
    <header>
      <!-- 面包屑管理区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: this.$route.path }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <!-- 卡片管理区域 -->
    <el-card>
      <div style="margin:0 0 15px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model=" userinfo.query"
              clearable
              @clear="getUsers"
            >
              <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" border style="width: 100%" lazy>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              active-color="#2f94fa"
              inactive-color="#e6eaec"
              v-model="scope.row.mg_state"
              @change="switchchange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editUsers(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="opendelete(scope.row.id)"
            ></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="settingRight(scope.row)"
              ></el-button>
            </el-tooltip>
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
      <!-- 添加用户弹窗 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="dialogClose">
        <el-form
          :model="ruleForm"
          :rules="rules"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addusers">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户弹窗 -->
      <el-dialog title="修改用户" :visible.sync="editVisible" width="50%" @close="editClose">
        <el-form
          :model="editForm"
          :rules="editrules"
          status-icon
          ref="editForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editsubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色窗口 -->
      <el-dialog title="分配角色" :visible.sync="settingRightVisible" width="50%" @close="settingClose">
        <div>
          <p>当前的用户：{{userRoleInfo.username}}</p>
          <p>当前的角色：{{userRoleInfo.role_name }}</p>
          <p>
            分配新角色:
            <el-select v-model="selectID" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="settingRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="settingsubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      userinfo: {
        query: "",
        pagenum: 1, //当前的页数
        pagesize: 2 //当前每页显示多少条数据
      },
      total: 0,
      // 添加用户信息
      dialogVisible: false,
      //添加用户信息校验
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 7 个字符", trigger: "blur" },
          {
            pattern: /^([a-z]|\d|_)+$/i,
            message: "用户名必须是字母、数字和下划线组合",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入内容", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^([a-z]|\d){3,8}@[a-z0-9]{2,6}\.(com|cn)$/i,
            message: "邮箱不合法",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/i,
            message: "手机号不合法",
            trigger: "blur"
          },
          { max: 11, message: "输入内容不全", trigger: "blur" }
        ]
      },
      //修改用户信息
      editVisible: false,
      searchuser: "",
      editForm: "",
      editrules: {
        email: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^([a-z]|\d){3,8}@[a-z0-9]{2,6}\.(com|cn)$/i,
            message: "邮箱不合法",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/i,
            message: "手机号不合法",
            trigger: "blur"
          },
          { max: 11, message: "输入内容不全", trigger: "blur" }
        ]
      },
      // 角色基本信息
      settingRightVisible: false,
      userRoleInfo: {},
      roleList: [],
      // 选中数据的id值
      selectID: ""
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      let { data: res } = await this.$axios.get("users", {
        params: this.userinfo
      });
      if (res.meta.status == 200) {
        // 获取后台返回的数据
        this.tableData = res.data.users;
        this.total = res.data.total;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    // 监听页数据改变
    handleCurrentChange(newPage) {
      this.userinfo.pagenum = newPage;
      this.getUsers();
    },
    // 监听pagesize数据改变
    handleSizeChange(newSize) {
      // 修改pagesize请求
      this.userinfo.pagesize = newSize;
      this.getUsers();
    },
    // 监听switch开关的变化
    async switchchange(roleinfos) {
      let { data: res } = await this.$axios.put(
        `users/${roleinfos.id}/state/${roleinfos.mg_state}`
      );
      if (res.meta.status == 200) {
        this.$message.success(res.meta.msg);
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    dialogClose() {
      this.$refs.ruleForm.resetFields();
    },
    // 用户信息校验并发送请求
    addusers() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let { data: res } = await this.$axios.post("users", this.ruleForm);
          if (res.meta.status == 201) {
            this.$message.success("添加用户成功");
            this.getUsers();
            this.dialogVisible = false;
          }
        } else {
          this.$message.error("添加用户失败");
        }
      });
    },
    // 修改用户信息
    editClose() {
      this.$refs.editForm.resetFields();
    },
    async editUsers(id) {
      let { data: res } = await this.$axios.get(`users/${id}`);
      if (res.meta.status == 200) {
        this.editForm = res.data;
        this.editVisible = true;
      }
    },
    // 修改发送
    editsubmit() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let { data: res } = await this.$axios.put(
            `users/${this.editForm.id}`,
            { email: this.editForm.email, mobile: this.editForm.mobile }
          );
          console.log(res);
          if (res.meta.status == 200) {
            this.getUsers();
            this.editVisible = false;
            this.$message.success("修改用户成功");
          } else {
            this.$message.error(res.meta.msg);
          }
        } else {
          this.$message.error("校验失败");
        }
      });
    },
    //触发删除
    opendelete(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { data: res } = await this.$axios.delete(`users/${id}`);
          if (res.meta.status == 200) {
            this.getUsers();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分配角色的窗口
    settingClose() {
      this.userRoleInfo = {};
      this.selectID='';
    },
    async settingRight(userinfo) {
      this.userRoleInfo = userinfo;
      let { data: res } = await this.$axios.get("roles");
      if (res.meta.status != 200) {
        return this, $message.error(res.meta.msg);
      }
      this.roleList = res.data;
      this.settingRightVisible = true;
    },
    async settingsubmit() {
      if (!this.selectID) {
        return this.$message.error("请选择要分配的角色");
      }
      let {data:res} = await this.$axios.put(`users/${this.userRoleInfo.id}/role`,{rid:this.selectID})
      if (res.meta.status != 200) {
        return this, $message.error(res.meta.msg);
      }
     this.getUsers();
      this.settingRightVisible = false;
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