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
        添加活动
      </el-button>
    </el-card>
    <!--文件列表-->
    <el-table v-loading="listLoading" :data="list" border :fit="fitWidth" size="small" stripe highlight-current-row style=" margin-top:20px; width: 100%" @selection-change="handleSelectionChange">

      <el-table-column align="center" label="活动名称">
        <template slot-scope="scope">
          <span>{{ scope.row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
            @change="handleShowStatusChange(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="分享文字">
        <template slot-scope="scope">
          <span>{{ scope.row.shareWords }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="说明">
        <template slot-scope="scope">
          <span>{{ scope.row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作">
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
          <el-input v-model="bannerDetail.activityName" />
        </el-form-item>
        <el-form-item label="分享文字：" prop="memo">
          <el-input v-model="bannerDetail.shareWords" type="textarea" :autosize="true" />
        </el-form-item>
        <el-form-item label="说明：" prop="memo">
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
import { fetchList, updateStatus, createOne, updateOne, deleteOne } from '@/api/activity' // createBanner
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import { Loading } from 'element-ui'
// import SingleFile from '@/components/Upload/singleFile'
// import UploadCorp from '@/components/Upload/uploadCorp'

const defaultDetail = {
  activityName: '',
  shareWords: '',
  memo: '',
  status: 1
}

export default {
  name: 'Banner',
  components: { Pagination },
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
      dialogTitle: '添加活动',
      isEdit: false,
      bannerDetail: Object.assign({}, defaultDetail),
      fullForm: false,
      uploadVisible: false,
      multipleSelection: [],
      fileList: [],
      list: null,
      fitWidth: true,
      total: 0,
      listLoading: true,
      rules: {
        activityName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        shareWords: [
          { required: false, message: '请输入分享文字', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        memo: [
          { required: false, message: '请输入说明', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ]
      },
      listQuery: {
        page: 1,
        limit: 10,
        status: ''
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
    handleShowStatusChange(index, row) {
      // let data = new URLSearchParams();
      updateStatus({ id: row._id, status: row.status }).then(response => {
        console.log(response)
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
              updateOne(this.bannerDetail).then(response => {
                this.getList()
                this.uploadVisible = false
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
              })
            } else {
              createOne(this.bannerDetail).then(response => {
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
        deleteOne({ id: item.row.id }).then(response => {
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
        status: ''
      }
      this.getList()
    },
    handleFilterNow() {
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
  .operate-container{
    height: 70px;
  }
</style>
