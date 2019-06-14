<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <!--<CommentDropdown v-model="postForm.comment_disabled" />-->
        <!--<PlatformDropdown v-model="postForm.platforms" />-->
        <!--<SourceUrlDropdown v-model="postForm.source_uri" />-->
        <el-button :loading="loading" style="margin-left: 10px;" type="success" @click="deployArticle">
          发 布
        </el-button>
        <el-button :loading="loading" type="warning" @click="draftForm">
          草 稿
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <!--<Warning />-->
          <el-col :span="24">
            <el-form-item style="margin-bottom: 20px;" prop="article_title">
              <MDinput v-model="postForm.article_title" :maxlength="100" name="name" required>
                英文标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;" prop="chinese_title">
              <MDinput v-model="postForm.chinese_title" :maxlength="100" name="name" required>
                中文标题
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item" prop="article_author">
                    <el-input v-model="postForm.article_author" size="mini" placeholder="" />
                    <!--<el-select v-model="postForm.article_author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="搜索用户">
                      <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
                    </el-select>-->
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item" prop="deploy_time">
                    <el-date-picker v-model="postForm.deploy_time" size="mini" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="60px" label="难度:" class="postInfo-container-item" prop="article_grade">
                    <el-select v-model="postForm.article_grade" size="mini" placeholder="请选择难度">
                      <el-option
                        v-for="item in gradeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="价格:" class="postInfo-container-item" prop="pay_price">
                    <el-input-number v-model="postForm.pay_price" size="mini" :precision="2" :step="0.1" :max="1000" /> 元
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="90px" label="翻译价格:" class="postInfo-container-item" pro="translate_price">
                    <el-input-number v-model="postForm.translate_price" size="mini" :precision="2" :step="0.1" :max="1000" /> 元
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="90px" label="支付人数:" class="postInfo-container-item" prop="pay_person_num">
                    <el-input-number v-model="postForm.pay_person_num" size="mini" :step="1" :max="1000000" /> 人
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="简介:" prop="article_brief">
          <el-input v-model="postForm.article_brief" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <el-form-item prop="article_content" label-width="45px" label="原文:" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.article_content" :height="400" />
        </el-form-item>

        <el-form-item prop="article_translate" label-width="45px" label="翻译:" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.article_translate" :height="400" />
        </el-form-item>

        <el-form-item prop="article_analysis" label-width="45px" label="解析:" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.article_analysis" :height="400" />
        </el-form-item>
        <!-- <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>-->
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
// import Upload from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import { validURL } from '@/utils/validate'
// import { Loading } from 'element-ui'
// import { searchUser } from '@/api/remoteSearch'
// import Warning from './Warning'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { fetchArticle, createArticle, updateArticle } from '@/api/article'
const defaultForm = {
  status: 0, // 发布状态： 1已发布，0：未发布， 2：草稿
  article_title: '', // 文章题目
  chinese_title: '', // 文章中文题目
  article_author: '', // 文章作者
  article_grade: '', // 文章级别
  memo: '', // 文章说明
  article_content: '', // 文章内容
  article_translate: '', // 文章翻译
  article_analysis: '', // 文章解析
  article_brief: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  deploy_time: undefined, // 发布时间
  article_audio: '', // 音频
  translate_price: '', // 翻译价值
  pay_price: '', // 支付价格
  pay_person_num: '' // 购买人数
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      LoadingOptions: {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      gradeOptions: [
        {
          label: '高中',
          value: 0
        },
        {
          label: 'CET-4',
          value: 1
        },
        {
          label: 'CET-6',
          value: 2
        },
        {
          label: '雅思',
          value: 3
        },
        {
          label: '托福',
          value: 4
        },
        {
          label: '专6',
          value: 5
        },
        {
          label: '专8',
          value: 6
        }
      ],
      deployMessageData: '发布文章成功',
      updateMessageData: '更新文章成功',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        article_title: [{ validator: validateRequire }],
        chinese_title: [{ validator: validateRequire }],
        article_brief: [{ validator: validateRequire, trigger: 'blur' }],
        article_author: [{ validator: validateRequire, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.article_brief.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    // 设置tab页签数据
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    deployArticle() {
      this.updateMessageData = '更新文章成功'
      this.deployMessageData = '发布文章成功'
      this.postForm.status = 1
      this.submitForm()
    },
    submitForm() {
      // let loadingInstance = Loading.service(this.LoadingOptions);
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateArticle(this.postForm).then((res) => {
              // loadingInstance.close();
              if (res.code === 200) {
                this.$notify({
                  title: '成功',
                  message: this.updateMessageData,
                  type: 'success',
                  duration: 2000
                })
              }
              this.loading = false
            })
          } else {
            createArticle(this.postForm).then((res) => {
              // loadingInstance.close();
              if (res.code === 200) {
                this.$notify({
                  title: '成功',
                  message: this.deployMessageData,
                  type: 'success',
                  duration: 2000
                })
              }
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      this.updateMessageData = '更新草稿成功'
      this.deployMessageData = '发布草稿成功'
      if (this.postForm.article_content.length === 0 || this.postForm.article_title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.postForm.status = 2
      this.submitForm()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
