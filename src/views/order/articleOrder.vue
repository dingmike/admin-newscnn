<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" :placeholder="$t('table.title')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="选择订单状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border :fit="fitWidth" size="small" stripe highlight-current-row style="width: 100%">

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="OPENID">
              <span>{{ props.row.openid }}</span>
            </el-form-item>
            <el-form-item label="用户姓名">
              <span>{{ props.row.userName === null|| props.row.userName ===''? '暂无': props.row.userName }}</span>
            </el-form-item>
            <el-form-item label="电话号">
              <span>{{ props.row.phone === null||props.row.phone === ''? '暂无': props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="文章单价">
              <span>{{ props.row.article.pay_price }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文章标题" width="240px">
        <template slot-scope="scope">
          <span>{{ scope.row.article_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="下单微信昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.user.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="订单价格">
        <template slot-scope="scope">
          <span>{{ scope.row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="文章单价">
        <template slot-scope="scope">
          <span>{{ scope.row.article.pay_price }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="难度">
        <template slot-scope="scope">
          <span>{{ scope.row.article.article_grade | gradeFilter }}</span>
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

      <el-table-column align="left" label="订单操作" width="100px">
        <template slot-scope="scope">
          <!--退款-->
          <el-tooltip class="item" effect="dark" content="退款" placement="top-start">
            <el-button v-show="scope.row.status === 2" type="success" icon="el-icon-check" size="small" circle @click="handleDeleteOrder(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchArticleOrderList } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    // //0 默认新创建  1 预支付创建 2 已支付  3 申请退款中 4 退款完成
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
      fitWidth: false,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        article_name: '',
        openid: ''
      },
      orderType: [
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
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleDeleteOrder() {

    },
    getList() {
      this.listLoading = true
      fetchArticleOrderList(this.listQuery).then(response => {
        this.list = response.data.data.docs
        this.total = response.data.data.total

        this.listLoading = false
      })
    },
    handleFilter() {
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
