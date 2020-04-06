<template>
  <div>
    <el-dialog
      :title="and ? '添加角色' : '编辑角色'"
      :visible.sync="dialogVisible"
      width="30%"
      @close="closerole"
    >
      <el-form :model="roleForm" ref="roleForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="notarizerole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // true为添加角色    fales为编辑角色
      and: true,
      dialogVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: '',
        roleId: '',
      },
    }
  },
  methods: {
    // 关闭重置
    closerole() {
      this.$refs.roleForm.resetFields()
    },
    // 添加角色编辑角色逻辑
    notarizerole() {
      if (this.and === true) {
        // 判断非空
        if (!this.roleForm.roleName) {
          return this.$message.error('角色名称不能为空')
        }
        // 添加逻辑
        this.$axios.post('roles', this.roleForm).then((res) => {
          if (res.data.meta.status === 201) {
            this.$message.success(res.data.meta.msg)
            this.$parent.getroleslist()
            this.dialogVisible = false
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
      } else {
        // 判断非空
        if (!this.roleForm.roleName) {
          return this.$message.error('角色名称不能为空')
        }
        // 编辑逻辑
        this.$axios
          .put(`roles/${this.roleForm.roleId}`, this.roleForm)
          .then((res) => {
            // window.console.log(res);
            if (res.data.meta.status === 200) {
              this.$message.success('修改成功')
              this.$parent.getroleslist()
              this.dialogVisible = false
            }
          })
      }
    },
  },
}
</script>

<style></style>
