<template>
  <div>
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="40%" @close="closearr">
      <!-- 树形控件 -->
      <el-tree
        :data="powerlist"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="value"
        ref="treeright"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmright">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["value", "id"],
  data() {
    return {
      dialogVisible: false,
      // 权限列表
      powerlist: [],
      // 树形控件参数对象
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  created() {
    this.getpower();
  },
  methods: {
    //   获取所有权限
    getpower() {
      this.$axios.get("rights/tree").then(res => {
        // window.console.log(res);
        if (res.data.meta.status === 200) {
          this.powerlist = res.data.data;
        }
      });
    },
    // 监听对话框的关闭事件,关闭清空父组件的id值数组
    closearr() {
      this.$parent.defKeys = [];
    },
    confirmright() {
      let keys = [
        ...this.$refs.treeright.getCheckedKeys(),
        ...this.$refs.treeright.getHalfCheckedKeys()
      ];
      keys = keys.join(",");
      // window.console.log(keys);
      // window.console.log(this.id);
      // 角色授权
      this.$axios.post(`roles/${this.id}/rights`, { rids: keys }).then(res => {
        // window.console.log(res);
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg);
          this.$parent.getroleslist();
          this.dialogVisible = false;
        }
      });
    }
  }
};
</script>

<style>
</style>