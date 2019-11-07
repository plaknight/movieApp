<template>
  <div class="clazz">
    <!-- 头部搜索框 -->
    <el-card shadow="hover" class="search-box">
      <div slot="header">
        <span>搜索框</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="5" :push="100">
          <el-input
            v-model="search.className"
            size="mini"
            autocomplete="off"
          ></el-input>
        </el-col>
        <el-col :span="2" align="right">
          <el-button type="primary" size="small" @click="clearSearch"
            >刷新</el-button
          >
        </el-col>
        <el-col :span="2" align="left">
          <el-button type="primary" size="small" @click="searchList"
            >查询</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 表单主体 -->
    <el-card class="tableConText">
      <div slot="header">
        <span
          ><el-button type="primary" size="small" @click="addClass"
            >新增</el-button
          ></span
        >
      </div>
      <!-- tabel 表单 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="className" label="班级名称" width="100">
        </el-table-column>
        <el-table-column prop="type" label="班级类型" width="100">
        </el-table-column>
        <el-table-column prop="desc" label="班级描述" width="200">
        </el-table-column>
        <el-table-column prop="startTime" label="开班时间" width="200">
        </el-table-column>
        <el-table-column prop="endTime" label="结课时间" width="200">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination :page="page" @initPages="initClass"></pagination>
    </el-card>
    <clazzDetail ref="clazz" @initClass="initClass"></clazzDetail>
  </div>
</template>

<script>
//城市
import { regionData, CodeToText } from "element-china-area-data";

import classApi from "@/api/xy/clazz";
//引入重置
import { resetDataArr } from "@/utils";

//引入lodash
import _ from "lodash";
// mixins
import pageMixin from "@/mixins/pageMixin";

//分页器
import pagination from "@/components/Pagination.vue";
//弹窗
import clazzDetail from "./clazzDetail.vue";
export default {
  name: "clazz",
  components: {
    pagination,
    clazzDetail
  },
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      search: {
        className: ""
      },
      tableData: [],
      CodeToText
    };
  },
  methods: {
    //刷新
    clearSearch() {
      resetDataArr(this, "search");
      resetDataArr(this, "page");
      this.initClass();
    },
    //查询
    searchList() {
      //还原分页器
      resetDataArr(this, "page");
      this.initClass();
    },
    //宿舍删除
    handleDelete(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确定 取消
          classApi.delClass({ id: val.id }).then(res => {
            if (res.code === true) {
              this.$message({ type: "success", message: "删除成功" });
              this.initClass();
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
    //班级编辑
    handleEdit(val) {
      this.$refs.clazz.openDialog(val.id);
    },
    //班级添加
    addClass() {
      resetDataArr(this, "search");
      this.$refs.clazz.openDialog();
    },
    initClass(val) {
      if (val) {
        resetDataArr(this, "page");
      }
      var params = _.pickBy(this.search, item => item);
      classApi
        .getClassList({
          start: this.page.currentPage,
          limit: this.page.pageSize,
          ...params
        })
        .then(res => {
          this.tableData = res.data.list;
          this.transformText(this.tableData)
          this.page.totalPage = res.data.totalRow;
        });
    },
    transformText(arr) {
      arr.forEach(el => {
        if (el.type === 0 ) {
          el.type = "H5前端";
        } else if (el.type === 1) {
          el.type = "UI设计";
        }
      });
    }
  },
  created() {
    this.initClass();
  }
};
</script>

<style lang='scss' scoped>
.clazz {
  .search-box {
    margin: 30px;
  }
  .tableConText {
    margin: 30px;
  }
  .pagination {
    margin-top: 30px;
  }
}
</style>