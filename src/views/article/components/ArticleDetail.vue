<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" class="">
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
        <el-form-item label="文章类型：" prop="name">
          <el-select v-model="postForm.category" filterable size="mini" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.category_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
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
          <!--<Tinymce ref="editor" v-model="postForm.article_analysis" :height="400" />-->
          <el-button type="success" @click="goSetAnalysis">
            去创建讲解内容
          </el-button>
        </el-form-item>
        <!-- <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>-->
      </div>
    </el-form>

    <el-dialog title="讲解内容" width="65%" :fullscreen="isFullScreen" :visible.sync="showSetAnalysis">
      <div>
        <el-form ref="postForm" :model="postForm.article_analysis" :rules="rules" size="small" class="">
          <el-form-item prop="words" label-width="45px" label="单词:" style="margin-bottom: 30px;">
            <div>
              <el-tag
                v-for="(item, index) in postForm.article_analysis.words"
                :key="index"
                closable
                type="success"
                :disable-transitions="false"
                @click="editWord(item)"
                @close="deleteWord(item)"
              >
                {{ item.ename }}
              </el-tag>
              <el-button class="button-new-tag" size="small" @click="goAddOneWord">+ New Word</el-button>
            </div>
          </el-form-item>
          <el-form-item prop="sentence" label-width="45px" label="句子:" style="margin-bottom: 30px;">
            <div>
              <el-tag
                v-for="(item, index) in postForm.article_analysis.sentence"
                :key="index"
                closable
                type="success"
                :disable-transitions="false"
                @click="editSentence(item)"
                @close="deleteSentence(item)"
              >
                {{ item.ename }}
              </el-tag>
              <el-button class="button-new-tag" size="small" @click="goAddOneSentence">+ New Sentence</el-button>
            </div>
          </el-form-item>
          <el-form-item prop="analysis_audio" label-width="45px" label="音频:" style="margin-bottom: 30px;">
            <el-input v-model="postForm.article_analysis.analysis_audio" placeholder="请输入内容" />
            <SingleFile v-model="postForm.article_analysis.analysis_audio" />
          </el-form-item>
          <el-form-item prop="analysis_video" label-width="45px" label="视频:" style="margin-bottom: 30px;">
            <el-input v-model="postForm.article_analysis.analysis_video" placeholder="请输入内容" />
            <SingleFile v-model="postForm.article_analysis.analysis_video" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showSetAnalysis = false">取 消</el-button>
        <el-button size="small" type="primary" @click="setAllAnalysis">确 定</el-button>
      </div>
      <!--添加单词 5个-->
      <el-dialog
        width="65%"
        title="添加重点单词"
        :visible.sync="showWordBox"
        append-to-body
        @close="showWordBox = false"
      >
        <div>
          <el-form ref="postForm2" :model="analysisWords" :rules="rules" size="small" class="">
            <el-form-item prop="ename" label-width="80px" label="英文单词">
              <el-input v-model="analysisWords.ename" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item prop="symbol" label-width="80px" label="单词音标">
              <el-input v-model="analysisWords.symbol" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item prop="cname" label-width="80px" label="单词中文">
              <el-input v-model="analysisWords.cname" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item prop="sentence" label-width="80px" label="单词讲解">
              <Tinymce v-if="showWordBox" ref="editor" v-model="analysisWords.sentence" :height="300" />
            </el-form-item>
            <!--<el-form-item prop="sentence" label-width="80px" label="例句英文">
              <el-input v-model="analysisWords.sentence" placeholder="请输入内容" />
            </el-form-item>-->
            <!--  <el-form-item prop="csentence" label-width="80px" label="例句中文">
              <el-input v-model="analysisWords.csentence" placeholder="请输入内容" />
            </el-form-item>-->
            <el-form-item prop="wordAudio" label-width="80px" label="单词发音">
              <el-input v-model="analysisWords.wordAudio" placeholder="请输入内容" />
              <SingleFile v-model="analysisWords.wordAudio" />
            </el-form-item>
            <el-form-item prop="sentenceAudio" label-width="80px" label="例句发音">
              <el-input v-model="analysisWords.sentenceAudio" placeholder="请输入内容" />
              <SingleFile v-model="analysisWords.sentenceAudio" />
            </el-form-item>
            <el-form-item prop="teacherAudio" label-width="80px" label="老师音频">
              <el-input v-model="analysisWords.teacherAudio" placeholder="请输入内容" />
              <SingleFile v-model="analysisWords.teacherAudio" />
            </el-form-item>
            <el-form-item prop="video" label-width="80px" label="视频">
              <el-input v-model="analysisWords.video" placeholder="请输入内容" />
              <SingleFile v-model="analysisWords.video" />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="showWordBox = false">关 闭</el-button>
          <el-button type="primary" size="small" @click="setOneWord">设 置</el-button>
        </div>
      </el-dialog>
      <!--添加句子 2个-->
      <el-dialog
        width="70%"
        title="添加重点句子"
        :visible.sync="showSentenceBox"
        append-to-body
        @close="showSentenceBox = false"
      >
        <div>
          <el-form ref="postForm3" :model="analysisSentence" :rules="rules" size="small" class="">
            <el-form-item prop="ename" label-width="80px" label="句子英文">
              <!--<el-input v-model="analysisSentence.ename" placeholder="请输入内容" />-->
              <Tinymce v-if="showSentenceBox" ref="editor" v-model="analysisSentence.ename" :height="200" />
            </el-form-item>
            <el-form-item prop="cname" label-width="80px" label="句子讲解">
              <Tinymce v-if="showSentenceBox" ref="editor" v-model="analysisSentence.cname" :height="200" />
            </el-form-item>
            <!-- <el-form-item prop="cname" label-width="80px" label="句子中文">
              <el-input v-model="analysisSentence.cname" placeholder="请输入内容" />
            </el-form-item>-->
            <el-form-item prop="sentenceAudio" label-width="80px" label="句子音频">
              <el-input v-model="analysisSentence.sentenceAudio" placeholder="请输入内容" />
              <SingleFile v-model="analysisSentence.sentenceAudio" />
            </el-form-item>
            <el-form-item prop="teacherAudio" label-width="80px" label="老师音频">
              <el-input v-model="analysisSentence.teacherAudio" placeholder="请输入内容" />
              <SingleFile v-model="analysisSentence.teacherAudio" />
            </el-form-item>
            <el-form-item prop="video" label-width="80px" label="视频">
              <el-input v-model="analysisSentence.video" placeholder="请输入内容" />
              <SingleFile v-model="analysisSentence.video" />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="showSentenceBox = false">关 闭</el-button>
          <el-button type="primary" size="small" @click="setOneSentence">设 置</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import SingleFile from '@/components/Upload/singleFile'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import waves from '@/directive/waves' // Waves directive
// import { validURL } from '@/utils/validate'
// import { Loading } from 'element-ui'
// import { searchUser } from '@/api/remoteSearch'
// import Warning from './Warning'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { fetchArticle, createArticle, updateArticle } from '@/api/article'
import { fetchAllList as fetchCategory } from '@/api/articleCate'

const defaultForm = {
  status: 0, // 发布状态： 1已发布，0：未发布， 2：草稿
  article_title: '', // 文章题目
  chinese_title: '', // 文章中文题目
  category: '',
  article_author: '', // 文章作者
  article_grade: '', // 文章级别
  memo: '', // 文章说明
  article_content: '', // 文章内容
  article_translate: '', // 文章翻译
  article_analysis: {
    words: [],
    sentence: [],
    analysis_audio: '',
    analysis_video: ''
  }, // 文章解析
  article_brief: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  deploy_time: undefined, // 发布时间
  article_audio: '', // 音频
  translate_price: '', // 翻译价值
  pay_price: '', // 支付价格
  pay_person_num: '' // 购买人数
}
const defaultAnalysisForm = {
  words: [
    {
      ename: 'learn',
      symbol: '美 /lɝn/ ',
      cname: 'vt. 学习；得知；认识到',
      sentence: 'we learn a lot language!',
      csentence: '我学了好多',
      wordAudio: 'http://www.bejson.com/',
      sentenceAudio: 'http://www.bejson.com/',
      teacherAudio: 'http://www.bejson.com/',
      video: 'http://www.bejson.com/'
    },
    {
      ename: 'learn2',
      symbol: '美 /lɝn/ ',
      cname: 'vt. 学习；得知；认识到',
      sentence: '',
      csentence: '我学了好多',
      wordAudio: 'http://www.bejson.com/',
      sentenceAudio: 'http://www.bejson.com/',
      teacherAudio: 'http://www.bejson.com/',
      video: 'http://www.bejson.com/'
    }
  ],
  sentence: [
    {
      ename: 'Shortcut for saving one or more documents to the database.Shortcut for saving one or more documents to the database.',
      cname: '将一个或多个文档保存到数据库的快捷方式。',
      audio: 'http://www.bejson.com/',
      video: 'http://www.bejson.com/'
    },
    {
      ename: 'Shortcut for saving one or more documents to the database.  ',
      cname: '将一个或多个文档保存到数据库的快捷方式。',
      audio: 'http://www.bejson.com/',
      video: 'http://www.bejson.com/'
    }
  ],
  analysis_audio: '',
  analysis_video: ''
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Sticky, SingleFile },
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
      analysisSentence: {
        ename: 'Shortcut for saving one or more documents to the database.  ',
        cname: '将一个或多个文档保存到数据库的快捷方式。',
        sentenceAudio: 'http://psnkebui3.bkt.clouddn.com/FmSrG_ao5eWwo0_LksTgWX9Tlkfm',
        teacherAudio: 'http://psnkebui3.bkt.clouddn.com/FmSrG_ao5eWwo0_LksTgWX9Tlkfm',
        video: 'http://psnkebui3.bkt.clouddn.com/FmSrG_ao5eWwo0_LksTgWX9Tlkfm'
      },
      analysisWords: {
        ename: 'learn',
        symbol: '美 /lɝn/ ',
        cname: 'vt. 学习；得知；认识到',
        sentence: 'we learn a lot language!',
        csentence: '我学了好多',
        wordAudio: 'http://psnkebui3.bkt.clouddn.com/FmSrG_ao5eWwo0_LksTgWX9Tlkfm',
        sentenceAudio: 'http://psnkebui3.bkt.clouddn.com/FmSrG_ao5eWwo0_LksTgWX9Tlkfm',
        teacherAudio: 'http://psnkebui3.bkt.clouddn.com/FmSrG_ao5eWwo0_LksTgWX9Tlkfm',
        video: 'http://psnkebui3.bkt.clouddn.com/FmSrG_ao5eWwo0_LksTgWX9Tlkfm'
      },
      isEditWord: false,
      isEditSentence: false,
      showWordBox: false,
      showSentenceBox: false,
      showSetAnalysis: false,
      isFullScreen: false,
      categories: [],
      LoadingOptions: {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      gradeOptions: [
        {
          label: '初中',
          value: 0
        },
        {
          label: '高中',
          value: 1
        },
        {
          label: 'CET-4',
          value: 2
        },
        {
          label: 'CET-6',
          value: 3
        },
        {
          label: '雅思',
          value: 4
        },
        {
          label: '托福',
          value: 5
        },
        {
          label: '专6',
          value: 6
        }
      ],
      deployMessageData: '发布文章成功',
      updateMessageData: '更新文章成功',
      postForm: Object.assign({}, defaultForm),
      analysisForm: Object.assign({}, defaultAnalysisForm),
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
    this.fetchCategory()
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchCategory() {
      fetchCategory().then(response => {
        this.categories = response.data
      })
    },
    editSentence(item) {
      this.isEditSentence = true
      this.analysisSentence = item
      this.showSentenceBox = true
    },
    editWord(item) {
      this.isEditWord = true
      this.analysisWords = item
      this.showWordBox = true
    },
    // 添加讲解数据
    setAllAnalysis() {
      console.log(this.postForm.article_analysis)
      this.showSetAnalysis = false
      // this.postForm.article_analysis = JSON.stringify(this.analysisForm)
    },
    deleteSentence(item) {
      // this.postForm.article_analysis.sentence.splice(this.postForm.article_analysis.sentence.indexOf(item), 1)
      this.postForm.article_analysis.sentence.splice(this.postForm.article_analysis.sentence.indexOf(item), 1)
    },
    deleteWord(item) {
      // this.postForm.article_analysis.words.splice(this.postForm.article_analysis.words.indexOf(item), 1)
      this.postForm.article_analysis.words.splice(this.postForm.article_analysis.words.indexOf(item), 1)
    },
    setOneSentence() {
      if (!this.isEditSentence) {
        this.postForm.article_analysis.sentence.push(this.analysisSentence)
      }
      this.showSentenceBox = false
    },
    setOneWord() {
      if (!this.isEditWord) {
        this.postForm.article_analysis.words.push(this.analysisWords)
      }
      this.showWordBox = false
    },
    goAddOneSentence() {
      this.showSentenceBox = true
      this.isEditSentence = false
    },
    goAddOneWord() {
      this.showWordBox = true
      this.isEditWord = false
    },
    goSetAnalysis() {
      this.showSetAnalysis = true
    },
    fetchData(id) {
      fetchArticle(id).then(response => {
        // 转换为对象进行渲染数据
        response.data.article_analysis = JSON.parse(response.data.article_analysis)
        this.postForm = response.data
        // this.analysisForm = JSON.parse(JSON.stringify(this.postForm.article_analysis));
        // this.postForm.article_analysis = JSON.stringify(this.analysisForm)
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
      this.postNow = JSON.parse(JSON.stringify(this.postForm))
      this.postNow.article_analysis = JSON.stringify(this.postNow.article_analysis)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateArticle(this.postNow).then((res) => {
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
            createArticle(this.postNow).then((res) => {
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
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    margin-top: 6px;
    padding-bottom: 0;
  }
}
</style>
