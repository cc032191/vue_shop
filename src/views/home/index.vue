<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="head_div">
        <img src="../../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <!-- 页面主题 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <regionstart />
      </el-aside>
      <!-- 页面右面 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import regionstart from "./components/regionstart";
export default {
  data() {
    return {};
  },
  components: {
    regionstart
  },
  methods: {
    quit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  .head_div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>