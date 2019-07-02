<template>
  <div class="upload-container">
    <el-upload
      class="image-uploader"
      :action="uploadAction"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeFileUpload"
      :on-success="handleUploadSuccess"
      multiple
      :limit="1"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="mini" type="primary" style="float: left">上传</el-button>
      <div slot="tip" class="el-upload__tip">上传文件大小不超过50M</div>
    </el-upload>
  </div>
</template>

<script>
// import { getToken } from '@/api/qiniu'

export default {
  name: 'SingleFile',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      uploadAction: process.env.VUE_APP_BASE_API + '/common/upload'
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    // 传递url到父组件
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleUploadSuccess(res) {
      this.emitInput(res.data.file_url)
    },
    beforeFileUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 50
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 50MB!')
      }
      return isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/mixin.scss";
    .upload-container {
      width: 400px;
      margin-top: 4px;
      .image-uploader{
        .el-upload{
          text-align: left;
        }
      }
    }

</style>
