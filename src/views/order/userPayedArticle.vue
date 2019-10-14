<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">用户购买文章列表</span>
    </el-card>
    <el-card class="operate-container" shadow="never">

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

      <el-select v-model="listQuery.articleCate" :placeholder="$t('table.chooseCategory')" style="width: 200px" class="filter-item" size="small" clearable>
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        />
      </el-select>
      <el-input v-model="listQuery.article_name" :placeholder="$t('table.article_name')" style="width: 220px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
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
      <!--<el-tooltip effect="dark" :content="$t('table.export')" placement="top">
        <el-button
          v-waves
          type="default"
          size="small"
          icon="el-icon-download"
          plain
          @click="handleDownload"
        />
      </el-tooltip>-->
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="list" border :fit="fitWidth" size="small" style="width: 100%" stripe highlight-current-row>
        <el-table-column label="微信头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.user.headimgurl" width="50" height="50" style="border-radius: 50%" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" label="微信昵称">
          <template slot-scope="scope">
            <div><span>{{ scope.row.user.nickname }}</span></div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="文章">
          <template slot-scope="scope">
            <span>{{ scope.row.article ? scope.row.article.article_title: '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="文章类型">
          <template slot-scope="scope">
            <span>{{ scope.row.article.articleCate ? scope.row.article.articleCate.category_name: '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="阅读累计时长">
          <template slot-scope="scope">
            {{ scope.row.read_time }} 分钟
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="购买时间">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_time }}</span>
          </template>
        </el-table-column>

        <el-table-column align="left" label="操作" width="140">
          <template slot-scope="scope">
            <div>
              <el-button type="danger" size="small" icon="el-icon-delete" circle @click="deleteById(scope.row.id)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchList, deleteById } from '@/api/userPayedArticle'
import { getUserListOnly as getUserList } from '@/api/wechat'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import loadmore from '@/directive/loadmore'
import { Loading } from 'element-ui'
import { fetchAllList as fetchCategory } from '@/api/articleCate'
// import { fetchAllList as fetchArticleCategory } from '@/api/articleCate'
import { parseUTCtime } from '@/utils'

export default {
  name: 'ArticleList',
  components: { Pagination },
  directives: { waves, loadmore },
  filters: {
    statusTypeFilter(status) {
      const statusArr = ['danger', 'success']
      return statusArr[status]
    },
    statusFilter(status) {
      switch (status) {
        case 1 :
          return '通过'
        case 0 :
          return '未通过'
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
      LoadingOptions: {
        lock: true,
        text: '正在加载...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      userParams: {
        page: 1,
        limit: 20
      },
      list: null,
      userlists: [],
      userTotal: null,
      fitWidth: true,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        user: '',
        articleCate: '',
        article_name: ''
      },
      categories: []
    }
  },
  created() {
    this.getList()
    this.fetchCategory()
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
    handleFilterNow() {
      this.getList()
    },
    deleteById(id) {
      this.$confirm('确定删除选中数据?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingInstance6 = Loading.service(this.LoadingOptions)
        deleteById({ id: id }).then(response => {
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
          message: '已取消'
        })
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.code === 200) {
          this.list = response.data.docs
          this.total = response.data.total
          this.listLoading = false
        }
      })
    },
    fetchCategory() {
      fetchCategory().then(response => {
        this.categories = response.data
      })
    },
    clearFilter() {
      this.listQuery = {
        page: 1,
        limit: 20,
        user: '',
        exam: '',
        category: '',
        course: '',
        status: '' // 发布状态： 1已通过，0：未通过
      }
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'exam_title', 'exam_content', 'exam_brief', 'exam_author', 'exam_audio', 'exam_pass_score', 'favour', 'exam_words', 'status', 'category', 'exam_sentences', 'exam_person_num', 'pass_person_num']
          const filterVal = ['id', 'chinese_title', 'exam_content', 'exam_brief', 'exam_author', 'exam_audio', 'exam_pass_score', 'favour', 'exam_words', 'status', 'category', 'exam_sentences', 'exam_person_num', 'pass_person_num']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '试卷列表'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseUTCtime(v[j].createAt)
        } else {
          return v[j]
        }
      }))
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
