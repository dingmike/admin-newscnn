<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" size="small" @click="openAddFiles">上传文件</el-button>
    </div>
    <!--文件列表-->
    <el-table v-loading="listLoading" :data="list" border :fit="fitWidth" size="small" stripe highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">

      <el-table-column width="320px" align="center" label="文件">
        <template slot-scope="scope">
          <div style="width: 100px;">
            <img v-if="scope.row.file_type === 1" :src="scope.row.file_url" style="width: 100%;" :alt="scope.row.file_name">
            <audio v-else-if="scope.row.file_type === 2" :src="scope.row.file_url" controls="controls">
              您的浏览器不支持 audio 标签。
            </audio>
            <video v-else-if="scope.row.file_type === 3" autoplay controls="controls" :src="scope.row.file_url" width="100%" :alt="scope.row.file_name">
              您的浏览器不支持 video 标签。
            </video>
            <span v-else>其它文件类型</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="文件名">
        <template slot-scope="scope">
          <span>{{ scope.row.file_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="文件类型">
        <template slot-scope="scope">
          <span>{{ scope.row.file_type | typeFilter }}</span>
          <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="上传时间">
        <template slot-scope="scope">
          <span>{{ scope.row.upload_time }}</span>
          <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" width="100px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button v-waves type="danger" size="mini" icon="el-icon-delete" circle @click="deleteFile(scope)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--上传文件弹窗-->
    <el-dialog width="40%" :fullscreen="fullForm" title="上传文件" :visible.sync="uploadVisible">
      <el-upload
        class="upload-demo"
        :action="uploadAction"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :before-upload="beforeFileUpload"
        :on-success="handleUploadSuccess"
        multiple
        :limit="10"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">上传文件大小不超过20M</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { filesList, deleteFile } from '@/api/system'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import { Loading } from 'element-ui'

export default {
  name: 'ArticleList',
  components: { Pagination },
  directives: { waves },
  filters: {
    // //0 默认新创建  1 预支付创建 2 已支付  3 申请退款中 4 退款完成
    typeFilter(type) {
      switch (type) {
        case 1 :
          return 'image'
        case 0 :
          return 'other'
        case 2 :
          return 'audio'
        case 3 :
          return 'video'
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
      uploadAction: process.env.VUE_APP_BASE_API + '/common/upload',
      fullForm: false,
      uploadVisible: false,
      multipleSelection: [],
      fileList: [],
      list: null,
      fitWidth: false,
      total: 0,
      listLoading: true,
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
          deleteFile({ file_key: item.row.file_key }).then(response => {
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
      filesList(this.listQuery).then(response => {
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

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .demo-table-expand {
    font-size: 12px;
    width: 100%;
  }
  .demo-table-expand label {
    width: 50px;
    color: #99a9bf;
    font-size: 14px;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 60%;
  }
  .demo-table-expand .el-form-item span{
    font-size: 10px;
  }
</style>
