<template>
  <el-dialog
    title="分配角色"
    :visible.sync="dialogVisible"
    width="30%"
    @close="reset"
  >
    <!-- 主体 -->
    <el-form :model="roleForm" ref="roleForm" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="roleForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="当前角色" prop="role_name">
        <el-input v-model="roleForm.role_name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="新角色" prop="role_names">
        <el-select v-model="roleForm.newrole_name" placeholder="请选择新角色">
          <el-option
            v-for="item in roleobj"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="rolechange">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      // 弹框
      dialogVisible: false,
      roleForm: {
        username: '',
        role_name: '',
        newrole_name: '',
        id: '',
      },
      // 角色列表
      roleobj: [],
    }
  },
  created() {
    this.getrolelist()
  },
  methods: {
    // 获取角色列表
    getrolelist() {
      this.$axios.get('roles').then((res) => {
        // window.console.log(res);
        if (res.data.meta.status === 200) {
          this.roleobj = res.data.data
        }
      })
    },
    //   分配角色
    rolechange() {
      // 判断是否选择了值
      if (!this.roleForm.newrole_name) {
        return this.$message.error('请选择要分配的角色')
      }
      this.$axios
        .put(`users/${this.roleForm.id}/role`, {
          rid: this.roleForm.newrole_name,
        })
        .then((res) => {
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            this.$parent.getuesrdata()
            this.dialogVisible = false
          }
        })
    },
    reset() {
      this.$refs.roleForm.resetFields()
    },
  },
}
</script>

<style></style>
