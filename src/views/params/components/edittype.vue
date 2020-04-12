<template>
  <div>
    <el-dialog
      :title="activeName==='many'?'修改动态参数':'修改静态属性'"
      :visible.sync="dialogVisible"
      width="30%"
      @close="closeempty"
    >
      <el-form
        :model="edittype"
        :rules="rules"
        ref="edittype"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item :label="activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="edittype.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edittypeaffirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['activeName', 'cateId'],
  data () {
    return {
      // 面板开关
      dialogVisible: false,
      // 数据
      edittype: {
        attr_name: '',
        attr_id: ''
      },
      rules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 表单关闭,清空属性
    closeempty () {
      this.$refs.edittype.resetFields();
    },
    // 确认按钮添加数据
    edittypeaffirm () {
      // 执行添加动态参数的逻辑
      this.$refs.edittype.validate(async (valid) => {
        if (valid) {
          // 验证通过
          const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${this.edittype.attr_id}`, {
            attr_name: this.edittype.attr_name,
            attr_sel: this.activeName
          })
          // window.console.log(res)
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
            this.$parent.getparamsData()
            this.dialogVisible = false
          } else {
            this.$message.error(res.meta.msg)
          }
        } else {
          this.$message.error('请输入参数名称')
          return false
        }
      });
    }
  }
}
</script>

<style>
</style>