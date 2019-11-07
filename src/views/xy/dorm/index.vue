<template>
  <div class="StudentDorm">
    <!-- 头部搜索框 -->
    <el-card shadow="hover" class="search-box">
      <div slot="header">
        <span>搜索框</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="5" :push="100">
           <el-input
            v-model="search.name"
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
          ><el-button type="primary" size="small" @click="addDorm"
            >新增</el-button
          ></span
        >
      </div>
      <!-- tabel 表单 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="宿舍名称" width="100">
        </el-table-column>
        <el-table-column prop="type" label="宿舍类型" width="100">
        </el-table-column>
        <el-table-column prop="bak" label="班级描述" width="200">
        </el-table-column>
        <el-table-column
          prop="position"
          label="宿舍位置"
          show-overflow-tooltip
          width="200"
        >
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
      <!-- 分页器 -->
      <pagination :page="page" @initPages="initDorm"></pagination>
      <!-- 弹窗 -->
      <dormDetail
        ref="dorm"
        @initDormList="initDorm"
      ></dormDetail>
    </el-card>
  </div>
</template>

<script>
//城市
import { regionData, CodeToText } from "element-china-area-data";
import studentApi from "@/api/xy/student.js";
// console.log(getStudentList)
import dormApi from "@/api/xy/dorm";

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
import dormDetail from "./dormDetail.vue";
export default {
  name: "Student",
  components: {
    pagination,
    dormDetail
  },
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      search: {
        name: "",
        classId: "",
        dormId: ""
      },
      tableData: [],
      CodeToText
    };
  },
  methods: {
    //刷新
    clearSearch() {
      resetDataArr(this,"search")
      this.initDorm()
    },
    //查询
    searchList() {
      //还原分页器
      resetDataArr(this,"page")
      this.initDorm()
    },
    //宿舍删除
    handleDelete(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dormApi
            .delDorm({
              id: val.id
            })
            .then(res => {
              if (res.code === true) {
                this.initDorm();
                this.$message({
                  type: "success",
                  message: "删除成功!"
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
    //宿舍编辑
    handleEdit(val) {
      this.$refs.dorm.openDialog(val.id);
    },
    //宿舍添加
    addDorm() {
      this.$refs.dorm.dialogFormVisible = true;
    },
    initDorm() {
      var params = _.pickBy(this.search,item=>item)
      dormApi
        .getDormList({
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
    transformText(arr){
        arr.forEach(el=>{
          if(el.type === 0){
            el.type = "男生宿舍"
          }else if(el.type === 1){
            el.type = "女生宿舍"
          }
        })
    }
  },
  created() {
    this.initDorm();
  }
};
</script>

<style lang='scss' scoped>
.StudentDorm {
  .search-box{
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