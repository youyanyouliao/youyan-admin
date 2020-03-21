<template>
  <div class="container">
    <Header />
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
      <a-layout-sider collapsible v-model="collapsed">
        <div class="logo" />
        <a-menu
          theme="dark"
          :defaultSelectedKeys="['1']"
          mode="inline"
          :defaultOpenKeys="['sub1']"
          @click="chooseMenuItem"
        >
          <a-menu-item key="1">
            <a-icon type="home" />
            <span>首页</span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="read" />
              <span>内容管理</span>
            </span>
            <a-menu-item key="2">活动</a-menu-item>
            <a-menu-item key="3">文章</a-menu-item>
            <a-menu-item key="4">招聘</a-menu-item>
            <a-menu-item key="5">轮播图</a-menu-item>
            <a-menu-item key="6">首页推荐</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="7">
            <a-icon type="user" />
            <span>用户管理</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <!-- <a-layout-header style="background: #fff; padding: 0" /> -->
        <a-layout-content style="margin: 0 16px">
          <a-breadcrumb style="margin: 16px 0;display:flex">
            <a-breadcrumb-item>{{subNavStr1}}</a-breadcrumb-item>
            <a-breadcrumb-item v-if="subNavStr2">{{subNavStr2}}</a-breadcrumb-item>
          </a-breadcrumb>
          <div :class="{ctStyle:!isIndex}">
            <router-view></router-view>
          </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">Ant Design ©2018 Created by Ant UED</a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
import Header from "./componets/header";
import { menus } from "../../constant/menu";
export default {
  data() {
    return {
      collapsed: false,
      navStr: "",
      isIndex: true
    };
  },
  components: {
    Header
  },
  computed: {
    subNavStr1: function() {
      return this.navStr.indexOf(",") > -1
        ? this.navStr.split(",")[0]
        : this.navStr;
    },
    subNavStr2: function() {
      return this.navStr.indexOf(",") > -1 ? this.navStr.split(",")[1] : "";
    }
  },
  created() {
    //  this.initMenus();
  },
  methods: {
    chooseMenuItem(item) {
      //导航面包屑变化
      let val = menus[parseInt(item.key) - 1];
      this.navStr = val;
      //路由变化
      switch (item.key) {
        case "1":
          this.$router
            .push({
              path: "/"
            })
            .catch(err => {
              err;
            });
          break;
        case "2":
          this.$router
            .push({
              path: "/activity"
            })
            .catch(err => {
              err;
            });
          break;
        case "5":
          this.$router
            .push({
              path: "/carousel"
            })
            .catch(err => {
              err;
            });
          break;
        case "7":
          this.$router
            .push({
              path: "/user"
            })
            .catch(err => {
              err;
            });
          break;
        default:
          this.$router
            .push({
              path: "/"
            })
            .catch(err => {
              err;
            });
          break;
      }
      //是否为首页
      this.isIndex = item.key == 1 ? true : false;
    }
  }
};
</script>

<style lang='less'>
/* #components-layout-demo-side .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  } */
.ctStyle {
  padding: 24px;
  background: #fff;
  min-height: 360px;
}
</style>