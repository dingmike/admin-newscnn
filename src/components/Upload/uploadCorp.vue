<template>
  <div>
    <div class="upload-box">
      <el-tooltip effect="light" content="点击查看大图" placement="top-start">
        <div
          v-if="option.img"
          class="image-box"
          :style="{'background-image': 'url('+ option.img +')', 'height': imageHeight}"
          @click="showCoprImg"
        />
      </el-tooltip>
      <div class="upload">
        <h6 class="upload-des">支持 jpg、png 格式大小 10M 以内的图片</h6>
        <input id="file" ref="file" type="file" @change="getFile">
        <label for="file">点击上传</label>
      </div>
    </div>
    <!--图片简介弹出-->
    <el-dialog :visible.sync="isShowCropper" append-to-body>
      <div v-show="isShowCropper" class="vue-cropper-box">
        <div class="vue-cropper-content">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.outputSize"
            :output-type="option.outputType"
            :info="option.info"
            :can-scale="option.canScale"
            :auto-crop="option.autoCrop"
            :center-box="option.centerBox"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
          />
        </div>
      </div>
      <el-button type="danger" size="small" style="float: right;" @click="onCubeImg">裁剪图片</el-button>
      <div style="clear: both" />
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="imageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import axios from 'axios'

export default {
  name: 'UploadCorp',
  components: {
    VueCropper
  },

  props: {
    // 特殊配置
    cropperOption: {
      type: Object,
      default: () => {
        return null
      }
    },
    value: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 默认图片
    imageUrl: {
      type: String,
      default: ''
    },
    // 图片展示高度
    imageHeight: {
      type: String,
      default: '100px'
    }
  },

  data() {
    return {
      newImg: this.imageUrl,
      dialogVisible: false,
      dialogVisible1: false,
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 320, // 默认生成截图框宽度
        autoCropHeight: 320, // 默认生成截图框高度
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        centerBox: true // 截图框是否被限制在图片里面
      },
      isShowCropper: false // 是否显示截图框
    }
  },
  computed: {
    /* imageUrl: {
        get(){
          return this.value
        },
        set(val) {
          return val
          // this.value = val
        }
      }*/
  },
  created() {
    this.initOptions()
  },
  methods: {
    showCoprImg() {
      this.dialogVisible = true
    },
    getFile(e) {
      const _this = this
      const files = e.target.files[0]
      if (!e || !window.FileReader) return // 看支持不支持FileReader
      const reader = new FileReader()
      reader.readAsDataURL(files)
      reader.onloadend = function() {
        _this.isShowCropper = true
        _this.option.img = this.result
        _this.$refs.file.value = ''
      }
    },
    // 确定裁剪图片
    onCubeImg() {
      this.$refs.cropper.getCropData((data) => {
        this.isShowCropper = false
        // console.log("压缩前的图片大小：" + data.length)
        const img = new Image()
        const _this = this
        img.src = data
        img.onload = function() {
          // let _data = _this.compress(img);
          const blob = _this.dataURItoBlob(data)
          const formData = new FormData()
          formData.append('icon', blob)
          // console.log("将blob对象转成formData对象：" + formData.get("icon"))
          // _this.$emit('cropped', data, formData); // 不发送到父组件进行上传
          // 直接上传即可
          _this.uploadCorpImg(data)
        }
      })
    },
    // 上传图片到服务器
    uploadCorpImg(icon) {
      // base64转换为二进制
      const bytes = window.atob(icon.split(',')[1])
      const imgType = icon.split(',')[0].split(':')[1]
      const arrs = []
      for (let i = 0; i < bytes.length; i++) {
        arrs.push(bytes.charCodeAt(i))
      }
      const blob = new Blob([new Uint8Array(arrs)], { type: imgType })
      const fd = new FormData()
      fd.append('files', blob, 'cabe' + Date.now() + '.jpg')
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 开始上传
      axios.post(process.env.VUE_APP_BASE_API + '/common/upload', fd, config).then(res => {
        if (res.data.code === 200) {
          this.option.img = res.data.data.file_url
          this.value.img_url = res.data.data.file_url
        }
      }).catch(res => {
        console.log(res)
        this.$message.error('请稍候重试或联系管理员')
      })
    },
    // 压缩图片
    compress(img) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      //  initSize = img.src.length,
      const width = img.width
      const height = img.height
      canvas.width = width
      canvas.height = height
      // 铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, width, height)
      // 进行压缩到80%
      const ndata = canvas.toDataURL('image/jpeg', 0.8)
      // console.log("压缩后的图片大小：" + ndata.length)
      return ndata
    },
    // base64转成bolb对象
    dataURItoBlob(base64Data) {
      let byteString
      if (base64Data.split(',')[0].indexOf('base64') >= 0) { byteString = atob(base64Data.split(',')[1]) } else { byteString = unescape(base64Data.split(',')[1]) }
      const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
      const ia = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia], { type: mimeString })
    },
    // 初始化配置文件
    initOptions() {
      this.isShowCropper = false
      if (this.cropperOption) {
        for (const key in this.option) {
          this.option[key] = this.cropperOption[key] || this.option[key]
        }
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet">
  .upload-box {
    & > div {
      display inline-block
      vertical-align middle
    }
    & .upload-des {
      margin 0
      font-size 14px
      font-weight 400
      color #909399
    }
  }

  .image-box {
    width 100px
    height 100px
    margin-right 20px
    background-size 100px auto
    background-position left center
    background-repeat no-repeat
    cursor pointer
  }

  .upload {
    & label {
      width: 80px;
      height: 34px;
      font-size: 12px;
      line-height: 34px;
      display: inline-block;
      border-radius: 4px;
      text-align: center;
      border: 1px solid #ddd;
      cursor pointer
    }
  }

  input[type='file'] {
    display: none;
  }

  .vue-cropper-box {
    width: 100%;
    height: 320px;
    margin: 15px 0px;
    .vue-cropper-content {
      height 320px
    }
  }
</style>
