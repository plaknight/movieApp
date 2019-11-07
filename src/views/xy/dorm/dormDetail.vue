<template>
  <div class="dormDetail">
    <!-- 表单信息弹窗 -->
    <el-dialog
      width="30%"
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
        <el-form-item label="宿舍名称" prop="name">
          <el-input
            v-model="form.name"
            size="mini"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="宿舍类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="(item,index) in dormList"
              :key="item + index"
              :label="item.type === 0 ?'男生宿舍': item.type ? '女生宿舍':'未定'"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宿舍地址">
          <el-input
            v-model="form.position"
            size="mini"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="开班时间">
          <el-date-picker
            v-model="form.startTime"
            size="mini"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结课时间">
          <el-date-picker
            v-model="form.endTime"
            size="mini"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="班级描述">
          <el-input
            v-model="form.bak"
            size="mini"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dormApi from '@/api/xy/dorm'
import { resetDataArr } from "@/utils";

export default {
  name: "dormDetail",
  // props:{
  //     dormList:{
  //         type: Array
  //     }
  // },
  data() {
    return {
      form: {
        name: "",
        endTime: "",
        startTime: "",
        type: "",
        position: "",
        bak: ""
      },
      options: [],
      dialogFormVisible: false,
      rules: {},
      dormList:[{type: 0},{type: 1},{type: null}]
    };
  },
  methods: {
    //openDialog
    openDialog(id){
      //如果id存在,那么就是点击了编辑按钮
      
      if(id){
        
        dormApi.getDormDetail({id})
        .then(res=>{
          console.log("jinru")
          this.form = res.data
          this.dialogFormVisible = true
        })
      }
    },
    //取消按钮
    cancel() {
      this.dialogFormVisible = false;
      console.log(this.dormList)
      resetDataArr(this,"form")
    },
    //确定按钮
    add() {
      var api
      //判断api是否存在否
      console.log(this.form)
      if(this.form.id){
        api = dormApi.updateDorm
      }else{
        api = dormApi.addDorm
      }
      this.dialogFormVisible = false;
      api({
          xyDormInfo: {
              ...this.form
          }
      }).then((res)=>{
          if(res.code === true){
              this.$emit('initDormList')
              resetDataArr(this,"form")
          }
      })
    }
  },
  created () {
      
  }
};
</script>

<style lang='scss' scoped>
</style>