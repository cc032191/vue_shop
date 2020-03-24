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
      <el-aside :width="isCollapse?'64px':'200px'">
        <i class="el-icon-s-operation" @click="isCollapse=!isCollapse"></i>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          active-text-color="#409EFF"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="clickPathtext"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in leftlist" :key="item.id">
            <!-- 一级菜单的模版区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="usericon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+itemchildren.path"
              v-for="itemchildren in item.children"
              :key="itemchildren.id"
              @click="clickPath('/'+itemchildren.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{itemchildren.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面右面 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧栏列表
      leftlist: [],
      // 图标的对象
      usericon: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false,
      // 被激活的链接地址
      clickPathtext: ""
    };
  },
  created() {
    // 一进入页面就取点击的路径赋值给clickPathtext
    this.clickPathtext=window.sessionStorage.getItem('Path')
    this.$axios.get("menus").then(res => {
      // window.console.log(res);
      if (res.data.meta.status === 200) {
        this.leftlist = res.data.data;
      }
    });
  },
  methods: {
    // 保存链接的激活状态
    clickPath(Path) {
      //   当前点击的路径保存在sessionStorage中     然后一进入页面就取出来赋值给clickPathtext
      window.sessionStorage.setItem("Path", Path);
      // this.clickPathtext=Path
    },
    quit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message.warning("退出成功");
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
    img {
      margin-left: 20px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-icon-s-operation {
    width: 100%;
    height: 40px;
    color: #fff;
    border-bottom: 1px solid #373d41;
    font-size: 20px;
    text-align: center;
    line-height: 40px;
    // 鼠标变小手
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
// 切换的样式
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>