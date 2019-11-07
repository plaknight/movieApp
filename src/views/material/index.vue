<template>
  <div class="material">
    <el-card shadow="hover" class="search-box">
      <div slot="header">
        <span>搜索框</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="5" :push="100">
          <el-input
            v-model="search.title"
            size="mini"
            autocomplete="off"
            placeholder="请输入图片标题"
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

    <!-- 图片主体 -->
    <el-card style="margin:30px">
      <div slot="header">
        <el-upload
          class="upload-demo"
          action="/admin/xy/upload/uploadImg"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
          :on-success="resetList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
      <el-row>
        <el-col :span="24"
          ><Pagination
            :page="page"
            style="float:right"
            @initPages="initImage"
          ></Pagination
        ></el-col>
        <el-col
          :span="6"
          v-for="item in imgArr"
          :key="item.id"
          style="height:300px;margin: 10px 0 10px 0"
        >
          <el-card style="height:100%; margin: 10px;" shadow="hover">
            <el-image
              :src="url.host + '/' + item.dir + '/' + item.fileName"
              style="width:100%;height:240px"
            ></el-image>
            <div
              class="footer"
              style="display:flex;justify-content: space-between; align-items: center"
              v-show="item.id !== showId"
            >
              <el-tooltip
                content="双击设置标题"
                placement="bottom"
                effect="light"
              >
                <span
                  style="fontSize: 12px; color: #93393"
                  @dblclick="focus(item.id, $event)"
                  >{{ item.title ? item.title : "未定义" }}</span
                >
              </el-tooltip>
              <el-tooltip content="容量大小" placement="bottom" effect="light">
                <span style="fontSize: 12px; color: #93393"
                  >{{ item.size }} b</span
                >
              </el-tooltip>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="delImg(item.id)"
              ></el-button>
            </div>
            <el-input
              v-model="item.title"
              placeholder="请输入内容"
              size="mini"
              @keyup.enter.native="changeTitle(item.title, item.id)"
              v-show="item.id === showId"
              ref="ipt"
              @blur="changeTitle(item.title, item.id)"
            ></el-input>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//引入图片api
import materialApi from "@/api/xy/material";

import Pagination from "@/components/Pagination";

import pageMixin from "@/mixins/pageMixin";

import url from "@/api/url";

import { resetDataArr } from '@/utils/index';

import _ from "lodash";
export default {
  name: "material",
  components: {
    Pagination
  },
  mixins: [pageMixin],
  data() {
    return {
      search: {
        title:"",
      },
      page: {
        pageSize: 12,
        pageSizes: [12, 24, 36]
      },
      showId: "",
      imgArr: [],
      url,
      fileList: []
    };
  },
  methods: {
    resetList() {
      this.initImage();
    },
    handleRemove(file, fileList) {
      this.delImg(file.response.id)
    },
    handlePreview(file) {
      console.log(file);
    },
    //聚焦
    focus(id, e) {
      this.showId = id;
      this.$nextTick(() => {
        e.target.parentNode.nextElementSibling.children[0].focus();
      });
    },
    //删除图片
    delImg(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确定 取消
          materialApi.delImage({ id }).then(res => {
            if (res.code === "success") {
              this.$message({ type: "success", message: "删除成功" });
              this.initImage();
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
    //更改标题
    changeTitle(val, id) {
      materialApi.updateTitle({ title: val, id }).then(res => {
        if (res.code === "success") {
          this.$message({ type: "success", message: "修改成功" });
          this.initImage();
          this.showId = "";
        }
      });
    },
    clearSearch() {
        resetDataArr(this,"search")
        resetDataArr(this,"page")
        this.initImage()
    },
    searchList() {
      this.initImage()
    },
    initImage() {
      var params = _.pickBy(this.search,item=>item)
      materialApi
        .getMaterialList({
          start: this.page.currentPage,
          limit: this.page.pageSize,
          ...params
        })
        .then(res => {
          this.imgArr = res.data.list;
          this.page.totalPage = res.data.totalRow;
        });
    }
  },
  created() {
    this.initImage();
  }
};
</script>

<style lang='scss' scoped>
.material {
  .search-box {
    margin: 30px;
    // border: 10px solid
  }
}
</style>