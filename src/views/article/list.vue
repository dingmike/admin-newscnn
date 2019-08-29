<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">文章列表</span>
      <el-button
        v-waves
        class="btn-add"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="addNewArticle"
      >添 加</el-button>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <!--
       page: 1,
        limit: 20,
        article_author: '',
        chinese_title: '',
        article_grade: '',
        category: '',
        is_only: 0, // 1： 是课程文章，0单独文章
        status: 1 // 发布状态： 1已发布，0：未发布， 2：草稿-->
      <el-input v-model="listQuery.chinese_title" :placeholder="$t('table.chinese_title')" style="width: 200px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
      <el-input v-model="listQuery.article_author" :placeholder="$t('table.article_author')" style="width: 200px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
      <el-select v-model="listQuery.status" :placeholder="$t('table.chooseArticleStatus')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option v-for="item in articleStatus" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.is_only" :placeholder="$t('table.chooseIsOnly')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option
          v-for="item in isOnlyOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="listQuery.free_article" :placeholder="$t('table.isFree')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option
          v-for="item in isFreeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="listQuery.category" :placeholder="$t('table.chooseCourseStatus')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        />
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
      <el-tooltip effect="dark" :content="$t('table.export')" placement="top">
        <el-button
          v-waves
          type="default"
          size="small"
          icon="el-icon-download"
          plain
          @click="handleDownload"
        />
      </el-tooltip>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="list" border :fit="fitWidth" size="small" style="width: 100%" stripe highlight-current-row>
        <el-table-column align="center" label="类型" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.category ? scope.row.category.category_name: '无' }}</span>
          </template>
        </el-table-column>
        <!--    <el-table-column align="center" label="英文标题" width="240">
          <template slot-scope="scope">
            <span>{{ scope.row.article_title }}</span>
          </template>
        </el-table-column>-->
        <el-table-column align="center" label="中文标题" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.chinese_title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="作者">
          <template slot-scope="scope">
            <span>{{ scope.row.article_author }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_price }}元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="免费">
          <template slot-scope="scope">
            <el-tag :type="scope.row.free_article === 1? 'danger' : 'success'">{{ scope.row.free_article === 1? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="翻译价格">
          <template slot-scope="scope">
            <span>{{ scope.row.translate_price }}元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="难度">
          <template slot-scope="scope">
            <span v-if="scope.row.article_grade">{{ scope.row.article_grade | gradeFilter }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="文章属性">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_only == 0? 'success' : 'info'">{{ scope.row.is_only == 0? '课程' : '文章' }}</el-tag>
            <!--<span>{{ scope.row.is_only == 1? '属于课程' : '阅读文章' }}</span>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="180">
          <!-- <template slot-scope="{row}">
            <el-tag :type="row.status | statusTypeFilter">
              {{ row.status | statusFilter }}
            </el-tag>
          </template>-->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              active-text="已发布"
              inactive-text="草稿"
              width="34"
              @change="handleShowStatusChange(scope.$index, scope.row)"
            />
            <el-tag v-if="scope.row.status === 3" :type="row.status | statusTypeFilter">
              {{ row.status | statusFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布时间" width="140">
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

        <el-table-column align="left" label="Actions" width="120">
          <template slot-scope="scope">
            <div>
              <router-link style="display: inline-block" :to="'/article/edit/'+scope.row.id">
                <el-button type="primary" size="small" icon="el-icon-edit" circle />
              </router-link>
              <el-button v-show="scope.row.status!==1" type="danger" size="small" icon="el-icon-delete" circle @click="deleteArticle(scope.row.id)" />
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
import { fetchList, deleteArticle, updateArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import { fetchAllList as fetchCategory } from '@/api/articleCate'
import { parseUTCtime } from '@/utils'

export default {
  name: 'ArticleList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusTypeFilter(status) {
      const statusArr = ['danger', 'success', 'info']
      return statusArr[status]
    },
    statusFilter(status) {
      switch (status) {
        case 1 :
          return '已发布'
        case 0 :
          return '未发布'
        case 2 :
          return '草稿'
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
      isFreeOptions: [
        {
          name: '免费',
          id: 1
        },
        {
          name: '付费',
          id: 0
        }
      ],
      isOnlyOptions: [
        {
          name: '属于课程',
          id: 0
        },
        {
          name: '阅读文章',
          id: 1
        }
      ],
      list: null,
      fitWidth: true,
      total: 0,
      listLoading: true,
      articleStatus: [
        {
          label: '已发布',
          value: 1
        },
        {
          label: '未发布',
          value: 0
        },
        {
          label: '草稿',
          value: 2
        }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        article_author: '',
        chinese_title: '',
        article_grade: '',
        category: '',
        is_only: '', // 1： 是课程文章，0单独文章
        status: '', // 发布状态： 1已发布，0：未发布， 2：草稿
        free_article: '' // 1免费，0 付费
      },
      categories: []
    }
  },
  created() {
    this.getList()
    this.fetchCategory()
  },
  methods: {
    handleFilterNow() {
      this.getList()
    },
    handleShowStatusChange(index, row) {
      // let data = new URLSearchParams();
      updateArticle({ id: row._id, status: row.status }).then(response => {
        console.log(response)
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    deleteArticle(id) {
      deleteArticle({ id: id }).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: '删除成功!',
            type: 'success',
            duration: 2000
          })
        }
        this.getList()
      })
    },
    addNewArticle() {
      this.$router.push({ path: '/article/create' })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.docs
        this.total = response.data.total
        this.listLoading = false
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
        article_author: '',
        chinese_title: '',
        article_grade: '',
        category: '',
        is_only: 0, // 1： 是课程文章，0单独文章
        status: 1 // 发布状态： 1已发布，0：未发布， 2：草稿
      }
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'chinese_title', 'article_grade', 'article_content', 'article_brief', 'article_author', 'article_audio', 'article_analysis', 'favour', 'id', 'status', 'category']
        const filterVal = ['id', 'chinese_title', 'article_grade', 'article_content', 'article_brief', 'article_author', 'article_audio', 'article_analysis', 'favour', 'id', 'status', 'category']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '文章列表'
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
