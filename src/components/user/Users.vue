<template>
    <div>
        <!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!--            用户列表区域-->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
                                   @change="changeUserStatus(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑角色" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                                       @click="showEditUserDialog(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                                       @click="deleteUser(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!--            分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--        添加用户的对话框-->
        <el-dialog title="添加用户" :visible.sync="addUserVisible" @close="closeAddUserDialog">
            <el-form :model="addUserForm" :rules="addUserRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="Visible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确定</el-button>
            </div>
        </el-dialog>
        <!--        修改用户的对话框-->
        <el-dialog title="修改用户" :visible.sync="editUserVisible" @close="closeEditUserDialog">
            <el-form ref="editFormRef" label-width="70px" :model="editForm" :rules="editFormRules">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "Users",
    data() {
      var checkEmail = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return callback()
        }
        callback(new Error("请输入合法的邮箱"))
      }

      var checkMobile = (rule, value, callback) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          return callback()
        }
        callback(new Error("请输入合法的手机号"))
      }
      return {
        queryInfo: {
          query: "",
          pagesize: 5,
          pagenum: 1
        },
        userList: [],
        total: 0,
        addUserForm: {
          username: "",
          password: "",
          email: "",
          mobile: ""
        },
        addUserRules: {
          username: [
            { min: 3, max: 10, message: "用户名长度在3和10之间", trigger: "blur" },
            { required: true, message: "请输入用户名!", trigger: "blur" }
          ],
          password: [
            { min: 6, max: 16, message: "用户名长度在6和16之间", trigger: "blur" },
            { required: true, message: "请输入密码!", trigger: "blur" }
          ],
          email: [
            { required: true, message: "请输入邮箱!", trigger: "blur" },
            { validator: checkEmail, trigger: "blur" }
          ],
          mobile: [
            { required: true, message: "请输入手机号!", trigger: "blur" },
            { validator: checkMobile, trigger: "blur" }
          ]
        },
        editForm: {},
        editFormRules: {
          email: [
            { required: true, message: "请输入邮箱!", trigger: "blur" },
            { validator: checkEmail, trigger: "blur" }
          ],
          mobile: [
            { required: true, message: "请输入手机号!", trigger: "blur" },
            { validator: checkMobile, trigger: "blur" }
          ]
        },
        addUserVisible: false,
        editUserVisible: false
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const { data: resp } = await this.$http.get("users", { params: this.queryInfo })
        if (resp.meta.status !== 200) {
          return this.$message.error("获取用户列表失败!")
        }
        this.userList = resp.data.users
        this.total = resp.data.total
      },
      handleSizeChange(size) {
        this.queryInfo.pagesize = size
        this.getUserList()
      },
      handleCurrentChange(page) {
        this.queryInfo.pagenum = page
        this.getUserList()
      },
      async changeUserStatus(row) {
        const { data: resp } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
        if (resp.meta.status !== 200) {
          row.mg_state = !row.mg_state
          return this.$message.error("更新用户状态失败!")
        }
        this.$message.success("更新用户状态成功!")
      },
      addUser() {
        this.$refs.addFormRef.validate(async vaild => {
          if (!vaild) return
          const { data: resp } = await this.$http.post("users", this.addUserForm)
          if (resp.meta.status !== 201) {
            return this.$message.error("添加用户失败")
          }
          this.$message.success("添加用户成功！")
          this.addUserVisible = false
          this.getUserList()
        })
      },
      closeAddUserDialog() {
        this.$refs.addFormRef.resetFields()
      },
      async showEditUserDialog(row) {
        const { data: resp } = await this.$http.get(`users/${row.id}`)
        if (resp.meta.status !== 200) return this.$message.error("获取用户信息失败")
        this.editForm = resp.data
        this.editUserVisible = true
      },
      closeEditUserDialog() {
        this.$refs.editFormRef.resetFields()
      },
      editUserInfo() {
        this.$refs.editFormRef.validate(async vaild => {
          if (!vaild) return
          const { data: resp } = await this.$http.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (resp.meta.status !== 200) {
            return this.$message.error("更新用户信息失败!")
          }
          this.editUserVisible = false
          this.getUserList()
          this.$message.success("更新用户信息成功!")
        })
      },
      async deleteUser(row) {
        const result = await this.$confirm(
          "此操作将永久删除该用户, 是否继续?", "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).catch(err => err)
        if (result === "confirm") {
          const { data: resp } = await this.$http.delete(`users/${row.id}`)
          if (resp.meta.status !== 200) return this.$message.error("删除用户失败!")
          this.$message.success("删除用户成功!")
          return this.getUserList()
        }
        this.$message.info("取消删除成功!")
      }
    }
  }
</script>

<style scoped>

</style>
