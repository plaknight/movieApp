<template>
  <div class="imgs">
    <el-dialog
      title="选择图片"
      :visible.sync="dialogisShow"
      width="60%"
      :before-close="cancel"
    >
      <el-card style="margin:5px">
        <div slot="header" v-show="insertImgShow">
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
          <el-input :value="tempUrl" size="mini" ref="ipt"></el-input>
          <el-button
            size="mini"
            @click.native="copy($event)"
            style="marginTop: 10px"
            >copy</el-button
          >
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
            :class="activeId === item.id ? 'active' : ''"
          >
            <el-card
              style="height:100%; margin: 10px;"
              shadow="hover"
              @click.native="choseImg(item)"
            >
              <el-image
                :src="url.host + '/' + item.dir + '/' + item.fileName"
                style="width:100%;height:240px"
              ></el-image>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import materialApi from "@/api/xy/material";

import Pagination from "@/components/Pagination";

import pageMixin from "@/mixins/pageMixin";

import url from "@/api/url";

import { resetDataArr } from "@/utils/index";

import clip from "@/utils/clipboard.js";
import _ from "lodash";
export default {
  name: "material",
  components: {
    Pagination
  },
  mixins: [pageMixin],
  data() {
    return {
      dialogisShow: false,
      page: {
        pageSize: 12,
        pageSizes: [12, 24, 36]
      },
      showId: "",
      imgArr: [],
      url,
      fileList: [],
      activeId: "",
      tempUrl: "",
      insertImgShow: false
    };
  },
  methods: {
    copy(e) {
      clip(this.tempUrl, e);
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    cancel() {
      this.dialogisShow = false;
      this.insertImgShow = false;
      this.tempUrl = "";
    },
    resetList() {
      this.initImage();
    },
    choseImg(val) {
      console.log(val);
      this.activeId = val.id;
      this.tempUrl = url.host + "/" + val.dir + "/" + val.fileName;
    },
    //确定按钮
    confirm() {
      if (!this.insertImgShow) {
        this.$emit("imgUrl", this.tempUrl);
      } else {
        this.dialogisShow = false;
        this.tempUrl = "";
        this.activeId = "";
      }
    },
    openImgDialog(val) {
      this.dialogisShow = true;
      if (val) {
        this.insertImgShow = true;
      }
    },
    initImage() {
      materialApi
        .getMaterialList({
          start: this.page.currentPage,
          limit: this.page.pageSize
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
.imgs {
  .active {
    position: relative;
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      content: "√";
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      font-size: 32px;
      color: #67c23a;
    }
  }
}
</style>