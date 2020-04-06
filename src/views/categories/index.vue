<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-card>
      <el-button type="primary" @click="addcateg">添加分类</el-button>
      <!-- vue-table-with-tree-grid -->
      <tree-table
        :data="catelist"
        :columns="columns"
        border
        :show-row-hover="false"
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        class="treetable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen; font-size: 16px;"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red; font-size: 16px;" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <!-- 修改 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="medium"
            @click="editcateg(scope.row)"
          >编辑</el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="medium"
            @click="removecateg(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="term.pagenum"
        :page-sizes="[5, 10]"
        :page-size="term.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加 -->
    <addcate ref="addcate"></addcate>
    <!-- 编辑 -->
    <editcate ref="editcate"></editcate>
  </div>
</template>

<script>
import addcate from './components/addcate'
import editcate from './components/editcate'
export default {
  data () {
    return {
      // 商品列表
      catelist: [],
      term: {
        pagenum: 1,
        pagesize: 5,
        type: 3,
      },
      total: null,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation',
        },
      ],
    }
  },
  components: {
    addcate,
    editcate
  },
  created () {
    this.getcate()
  },
  methods: {
    // 获取数据列表
    async getcate () {
      const { data: res } = await this.$axios.get('categories', {
        params: this.term,
      })
      // console.log(res)
      if (res.meta.status === 200) {
        this.catelist = res.data.result
        this.total = res.data.total
      }
    },
    // 添加分类
    addcateg () {
      // 调用子组件的获取商品分类列表的函数
      this.$refs.addcate.getcategories()
      this.$refs.addcate.dialogFormVisible = true
    },
    // 编辑
    editcateg (row) {
      // window.console.log(row)
      this.$refs.editcate.cateform = row
      this.$refs.editcate.dialogVisible = true
    },
    // 删除
    removecateg (row) {
      this.$confirm('确定删除此分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${row.cat_id}`)
        if (res.meta.status === 200) {
          // 判断是不是当页的最后一条数据,如果是,pagenum减1
          if (this.catelist.length === 1) {
            this.term.pagenum -= 1
          }
          this.$message.success(res.meta.msg)
          this.getcate()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 每页多少条
    handleSizeChange (val) {
      this.term.pagesize = val
      this.getcate()
    },
    // 当前多少页
    handleCurrentChange (val) {
      this.term.pagenum = val
      this.getcate()
    },
  },
}
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 20px;
}
</style>
