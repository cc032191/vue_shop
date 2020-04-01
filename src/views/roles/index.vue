<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-card>
      <el-button type="primary" @click="addrole">添加角色</el-button>
      <el-table :data="roleslist" border style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',index===0?'bdtop':'','vcenter']"
              v-for="(item1,index) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag closable @close="removerightId(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  :class="[index===0?'':'bdtop','vcenter']"
                  v-for="(item2,index) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removerightId(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="removerightId(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editrole(scope.row.id)"
            >编辑</el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removerole(scope.row.id)"
            >删除</el-button>
            <!-- 分配 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="getright(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限 -->
    <privileges ref="privileges" :value="defKeys" :id="rightid"></privileges>
    <!-- 添加编辑 -->
    <addeditrole ref="addeditrole"></addeditrole>
  </div>
</template>

<script>
import privileges from "./components/privileges";
import addeditrole from "./components/addeditrole";
export default {
  data() {
    return {
      // 角色权限
      roleslist: [],
      //默认选中的节点id值数组
      defKeys: [],
      // 即将更新权限的id
      rightid: ""
    };
  },
  components: {
    privileges,
    addeditrole
  },
  created() {
    this.getroleslist();
  },
  methods: {
    // 获取角色列表
    getroleslist() {
      this.$axios.get("roles").then(res => {
        // window.console.log(res);
        if (res.data.meta.status == 200) {
          this.roleslist = res.data.data;
        }
      });
    },
    // 添加角色
    addrole() {
      this.$refs.addeditrole.and = true;
      this.$refs.addeditrole.dialogVisible = true;
    },
    // 编辑角色
    editrole(id) {
      this.$refs.addeditrole.and = false;
      this.$refs.addeditrole.dialogVisible = true;
      this.$axios.get(`roles/${id}`).then(res => {
        // window.console.log(res)
        if (res.data.meta.status === 200) {
          this.$refs.addeditrole.roleForm = res.data.data;
        }
      });
    },
    // 删除角色
    removerole(id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`roles/${id}`).then(res => {
            // window.console.log(res);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getroleslist();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除角色指定权限
    removerightId(row, id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`roles/${row.id}/rights/${id}`).then(res => {
            // window.console.log(res);
            if (res.data.meta.status == 200) {
              row.children = res.data.data;
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分配权限
    getright(row) {
      // window.console.log(row);
      // 传过去的 row的id保存起来,供角色授权使用
      this.rightid = row.id;
      // 调用获取所有权限列表
      this.$refs.privileges.getpower();
      // 调用递归函数获取三级节点的id值
      this.getnode(row, this.defKeys);
      // 打开弹框
      this.$refs.privileges.dialogVisible = true;
    },
    // 定义递归函数来获取三级节点的id值
    getnode(row, arr) {
      // 获取当前传过来的row的第一级子节点
      let children = row.children;
      // 遍历第一级子节点
      children.forEach(item => {
        // 如果不存在children属性,则把他们的id项保存到数组里面
        if (!item.children) {
          return arr.push(item.id);
        }
        this.getnode(item, arr);
      });
      // window.console.log(arr);
    }
  }
};
</script>

<style lang='less'>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>