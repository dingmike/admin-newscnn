<template>
  <el-card class="course-form-container" shadow="never">
    <el-form
      ref="productCateFrom"
      :model="course"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="课程名称：" prop="name">
        <el-input v-model="course.name" />
      </el-form-item>
      <el-form-item label="课程副标题：" prop="course_title">
        <el-input v-model="course.course_title" />
      </el-form-item>
      <el-form-item label="课程类型：" prop="course_category">
        <el-select v-model="course.course_category" size="mini" placeholder="请选择课程类型">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程价格：" class="postInfo-container-item" prop="price">
        <el-input-number v-model="course.price" size="mini" :precision="2" :step="0.1" :max="1000" />&nbsp;&nbsp;元
      </el-form-item>
      <el-form-item label="课程折扣：" class="postInfo-container-item" prop="discount">
        <el-input-number v-model="course.discount" size="mini" :precision="2" :step="0.01" :max="1" />&nbsp;&nbsp;折
      </el-form-item>
      <el-form-item label="课程天数：" class="postInfo-container-item" prop="learn_days">
        <el-input-number v-model="course.learn_days" size="mini" :step="1" :max="365" />&nbsp;&nbsp;天
      </el-form-item>
      <el-form-item label="课程状态：" prop="status">
        <el-radio-group v-model="course.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="课程图标：">
        <el-input v-model="course.icon" />
        <single-upload v-model="course.icon" />
      </el-form-item>
      <el-form-item label="课程备注：" prop="remark">
        <el-input v-model="course.remark" type="textarea" :autosize="true" />
      </el-form-item>
      <el-form-item label="课程简介：" prop="course_brief">
        <div class="editor-container">
          <!--<markdown-editor ref="markdownEditor" v-model="course.course_brief" :language="language" height="300px" />-->
          <Tinymce ref="editor" v-model="course.course_brief" :height="300" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fetchCourseDetail, createCourse, updateCourse } from '@/api/course'
import { fetchAllList as fetchCategory } from '@/api/articleCate'
import SingleUpload from '@/components/Upload/singleUpload'
// import MarkdownEditor from '@/components/MarkdownEditor'
import Tinymce from '@/components/Tinymce'
import { Loading } from 'element-ui'

const defaultProductCate = {
  name: '',
  icon: '',
  price: 0,
  course_title: '',
  status: 1,
  remark: ''
}
export default {
  name: 'CourseDetail',
  components: { SingleUpload, Tinymce },
  filters: {
    filterLabelFilter(index) {
      if (index === 0) {
        return '筛选属性：'
      } else {
        return ''
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      languageTypeList: {
        'en': 'en_US',
        'zh': 'zh_CN',
        'es': 'es_ES'
      },
      categories: [],
      loadOption: {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      course: Object.assign({}, defaultProductCate),
      rules: {
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        course_title: [
          { required: true, message: '请输入课程副标题', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入课程价格', trigger: 'blur' }
        ],
        course_category: [
          { required: true, message: '请选择课程分类', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入课程备注', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        course_brief: [
          { required: true, message: '请输入课程简介', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    language() {
      return this.languageTypeList[this.$store.getters.language]
    }
  },
  created() {
    if (this.isEdit) {
      const loadingInstance = Loading.service(this.loadOption)
      fetchCourseDetail(this.$route.query.id).then(response => {
        loadingInstance.close()
        this.course = response.data
      })
    } else {
      this.course = Object.assign({}, defaultProductCate)
    }
    this.fetchCategory()
  },
  methods: {
    fetchCategory() {
      fetchCategory().then(response => {
        this.categories = response.data
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
              updateCourse(this.course).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              createCourse(this.course).then(response => {
                this.$refs[formName].resetFields()
                this.resetForm(formName)
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
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
      this.course = Object.assign({}, defaultProductCate)
    }
  }
}
</script>

<style lang="less" scoped>
 .course-form-container{
   width: 78%;
   padding: 35px 35px 15px 35px;
   margin: 20px auto;
 }
</style>
