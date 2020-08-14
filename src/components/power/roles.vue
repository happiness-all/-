<template>
  <div id="users">
    <header>
      <!-- 面包屑管理区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: this.$route.path }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-card>
      <!-- 添加角色管理区域 -->
      <el-button type="primary" @click="dialogVisible=true">添加角色</el-button>
      <el-table :data="rolesData" border style="width: 100%" lazy>
        <!-- 展开列 -->
        <el-table-column type="expand" label>
          <template slot-scope="scope">
            <!-- 渲染一级权限数据 -->
            <el-row
              v-for="(item1,i1) in  scope.row.children"
              :key="item1.id"
              :class="['bdbottom',i1==0?'bdtop':'','vcenter']"
              closable
              @close="rolesDelete(scope.row,item1.id)"
            >
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限数据 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2==0?'':'bdtop','vcenter']"
                  closable
                  @close="rolesDelete(scope.row,item2.id)"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级数据渲染 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="rolesDelete(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editroles(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteroles(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRight(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色弹框区域 -->
      <!-- 添加用户弹窗 -->
      <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%" @close="dialogClose">
        <el-form
          :model="ruleForm"
          :rules="rules"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="ruleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addroles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户弹窗 -->
      <el-dialog title="修改角色" :visible.sync="editVisible" width="50%" @close="editClose">
        <el-form
          :model="editForm"
          :rules="editrules"
          status-icon
          ref="editForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editroleinfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限弹框 -->
      <el-dialog title="分配权限" :visible.sync="setRightVisible" width="30%" @click="setRightClose">
        <el-tree
          :data="setRightData"
          :props="treeProps"
          show-checkbox
          node-key="id"
          ref="treeRights"
          default-expand-all
          :default-checked-keys="defkeys"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="allRightroles">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import moment from "moment-js";
export default {
  data() {
    return {
      rolesData: [],
      // 添加角色信息
      dialogVisible: false,
      ruleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 修改用户信息
      editForm: {
        roleName: "",
        roleDesc: ""
      },
      editVisible: false,
      editrules: {
        roleName: [
          { required: true, message: "请输入内容", trigger: "blur" },
          { min: 2, max: 8, message: "输入内容不全", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入内容", trigger: "blur" },
          { min: 2, max: 8, message: "输入内容不全", trigger: "blur" }
        ]
      },
      rules: {
        roleName: [
          { required: true, message: "请输入内容", trigger: "blur" },
          { min: 2, max: 8, message: "输入内容不全", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入内容", trigger: "blur" },
          { min: 2, max: 8, message: "输入内容不全", trigger: "blur" }
        ]
      },
      // 树形结构数据
      setRightData: [],
      treeProps: {
        children: "children",
        label: "authName"
      },
      setRightVisible: false,
      defkeys: [],
      // 即将获取授权的角色的id
      rightrole: ""
    };
  },
  created() {
    this.getroles();
  },
  methods: {
    // 渲染页面数据
    async getroles() {
      let { data: res } = await this.$axios.get("roles");
      if (res.meta.status != 200) {
        this.$message.error(res.meta.msg);
      }
      this.rolesData = res.data;
    },
    // 添加用户角色信息
    addroles() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let { data: res } = await this.$axios.post("roles", this.ruleForm);
          if (res.meta.status != 201) {
            this.$message.error("添加失败");
          }
          this.$message.success("添加成功");
          this.getroles();
          this.dialogVisible = false;
        } else {
          this.$message.error("校验失败");
        }
      });
    },
    dialogClose() {
      this.$refs.ruleForm.resetFields();
    },
    // 修改用户信息
    editClose() {
      this.$refs.editForm.resetFields();
    },
    async editroles(id) {
      let { data: res } = await this.$axios.get(`roles/${id}`);
      if (res.meta.status == 200) {
        this.editForm = res.data;
        this.editVisible = true;
      }
    },
    editroleinfo() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let { data: res } = await this.$axios.put(
            `roles/${this.editForm.roleId}`,
            {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc
            }
          );
          console.log(this.editForm);
          console.log(res);
          if (res.meta.status == 200) {
            this.getroles();
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
    deleteroles(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { data: res } = await this.$axios.delete(`roles/${id}`);
          if (res.meta.status == 200) {
            this.getroles();
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
    rolesDelete(role, rightid) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { data: res } = await this.$axios.delete(
            `roles/${role.id}/rights/${rightid}`
          );
          if (res.meta.status == 200) {
            // this.getroles();
            // 不要整体渲染数据，会关闭当前打开的窗口
            // 只渲染获取的children部分
            role.children = res.data;
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
    // 获取树形结构数据
    async showRight(role) {
      let { data: res } = await this.$axios.get("rights/tree");
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
      }
      // 把获取到的数据保存在data中
      this.setRightData = res.data;
      this.getLeafKeys(role, this.defkeys);
      this.setRightVisible = true;
      this.rightrole = role.id;
    },
    // 通过递归的形式获取所有三级权限的id
    getLeafKeys(node, arr) {
      // 如果当前node节点中不包含children属性，则为三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听关闭之后所有分配的数据是否清空
    setRightClose() {
      this.defkeys = [];
    },
    async allRightroles() {
      let keys = [
        ...this.$refs.treeRights.getCheckedKeys(),
        ...this.$refs.treeRights.getHalfCheckedKeys()
      ];
      let rightstr = keys.join(",");
      let { data: res } = await this.$axios.post(
        `roles/${this.rightrole}/rights`,
        {
          rids: rightstr
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
      }
      this.getroles();
      this.setRightVisible = false;
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
  .el-card
    box-shadow 0 1px 1px rgba(0, 0, 0, 0.15)
  .el-button
    margin-bottom 10px
.el-tag
  margin 10px
.bdtop
  border-top 1px solid #eeeeee
.bdbottom
  border-bottom 1px solid #eeeeee
.vcenter
  display flex
  align-items center
</style>