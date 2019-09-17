<template>
  <el-card class="form-container" shadow="never">
    <el-form
      ref="productCateFrom"
      :model="productCate"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="分类名称：" prop="category_name">
        <el-input v-model="productCate.category_name" />
      </el-form-item>
      <el-form-item label="分类简介：" prop="category_title">
        <el-input v-model="productCate.category_title" />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="productCate.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类图标：" prop="icon">
        <el-input v-model="productCate.icon" />
        <single-upload v-model="productCate.icon" />
      </el-form-item>
      <el-form-item label="分类备注：" prop="memo">
        <el-input v-model="productCate.memo" type="textarea" :autosize="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fetchCategoryDetail, createCategory, updateCategory } from '@/api/articleCate'
import SingleUpload from '@/components/Upload/singleUpload'
import { Loading } from 'element-ui'

const defaultProductCate = {
  category_name: '',
  icon: '',
  category_title: '',
  status: 1,
  memo: ''
}
export default {
  name: 'ProductCateDetail',
  components: { SingleUpload },
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
      loadOption: {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      productCate: Object.assign({}, defaultProductCate),
      rules: {
        category_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        category_title: [
          { required: true, message: '请输入分类简介', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请上传图片', trigger: 'blur' },
          { min: 2, max: 1000, message: '长度在 2 到 1000 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const loadingInstance = Loading.service(this.loadOption)
      fetchCategoryDetail(this.$route.query.id).then(response => {
        loadingInstance.close()
        this.productCate = response.data
      })
    } else {
      this.productCate = Object.assign({}, defaultProductCate)
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateCategory(this.productCate).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              createCategory(this.productCate).then(response => {
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
      this.productCate = Object.assign({}, defaultProductCate)
    }
  }
}
</script>

<style scoped>

</style>
