<template>
  <div>
    <el-upload
      :action="uploadAction"
      :data="dataObj"
      list-type="picture"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
// import { policy } from '@/api/oss'

export default {
  name: 'SingleUpload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadAction: process.env.VUE_APP_BASE_API + '/common/upload',
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
      },
      dialogVisible: false
    }
  },
  computed: {
    imageUrl() {
      return this.value
    },
    imageName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf('/') + 1)
      } else {
        return null
      }
    },
    fileList() {
      return [{
        name: this.imageName,
        url: this.imageUrl
      }]
    },
    showFileList: {
      get: function() {
        return this.value !== null && this.value !== '' && this.value !== undefined
      },
      set: function(newValue) {
      }
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('')
    },
    handlePreview(file) {
      this.dialogVisible = true
    },
    beforeUpload(file) {
      /* const _self = this
      return new Promise((resolve, reject) => {
        policy().then(response => {
          _self.dataObj.policy = response.data.policy
          _self.dataObj.signature = response.data.signature
          _self.dataObj.ossaccessKeyId = response.data.accessKeyId
          _self.dataObj.key = response.data.dir + '/${filename}'
          _self.dataObj.dir = response.data.dir
          _self.dataObj.host = response.data.host
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })*/
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        return isLt2M
      }
      if (isJPG || isJPEG || isPNG) {
        return true
      } else {
        this.$message.error('上传头像图片只能是 JPG JPEG PNG 格式!')
        return false
      }
    },
    handleUploadSuccess(res) {
      this.showFileList = true
      this.emitInput(res.data.file_url)
    }
  }
}
</script>
<style>

</style>

