<template>
  <div class="articles">
    <el-card shadow="hover" class="search-box" style="margin: 30px">
      <div slot="header">
        <span>搜索框</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="5" :push="100">
          <el-input
            v-model="search.title"
            size="mini"
            autocomplete="off"
            placeholder="请输入文章标题"
          ></el-input>
        </el-col>
        <el-col :span="5" :push="100">
          <el-input
            v-model="search.author"
            size="mini"
            autocomplete="off"
            placeholder="请输入作者名称"
          ></el-input>
        </el-col>
        <el-col :span="2" align="right">
          <el-button type="primary" size="small" @click="clearSearch"
            >刷新</el-button
          >
        </el-col>
        <el-col :span="2" align="left">
          <el-button type="primary" size="small" @click="initArticle"
            >查询</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <!-- 表单主体 -->
    <el-card class="tableConText" style="margin: 30px">
      <div slot="header">
        <span
          ><el-button type="primary" size="small" @click="addArticle"
            >新增</el-button
          ></span
        >
        <pagination
          :page="page"
          @initPages="initArticle"
          style="float:right"
        ></pagination>
      </div>
      <!-- tabel 表单 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="title" label="文章标题" width="100">
        </el-table-column>
        <el-table-column prop="desc" label="描述" width="120">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="添加时间"
          show-overflow-tooltip
          width="100"
        >
        </el-table-column>
        <el-table-column prop="author" label="作者" width="100">
        </el-table-column>
        <el-table-column label="是否最热" show-overflow-tooltip width="100">
          <template v-slot="scope">
            {{ scope.row.hot === 0 ? "否" : "是" }}
          </template>
        </el-table-column>
        <el-table-column label="阅读量 / 赞" show-overflow-tooltip width="200">
          <template v-slot="scope">
            {{ +scope.row.viewCount + " / " + +scope.row.zanCount }}
          </template>
        </el-table-column>
        <el-table-column label="封面图片" show-overflow-tooltip width="200">
          <template v-slot="scope">
            <img
              :src="scope.row.cover"
              alt=""
              style="width: 45px;height: 45px;"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="240" align="center">
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
    </el-card>
    <!-- 弹窗 -->
    <detail ref="Articledetail" @initArticle="initArticle"></detail>
  </div>
</template>

<script>
import articleApi from "@/api/content/article";

import pageMixin from "@/mixins/pageMixin";

//分页器
import pagination from "@/components/Pagination.vue";

import detail from "./detail";

import { resetDataArr } from "@/utils/index";

import _ from "lodash";
export default {
  name: "articles",
  components: {
    pagination,
    detail
  },
  mixins: [pageMixin],
  data() {
    return {
      search: {
        title: "",
        author: ""
      },
      tableData: [],
      loading: false
    };
  },
  methods: {
    addArticle() {
      this.$refs.Articledetail.openDialog();
    },

    //删除
    handleDelete(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          articleApi.delArticle({
             id: val.id
           }).then(res => {
              if (res.code === "success") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.initArticle();
              }
            })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //编辑
    handleEdit(val) {
      this.$refs.Articledetail.openDialog(val.id);
    },

    clearSearch() {
      //清空输入框的值,并且
      resetDataArr(this,"search")
      this.initArticle()
    },
    initArticle() {
      var params = _.pickBy(this.search,item=>item)
      articleApi
        .articleList({
          start: this.page.currentPage,
          limit: this.page.pageSize,
          ...params
        })
        .then(res => {
          this.tableData = res.data.list;
          this.page.totalPage = res.data.totalRow;
        });
    }
  },
  created() {
    this.initArticle();
  }
};
</script>

<style lang='scss' scoped>
</style>