<template>
  <div class="menu">
    <el-card style="margin: 30px">
      <div slot="header">
        <el-button type="primary" @click="addMenu" size="mini"
          >创建一级菜单</el-button
        >
        <pagination
          :page="page"
          @initPages="initMenuList"
          style="float:right"
        ></pagination>
      </div>
      <el-table
        :data="tableData"
        border
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >>
        <el-table-column prop="id" label="id" width="180"> </el-table-column>
        <el-table-column prop="pId" label="顶级菜单pId" width="180">
        </el-table-column>
        <el-table-column prop="level" label="排序" width="100">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="120">
        </el-table-column>
        <el-table-column prop="name" label="组件名称"> </el-table-column>
        <el-table-column prop="url" label="url" width="100"> </el-table-column>
        <el-table-column prop="status" label="是否可用" width="100">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="text"
              style="color:green"
              @click="updateMenuDetail(scope.row)"
              size="mini"
              >修改用户</el-button
            >
            <el-button
              type="text"
              style="color:red"
              @click="delMenu(scope.row)"
              size="mini"
              >删除</el-button
            >
            <el-button
              v-show="scope.row.pId === '-1'"
              type="text"
              style="color:red"
              @click="addSubmenu(scope.row)"
              size="mini"
              >添加子菜单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :visible.sync="roleDialogShow"
      title="FormList"
      @close="closeDialog"
      width="60%"
    >
      <el-form :model="form" ref="form">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="菜单名称" label-width="120px">
              <el-input
                v-model="form.title"
                autocomplete="off"
                size="small"
                placeholder="用于生成导航title"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="菜单层级" label-width="120px">
              <el-input
                v-model="form.level"
                autocomplete="off"
                size="small"
                placeholder="暂不支持>2级以上菜单"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="pId顶级菜单" label-width="120px">
              <el-input
                v-model="form.pId"
                autocomplete="off"
                size="small"
                placeholder="默认'-1', 顶级菜单"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="路由名称" label-width="120px">
              <el-input
                v-model="form.name"
                autocomplete="off"
                size="small"
                placeholder="自定义路由名称,用于跳转"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="路由url" label-width="120px">
              <el-input
                v-model="form.url"
                autocomplete="off"
                size="small"
                placeholder="如果外联,这里输入url"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否外联" label-width="120px">
              <el-radio-group v-model="form.outlink">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="路由组件key" label-width="120px">
              <el-input
                v-model="form.component"
                autocomplete="off"
                size="small"
                placeholder="客户端根据该字段渲染对应组建"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="redirect" label-width="120px">
              <el-input
                v-model="form.redirect"
                autocomplete="off"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="菜单排序" label-width="120px">
              <el-input-number
                v-model="form.sort"
                :min="-1"
                :max="2"
                placeholder="倒序"
                size="small"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="icon" label-width="120px">
              <el-input
                v-model="form.icon"
                autocomplete="off"
                size="small"
                placeholder="图标svg名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="doSave" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageMixin from "@/mixins/pageMixin";
import pagination from "@/components/Pagination.vue";
import { resetDataArr } from "@/utils";

import menuApi from "@/api/auth/menu";
export default {
  name: "menus",
  data() {
    return {
      tableData: [],
      roleDialogShow: false,
      form: {
        level: 1,
        outlink: "0",
        pId: "-1"
      }
    };
  },
  methods: {
    //弹窗确定
    doSave() {
      var api;
      if (this.form.id) {
        api = menuApi.updateMenu;
      } else {
        api = menuApi.saveMenu;
      }
      api({menu: {...this.form}}).then(res=>{
        console.log(res)
        if(res.code = "success"){
              this.$message({ type: "success", message: "操作成功" });
              this.closeDialog()
              this.initMenuList();
        }
      })
    },
    //修改按钮
    updateMenuDetail(val){
      menuApi.detail({id:val.id}).then(res=>{
        this.form = res.data
        this.form.menuType = null
        this.form.outlink = "0"
        console.log("执行了",this.form)
      })
      this.openDialog()
    },
    //关闭弹窗
    closeDialog() {
      this.roleDialogShow = false;
      resetDataArr(this, "form");
    },
    //开启弹窗
    openDialog() {
      this.roleDialogShow = true;
    },
    //子菜单
    addSubmenu(val) {
      this.form.pId = val.id
      console.log(this.form)
      this.form.level = 2,
      this.openDialog();
    },
    //一级菜单按钮
    addMenu() {
      this.openDialog();
    },
    //删除按钮
    delMenu(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确定 取消
          menuApi.delMenu({ id: val.id }).then(res => {
            if (res.code === "success") {
              this.$message({ type: "success", message: "删除成功" });
              this.initMenuList();
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
    initMenuList() {
      menuApi.menuList().then(res => {
        console.log(res);
        this.tableData = res.data.reduce((a, b) => {
          let tempObj = b.menu;
          tempObj.children = b.list;
          a.push(tempObj);
          return a;
        }, []);
      });
    }
  },
  created() {
    this.initMenuList();
  },
  components: {
    pagination
  },
  mixins: [pageMixin]
};
</script>

<style lang='scss' scoped>
</style>