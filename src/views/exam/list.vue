<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">课程试卷列表</span>
      <el-button
        v-waves
        class="btn-add"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="addNewExam"
      >添 加</el-button>
    </el-card>
    <el-card class="operate-container" shadow="never">

      <el-input v-model="listQuery.exam_title" :placeholder="$t('table.exam_title')" style="width: 220px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
      <el-input v-model="listQuery.exam_author" :placeholder="$t('table.exam_author')" style="width: 220px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
      <el-select v-model="listQuery.status" :placeholder="$t('table.chooseExamStatus')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option v-for="item in examStatus" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.category" :placeholder="$t('table.chooseCategory')" style="width: 130px" class="filter-item" size="small" clearable @change="getCourseOptions">
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="listQuery.course" v-loadmore="loadmoreOption" :placeholder="$t('table.chooseCourse')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option
          v-for="item in courselists"
          :key="item.id"
          :label="item.name"
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
        <el-table-column align="center" label="试卷标题" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.exam_title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.category ? scope.row.category.category_name: '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属课程" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.course.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="出题作者">
          <template slot-scope="scope">
            <span>{{ scope.row.exam_author }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单词句子数量" width="140">
          <template slot-scope="scope">
            <div>单词：{{ scope.row.exam_words.length }} 个</div>
            <div>句子：{{ scope.row.exam_sentences.length }} 个</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合格分数">
          <template slot-scope="scope">
            <el-tag type="info">{{ scope.row.exam_pass_score }} 分</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总分数">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.total_score }} 分</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              active-text="已发布"
              inactive-text="草稿"
              @change="handleShowStatusChange(scope.$index, scope.row)"
            />
            <el-tag v-if="scope.row.status === 3" :type="row.status | statusTypeFilter">
              {{ row.status | statusFilter }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="left" label="Actions" width="140">
          <template slot-scope="scope">
            <div>
              <router-link style="display: inline-block" :to="'/exam/edit/'+scope.row.id">
                <el-button type="primary" size="small" icon="el-icon-edit" circle />
              </router-link>
              <el-button v-show="scope.row.status!==1" type="danger" size="small" icon="el-icon-delete" circle @click="deleteExam(scope.row.id)" />
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
import { fetchList, deleteExam, updateExam } from '@/api/exam'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import loadmore from '@/directive/loadmore'
import { fetchAllList as fetchCategory } from '@/api/articleCate'
import { parseUTCtime } from '@/utils'
import { fetchCoursesByCatrgory } from '@/api/course'

export default {
  name: 'ArticleList',
  components: { Pagination },
  directives: { waves, loadmore },
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
          return '初中'
        case 1 :
          return '高中'
        case 2 :
          return 'CET-4'
        case 3 :
          return 'CET-6'
        case 4 :
          return '雅思'
        case 5 :
          return '托福'
        case 6 :
          return '专6'
        case 7 :
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
      isOnlyOptions: [
        {
          name: '属于课程',
          id: 1
        },
        {
          name: '阅读文章',
          id: 0
        }
      ],
      courseParams: {
        id: '', // 分类ID
        page: 1,
        limit: 8
      },
      list: null,
      courselists: [],
      cateCourseTotal: null,
      fitWidth: true,
      total: 0,
      listLoading: true,
      examStatus: [
        {
          label: '已发布',
          value: 1
        },
        {
          label: '草稿',
          value: 2
        }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        exam_author: '',
        exam_title: '',
        category: '',
        course: '',
        status: 1 // 发布状态： 1已发布，0：未发布， 2：草稿
      },
      categories: []
    }
  },
  created() {
    this.getList()
    this.fetchCategory()
  },
  methods: {
    // 课程分类
    getCourseOptions(id) {
      this.courseParams.id = id
      this.loadmoreOption(1)
    },
    // 根据分类加载课程列表
    loadmoreOption(flag) {
      if (flag === 1) {
        this.courseParams.page = 1
        this.courseParams.limit = 8
        this.courselists = []
        this.listQuery.course = ''
        fetchCoursesByCatrgory(this.courseParams).then(response => {
          if (response.data.docs.length) {
            this.courselists = this.courselists.concat(response.data.docs)
          }
          this.cateCourseTotal = response.data.total
        })
      } else {
        this.courseParams.page = this.courseParams.page + 1
        if (this.cateCourseTotal > this.courselists.length) {
          fetchCoursesByCatrgory(this.courseParams).then(response => {
            if (response.data.docs.length) {
              this.courselists = this.courselists.concat(response.data.docs)
            }
            this.cateCourseTotal = response.data.total
          })
        }
      }
    },
    handleFilterNow() {
      this.getList()
    },
    handleShowStatusChange(index, row) {
      // let data = new URLSearchParams();
      updateExam({ id: row._id, status: row.status }).then(response => {
        console.log(response)
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    deleteExam(id) {
      deleteExam({ id: id }).then(response => {
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
    addNewExam() {
      this.$router.push({ path: '/exam/create' })
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
