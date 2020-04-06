<template>
  <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%">
    <!-- 主体区域 -->
    <el-form :model="userForm" :rules="rules" ref="userForm" label-width="65px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="userForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="canceldialog">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  passwordtest,
  usernametext,
  verifyemall,
  phonecodetest,
} from '../../../utils/mycheck'
export default {
  data() {
    return {
      // 弹框控件
      dialogVisible: false,
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      rules: {
        username: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: usernametext, trigger: 'blur' },
        ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
          { validator: passwordtest, trigger: 'blur' },
        ],
        email: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: verifyemall, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: phonecodetest, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 验证表单
    submitForm() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$axios.post('users', this.userForm).then((res) => {
            // window.console.log(res);
            if (res.data.meta.status === 201) {
              this.$message.success(res.data.meta.msg)
              this.dialogVisible = false
              this.$parent.getuesrdata()
              // 表单重置
              this.$refs.userForm.resetFields()
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        } else {
          this.$message.error('验证不通过')
        }
      })
    },
    // 取消
    canceldialog() {
      // 关闭弹框   表单重置
      this.dialogVisible = false
      // 表单重置
      this.$refs.userForm.resetFields()
      // 重新获取数据
      this.$parent.getuesrdata()
    },
  },
}
</script>

<style></style>
