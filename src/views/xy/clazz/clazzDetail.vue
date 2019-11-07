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
        <el-form-item label="班级名称" prop="name">
          <el-input
            v-model="form.className"
            size="mini"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="(item,index) in classList"
              :key="item + index"
              :label="item.type === 0 ?'H5前端': 'UI设计'"
              :value="item.type"
            >
            </el-option>
          </el-select>
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
            v-model="form.desc"
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
import clazzApi from '@/api/xy/clazz'
import { resetDataArr } from "@/utils";

export default {
  name: "dormDetail",
  data() {
    return {
      form: {
        className: "",
        endTime: "",
        startTime: "",
        type: "",
        desc: ""
      },
      options: [],
      dialogFormVisible: false,
      rules: {},
      classList:[{type: 0},{type: 1}]
    };
  },
  methods: {
    //openDialog
    openDialog(id){
      //如果id存在,那么就是点击了编辑按钮    
      if(id){        
        clazzApi.getClassMsg({id})
        .then(res=>{
        //   console.log("jinru")
          this.dialogFormVisible = true
          this.form = res.data
          console.log(res)
        })
      }else{
          this.dialogFormVisible = true
      }
    },
    //取消按钮
    cancel() {
      this.dialogFormVisible = false;
      resetDataArr(this,"form")
    },
    //确定按钮
    add() {
        var api
        if(this.form.id){
             api = clazzApi.updateClass
        }else{
            api =clazzApi.addClass
        }
        api({
            xyClassInfo:{...this.form}
        }).then(res=>{
            if(res.code === true){
                resetDataArr(this,"form")
                  this.$message({
                  type: "success",
                  message: "添加成功!"
                });
                this.$emit('initClass',"1")
                this.dialogFormVisible = false;
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