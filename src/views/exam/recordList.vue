<template>
  <div class="app-container">
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

      <el-select v-model="listQuery.status" :placeholder="$t('table.chooseExamRecordStatus')" style="width: 200px" class="filter-item" size="small" clearable>
        <el-option v-for="item in examStatus" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.category" :placeholder="$t('table.chooseCategory')" style="width: 200px" class="filter-item" size="small" clearable @change="getCourseOptions">
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
        <el-table-column label="微信头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.user.headimgurl" width="50" height="50" style="border-radius: 50%" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户昵称" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.user.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.category ? scope.row.category.category_name: '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="试卷">
          <template slot-scope="scope">
            <span>{{ scope.row.exam.exam_title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属课程" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.course.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="得分">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.score }} 分</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="试卷总分">
          <template slot-scope="scope">
            <el-tag type="info">{{ scope.row.exam.total_score }} 分</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="及格分数">
          <template slot-scope="scope">
            <el-tag type="info">{{ scope.row.exam.exam_pass_score }} 分</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="180">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusTypeFilter">
              {{ scope.row.status | statusFilter }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="left" label="Actions" width="140">
          <template slot-scope="scope">
            <div>
              <el-button type="danger" size="small" icon="el-icon-delete" circle @click="deleteExamRecord(scope.row.id)" />
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
import { fetchRecordList as fetchList, deleteExamRecord } from '@/api/exam'
import { getUserListOnly as getUserList } from '@/api/wechat'
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
      userParams: {
        page: 1,
        limit: 20
      },
      list: null,
      courselists: [],
      userlists: [],
      cateCourseTotal: null,
      userTotal: null,
      fitWidth: true,
      total: 0,
      listLoading: true,
      examStatus: [
        {
          label: '已通过',
          value: 1
        },
        {
          label: '未通过',
          value: 0
        }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        user: '',
        exam: '',
        category: '',
        course: '',
        status: '' // 发布状态： 1已通过，0：未通过
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
    // 课程分类
    getCourseOptions(id) {
      this.courseParams.id = id
      this.loadmoreOption(1)
    },
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
    deleteExamRecord(id) {
      deleteExamRecord({ id: id }).then(response => {
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
        if (response.code === 200) {
          this.list = response.data.data.docs
          this.total = response.data.data.total
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
