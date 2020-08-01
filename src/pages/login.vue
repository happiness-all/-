<template>
  <div class="logined">
    <h3>登&nbsp;录</h3>
    <el-form
      :model="ruleForm"
      :rules="rules"
      status-icon
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label prop="user">
        <el-input v-model="ruleForm.user" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label prop="pwd">
        <el-input type="password" v-model="ruleForm.pwd" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登&nbsp;录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        user: "",
        pwd: "",
        delivery: false,
        type: []
      },
      rules: {
        user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 5 个字符", trigger: "blur" },
          {
            pattern: /^([a-z]|\d|_)+$/i,
            message: "用户名必须是字母、数字和下划线组合",
            trigger: "blur"
          }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^([a-z]|\d)+$/i,
            message: "密码必须是字母、数字组合",
            trigger: "blur"
          },
          { min: 6, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm.user);
          console.log(this.ruleForm.pwd);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
};
</script>
<style lang="stylus">
* {
  padding: 0;
  margin: 0;
}

body, html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);

  .logined {
    width: 260px;
    height: 240px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -220px;
    margin-top: -140px;

    h3 {
      color: #fff;
      font-family: serif;
      margin-bottom: 15px;
      font-size: 30px;
      text-align: right;
    }

    .el-input {
      width: 220px;
    }

    .el-form {
      margin-left: 0;
    }

    .el-button {
      width: 220px;
    }
  }
}
</style>