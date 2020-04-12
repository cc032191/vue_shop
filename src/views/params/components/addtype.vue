<template>
  <div>
    <el-dialog
      :title="activeName==='many'?'添加动态参数':'添加静态属性'"
      :visible.sync="dialogVisible"
      width="30%"
      @close="closeempty"
    >
      <el-form
        :model="addtype"
        :rules="rules"
        ref="addtype"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item :label="activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="addtype.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addtypeaffirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- {{cateId}} -->
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
      addtype: {
        attr_name: ''
      },
      rules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 表单关闭,清空属性
    closeempty () {
      this.$refs.addtype.resetFields();
    },
    // 确认按钮添加数据
    addtypeaffirm () {
      // 执行添加动态参数的逻辑
      this.$refs.addtype.validate(async (valid) => {
        if (valid) {
          // 验证通过
          const { data: res } = await this.$axios.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addtype.attr_name,
            attr_sel: this.activeName
          })
          // window.console.log(res)
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            this.$parent.getparamsData()
            this.dialogVisible = false
          } else {
            this.$message.error(res.meta.msg)
          }
        } else {
          this.$message.error('请输入参数名称')
          return false;
        }
      });
    }
  }
}
</script>

<style>
</style>