<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">课程文章列表</span>
      <el-button
        class="btn-add"
        size="mini"
        @click="handleAddArticleCate()"
      >
        添 加
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
        <el-table-column label="图标" align="center" width="80">
          <template slot-scope="scope">
            <div class="icon-img">
              <img :src="scope.row.icon" alt="tu">
            </div>
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
        <el-table-column align="center" label="天数">
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
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
            >管理文章
            </el-button>
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
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
        :current-page.sync="listQuery.pageNum"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      title="课程中的文章"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <span>课程名称：</span>
      <span>{{ courseDetail.name }}</span>
      <el-card class="course-form-container" shadow="never">
        <el-form
          ref="courseArticleFrom"
          :model="courseArticle"
          :rules="rules"
          label-width="150px"
        >
          <el-form-item label="文章类型：" prop="name">
            <el-select v-model="courseArticle.course_category" filterable size="mini" placeholder="请选择分类" @change="changeCate">
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文章：" prop="name">
            <el-select v-model="courseArticle.course_category" size="mini" placeholder="请选择文章">
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('productCateFrom')">提交</el-button>
            <el-button v-if="!isEdit" @click="resetForm('productCateFrom')">重置</el-button>
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
// import { fetchList as fetchCourseArticle, fetchCourseArticleDetail, createCourseArticle, updateCourse } from '@/api/courseArticle'
import { fetchList as fetchCourseArticle } from '@/api/courseArticle'
// import { fetchList, deleteCourse, updateCourseStatus } from '@/api/course'
import { deleteCourse, updateCourseStatus } from '@/api/course'
import { fetchAllList as fetchCategory } from '@/api/articleCate'
export default {
  name: 'ProductCateList',
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
      courseArticle: {},
      courseArticleList: [],
      courseDetail: {},
      dialogVisible: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
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
    this.resetParentId()
    this.getList()
    this.fetchCategory()
  },
  methods: {
    // 加载分类下的文章
    changeCate(item) {
      console.log(item)
    },
    fetchCategory() {
      fetchCategory().then(response => {
        this.categories = response.data
      })
    },
    // 添加文章到课程
    handleAddArticle() {

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
      this.dialogVisible = true
    },
    getList() {
      this.listLoading = true
      fetchCourseArticle(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.docs
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
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
      this.$router.push({ path: '/articleCate/updateCourse', query: { id: row.id }})
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
