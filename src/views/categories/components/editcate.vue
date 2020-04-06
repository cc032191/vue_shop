<template>
  <div>
    <!-- 修改分类 -->
    <el-dialog title="修改分类" :visible.sync="dialogVisible" width="600px">
      <el-form :model="cateform" :rules="rules" ref="cateform">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
          <el-input v-model="cateform.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editcate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      cateform: {
        cat_name: '',
        // 分类id 
        cat_id: ''
      },
      formLabelWidth: '80px',
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    editcate () {
      this.$refs.cateform.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.put(`categories/${+(this.cateform.cat_id)}`, { cat_name: this.cateform.cat_name })
          window.console.log(res)
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
            this.$parent.getcate()
            this.dialogVisible = false
          }
        } else {
          this.$message.error('请输入分类名称')
          return false;
        }
      });
    }
  },
}
</script>

<style>
</style>