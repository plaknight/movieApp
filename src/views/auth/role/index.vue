<template>
  <div class="role">
    <el-card style="margin: 30px">
      <div slot="header">
        <el-button type="primary" @click="addUser" size="mini"
          >创建角色</el-button
        >
        <pagination
          :page="page"
          @initPages="initRoleList"
          style="float:right"
        ></pagination>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="id" width="180"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="desc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="text"
              style="color:green"
              @click="updateRole(scope.row)"
              size="mini"
              >修改用户</el-button
            >
            <el-button type="text" style="color:red" @click="delRole(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色dialog -->
    <el-dialog
      title="创建角色"
      :visible.sync="roleDialogShow"
      @close="closeDialog"
      width="40%"
    >
      <el-form :model="form" ref="form">
        <el-form-item label="角色名称" label-width="80px">
          <el-input
            v-model="form.roleName"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px">
          <el-input
            v-model="form.desc"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="80px">
          <el-card :body-style="{ padding: '0px' }">
            <div slot="header">
              <span>选择角色对应的菜单:</span>
            </div>
            <el-tree
              :data="treeData"
              node-key="id"
              ref="tree"
              :props="defaultProps"
              :default-checked-keys="selected"
              show-checkbox
            ></el-tree>
          </el-card>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="doSaveUser" size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageMixin from "@/mixins/pageMixin";
import pagination from "@/components/Pagination.vue";
import roleApi from "@/api/auth/role";
import { resetDataArr } from "@/utils";

//这里需使用menu的api
import menuApi from "@/api/auth/menu";
export default {
  name: "role",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData: [],
      //   treeData: [],
      roleDialogShow: false,
      form: {},
      menuList: [],
      selected: []
    };
  },
  methods: {
    // 添加用户按钮
    addUser() {
      this.roleDialogShow = true;
      this.getmenuList();
    },
    //修改用户按钮
    async updateRole(val) {
      this.form = { ...val };
      this.getmenuList();
      await roleApi.getMenuByRole({ roleId: val.id }).then(res => {
        this.selected = res.data.map(el => {
          return el.menuId;
        });
      });
      this.roleDialogShow = true;
      //点击修改获取当前页面的信息
    },
    //查看用户按钮
    checkRole() {},
    doSaveUser() {
      //点击确定的时候判断
      var api
      if(this.form.id){
        api = roleApi.updateRole
      }else{
        api = roleApi.saveRole
      }
      api({
          role: {
            ...this.form
          },
          menuIds: this.$refs.tree.getCheckedKeys()
        })
        .then(res => {
          if (res.code === "success") {
            this.closeDialog();
            resetDataArr(this, "form");
            this.initRoleList();
            this.$message({ type: "success", message: "操作成功" });
          }
        });
    },
    closeDialog() {
      this.roleDialogShow = false;
      resetDataArr(this, "form");
      resetDataArr(this, "selected");
    },
    initRoleList() {
      roleApi.roleList().then(res => {
        this.tableData = res.data;
      });
    },
    //树形节点被选中
    choseTree(obj, node, e) {
      // console.log(obj,node,e)
    },
    getmenuList() {
      menuApi.menuList().then(res => {
        this.menuList = res.data;
      });
    },
    delRole(val) {
      console.log(val);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确定 取消
          roleApi.delRole({ roleId: val.id }).then(res => {
            if (res.code === "success") {
              this.$message({ type: "success", message: "删除成功" });
              this.initRoleList();
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
    }
  },
  components: {
    pagination
  },
  mixins: [pageMixin],
  created() {
    this.initRoleList();
  },
  computed: {
    treeData() {
      const tempArr = this.menuList.reduce((a, b) => {
        let tempObj = {
          label: b.menu.title,
          id: b.menu.id
        };
        if (b.list) {
          tempObj.children = [];
          b.list.forEach(el => {
            tempObj.children.push({
              label: el.title,
              id: el.id
            });
          });
        }
        a.push(tempObj);
        return a;
      }, []);
      console.log(tempArr);
      return tempArr;
    }
  }
};
</script>

<style lang='scss' scoped>
</style>