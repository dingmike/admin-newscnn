<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-button
        v-waves
        class="btn-add"
        size="mini"
        type="primary"
        @click="openAddFiles()"
      >
        添加Banner
      </el-button>
    </el-card>
    <!--文件列表-->
    <el-table v-loading="listLoading" :data="list" border :fit="fitWidth" size="small" stripe highlight-current-row style=" margin-top:20px; width: 100%" @selection-change="handleSelectionChange">

      <el-table-column width="180" align="center" label="图片">
        <template slot-scope="scope">
          <div style="width: 100px;">
            <img :src="scope.row.img_url" style="width: 100%;" :alt="scope.row.name">
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" label="广告类型（位置）">
        <template slot-scope="scope">
          <span>{{ scope.row.category | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" label="文字说明">
        <template slot-scope="scope">
          <span>{{ scope.row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button
              size="mini"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button v-waves type="danger" size="mini" icon="el-icon-delete" circle @click="deleteFile(scope)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--上传banner弹窗-->
    <el-dialog width="50%" :fullscreen="fullForm" :title="dialogTitle" :visible.sync="uploadVisible">
      <el-form
        ref="bannerForm"
        :model="bannerDetail"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="名称：" prop="name">
          <el-input v-model="bannerDetail.name" />
        </el-form-item>
        <el-form-item label="广告图类型：" prop="category">
          <el-select v-model="bannerDetail.category" size="mini" placeholder="请选广告图类型" @visible-change="showSelectOption" @change="changeCategory">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片：" prop="img_url">
          <el-input v-model="bannerDetail.img_url" />
          <upload-corp
            v-if="showCrop"
            v-model="bannerDetail"
            :cropper-option="cropperOption"
            :image-url="bannerDetail.img_url"
          />
          <!--<SingleFile v-model="bannerDetail.img_url" />-->
        </el-form-item>
        <el-form-item label="跳转链接：" prop="url">
          <el-input v-model="bannerDetail.url" />
        </el-form-item>
        <el-form-item label="文字说明：" prop="memo">
          <el-input v-model="bannerDetail.memo" type="textarea" :autosize="true" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="bannerDetail.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('bannerForm')">提交</el-button>
          <el-button v-if="!isEdit" @click="resetForm('bannerForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteBanner, createBanner, updateBanner } from '@/api/banner' // createBanner
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import { Loading } from 'element-ui'
// import SingleFile from '@/components/Upload/singleFile'
import UploadCorp from '@/components/Upload/uploadCorp'

const defaultDetail = {
  name: '',
  category: '',
  url: '',
  img_url: '',
  memo: '',
  status: 1
}

export default {
  name: 'Banner',
  components: { Pagination, UploadCorp },
  directives: { waves },
  filters: {
    // //0 默认新创建  1 预支付创建 2 已支付  3 申请退款中 4 退款完成
    typeFilter(type) {
      switch (type) {
        case 1 :
          return '首页顶部Banner'
        case 2 :
          return '首页card背景'
        case 3 :
          return '我的课程顶部Banner'
        case 4 :
          return '分享页面背景图'
        case 5 :
          return '打卡页面顶部banner'
        case 6 :
          return '打卡分享banner'
        case 7 :
          return '学习群二维码'
        default:
          break
      }
    }
  },
  data() {
    return {
      showCrop: false,
      cropperOption: {
        img: '',
        outputType: 'jpg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 570, // 默认生成截图框宽度
        autoCropHeight: 242, // 默认生成截图框高度
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [570, 242] // 截图框的宽高比例
      },
      dialogTitle: '添加广告',
      isEdit: false,
      bannerDetail: Object.assign({}, defaultDetail),
      categories: [
        {
          name: '首页顶部Banner',
          id: 1
        },
        {
          name: '首页card背景',
          id: 2
        },
        {
          name: '我的课程顶部Banner',
          id: 3
        },
        {
          name: '分享页面背景图',
          id: 4
        },
        {
          name: '打卡页面顶部banner',
          id: 5
        },
        {
          name: '打卡分享banner',
          id: 6
        },
        {
          name: '学习群二维码',
          id: 7
        }
      ],
      uploadAction: process.env.VUE_APP_BASE_API + '/common/upload',
      fullForm: false,
      uploadVisible: false,
      multipleSelection: [],
      fileList: [],
      list: null,
      fitWidth: true,
      total: 0,
      listLoading: true,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择广告类型', trigger: 'blur' }
        ],
        img_url: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        memo: [
          { required: false, message: '请输入文字说明', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ]
      },
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        article_name: '',
        openid: ''
      },
      LoadingOptions: {
        lock: true,
        text: '正在加载...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
    }
  },
  watch: {
    /*    cropperOption: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }*/
  },
  created() {
    this.getList()
  },
  methods: {
    showSelectOption(val) {
      if (val) {
        this.showCrop = false
      }
    },
    changeCategory(val) {
      this.showCrop = true
      // 如果是分享页面背景图
      if (val === 4) {
        this.cropperOption = {
          img: '',
          outputType: 'png', // 裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 1242, // 默认生成截图框宽度
          autoCropHeight: 2208, // 默认生成截图框高度
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [1242, 2208], // 截图框的宽高比例
          infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
          full: true, // 是否输出原图比例的截图
          enlarge: 10 // 图片根据截图框输出比例倍数
        }
      } else if (val === 6) {
        this.cropperOption = {
          img: '',
          outputType: 'jpg', // 裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 435, // 默认生成截图框宽度
          autoCropHeight: 245, // 默认生成截图框高度
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [435, 245] // 截图框的宽高比例
        }
      } else {
        this.cropperOption = {
          img: '',
          outputType: 'jpg', // 裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 570, // 默认生成截图框宽度
          autoCropHeight: 242, // 默认生成截图框高度
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [570, 242] // 截图框的宽高比例
        }
      }
    },
    openAddFiles() {
      this.uploadVisible = true
    },
    handleUpdate(row) {
      this.dialogTitle = '编辑：' + row.name
      this.isEdit = true
      this.bannerDetail = JSON.parse(JSON.stringify(row))
      this.uploadVisible = true
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
              updateBanner(this.bannerDetail).then(response => {
                this.getList()
                this.uploadVisible = false
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
              })
            } else {
              createBanner(this.bannerDetail).then(response => {
                this.$refs[formName].resetFields()
                this.resetForm(formName)
                this.getList()
                this.uploadVisible = false
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
      this.course = Object.assign({}, defaultDetail)
    },
    deleteFile(item) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingInstance6 = Loading.service(this.LoadingOptions)
        deleteBanner({ id: item.row.id }).then(response => {
          if (response.code === 200) {
            loadingInstance6.close()
            this.getList()
            this.$notify({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$notify({
              message: '删除失败',
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.docs
        this.total = response.data.total
        this.listLoading = false
      })
    },
    clearFilter() {
      this.listQuery = {
        page: 1,
        limit: 10,
        status: '',
        article_name: '',
        openid: ''
      }
      this.getList()
    },
    handleFilterNow() {
      this.getList()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleUploadSuccess(res) {
      if (res.code === 200) {
        this.getList()
      }
    },
    beforeFileUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 20
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 20MB!')
      }
      return isLt2M
    }
  }
}
</script>

<style lang="less" scoped>
  .operate-container{
    height: 70px;
  }
</style>
