<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="getuesr.query"
            clearable
            @clear="getuesrdata()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getuesrdata()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getdialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="mg_state">
            <el-switch v-model="mg_state.row.mg_state" @change="updateswitch(mg_state.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="userId">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="amenduser(userId.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="remove(userId.row.id)"
            ></el-button>
            <!-- 分配 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getuesr.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="getuesr.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 弹框 -->
    <adduser ref="adduser"></adduser>
    <amenduser ref="amenduser"></amenduser>
  </div>
</template>

<script>
import adduser from "./components/adduser";
import amenduser from "./components/amenduser";
export default {
  data() {
    return {
      // 用户数据
      userlist: [],
      // 总数据条数
      total: null,
      getuesr: {
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      }
    };
  },
  components: {
    adduser,
    amenduser
  },
  created() {
    // 一进入页面就要获取信息
    this.getuesrdata();
  },
  methods: {
    // 获取用户数据
    getuesrdata() {
      this.$axios({
        url: "users",
        method: "get",
        params: this.getuesr
      }).then(res => {
        // window.console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error("获取失败");
          return;
        }
        this.userlist = res.data.data.users;
        // window.console.log(this.userlist);
        this.total = res.data.data.total;
      });
    },
    // 每页多少条
    handleSizeChange(newpagesize) {
      // 重新赋值
      this.getuesr.pagesize = newpagesize;
      this.getuesrdata();
    },
    // 当前显示页码
    handleCurrentChange(newhandleCurrentChange) {
      this.getuesr.pagenum = newhandleCurrentChange;
      this.getuesrdata();
    },
    // 开关状态改变    接受改变的哪一行的数据
    updateswitch(switchlist) {
      // window.console.log(switchlist);
      this.$axios
        .put(`users/${switchlist.id}/state/${switchlist.mg_state}`)
        .then(res => {
          // window.console.log(res);
          if (res.data.meta.status !== 200) {
            // 状态设置回去
            switchlist.mg_state = !switchlist.mg_state;
            this.$message.error("状态更新失败");
          } else {
            if (res.data.data.mg_state === 0) {
              this.$message.success("状态关闭");
            } else {
              this.$message.success("状态打开");
            }
          }
        });
    },
    // 打开弹框
    getdialog() {
      this.$refs.adduser.dialogVisible = true;
    },
    // 打开修改页面
    amenduser(userid) {
      // 传值给amenduser组件
      this.$refs.amenduser.dialogVisible = true;
      this.$axios.get(`users/${userid}`).then(res => {
        // window.console.log(res);
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg);
          this.$refs.amenduser.amenduserForm = res.data.data;
        } else {
          this.$message.error("获取失败");
        }
      });
    },
    // 删除
    remove(id) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`users/${id}`).then(res => {
            // window.console.log(res);
            if (res.data.meta.status === 200) {
              if (this.userlist.length === 1) {
                this.getuesr.pagenum -= 1;
              }
              this.$message.success(res.data.meta.msg);
              this.getuesrdata();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang='less' scoped>
</style>