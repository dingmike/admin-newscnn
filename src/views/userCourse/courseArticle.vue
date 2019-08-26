<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-date" style="margin-top: 5px" />
      <span style="margin-top: 5px">用户:  <span style="font-weight: 600">{{ nickname }}</span> &nbsp;&nbsp;</span>
      <span style="margin-top: 5px">课程: <span style="font-weight: 600;">{{ courseTitle }}</span>  的课时学习情况  </span>
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
        <el-table-column label="排序" width="120" align="center">
          <template slot-scope="scope">
            <span class="font-extra-small">第-{{ scope.row.sort_day }}-天</span>
          </template>
        </el-table-column>
        <el-table-column label="是否准时学习" width="200" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_study === 1 ? ( scope.row.is_today === 1? 'success' : 'danger') : 'info' ">{{ scope.row.is_study === 1 ? (scope.row.is_today === 1? '已准时学习' : '未准时学习') : '未学习' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否打卡">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_study === 1? 'success' : 'danger'">{{ scope.row.is_study === 1? '已打卡' : '未打卡' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="文章标题" width="" align="left">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.article_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中文标题" width="" align="left">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.chinese_title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="累计学习时长">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.read_time }} 分钟</span>
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
import { fetchCourseDayList } from '@/api/userCourse'

export default {
  name: 'PayedCourseDayList',
  filters: {
  },
  data() {
    return {
      courseTitle: '',
      nickname: '',
      categories: [],
      dialogVisible: false,
      list: null,
      total: null,
      isEdit: false,
      listLoading: true,
      listQuery: {
        payed_course: '',
        page: 1,
        limit: 10
      },
      cateArticleTotal: null
    }
  },
  watch: {
    $route(route) {
      this.getList()
    }
  },
  created() {
    this.listQuery.payed_course = this.$route.query.id
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchCourseDayList(this.listQuery).then(response => {
        this.listLoading = false
        this.nickname = response.data.docs[0].user.nickname
        this.courseTitle = response.data.docs[0].course.name
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
