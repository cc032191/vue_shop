<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt />
      </div>
      <!-- 登录区域 -->
      <el-form
        ref="loginref"
        :rules="loginrules"
        :model="loginform"
        label-width="0"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            placeholder="请输入用户名"
            v-model="loginform.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            placeholder="请输入密码"
            show-password
            v-model="loginform.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            :plain="true"
            @click="registerlogin"
            @keyup.enter="registerlogin"
          >登录</el-button>
          <el-button type="info" @click="resetlogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义密码效验规则
    let custompassword = (rule, value, callback) => {
      // 定义正则表达式
      let reg = /^\w+$/;
      if (reg.test(value)) {
        // 如果通过就接着执行
        callback();
      } else {
        // 如果不通过就显示提示信息
        callback(new Error("密码格式不正确"));
      }
    };
    return {
      // 登录表单数据对象
      loginform: {
        username: "admin",
        password: "123456"
      },
      // 登录表单验证对象
      loginrules: {
        username: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur"
          },
          { validator: custompassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 登录验证
    registerlogin() {
      this.$refs.loginref.validate(async valid => {
        // window.console.log(valid)
        // 如果为false的话  就return
        if (!valid) return;
        // 第一种方法:
        // 如果返回的是一个Promise,可以用await  async来简化
        // 在请求前面加await     在最近的函数前面加async来修饰
        // let result =await this.$axios.post("login", this.loginform);
        // console.log(result);
        // 第二种方法:
        this.$axios.post("login", this.loginform).then(res => {
          // console.log(res);
          // 结构赋值给data
          // const { data } = res;
          // console.log(data);
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg);
          this.$message.success(res.data.meta.msg);
          // 保存token   只应在打开期间生效  所以保存在sessionStorage中
          window.sessionStorage.setItem("token", res.data.data.token);
          // 页面跳转到home页面
          this.$router.push("/home");
        });
        // 第三种方法
        // this.$axios({
        //   url: "login",
        //   method: "post",
        //   data: this.loginform
        // }).then(res => {
        //   window.console.log(res);
        // }).catch(err => {
        // console.log(err);
        // });;
      });
    },
    // 重置
    resetlogin() {
      this.$refs.loginref.resetFields();
    }
  }
};
</script >

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    // position: absolute;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%,-50%);
    position: relative;
    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      background-color: #fff;
      box-shadow: 0 0 10px #ddd;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>