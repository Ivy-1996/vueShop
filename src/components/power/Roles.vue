<template>
    <div>
        <!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--        卡片视图-->
        <el-card>

            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
  export default {
    name: "Roles",
    methods: {
      async getRoleList() {
        const { data: resp } = await this.$http.get("roles")
        if (resp.meta.status !== 200) {
          return this.$message.error("获取角色列表失败")
        }
        this.roleList = resp.data
      }
    },
    data() {
      return {
        roleList: []
      }
    },
    created() {
      this.getRoleList()
    }
  }
</script>

<style scoped>

</style>
