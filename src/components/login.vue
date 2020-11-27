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
      <el-form-item label prop="username">
        <el-input
          v-model="ruleForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          style="width: 100px"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')" style="width: 100px"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //数据请求的对象
      ruleForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 5 个字符", trigger: "blur" },
          {
            pattern: /^([a-z]|\d|_)+$/i,
            message: "用户名必须是字母、数字和下划线组合",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^([a-z]|\d)+$/i,
            message: "密码必须是字母、数字组合",
            trigger: "blur",
          },
          { min: 6, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("login", this.ruleForm)
            .then((res) => {
              let resg = res.data;
              if (resg.meta.status == 200) {
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
                let token = resg.data.token;
                sessionStorage.setItem("token", token);
                this.$forceUpdate();
                this.$router.replace("/index");
              } else {
                this.$message.error("登录失败,请重新输入");
              }
            })
            .catch((err) => console.log(err));
        } else {
          console.log("用户格式不正确");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
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
    width: 320px;
    height: 240px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -220px;
    margin-top: -140px;

    h3 {
      margin-left: 60px;
      color: #fff;
      font-family: serif;
      margin-bottom: 15px;
      font-size: 30px;
      text-align: center;
    }

    .el-input {
      width: 220px;
    }

    .el-form {
      margin-left: 0;
    }
  }
}
</style>