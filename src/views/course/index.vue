<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">课程列表</span>
      <el-button
        class="btn-add"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="handleAddProductCate()"
      >
        添 加
      </el-button>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-input v-model="listQuery.name" :placeholder="$t('table.course_name')" style="width: 220px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
      <el-select v-model="listQuery.status" :placeholder="$t('table.chooseCourseStatus')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option v-for="item in courseStatus" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.course_category" :placeholder="$t('table.chooseCategory')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.category_name"
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
        <el-table-column label="图标" align="center" width="80">
          <template slot-scope="scope">
            <div class="icon-img">
              <img :src="scope.row.icon" alt="tu">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="120" align="center">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.course_category.category_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" width="120" align="center">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="副标题" width="120" align="center">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.course_title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="折扣">
          <template slot-scope="scope">
            <span>{{ scope.row.discount }}折</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="免费">
          <template slot-scope="scope">
            <el-tag :type="scope.row.free_course === 1? 'danger' : 'success'">{{ scope.row.free_course === 1? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="课时">
          <template slot-scope="scope">
            <span>{{ scope.row.learn_days }}天</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="购买人数">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_person_num }}人</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="限购数量">
          <template slot-scope="scope">
            <span>{{ scope.row.ticket }}份</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="课程简介" align="center">
          <template slot-scope="scope">{{ scope.row.course_brief }}</template>
        </el-table-column>-->
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-text="已发布"
              inactive-text="未发布"
              @change="handleShowStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="150" align="center">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.deploy_time | parseUTCtime }}</span>
            <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="pirmary"
              circle
              @click="goCourseArticle(scope.$index, scope.row)"
            >课程文章
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.$index, scope.row)"
            />
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
import { fetchList, deleteCourse, updateCourseStatus } from '@/api/course'
import { fetchAllList as fetchCategory } from '@/api/courseCate'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'ProductCateList',
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
    levelFilter(value) {
      if (value === 0) {
        return '一级'
      } else if (value === 1) {
        return '二级'
      }
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false
      } else {
        return true
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
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: '',
        status: 1,
        free_course: '', // 0付费，1 免费
        course_category: ''
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
      courseStatus: [
        {
          label: '已发布',
          value: 1
        },
        {
          label: '未发布',
          value: 0
        }
      ],
      categories: [],
      parentId: 0
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
  },
  methods: {
    // 添加文章到课程
    handleAddArticle() {

    },
    goCourseArticle(index, row) {
      // this.$router.push({ name: 'CourseArticle', params: {id: row.id, courseName: row.course_title, courseCategory: row.course_category}})
      this.$router.push({ path: '/courseCate/courseArticle', query: { id: row.id }})
    },
    resetParentId() {
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId
      } else {
        this.parentId = 0
      }
    },
    fetchCategory() {
      fetchCategory().then(response => {
        this.categories = response.data
      })
    },
    handleAddProductCate() {
      this.$router.push('/courseCate/addCourse')
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
    handleShowStatusChange(index, row) {
      // let data = new URLSearchParams();

      updateCourseStatus({ id: row._id, status: row.status }).then(response => {
        console.log(response)
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleTransferProduct(index, row) {
      console.log('handleAddProductCate')
    },
    handleUpdate(index, row) {
      this.$router.push({ path: '/courseCate/updateCourse', query: { id: row.id }})
    },
    handleFilterNow() {
      this.getList()
    },
    clearFilter() {
      this.listQuery = {
        page: 1,
        limit: 10,
        name: '',
        status: 1,
        course_category: ''
      }
      this.getList()
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCourse({ id: row.id }).then(response => {
          console.log(response)
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
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
