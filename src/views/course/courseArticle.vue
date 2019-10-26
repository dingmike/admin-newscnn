<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">课程: {{ courseTitle }}</span>
      <el-button
        class="btn-add"
        size="mini"
        @click="handleAddArticleCate()"
      >
        添加文章
      </el-button>
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
        <el-table-column label="文章标题" width="" align="left">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.article !==null ? scope.row.article.article_title : '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中文标题" width="" align="left">
          <template slot-scope="scope">
            <span class="font-extra-small">{{ scope.row.article !== null ? scope.row.article.chinese_title : '无' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="难度">
          <template slot-scope="scope">
            <span v-if="scope.row.article !== null">{{ scope.row.article.article_grade | gradeFilter }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
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
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.limit"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      title="课程中的文章"
      :visible.sync="dialogVisible"
      width="60%"
      @close="closeDialog"
    >
      <el-card v-if="isEdit">
        <span>课程名称：</span>
        <span> {{ courseArticle.course.name }}</span>
      </el-card>
      <el-card class="course-form-container" shadow="never">
        <el-form
          ref="courseArticleFrom"
          :model="courseArticle"
          :rules="rules"
          label-width="200px"
        >
          <el-form-item label="课程类型：" prop="course_category">
            <el-select v-model="courseArticle.course_category" style="width: 400px" filterable size="small" placeholder="请选择分类" @change="changeCate">
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程文章：" prop="article">
            <el-select v-model="courseArticle.article" v-loadmore="loadmoreOption" style="width: 400px" size="small" filterable placeholder="请选择课程文章">
              <el-option
                v-for="item in articleList"
                :key="item.id"
                :label="item.chinese_title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="学习天数排序:" class="postInfo-container-item" prop="sort_day">
            第  <el-input-number v-model="courseArticle.sort_day" size="small" :step="1" :max="365" />  天
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSubmit('courseArticleFrom')">提交</el-button>
            <el-button v-if="!isEdit" size="small" @click="resetForm('courseArticleFrom')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import {fetchList,deleteProductCate,updateShowStatus,updateNavStatus} from '@/api/articleCate'
// import { fetchList as fetchCourseArticle, fetchCourseArticleDetail, createCourseArticle, updateCourseArticle } from '@/api/courseArticle'
import { fetchList as fetchCourseArticle, createCourseArticle, updateCourseArticle, deleteCourseArticle } from '@/api/courseArticle'
// import { fetchList, deleteCourse, updateCourseStatus } from '@/api/course'
import { updateCourseStatus, fetchCourseDetail } from '@/api/course'
// import { fetchAllList as fetchCategory } from '@/api/articleCate'
import { fetchAllList as fetchCategory } from '@/api/courseCate'
import { fetchCateArticleList } from '@/api/article'
import loadmore from '@/directive/loadmore'

const defaultCourseArticle = {
  course_category: '',
  course: '',
  article: '',
  sort_day: ''
}

export default {
  name: 'ProductCateList',
  directives: { loadmore },
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
      courseTitle: '',
      courseArticle: Object.assign({}, defaultCourseArticle),
      articleList: [], // 文章选项
      courseArticleList: [],
      courseDetail: {},
      categories: [],
      dialogVisible: false,
      list: null,
      total: null,
      isEdit: false,
      listLoading: true,
      listQuery: {
        id: '',
        page: 1,
        limit: 10
      },
      rules: {
        article: [
          { required: true, message: '请选择文章', trigger: 'blur' }
        ],
        course_category: [
          { required: true, message: '请选择课程', trigger: 'blur' }
        ],
        sort_day: [
          { required: true, message: '请为课程排序', trigger: 'blur' }
        ]
      },
      cateQuery: {
        id: '',
        page: 1,
        limit: 8,
        is_only: 0 // 0 课程
      },
      cateArticleTotal: null,
      parentId: 0
    }
  },
  watch: {
    $route(route) {
      this.resetParentId()
      this.getList()
    }
  },
  created() {
    this.listQuery.id = this.$route.query.id
    // this.courseTitle = this.$route.params.courseName
    // this.courseArticle.course_category = this.$route.params.courseCategory
    // this.cateQuery.id = this.$route.params.courseCategory
    this.fetchCourseDetail()
  },
  mounted() {
    this.resetParentId()
    this.getList()
  },
  methods: {
    loadmoreOption() {
      this.cateQuery.page = this.cateQuery.page + 1
      if (this.cateArticleTotal > this.articleList.length) {
        fetchCateArticleList(this.cateQuery).then(response => {
          if (response.doc.docs.length) {
            this.articleList = this.articleList.concat(response.doc.docs)
          }
          this.cateArticleTotal = response.doc.total
        })
      }
    },
    // 加载分类下的文章
    changeCate(item) {
      if (item) {
        this.cateQuery.id = item
        this.cateQuery.page = 1
        this.articleList = []
      }
      fetchCateArticleList(this.cateQuery).then(response => {
        if (response.doc.docs.length) {
          this.articleList = this.articleList.concat(response.doc.docs)
        }
        this.cateArticleTotal = response.doc.total
      })
    },
    fetchCategory() {
      fetchCategory().then(response => {
        this.categories = response.data
      })
    },
    fetchCourseDetail() {
      fetchCourseDetail(this.$route.query.id).then(response => {
        this.courseTitle = response.data.name
        this.courseArticle.course = response.data.id
        this.courseArticle.course_category = this.cateQuery.id = response.data.course_category
        this.fetchCategory()
        this.changeCate()
      })
    },
    resetParentId() {
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId
      } else {
        this.parentId = 0
      }
    },
    handleAddArticleCate() {
      // this.$router.push('/articleCate/addCourse')
      this.isEdit = false
      // this.courseArticle= Object.assign({}, defaultCourseArticle)
      this.courseArticle.course_category = this.cateQuery.id
      this.courseArticle.article = ''
      this.courseArticle.sort_day = ''
      this.dialogVisible = true
    },
    getList() {
      this.listLoading = true
      fetchCourseArticle(this.listQuery).then(response => {
        debugger
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
      this.courseArticle = JSON.parse(JSON.stringify(row))
      this.courseArticle.course_category = row.course.course_category
      this.isEdit = true
      this.dialogVisible = true
      // this.$router.push({ path: '/articleCate/updateCourse', query: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该课程文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCourseArticle({ id: row.id }).then(response => {
          console.log(response)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.listQuery.limit = 10
          this.getList()
        })
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateCourseArticle(this.courseArticle).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              })
            } else {
              createCourseArticle(this.courseArticle).then(response => {
                this.$refs[formName].resetFields()
                this.resetForm(formName)
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
              })
            }
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.course = Object.assign({}, defaultCourseArticle)
    },
    closeDialog() {
      this.listQuery.limit = 10
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
