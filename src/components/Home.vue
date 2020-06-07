<template>

    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/header.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!--      页面主体区域-->
        <el-container>
            <!--          侧边栏-->
            <el-aside :width="isCollapsed ? '64px' : '200px'">
                <div class="toggle-button" @click="changeIsCollapsed">|||</div>
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409BFF" unique-opened
                         :collapse="isCollapsed" :collapse-transition="false" router :default-active="active">
                    <el-submenu :index="item.path + ''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsDict[item.path]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="subItem.path + ''" v-for="subItem in item.children" :key="subItem.id"
                                      @click="saveActiveStatus(subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <!--                路由占位符-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        menuList: [],
        iconsDict: {
          users: "iconfont icon-user",
          rights: "iconfont icon-tijikongjian",
          goods: "iconfont icon-shangpin",
          orders: "iconfont icon-danju",
          reports: "iconfont icon-baobiao"
        },
        isCollapsed: false,
        active: ""
      }
    },
    created() {
      this.getMenuList()
      this.active = window.sessionStorage.getItem("active")
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push("/login")
      },
      async getMenuList() {
        const { data: resp } = await this.$http.get("menus")
        if (resp.meta.status !== 200) {
          return this.$message.error(resp.meta.msg)
        }
        this.menuList = resp.data
      },
      changeIsCollapsed() {
        this.isCollapsed = !this.isCollapsed
      },
      saveActiveStatus(active) {
        window.sessionStorage.setItem("active", active)
        this.active = active
      }
    }
  }
</script>

<style scoped lang="less">
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #ffffff;
        font-size: 20px;

        > div {
            display: flex;
            align-items: center;

            span {
                margin-left: 15px;
            }
        }
    }

    .el-aside {
        background-color: #333744;

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #EAEDF1;
    }

    .home-container {
        height: 100%;
    }

    .iconfont {
        margin-right: 10px;
    }

    .toggle-button {
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: #ffffff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
