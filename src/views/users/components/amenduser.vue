<template>
  <el-dialog
    title="修改用户信息"
    :visible.sync="dialogVisible"
    width="30%"
    @close="reset"
  >
    <!-- 主体 -->
    <el-form :model="amenduserForm" :rules="rules" ref="userForm" label-width="65px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="amenduserForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="amenduserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="amenduserForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmchange">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { verifyemall, phonecodetest } from "../../../utils/mycheck";
export default {
  data() {
    return {
      // 弹框
      dialogVisible: false,
      amenduserForm: {
        username: "",
        email: "",
        mobile: "",
        id: ""
      },
      rules: {
        email: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: verifyemall, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: phonecodetest, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    confirmchange() {
      // window.console.log(this.amenduserForm.id);
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.$axios({
            url: `users/${this.amenduserForm.id}`,
            method: "put",
            data: {
              email: this.amenduserForm.email,
              mobile: this.amenduserForm.mobile
            }
          }).then(res => {
            // window.console.log(res);
            if (res.data.meta.status === 200) {
              this.dialogVisible = false;
              this.$message.success(res.data.meta.msg);
              this.$parent.getuesrdata();
            } else {
              this.$message.error(res.data.meta.msg);
            }
          });
        } else {
          this.$message.error("验证不通过");
        }
      });
    },
    reset() {
      this.$refs.userForm.resetFields();
    }
  }
};
</script>

<style>
</style>