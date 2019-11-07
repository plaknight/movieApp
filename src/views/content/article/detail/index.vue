<template>
  <div class="detail">
    <el-dialog
      title="编辑"
      :visible.sync="dialogFormVisible"
      width="60%"
      :before-close="cancel"
    >
      <el-form :model="form">
        <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item label="文章标题" width>
              <el-input
                v-model="form.title"
                autocomplete="off"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作者">
              <el-input
                v-model="form.author"
                autocomplete="off"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="摘要">
          <el-input
            v-model="form.desc"
            autocomplete="off"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="最热">
          <el-switch
            v-model="form.hot"
            active-color="#13ce66"
            inactive-color="#939393"
            active-value="1"
            inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          label="封面图片"
          style="display: flex;align-items: center;"
        >
          <el-button type="primary" @click="showChangeImg" size="mini"
            >选择图片</el-button
          >
          <img
            :src="form.cover"
            alt=""
            style="width: 45px;height: 45px; marginLeft: 30px"
          />
          <el-button type="text" @click="delImg" v-show="form.cover"
            >删除</el-button
          >
        </el-form-item>
        <el-form-item label="文章显示封面">
          <el-switch
            v-model="form.coverShow"
            active-color="#13ce66"
            inactive-color="#939393"
            active-value="1"
            inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="切换富文本类型">
          <el-radio-group v-model="form.type" @change="clearContext">
            <el-radio label="0">富文本</el-radio>
            <el-radio label="1">markedown</el-radio>
          </el-radio-group>
          <el-tag type="warning" size="mini" style="marginLeft: 30px;"
            >切换编辑器会清空内容,请谨慎操作.</el-tag
          >
          <el-button
            type="primary"
            @click="insertImg"
            size="mini"
            style="marginLeft: 30px;"
            >插入素材↓↓↓</el-button
          >
        </el-form-item>
        <el-form-item>
          <Tinymce
            v-show="form.type === '0'"
            v-model="form.content1"
            ref="Tin"
          ></Tinymce>
          <MarkdownEditor
            v-show="form.type === '1'"
            v-model="form.content1"
            ref="md"
          ></MarkdownEditor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <imgCom ref="imgs" @imgUrl="tempImg"></imgCom>
  </div>
</template>

<script>
//引入富文本组件
import Tinymce from "@/components/Tinymce";
//引入markdown
import MarkdownEditor from "@/components/MarkdownEditor";

import imgCom from "./img/index";
//重置
import { resetDataArr } from "@/utils/index";
import articleApi from "@/api/content/article";
export default {
  name: "detail",
  components: {
    Tinymce,
    MarkdownEditor,
    imgCom
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        title: "",
        author: "",
        hot: "",
        type: "0",
        zanCount: "0",
        viewCount: "0",
        coverShow: 0,
        desc: "",
        content1: "",
        content2: "",
        cover: ""
      }
    };
  },
  watch: {},
  methods: {
    //鼠标光标的位置
    textPositioin(){
     
    },
    //插入素材按钮
    insertImg() {
      this.$refs.imgs.openImgDialog("inserted");
    },
    //切换的时候清空
    clearContext() {
      this.$nextTick(() => {
        if (this.form.type === "0") {
          this.$refs.Tin.setContent("");
        } else {
          this.$refs.md.setValue("");
        }
      });
    },
    //取消按钮
    cancel() {
      if (this.form.type == "0") {
        this.$refs.Tin.setContent(" ");
      } else {
        this.$refs.md.setValue(" ");
      }
      this.form = this.$options.data().form;
      this.dialogFormVisible = false;
    },
    //图片删除
    delImg() {
      this.form.cover = "";
    },
    openDialog(id) {
      this.dialogFormVisible = true;
      //判断id是否存在 来标记编辑和新增的区别
      if (id) {
        articleApi.editArticle({ id }).then(res => {
          this.form = res.data;
          this.$nextTick(() => {
            {
              //判断type类型
              if (this.form.type === "0") {
                if(this.form.content1 === null){
                  return false
                }
                this.$refs.Tin.setContent(this.form.content1);
              } else {
                this.$refs.md.setValue(this.form.content1);
              }
            }
          });
        });
      }
    },
    showChangeImg() {
      this.$refs.imgs.openImgDialog();
    },
    submit() {
      //提交之前判断是富文本和makedown编辑器
      if (this.form.type === "0") {
        //如果是富文本 那么 content1的值和content2的值是一样的
        this.form.content2 = this.form.content1;
      } else {
        this.form.content2 = this.$refs.md.getHtml();
      }

      //判断
      var api;
      if (this.form.id) {
        api = articleApi.updateArticle;
      } else {
        api = articleApi.saveArticle;
      }
      api({
        xyNews: {
          ...this.form
        }
      }).then(res => {
        if (res.code === "success") {
          this.dialogFormVisible = false;
          this.$message({ type: "success", message: "complete!" });
          this.$emit("initArticle");
          resetDataArr(this, "form");
        }
      });
    },
    tempImg(val) {
      this.form.cover = val;
    }
  }
};
</script>

<style lang='scss' scoped>
</style>