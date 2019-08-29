<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">用户已购课程列表</span>
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
      <el-select v-model="listQuery.free_course" :placeholder="$t('table.isFree')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option
          v-for="item in isFreeOptions"
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
    </el-card>
    <div class="table-container">
      <el-table
        ref="productCateTable"
        v-loading="listLoading"
        style="width: 100%"
        :data="list"
        size="mini"
        border
        highlight-current-row
      >
        <!--        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>-->
        <el-table-column label="微信头像" align="center" width="80">
          <template slot-scope="scope">
            <img :src="scope.row.user.headimgurl" width="40" height="40" style="border-radius: 50%" alt="">
          </template>
        </el-table-column>
        <el-table-column label="微信昵称" width="140" align="center">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.user.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程名称" width="200" align="center">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.course.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="课程价格" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.course.price }}元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="课时" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.course.learn_days }} 天</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="免费课程" width="150">
          <template slot-scope="scope">
            <el-tag :type="scope.row.free_course === 1? 'danger' : 'success'">{{ scope.row.free_course === 1? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.pay_time | parseUTCtime }}</span>
            <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              circle
              @click="goCourseArticle(scope.$index, scope.row)"
            >学习情况
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.limit"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// import {fetchList,deleteProductCate,updateShowStatus,updateNavStatus} from '@/api/articleCate'
import { fetchList, deleteUserCourse } from '@/api/userCourse'
import { fetchAllList as fetchCategory } from '@/api/articleCate'
import { getUserListOnly as getUserList } from '@/api/wechat'
import { fetchCoursesByCatrgory } from '@/api/course'
import waves from '@/directive/waves' // Waves directive
import loadmore from '@/directive/loadmore'

export default {
  name: 'ProductCateList',
  directives: { waves, loadmore },
  filters: {
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
      userParams: {
        page: 1,
        limit: 20
      },
      courseParams: {
        id: '', // 分类ID
        page: 1,
        limit: 8
      },
      courselists: [],
      userlists: [],
      userTotal: null,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        free_course: '', // 0付费，1 免费
        category: '',
        user: '',
        course: ''
      },
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
      categories: []
    }
  },
  watch: {
    $route(route) {
      // this.resetParentId()
      this.getList()
    }
  },
  created() {
    // this.resetParentId()
    this.getList()
    this.fetchCategory()
    this.loadUserList()
  },
  methods: {
    goCourseArticle(index, row) {
      // this.$router.push({ name: 'CourseArticle', params: {id: row.id, courseName: row.course_title, courseCategory: row.course_category}})
      this.$router.push({ path: '/order/courseArticle', query: { id: row.id }})
    },
    fetchCategory() {
      fetchCategory().then(response => {
        this.categories = response.data
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.docs
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilterNow() {
      this.getList()
    },
    clearFilter() {
      this.listQuery = {
        page: 1,
        limit: 10,
        free_course: '', // 0付费，1 免费
        category: '',
        user: '',
        course: ''
      }
      this.getList()
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该用户学习的课程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserCourse({ id: row.id }).then(response => {
          console.log(response)
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
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
    }
  }
}
</script>

<style lang="less" scoped>
  .icon-img {
    width: 60px;
    height: 60px;
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
