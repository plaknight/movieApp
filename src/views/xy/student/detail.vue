<template>
  <div class="StudentDetail">
    <!-- 表单信息弹窗 -->
    <el-dialog
      title="信息列表"
      :visible.sync="dialogFormVisible"
      :before-close="cancel"
    >
      <el-form
        :model="form"
        label-width="100px"
        size="mini"
        :rules="rules"
        ref="form"
      >
        <el-card>
          <div slot="header">
            <span>主要信息</span>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="form.name"
                  size="mini"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别">
                <el-radio v-model="form.sex" label="0">男</el-radio>
                <el-radio v-model="form.sex" label="1">女</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班级">
                <el-select v-model="form.classId" placeholder="请选择班级">
                  <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.className"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="宿舍">
                <el-select v-model="form.dormId" placeholder="请选择宿舍">
                  <el-option
                    v-for="item in dormList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="城市">
                <el-cascader
                  size="small"
                  :options="options"
                  v-model="selectedOptions"
                  @change="handleChange"
                >
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学校">
                <el-input
                  v-model="form.school"
                  size="mini"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <div slot="header">
            <span>补充信息</span>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="紧急电话">
                <el-input
                  v-model="form.tel2"
                  size="mini"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作">
                <el-input
                  v-model="form.oldJob"
                  size="mini"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="微信">
                <el-input
                  v-model="form.wx"
                  size="mini"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="qq">
                <el-input
                  v-model="form.qq"
                  size="mini"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号码">
                <el-input
                  v-model="form.tel"
                  size="mini"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <el-form size="mini" :model="paymentData">
        <el-card>
          <div slot="header">
            <span>缴费信息</span>
            <el-button
              type="primary"
              style="float: right; margin-bottom: 20px"
              @click="paymentisShow"
              size="mini"
              >添加费用</el-button
            >
          </div>
          <el-row v-show="paymentShow">
            <el-col :span="8">
              <el-form-item label="缴费类型">
                <el-select
                  v-model="paymentData.costType"
                  placeholder="缴费类型"
                >
                  <el-option
                    v-for="item in costTypeList"
                    :key="item.type"
                    :label="item.text"
                    :value="item.type"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="金额">
                <el-input
                  v-model="paymentData.costValue"
                  size="mini"
                  autocomplete="off"
                  width="200"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="marginLeft: 30px">
              <el-form-item label="缴费时间">
                <el-date-picker
                  v-model="paymentData.costTime"
                  size="mini"
                  type="date"
                  placeholder="选择缴费时间"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  autosize
                  placeholder="请输入备注"
                  v-model="paymentData.costBak"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :push="18">
              <el-button size="small" @click="cancel">取 消</el-button>
              <el-button size="small" type="primary" @click="addPayment"
                >确 定</el-button
              >
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="costType" label="缴费类型"></el-table-column>
        <el-table-column prop="costTime" label="缴费时间"></el-table-column>
        <el-table-column prop="costValue" label="缴费金额"></el-table-column>
        <el-table-column prop="costBak" label="备注说明"></el-table-column>
        <el-table-column label="操作" fixed="right" >
          <template slot-scope="scope">
            <el-button
              v-show="scope.row.tempId"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id,scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import studentApi from "@/api/xy/student.js";

import dormApi from "@/api/xy/dorm";

import classApi from "@/api/xy/clazz";
//引入重置
import { resetDataArr } from "@/utils";

import { regionData } from "element-china-area-data";
//引入省市区
//引入mock生成id
const Mock = require("mockjs");
const Random = Mock.Random;
console.log(Mock);
export default {
  name: "studentDetail",
  data() {
    return {
      options: regionData,
      selectedOptions: [],
      // 弹窗的表单和隐藏
      dialogFormVisible: false,
      //宿舍列表
      dormList: [],
      classList: [],
      //缴费明细
      paymentData: {
        costType: "",
        costBak: "",
        costTime: "",
        costValue: "",
        tempId: Random.guid()
      },
      //缴费显示
      paymentShow: false,
      tableData: [],
      //缴费类型
      costTypeList: [{ type: 0, text: "住宿费" }, { type: 1, text: "学费" }],
      form: {
        name: "",
        sex: "",
        address: "",
        dormId: "",
        city: "",
        school: "",
        classId: ""
      },
      loading: false,
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getClassList();
    this.getDormList();
  },
  methods: {
    //paymentShow显示
    paymentisShow() {
      this.paymentShow = !this.paymentShow;
      console.log(this.tableData);
    },
    //删除
    handleDelete(id,val) {
      console.log(val)
      let idx = this.tableData.findIndex(el => el.id === id);
      this.tableData.splice(idx, 1);
    },
    //临时添加的
    addPayment() {
      this.paymentShow = false
      this.tableData.push(this.paymentData);
      resetDataArr(this,"paymentData")
    },

    //城市选择触发
    handleChange(val) {
      this.form.city = val.toString();
    },
    //获取宿舍列表
    getClassList() {
      classApi.getClassList().then(res => {
        this.classList = res.data.list;
      });
    },
    getDormList() {
      dormApi.getDormList().then(res => {
        this.dormList = res.data.list;
      });
    },
    openDialog(id) {
      if (id) {
        studentApi.editStudent(id).then(res => {
          this.form = res.data;
          if (this.form.city) {
            this.selectedOptions = this.form.city.split(",");
          }
        });
        studentApi.paymentCost({ userId: id }).then(res => {
          this.tableData = res.data.list;
          this.tableData.forEach((el)=>{
             el.costType = el.costType ? "住宿费" : "学费"
          })
        });
      }
      this.dialogFormVisible = true;
    },
    //取消按钮
    cancel() {
      resetDataArr(this, "form");
      resetDataArr(this, "selectedOptions");
      resetDataArr(this, "tableData");
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
    },
    // 增加学员 和 更新学员信息
    add() {
      this.$refs.form.validate(valid => {
        if (valid) {
          var api;
          var flag;
          console.log(this.form);
          if (this.form.id) {
            api = studentApi.updateStudent;
          } else {
            api = studentApi.saveStudent;
            flag = true;
          }
          let tempObj = {};
          let num = 0;
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].tempId) {
              tempObj["xyCostItems_" + num] = this.tableData[i];
              num++
            }
          }
          api({
            xyUser: {
              ...this.form
            },
            _size: num,
            ...tempObj
          }).then(res => {
            if (res.code === "success") {
              this.$message.success("保存成功!");
              this.$emit("reset-list", flag);
              this.dialogFormVisible = false;
              //重置
              resetDataArr(this, "form");
              resetDataArr(this, "selectedOptions");
            } else {
              this.$message.error("保存失败!");
            }
          });
        } else {
          this.$message.error("请注意验证规则!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
</style>