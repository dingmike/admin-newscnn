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

      <el-table-column width="320" align="center" label="图片">
        <template slot-scope="scope">
          <div style="width: 100px;">
            <img :src="scope.row.img_url" style="width: 100%;" :alt="scope.row.name">
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" label="广告类型（位置）">
        <template slot-scope="scope">
          <span>{{ scope.row.category | typeFilter }}</span>
          <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? '启用' : '禁用' }}</span>
          <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="300">
        <template slot-scope="scope">
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
          <el-select v-model="bannerDetail.category" size="mini" placeholder="请选择课程类型">
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
          <SingleFile v-model="bannerDetail.img_url" />
        </el-form-item>
        <el-form-item label="跳转链接：" prop="url">
          <el-input v-model="bannerDetail.url" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="bannerDetail.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteBanner } from '@/api/banner' // createBanner
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import { Loading } from 'element-ui'
import SingleFile from '@/components/Upload/singleFile'

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
  components: { Pagination, SingleFile },
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
      dialogTitle: '添加广告',
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
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择广告类型', trigger: 'blur' }
        ],
        sort_day: [
          { required: true, message: '请为课程排序', trigger: 'blur' }
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
      },
      orderType: [
        {
          label: '新创建',
          value: 0
        },
        {
          label: '预支付创建',
          value: 1
        },
        {
          label: '已支付',
          value: 2
        },
        {
          label: '申请退款中',
          value: 3
        },
        {
          label: '退款完成',
          value: 4
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    openAddFiles() {
      this.uploadVisible = true
    },
    deleteFile(item) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const loadingInstance6 = Loading.service(this.LoadingOptions)
          deleteBanner({ id: item.row.id }).then(response => {
            loadingInstance6.close()
            this.$notify({
              message: '删除成功',
              type: 'success'
            })
          })
        })
        .then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        debugger
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
