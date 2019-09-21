<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.article_name" :placeholder="$t('table.article_name')" style="width: 220px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
      <el-input v-model="listQuery.course_name" :placeholder="$t('table.course_name')" style="width: 220px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
      <!--<el-input v-model="listQuery.openid" placeholder="Openid" style="width: 200px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />-->
      <el-select v-model="listQuery.user" v-loadmore="loadmoreUserOption" :placeholder="$t('table.chooseUser')" style="width: 200px" class="filter-item" size="small" filterable clearable>
        <el-option
          v-for="item in userlists"
          :key="item.id"
          :label="item.nickname"
          :value="item.id"
        >
          <div>
            <div style="width: 40px; height: 40px; float: left">
              <img :src="item.headimgurl" width="30" height="30" style="border-radius: 50%" alt="">
            </div>
            <div style="float: right;">
              <span style="color: #8492a6; font-size: 13px">{{ item.nickname }}</span>
            </div>
          </div>

        </el-option>
      </el-select>
      <el-select v-model="listQuery.status" :placeholder="$t('table.chooseOrderStatus')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.orderType" placeholder="选择订单类型" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" size="small" @click="handleFilterNow">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item" size="small" plain @click="clearFilter">重 置</el-button>
      <el-tooltip effect="dark" :content="$t('table.refresh')" placement="top">
        <el-button
          v-waves
          class="filter-item"
          type="default"
          size="small"
          icon="el-icon-refresh"
          plain
          @click="getList"
        />
      </el-tooltip>
    </div>

    <el-table v-loading="listLoading" :data="list" :fit="fitWidth" size="small" height="520" stripe highlight-current-row style="width: 100%" border>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="orderId">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="uuid">
              <span>{{ props.row.uuid }}</span>
            </el-form-item>
            <el-form-item label="OPENID">
              <span>{{ props.row.openid }}</span>
            </el-form-item>
            <el-form-item label="用户姓名">
              <span>{{ props.row.userName === null|| props.row.userName ===''? '暂无': props.row.userName }}</span>
            </el-form-item>
            <el-form-item label="电话号">
              <span>{{ props.row.phone === null||props.row.phone === ''? '暂无': props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="用户微信昵称">
              <span>{{ props.row.user.nickname }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文章标题" width="240px">
        <template slot-scope="scope">
          <span>{{ scope.row.article_name ? scope.row.article_name : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="课程标题" width="240px">
        <template slot-scope="scope">
          <span>{{ scope.row.course_name ? scope.row.course_name : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="下单微信昵称">
        <template slot-scope="{row}">
          <span>{{ row.user === null|| row.user === '' ? '无' : row.user.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="订单价格">
        <template slot-scope="scope">
          <span>{{ scope.row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="文章单价">
        <template slot-scope="scope">
          <span>{{ scope.row.article ? scope.row.article.pay_price : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="课程单价">
        <template slot-scope="scope">
          <span>{{ scope.row.course ? scope.row.course.price : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="文章难度">
        <template slot-scope="scope">
          <span>{{ scope.row.article ? (scope.row.article.article_grade) : '' | gradeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="支付方式">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_type === 1? '微信支付': '其他' }}</span>
        </template>
      </el-table-column>
      <!-- //0 默认新创建  1 预支付创建 2 已支付  3 申请退款中 4 退款完成-->
      <el-table-column class-name="status-col" label="订单状态" width="100">
        <template slot-scope="{row}">
          <el-tag size="small">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="下单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.order_time }}</span>
          <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        </template>
      </el-table-column>

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>-->

      <!--     <el-table-column min-width="300px" label="Title">
        <template slot-scope="{row}">
          <router-link :to="'/example/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>-->

      <el-table-column align="left" label="订单操作" width="140">
        <template slot-scope="scope">
          <!--退款-->
          <el-tooltip class="item" effect="dark" content="退款" placement="top-start">
            <el-button v-show="scope.row.status === 2" type="success" icon="el-icon-check" size="mini" circle />
          </el-tooltip>
          <el-tooltip v-show="scope.row.status !== 5" class="item" effect="dark" content="作废" placement="top-start">
            <el-button type="warning" icon="el-icon-scissors" size="mini" circle @click="handleChangeOrder(scope.row.id)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button v-show="scope.row.status === 5" type="danger" icon="el-icon-delete" size="mini" circle @click="handleDeleteOrder(scope.row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchArticleOrderList, deleteOrderById, changeOrderStatusById } from '@/api/article'
import { getUserListOnly as getUserList } from '@/api/wechat'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import loadmore from '@/directive/loadmore'
import { Loading } from 'element-ui'

export default {
  name: 'ArticleList',
  components: { Pagination },
  directives: { waves, loadmore },
  filters: {
    // //0 默认新创建  1 预支付创建 2 已支付  3 申请退款中 4 退款完成 5作废
    statusFilter(status) {
      switch (status) {
        case 1 :
          return '预支付创建'
        case 0 :
          return '新创建'
        case 2 :
          return '已支付'
        case 3 :
          return '申请退款中'
        case 4 :
          return '退款完成'
        case 5 :
          return '已作废'
        default:
          break
      }
    },
    gradeFilter(grade) {
      switch (grade) {
        case 0 :
          return '高中'
        case 1 :
          return 'CET-4'
        case 2 :
          return 'CET-6'
        case 3 :
          return '雅思'
        case 4 :
          return '托福'
        case 5 :
          return '专6'
        case 6 :
          return '专8'
        default:
          break
      }
    },
    parseUTCtime(UTCDateString) {
      if (!UTCDateString) {
        return '-'
      }
      function formatFunc(str) { // 格式化显示
        return str > 9 ? str : '0' + str
      }
      const date2 = new Date(UTCDateString) // 这步是关键
      const year = date2.getFullYear()
      const mon = formatFunc(date2.getMonth() + 1)
      const day = formatFunc(date2.getDate())
      let hour = date2.getHours()
      const noon = hour >= 12 ? 'PM' : 'AM'
      hour = hour >= 12 ? hour - 12 : hour
      hour = formatFunc(hour)
      const min = formatFunc(date2.getMinutes())
      return year + '-' + mon + '-' + day + ' ' + noon + ' ' + hour + ':' + min
    }
  },
  data() {
    return {
      list: null,
      fitWidth: true,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        orderType: '0',
        article_name: '',
        course_name: '',
        user: ''
      },
      userParams: {
        page: 1,
        limit: 20
      },
      userlists: [],
      userTotal: null,
      orderType: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '文章订单',
          value: '1'
        },
        {
          label: '课程订单',
          value: '2'
        }
      ],
      LoadingOptions: {
        lock: true,
        text: '正在加载...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      orderStatus: [
        {
          label: '新创建',
          value: 0
        },
        {
          label: '预支付创建',
          value: 1
        },
        {
          label: '已支付',
          value: 2
        },
        {
          label: '申请退款中',
          value: 3
        },
        {
          label: '退款完成',
          value: 4
        },
        {
          label: '订单作废',
          value: 5
        }
      ]
    }
  },
  created() {
    this.getList()
    this.loadUserList()
  },
  methods: {
    loadmoreUserOption() {
      // 加载用户选项
      this.userParams.page = this.userParams.page + 1
      if (this.userTotal > this.userlists.length) {
        getUserList(this.userParams).then(response => {
          if (response.data.docs.length) {
            this.userlists = this.userlists.concat(response.data.docs)
          }
          this.userTotal = response.data.total
        })
      }
    },
    loadUserList() {
      getUserList(this.userParams).then(response => {
        if (response.data.docs.length) {
          this.userlists = this.userlists.concat(response.data.docs)
        }
        this.userTotal = response.data.total
      })
    },
    handleDeleteOrder(id) {
      this.$confirm('确定删除该订单?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingInstance6 = Loading.service(this.LoadingOptions)
        deleteOrderById({ id: id }).then(response => {
          if (response.code === 200) {
            loadingInstance6.close()
            this.getList()
            this.$notify({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$notify({
              message: '删除失败',
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleChangeOrder(id) {
      this.$confirm('确定作废该订单?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingInstance6 = Loading.service(this.LoadingOptions)
        changeOrderStatusById({ id: id }).then(response => {
          if (response.code === 200) {
            loadingInstance6.close()
            this.getList()
            this.$notify({
              message: '作废成功',
              type: 'success'
            })
          } else {
            this.$notify({
              message: '作废失败',
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getList() {
      this.listLoading = true
      fetchArticleOrderList(this.listQuery).then(response => {
        this.list = response.data.data.docs
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    clearFilter() {
      this.listQuery = {
        page: 1,
        limit: 10,
        status: '',
        orderType: '0',
        article_name: '',
        course_name: '',
        user: ''
      }
      this.getList()
    },
    handleFilterNow() {
      this.getList()
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .demo-table-expand {
    font-size: 12px;
    width: 100%;
  }
  .demo-table-expand label {
    width: 50px;
    color: #99a9bf;
    font-size: 14px;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 60%;
  }
  .demo-table-expand .el-form-item span{
    font-size: 10px;
  }
</style>
