<template>
  <div class="dashboard-container">
    <el-row :gutter="30">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <h5>用户统计<svg-icon icon-class="people" class-name="custom-class" /></h5>
             <h5>总数: {{ userInfo.userCount }} </h5> 
            <h5>今日新增: {{ userInfo.userCountToday }}</h5>
          </div>
          <div id="user" style=""></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <h5>新闻统计</h5>
            <h5>总数: {{ newsInfo.newsCount }}</h5>
            <h5>今日新增: {{ newsInfo.newsCountToday }}</h5>
          </div>
          <div id="news"></div>
        </el-card>
      </el-col>
      <el-col :span="10" style="marginTop: 30px">
        <el-card>
          <div slot="header">
            <h5>图片统计</h5>
            <h5>总数: {{ imgInfo.imgCount }}</h5>
            <h5>今日新增: {{ imgInfo.imgCountToday }}</h5>
          </div>
          <div id="imgs"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

//引入api
import dashboardApi from "@/api/xy/dashboard";

var echarts = require("echarts");
export default {
  mounted() {},
  name: "Dashboard",
  data() {
    return {
      imgInfo: {
        imgCount: 0,
        imgCountToday: 0,
        imgCountByDay: ""
      },
      newsInfo: {
        newsCount: 0,
        newsCountToday: 0,
        newsCountByDay: ""
      },
      userInfo: {
        userCount: 0,
        userCountToday: 0,
        userCountByDay: ""
      }
    };
  },
  methods: {
    initDashboard() {
      dashboardApi.getDashboard().then(res => {
        this.imgInfo.imgCount = res.imgCount.count;
        this.newsInfo.newsCount = res.newsCount.count;
        this.userInfo.userCount = res.userCount.count;
        this.imgInfo.imgCountToday = res.imgCountToday.count;
        this.newsInfo.newsCountToday = res.newsCountToday.count;
        this.userInfo.userCountToday = res.userCountToday.count;
        this.initEchart("user", res.userCountByDay);
        this.initEchart("news", res.newsCountByDay);
        this.initEchart("imgs", res.imgCountByDay);
      });
    },
    initEchart(ele, arr) {
      var myChart = echarts.init(document.getElementById(ele));
      myChart.setOption({
          color: ['#3398DB'],
        title: {
          text: ele==="imgs"?"图片图表":(ele === "news"? "新闻图表": "用户图表")
        },
        tooltip: {},
        xAxis: {
          data: arr.reduce((a, b) => {
            a.push(b.date);
            return a;
          }, []),
          axisLabel:{
            rotate: 45
          }
        },
        yAxis: {},
        series: [
          {
            name: "数量",
            type: "bar",
            data: arr.reduce((a, b) => {
              a.push(b.count);
              return a;
            }, [])
          }
        ]
      });
    }
  },
  created() {
    this.initDashboard();
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  #user,
  #imgs,
  #news {
    width: 100%;
    height: 320px;
  }
}
</style>
