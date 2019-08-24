<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="40">
      <el-form :inline="true">
        <el-col :xs="24" :sm="24" :md="10" :lg="12" class="text-center">
          <el-card class="box-card">
            <el-form-item label="推送提醒消息">
              <el-input
                v-model="pushParams.title"
                :placeholder="$t('table.pushMsg')"
                type="textarea"
                :rows="1"
                style="width: 280px"
                class="filter-item"
                size="medium"
                maxlength="30"
                show-word-limit
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button v-waves type="primary" size="medium" @click="pushMsg">
                {{ $t('table.confirmPush') }}
              </el-button>
            </el-form-item>
          </el-card>
        </el-col>
      </el-form>
      <el-form>
        <el-col :xs="24" :sm="24" :md="10" :lg="12">
          <el-card class="box-card">
            <el-form-item label="统计区间">
              <el-select v-model="params.days" :placeholder="$t('table.statisticDays')" size="medium" @change="changeDays">
                <el-option v-for="item in daysOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-card>
        </el-col>

      </el-form>

    </el-row>
    <panel-group :user-subscribe="userSubscribe" :total-data="totalData" @handleSetLineChartData="handleSetLineChartData" />
    <!--给订阅用户发送推送消息 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart v-if="allChartData.userNums.days.length" :height="lineHeight" :chart-data="lineChartData" />
    </el-row>

    <!--    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>-->

    <!--    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>-->
  </div>
</template>
<script>
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import { getNowFormatDate } from '@/utils'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import { getDaysStatistics, pushMsg } from '@/api/system'
import { getUserSubscribeNums } from '@/api/wechat'
import waves from '@/directive/waves' // Waves directive
import { Loading } from 'element-ui'

/* const lineChartData = {
  userNums: {
    data: [
      {
        title: '当天用户数',
        name: 'userNums',
        color: '#FF005A',
        lineColor: '#FF005A',
        data: [100, 120, 161, 134, 105, 160, 165]
      },
      {
        title: '总用户数',
        name: 'totalUserNums',
        color: '#3888fa',
        lineColor: '#3888fa',
        data: [120, 82, 91, 154, 162, 140, 145]
      }
    ],
    // userNums: [100, 120, 161, 134, 105, 160, 165],
    // totalUserNums: [120, 82, 91, 154, 162, 140, 145],
    title: ['当天用户数', '总用户数'],
    days: ['2019-07-24', '2019-07-25', '2019-07-26', '2019-07-27', '2019-07-28', '2019-07-29', '2019-07-30']
  },
  /!*  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
    days: ['2019-07-24', '2019-07-25', '2019-07-26', '2019-07-27', '2019-07-28', '2019-07-29', '2019-07-30']

  },*!/
  orders: {
    data: [
      {
        title: '当天订单数',
        name: 'orderNums',
        color: '#00defa',
        lineColor: '#00defa',
        data: [80, 45, 121, 87, 89, 90, 9]
      },
      {
        title: '当天文章订单数',
        naem: 'articleOrderNums',
        color: '#FF005A',
        lineColor: '#FF005A',
        data: [120, 45, 91, 154, 162, 140, 78]
      },
      {
        title: '当天课程订单数',
        naem: 'courseOrderNums',
        color: '#3888fa',
        lineColor: '#3888fa',
        data: [120, 82, 91, 54, 65, 140, 87]
      },
      {
        title: '文章订单总数',
        naem: 'totalArticleOrderNums',
        color: '#10fa17',
        lineColor: '#10fa17',
        data: [120, 82, 34, 154, 162, 140, 145]
      },
      {
        title: '课程订单总数',
        naem: 'totalCourseOrderNums',
        color: '#fac928',
        lineColor: '#fac928',
        data: [120, 82, 61, 84, 162, 140, 145]
      },
      {
        title: '订单总数',
        naem: 'totalOrderNums',
        color: '#42652c',
        lineColor: '#42652c',
        data: [120, 832, 931, 754, 162, 140, 145]
      }
    ],
    // orderNums: [80, 100, 121, 104, 105, 90, 100],
    // articleOrderNums: [120, 90, 100, 138, 142, 130, 130],
    // courseOrderNums: [120, 90, 100, 138, 142, 130, 130],
    // totalArticleOrderNums: [120, 90, 100, 138, 142, 130, 130],
    // totalCourseOrderNums: [120, 90, 100, 138, 142, 130, 130],
    // totalOrderNums: [120, 90, 100, 138, 142, 130, 130],
    title: ['当天订单数', '当天文章订单数', '当天课程订单数', '文章订单总数', '课程订单总数', '订单总数'],
    days: ['2019-07-24', '2019-07-25', '2019-07-26', '2019-07-27', '2019-07-28', '2019-07-29', '2019-07-30']

  },
  money: {
    data: [
      {
        title: '当天课程金额',
        name: 'courseMoney',
        color: '#00defa',
        lineColor: '#00defa',
        data: [80, 45, 121, 87, 89, 90, 9]
      },
      {
        title: '当天文章金额',
        name: 'articleMoney',
        color: '#ff1040',
        lineColor: '#ff1040',
        data: [80, 45, 121, 87, 89, 90, 9]
      },
      {
        title: '课程总金额',
        name: 'totalCourseMoney',
        color: '#fac928',
        lineColor: '#fac928',
        data: [80, 45, 121, 87, 89, 90, 9]
      },
      {
        title: '文章总金额',
        name: 'totalArticleMoney',
        color: '#bb17fa',
        lineColor: '#bb17fa',
        data: [80, 45, 121, 87, 89, 90, 9]
      },
      {
        title: '总金额',
        name: 'totalMoney',
        color: '#173177',
        lineColor: '#173177',
        data: [80, 45, 121, 87, 89, 90, 9]
      }
    ],
    // courseMoney: [130, 140, 141, 142, 145, 150, 160],
    // articleMoney: [120, 82, 91, 154, 162, 140, 130],
    // totalCourseMoney: [120, 82, 91, 154, 162, 140, 130],
    // totalArticleMoney: [120, 82, 91, 154, 162, 140, 130],
    // totalMoney: [120, 82, 91, 154, 162, 140, 130],
    title: ['当天课程金额', '当天文章金额', '课程总金额', '文章总金额', '总金额'],
    days: ['2019-07-24', '2019-07-25', '2019-07-26', '2019-07-27', '2019-07-28', '2019-07-29', '2019-07-30']
  }
}*/

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
    // RaddarChart,
    // PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  directives: { waves },
  data() {
    return {
      daysOptions: [
        {
          label: '2天',
          value: 2
        },
        {
          label: '5天',
          value: 5
        },
        {
          label: '7天',
          value: 7
        },
        {
          label: '10天',
          value: 10
        },
        {
          label: '15天',
          value: 15
        },
        {
          label: '30天',
          value: 30
        },
        {
          label: '60天',
          value: 60
        },
        {
          label: '180天',
          value: 180
        },
        {
          label: '365天',
          value: 365
        }
      ],
      pushParams: {
        title: ''
      },
      LoadingOptions: {
        lock: true,
        text: '正在加载...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      userSubscribe: 0,
      lineHeight: '400px',
      lineChartData: '',
      totalData: {
        totalUserNums: 0,
        totalOrderNums: 0,
        totalMoney: 0,
        subscribedUserNums: 0
      },
      allChartData: {
        userNums: {
          data: [
            {
              title: '新增用户',
              name: 'userNums',
              color: '#fa9b4d',
              lineColor: '#fa9b4d',
              data: []
            },
            {
              title: '总用户数',
              name: 'totalUserNums',
              color: '#00b912',
              lineColor: '#00b912',
              data: []
            }
          ],
          title: ['新增用户', '总用户数'],
          days: [],
          yName: '人'
        },
        orders: {
          data: [
            {
              title: '新增订单',
              name: 'orderNums',
              color: '#00defa',
              lineColor: '#00defa',
              data: []
            },
            {
              title: '新增文章订单',
              naem: 'articleOrderNums',
              color: '#a0d7d9',
              lineColor: '#a0d7d9',
              data: []
            },
            {
              title: '新增课程订单',
              naem: 'courseOrderNums',
              color: '#3888fa',
              lineColor: '#3888fa',
              data: []
            },
            {
              title: '文章订单总数',
              naem: 'totalArticleOrderNums',
              color: '#00b912',
              lineColor: '#00b912',
              data: []
            },
            {
              title: '课程订单总数',
              naem: 'totalCourseOrderNums',
              color: '#fac928',
              lineColor: '#fac928',
              data: []
            },
            {
              title: '订单总数',
              naem: 'totalOrderNums',
              color: '#ff1040',
              lineColor: '#ff1040',
              data: []
            }
          ],
          title: ['新增订单', '新增文章订单', '新增课程订单', '文章订单总数', '课程订单总数', '订单总数'],
          days: [],
          yName: '笔'
        },
        money: {
          data: [
            {
              title: '新增课程金额',
              name: 'courseMoney',
              color: '#00b912',
              lineColor: '#00b912',
              data: []
            },
            {
              title: '新增文章金额',
              name: 'articleMoney',
              color: '#fa7718',
              lineColor: '#fa7718',
              data: []
            },
            {
              title: '课程总金额',
              name: 'totalCourseMoney',
              color: '#fac928',
              lineColor: '#fac928',
              data: []
            },
            {
              title: '文章总金额',
              name: 'totalArticleMoney',
              color: '#bb17fa',
              lineColor: '#bb17fa',
              data: []
            },
            {
              title: '总金额',
              name: 'totalMoney',
              color: '#ff1040',
              lineColor: '#ff1040',
              data: []
            }
          ],
          title: ['新增课程金额', '新增文章金额', '课程总金额', '文章总金额', '总金额'],
          days: [],
          yName: '元'
        }
      },
      params: {
        days: 30 // 取三十天的统计数据
      }
    }
  },
  mounted() {
    this.getUserSubscribeNums()
    this.getDaysStatistics()
  },
  methods: {
    pushMsg() {
      if (this.pushParams.title) {
        this.$confirm('确定向所有参与课程学习的用户推送提醒消息吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loadingInstance6 = Loading.service(this.LoadingOptions)
          pushMsg(this.pushParams).then(response => {
            if (response.code === 200) {
              loadingInstance6.close()
              this.$notify({
                message: '推送成功',
                type: 'success'
              })
            } else {
              this.$notify({
                message: '推送失败',
                type: 'success'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消推送'
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请填写推送内容'
        })
      }
    },
    handleSetLineChartData(type) {
      this.lineChartData = this.allChartData[type]
    },
    getUserSubscribeNums() {
      getUserSubscribeNums().then(res => {
        if (res.code === 200) {
          // this.userSubscribe = res.data
          this.totalData = res.data
        }
      })
    },
    changeDays() {
      this.allChartData = {
        userNums: {
          data: [
            {
              title: '当天用户数',
              name: 'userNums',
              color: '#FF005A',
              lineColor: '#FF005A',
              data: []
            },
            {
              title: '总用户数',
              name: 'totalUserNums',
              color: '#3888fa',
              lineColor: '#3888fa',
              data: []
            }
          ],
          title: ['当天用户数', '总用户数'],
          days: []
        },
        orders: {
          data: [
            {
              title: '当天订单数',
              name: 'orderNums',
              color: '#00defa',
              lineColor: '#00defa',
              data: []
            },
            {
              title: '当天文章订单数',
              naem: 'articleOrderNums',
              color: '#FF005A',
              lineColor: '#FF005A',
              data: []
            },
            {
              title: '当天课程订单数',
              naem: 'courseOrderNums',
              color: '#3888fa',
              lineColor: '#3888fa',
              data: []
            },
            {
              title: '文章订单总数',
              naem: 'totalArticleOrderNums',
              color: '#10fa17',
              lineColor: '#10fa17',
              data: []
            },
            {
              title: '课程订单总数',
              naem: 'totalCourseOrderNums',
              color: '#fac928',
              lineColor: '#fac928',
              data: []
            },
            {
              title: '订单总数',
              naem: 'totalOrderNums',
              color: '#42652c',
              lineColor: '#42652c',
              data: []
            }
          ],
          title: ['当天订单数', '当天文章订单数', '当天课程订单数', '文章订单总数', '课程订单总数', '订单总数'],
          days: []
        },
        money: {
          data: [
            {
              title: '当天课程金额',
              name: 'courseMoney',
              color: '#00defa',
              lineColor: '#00defa',
              data: []
            },
            {
              title: '当天文章金额',
              name: 'articleMoney',
              color: '#ff1040',
              lineColor: '#ff1040',
              data: []
            },
            {
              title: '课程总金额',
              name: 'totalCourseMoney',
              color: '#fac928',
              lineColor: '#fac928',
              data: []
            },
            {
              title: '文章总金额',
              name: 'totalArticleMoney',
              color: '#bb17fa',
              lineColor: '#bb17fa',
              data: []
            },
            {
              title: '总金额',
              name: 'totalMoney',
              color: '#173177',
              lineColor: '#173177',
              data: []
            }
          ],
          title: ['当天课程金额', '当天文章金额', '课程总金额', '文章总金额', '总金额'],
          days: []
        }
      }
      this.getDaysStatistics()
    },
    getDaysStatistics() {
      // this.lineChartData = this.allChartData.userNums
      // const now = new Date()
      // const nowDate = [now.getFullYear(), (now.getMonth() + 1), now.getDate()].join('-')
      getDaysStatistics(this.params).then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            this.allChartData.userNums.days.push(item.recordDate)
            this.allChartData.userNums.data[0].data.push(item.userNums)
            this.allChartData.userNums.data[1].data.push(item.totalUserNums)

            this.allChartData.orders.days.push(item.recordDate)
            this.allChartData.orders.data[0].data.push(item.orderNums)
            this.allChartData.orders.data[1].data.push(item.articleOrderNums)
            this.allChartData.orders.data[2].data.push(item.courseOrderNums)
            this.allChartData.orders.data[3].data.push(item.totalArticleOrderNums)
            this.allChartData.orders.data[4].data.push(item.totalCourseOrderNums)
            this.allChartData.orders.data[5].data.push(item.totalOrderNums)

            this.allChartData.money.days.push(item.recordDate)
            this.allChartData.money.data[0].data.push(item.courseMoney)
            this.allChartData.money.data[1].data.push(item.articleMoney)
            this.allChartData.money.data[2].data.push(item.totalCourseMoney)
            this.allChartData.money.data[3].data.push(item.totalArticleMoney)
            this.allChartData.money.data[4].data.push(item.totalMoney)
            // 最后一天也就是最新的一天的数据中取出总量 getNowFormatDate() === item.recordDate
            /* if (item.recordDate === res.data[res.data.length - 1].recordDate) {
              this.totalData = {
                totalUserNums: item.totalUserNums,
                totalOrderNums: item.totalOrderNums,
                totalMoney: item.totalMoney
              }
            }*/
          })
          this.lineChartData = this.allChartData.userNums
          console.log(this.allChartData)
          console.log(this.totalData)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
