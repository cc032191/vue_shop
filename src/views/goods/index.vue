<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="getgoodslist()">
            <el-button slot="append" icon="el-icon-search" @click="getgoodslist()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addgoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodslist" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="900"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="200"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="200"></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">{{scope.row.add_time | timeDate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delgoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10,20,50,100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品列表
      goodslist: [],
      // 查询参数
      query: '',
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 10,
      // 总数量
      total: null
    }
  },
  created () {
    this.getgoodslist()
  },
  methods: {
    // 获取商品列表
    async getgoodslist () {
      const { data: res } = await this.$axios('goods', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // window.console.log(res)
      if (res.meta.status === 200) {
        this.goodslist = res.data.goods
        this.total = res.data.total
      }
    },
    // 删除商品
    delgoods (id) {
      this.$confirm('确认删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`goods/${id}`)
        // window.console.log(res)
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          this.getgoodslist()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加商品
    addgoods () {
      this.$router.push('/goods/add')
    },
    // 每页多少条
    handleSizeChange (val) {
      this.pagesize = val
      this.getgoodslist()
    },
    // 当前页码
    handleCurrentChange (val) {
      this.pagenum = val
      this.getgoodslist()
    }
  }
}
</script>

<style>
</style>