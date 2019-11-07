<template>
  <div class="Student">
    <!-- 头部搜索框 -->
    <el-card shadow="hover" class="search-box">
      <div slot="header">
        <span>搜索框</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="4"
          ><el-input
            size="mini"
            placeholder="根据姓名查询"
            v-model="search.name"
            clearable
          >
          </el-input
        ></el-col>
        <el-col :span="4"
          ><el-select
            v-model="search.classId"
            placeholder="请选择班级"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            >
            </el-option> </el-select
        ></el-col>
        <el-col :span="4">
          <el-select
            v-model="search.dormId"
            placeholder="请选择宿舍"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in dormList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              size="mini"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="search.startTime"
            size="mini"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
            format="yyyy 年 MM 月 dd 日"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="5" align="right">
          <el-button type="primary" size="mini" @click="clearSearch"
            >刷新</el-button
          >
        </el-col>
        <el-col :span="2" align="left">
          <el-button type="primary" size="mini" @click="searchList"
            >查询</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 表单主体 -->
    <el-card class="tableConText">
      <div slot="header">
        <span
          ><el-button type="primary" size="small" @click="addStudent"
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
        <el-table-column prop="name" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="sexv" label="性别" width="50"> </el-table-column>
        <el-table-column
          prop="addTime"
          label="入学时间"
          show-overflow-tooltip
          width="100"
        >
        </el-table-column>
        <el-table-column prop="city" label="城市" width="200">
        </el-table-column>
        <el-table-column
          prop="dormname"
          label="宿舍"
          show-overflow-tooltip
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="classname"
          label="班级"
          show-overflow-tooltip
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="当前状态"
          show-overflow-tooltip
          width="200"
        >
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
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

      <!-- 弹窗 -->
      <detailDialog ref="detail" @reset-list="initPage"></detailDialog>

      <pagination :page="page" @initPages="initPage"></pagination>
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
//引入弹窗组件
import detailDialog from "./detail";
//引入lodash
import _ from "lodash";
// mixins
import pageMixin from "@/mixins/pageMixin";

//分页器
import pagination from "@/components/Pagination.vue";
export default {
  name: "Student",
  components: {
    detailDialog,
    pagination
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
      dormList: [],
      classList: [],
      CodeToText
    };
  },
  methods: {
    //获取class列表
    initClassList() {
      classApi.getClassList().then(res => {
        this.classList = res.data.list;
      });
    },
    //获取宿舍列表
    initDormList() {
      dormApi.getDormList().then(res => {
        this.dormList = res.data.list;
      });
    },
    //清空 并刷新 搜索
    clearSearch() {
      resetDataArr(this, "search");
      this.initPage("reset");
    },
    //查询
    searchList() {
      //还原分页器
      resetDataArr(this, "page");
      this.initPage();
    },
    //编辑按钮
    handleEdit(val) {
      // this.loading = true;
      console.log(val);
      this.$refs.detail.openDialog(val.id);
    },
    // 删除
    handleDelete(val) {
      this.loading = true;
      studentApi.deleteStudent(val.id).then(res => {
        if (res.code === true) {
          this.initPage();
        }
      });
    },

    // 增加学员
    addStudent() {
      this.$refs.detail.openDialog();
    },
    //init 重置列表
    initPage(val) {
      //判断是否为真,如果是,添加的时候跳到首页
      if (val) {
        this.page.currentPage = 1;
      }

      //过滤lodash
      var params = _.pickBy(this.search, item => item);
      studentApi
        .getStudentList({
          start: this.page.currentPage,
          limit: this.page.pageSize,
          ...params
        })
        .then(res => {
          this.tableData = res.data.list;
          this.cityToText(this.tableData);
          this.$message.success("Complete!!!");
          this.page.totalPage = res.data.totalRow;
          this.loading = false;
        });
    },
    cityToText(arr) {
      let newTableData = arr.map(el => {
        if (el.city) {
          el;
          return el.city.split(",").reduce((total, current) => {
            return (total = total + CodeToText[current]);
          }, "");
        } else {
          return undefined;
        }
      });
      newTableData.forEach((el, index) => {
        if (/[\u4e00-\u9fa5]/.test(el)) {
          this.tableData[index].city = el;
        } else {
          this.tableData[index].city = "";
        }
      });
    }
  },
  created() {
    this.initPage();
    this.initDormList();
    this.initClassList();
  }
};
</script>

<style lang='scss' scoped>
.Student {
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