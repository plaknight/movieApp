<template>
  <div class="user">
    <el-card style="margin: 30px">
      <div slot="header">
        <el-button type="primary" @click="addUser" size="mini"
          >添加用户</el-button
        >
        <pagination
          :page="page"
          @initPages="initUserList"
          style="float:right"
        ></pagination>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="id" width="180"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="roleNames" label="角色"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="text" @click="changeUser(scope.row)" size="mini"
              >修改角色</el-button
            >
            <el-button
              type="text"
              style="color:green"
              @click="editUser(scope.row)"
              size="mini"
              >编辑用户</el-button
            >
            <el-button
              type="text"
              style="color:red"
              @click="delUser(scope.row)"
              size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      @close="closeDialog"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" label-width="60px">
          <el-input
            v-model="form.username"
            autocomplete="off"
            size="small"
            placeholder="建议使用英文"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="60px" prop="password">
          <el-input
            v-model="form.password"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="doSaveUser" size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="transferIsShow" @close="cloaseTransfer">
      <el-transfer v-model="value" :data="transferData"></el-transfer>
      <span slot="footer">
        <el-button @click="cloaseTransfer" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/auth/user";
import pageMixin from "@/mixins/pageMixin";
import pagination from "@/components/Pagination.vue";

//这里还是需要角色集合的api
import roleApi from "@/api/auth/role";
import { resetDataArr } from "@/utils";
export default {
  name: "user",
  mixins: [pageMixin],
  components: {
    pagination
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      transferIsShow: false,
      form: {
        username: "",
        password: ""
      },
      title: "新增用户",
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 11, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      value: [],
      transferData: [],
      userId: ""
    };
  },
  methods: {
    confirm() {
      userApi
        .saveUserRole({
          userId: this.userId,
          roleId: this.value
        })
        .then(res => {
          if (res.code === "success") {
            this.$message({ type: "success", message: "修改成功" });
            this.initUserList();
            this.cloaseTransfer();
          }
        });
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      resetDataArr(this, "form");
      this.resetForm("form");
    },
    cloaseTransfer() {
      this.transferIsShow = false;
    },
    //确定按钮
    doSaveUser() {
      var api;
      if (this.form.id) {
        api = userApi.updateUser;
      } else {
        api = userApi.saveUser;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          api({
            adminUser: {
              ...this.form
            }
          }).then(res => {
            if (res.code === "success") {
              this.$message({ type: "success", message: "操作成功" });
              this.initUserList();
              this.resetForm("form");
              this.closeDialog();
            }
          });
        }
      });
    },
    userList() {
      return roleApi.roleList().then(res => {
        this.transferData = res.data.reduce((a, b) => {
          a.push({
            key: b.id,
            label: b.roleName,
            disabled: false
          });
          return a;
        }, []);
      });
    },
    //修改
    async changeUser(val) {
      this.userId = val.id;
      await userApi.getRoleIdsByUser({ userId: val.id }).then(res => {
        this.value = res.data.map(el => {
          return el.roleId;
        });
      });
      await this.userList();
      this.transferIsShow = true;
    },
    //编辑
    editUser(val) {
      this.title = "编辑用户";
      this.form = {
        username: val.username,
        id: val.id
      };
      this.openDialog();
    },
    // 删除
    delUser(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确定 取消
          userApi.delUser({ id: val.id }).then(res => {
            if (res.code === "success") {
              this.$message({ type: "success", message: "删除成功" });
              this.initUserList();
            } else {
              this.$message({
                type: "error",
                message: "删除失败,发生了未知的错误"
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
    //添加用户
    addUser() {
      this.title = "新增用户";
      this.openDialog();
    },
    async initUserList() {
      await userApi
        .userList({
          start: this.page.currentPage,
          limit: this.page.pageSize
        })
        .then(res => {
          this.tableData = res.data.list;
          this.page.totalPage = res.data.totalRow;
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    this.initUserList();
  }
};
</script>

<style lang='scss' scoped>
</style>