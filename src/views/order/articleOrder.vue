<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border :fit="fitWidth" size="small" stripe highlight-current-row style="width: 100%">
      <el-table-column align="center" label="文章标题" width="240px">
        <template slot-scope="scope">
          <span>{{ scope.row.article_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="微信昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.user.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="OPENID">
        <template slot-scope="scope">
          <span>{{ scope.row.openid }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="用户姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="phone">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="订单价格">
        <template slot-scope="scope">
          <span>{{ scope.row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="文章单价">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_price }}</span>
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
      <el-table-column width="180px" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.deploy_time | parseUTCtime }}</span>
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

      <el-table-column align="left" label="Actions" width="100px">
        <template slot-scope="scope">
          <div>
            <router-link style="display: inline-block" :to="'/article/edit/'+scope.row.id">
              <el-button type="primary" size="small" icon="el-icon-edit" circle />
            </router-link>
            <el-button v-show="scope.row.status!==1" type="danger" size="small" icon="el-icon-delete" circle @click="handleModifyStatus(scope.row)" />
          </div>
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
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchArticleOrderList(this.listQuery).then(response => {
        this.list = response.data.docs
        this.total = response.data.total
        this.listLoading = false
      })
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
</style>
