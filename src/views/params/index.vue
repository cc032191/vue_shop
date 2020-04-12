<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意,只允许为第三级分类设置相关参数!" type="warning" show-icon></el-alert>
      <!-- 级联选择框 -->
      <el-row class="rowcasc">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectcate"
            :options="cateslist"
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children'}"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <div class="temparams">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 动态参数 -->
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" :disabled="selectcate.length!==3" @click="addmany">添加参数</el-button>
            <!-- 表格 -->
            <el-table :data="manymainlist" style="width: 100%" border>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- 循环渲染标签 -->
                  <el-tag
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index,scope.row)"
                  >{{item}}</el-tag>
                  <!-- 添加 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index" label="#" width="50px"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- 修改 -->
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="editmanyparams(scope.row.attr_id)"
                  >修改</el-button>
                  <!-- 删除 -->
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removemanyparams(scope.row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 静态属性 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="selectcate.length!==3" @click="addonly">添加属性</el-button>
            <!-- 表格 -->
            <el-table :data="onlymainlist" style="width: 100%" border>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- 循环渲染标签 -->
                  <el-tag
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index,scope.row)"
                  >{{item}}</el-tag>
                  <!-- 添加 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#" width="50px"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- 修改 -->
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="editonlyparams(scope.row.attr_id)"
                  >修改</el-button>
                  <!-- 删除 -->
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeonlyparams(scope.row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 添加动态与静态共同页面 -->
    <addtype ref="addtype" :activeName="activeName" :cateId="cateId"></addtype>
    <!-- 修改动态与静态共同页面 -->
    <edittype ref="edittype" :activeName="activeName" :cateId="cateId"></edittype>
    <!-- {{cateId}} -->
  </div>
</template>

<script>
import addtype from './components/addtype'
import edittype from './components/edittype'
export default {
  data () {
    return {
      // 被激活的页签名称
      activeName: 'many',
      // 商品列表
      cateslist: [],
      // 选中的值
      selectcate: [],
      // 动态参数列表
      manymainlist: [],
      // 静态参数列表
      onlymainlist: [],
      // 属性id
      attrid: ''
    }
  },
  components: {
    addtype,
    edittype
  },
  created () {
    this.getcatelist()
  },
  computed: {
    // 获取该商品分类的id
    cateId () {
      if (this.selectcate.length === 3) {
        return this.selectcate[2]
      }
      return null
    }
  },
  methods: {
    // 获取商品属性
    async getparams () {
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes/${this.attrid}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      // window.console.log(res)
      if (res.meta.status === 200) {
        this.$refs.edittype.edittype = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // 关闭标签该做的事
    handleClose (index, row) {
      // 根据索引删除第一个参数
      row.attr_vals.splice(index, 1)
      // 提交到服务器
      // window.console.log(row)
      this.onSubmitEditing(row)
    },
    // 编辑提交参数
    async onSubmitEditing (row) {
      const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      // window.console.log(res)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
      }
    },
    // 点击按钮 展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 文本框自动获得焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    // 添加tag标签   失去焦点&按下回车都会触发
    handleInputConfirm (row) {
      // 输入框里面的文本为空则清空输入框,关闭输入框
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        // 不为空则添加到attr_vals中
        row.attr_vals.push(row.inputValue.trim())
        // 添加之后清空输入框
        row.inputValue = ''
        // 关闭输入框
        row.inputVisible = false
        // 存到服务器上面
        this.onSubmitEditing(row)
      }
    },
    // 添加动态
    addmany () {
      this.$refs.addtype.dialogVisible = true
    },
    // 添加静态
    addonly () {
      this.$refs.addtype.dialogVisible = true
    },
    // 编辑动态
    editmanyparams (id) {
      // window.console.log(id)
      this.attrid = id
      this.getparams()
      this.$refs.edittype.dialogVisible = true
    },
    // 编辑静态
    editonlyparams (id) {
      this.attrid = id
      this.getparams()
      this.$refs.edittype.dialogVisible = true
    },
    // 删除动态
    removemanyparams (id) {
      this.attrid = id
      this.delparams()
    },
    // 删除静态
    removeonlyparams (id) {
      this.attrid = id
      this.delparams()
    },
    // 删除逻辑
    delparams () {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${this.cateId}/attributes/${this.attrid}`)
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          this.getparamsData()
        } else {
          this.$message.error(res.meta.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取商品分类列表
    async getcatelist () {
      const { data: res } = await this.$axios.get('categories')
      // window.console.log(res)
      if (res.meta.status === 200) {
        this.cateslist = res.data
      }
    },
    // 级联选择器选中项改变触发的函数
    handleChange () {
      this.getparamsData()
    },
    // 点击页签触发的函数
    handleClick () {
      this.getparamsData()
    },
    // 获取参数的列表数据
    async getparamsData () {
      // 要求必须选择最后一项,如果选择的不是最后一项,则重置
      if (this.selectcate.length !== 3) {
        this.selectcate = []
        this.manymainlist = []
        this.onlymainlist = []
        return
      }
      // window.console.log(this.selectcate)
      // 如果选择了最后一项,则应该获取该商品对用的参数与属性
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status === 200) {
        // 把attr_vals转换为数组   不为空就分割   为空就给一个空的数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          this.$set(item, 'inputVisible', false)
          // 文本框输入的值
          this.$set(item, 'inputValue', '')
        })
        // window.console.log(res)
        // 判断一下获取的数据是动态的还是静态的
        if (this.activeName === 'many') {
          // 说明获取的是动态参数里面的数据
          this.manymainlist = res.data
        } else {
          this.onlymainlist = res.data
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.rowcasc {
  margin-top: 20px;
  span {
    margin-right: 15px;
  }
  .el-cascader {
    width: 300px;
  }
}
.temparams {
  margin-top: 20px;
}
// tag标签样式
.button-new-tag {
  margin: 7px;
  height: 32px;
  line-height: 32px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 140px;
  margin-left: 7px;
}
</style>