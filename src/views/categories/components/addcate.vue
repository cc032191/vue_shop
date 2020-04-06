<template>
  <div>
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="600px" @close="shutempty">
      <el-form :model="cateform" :rules="rules" ref="cateform">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
          <el-input v-model="cateform.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" :label-width="formLabelWidth">
          <div class="block">
            <el-cascader
              v-model="selectarr"
              :options="addcatelist"
              :props="{ expandTrigger: 'hover',value: 'cat_id',label: 'cat_name',children: 'children',checkStrictly: true }"
              @change="handleChange"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmcate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogFormVisible: false,
      cateform: {
        cat_name: '',
        // 分类父id,默认为0 
        cat_pid: 0,
        // 分类层级 默认为0 0为1级分类 1为2级分类 2为3级分类
        cat_level: 0
      },
      // 商品分类列表
      addcatelist: [],
      // 选择到的数据的id
      selectarr: [],
      formLabelWidth: '80px',
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getcategories () {
      const { data: res } = await this.$axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status === 200) {
        this.addcatelist = res.data
      }
      window.console.log(this.addcatelist)
    },
    // 选择框值发生改变的时候执行
    handleChange () {
      window.console.log(this.selectarr)
      // 如果selectarr数组中的长度大于0,证明选中的父级分类
      // 反之,就说明没有选中任何父级分类
      if (this.selectarr.length > 0) {
        // 父级分类的id
        this.cateform.cat_pid = this.selectarr[this.selectarr.length - 1]
        // 为当前分类的等级赋值
        this.cateform.cat_level = this.selectarr.length
        return
      } else {
        // 父级分类的id
        this.cateform.cat_pid = 0
        // 为当前分类的等级赋值
        this.cateform.cat_level = 0
      }
    },
    // 发送添加
    confirmcate () {
      // window.console.log(this.cateform)
      this.$refs.cateform.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post('categories', this.cateform)
          window.console.log(res)
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            this.$parent.getcate()
            this.dialogFormVisible = false
          }
        } else {
          this.$message.error('请输入分类名称')
          return false;
        }
      });
    },
    // 表单关闭重置
    shutempty () {
      // 表单清空
      this.$refs.cateform.resetFields();
      // 分类等级 ID等于最高等级 绑定的数组selectarr清空
      this.selectarr = []
      this.cateform.cat_pid = 0
      this.cateform.cat_level = 0
    }
  },
}
</script>

<style lang='less' scoped>
.el-form-item__content {
  .el-cascader {
    width: 480px;
  }
}
</style>
