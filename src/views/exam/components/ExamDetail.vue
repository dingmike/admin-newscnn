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
            <el-form-item style="margin-bottom: 20px;" prop="exam_title">
              <MDinput v-model="postForm.exam_title" :maxlength="100" name="name" required>
                试卷名称
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="6">
                  <el-form-item label-width="100px" label="出题作者:" class="postInfo-container-item" prop="exam_author">
                    <el-input v-model="postForm.exam_author" size="mini" placeholder="" />
                    <!--<el-select v-model="postForm.article_author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="搜索用户">
                      <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
                    </el-select>-->
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="110px" label="参与考试人数:" class="postInfo-container-item" prop="exam_person_num">
                    <el-input-number v-model="postForm.exam_person_num" size="mini" :step="1" :max="1000000" /> 人
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="110px" label="总分:" class="postInfo-container-item" prop="exam_person_num">
                    <el-input-number v-model="postForm.total_score" size="mini" :step="1" :max="150" /> 分
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="110px" label="通过分数:" class="postInfo-container-item" prop="exam_person_num">
                    <el-input-number v-model="postForm.exam_pass_score" size="mini" :step="1" :max="150" /> 分
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="试题类型：" label-width="110px" prop="name">
                    <el-select v-model="postForm.category" filterable size="mini" placeholder="请选择分类" @change="getCourseOptions">
                      <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :label="item.category_name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="所属课程：" label-width="110px" prop="course">
                    <!--    <el-select v-model="postForm.course" filterable size="mini" placeholder="请选择所属课程">
                      <el-option
                        v-for="item in courselists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>-->
                    <el-select v-model="postForm.course" v-loadmore="loadmoreOption" style="width: 200px" size="mini" filterable placeholder="请选择所属课程" @change="getAllCourseWordsAndSentences">
                      <el-option
                        v-for="item in courselists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="考试简介:" prop="exam_brief">
          <el-input v-model="postForm.exam_brief" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入简介内容" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <el-form-item prop="words" label-width="100px" label="考试单词:" style="margin-bottom: 30px;">
          <el-card shadow="never" class="cardBg">
            <el-button class="button-new-tag" size="small" @click="goAddOneWord">+ New Word</el-button>
            <div v-for="(item, index) in postForm.exam_words" :key="index">
              <el-row :gutter="20">
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    {{ item.label }} / {{ item.wordTranslate }}
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content bg-purple-light">
                    <p style="line-height: 18px; padding: 4px 0;"> 例句：{{ item.exampleSentence }}</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <!--<AudioPlayer :audioList='item.wordAudio'></AudioPlayer>-->
                    <aplayer
                      autoplay
                      :music="{
                        title: item.word,
                        artist: '英文能力',
                        src: item.wordAudio,
                        pic: 'http://bkcdn.fecstec.com/FkXF_cUF6QlMYwgXg5H0Z90QeTv-'
                      }"
                    />
                    <!-- <audio :src="item.wordAudio" controls="controls" style="padding: 10px">
                    您的浏览器不支持 audio 标签。
                  </audio>-->
                  </div>
                </el-col>
              </el-row>

            </div>
          </el-card>

        </el-form-item>

        <el-form-item prop="sentence" label-width="100px" label="考试句子:" style="margin-bottom: 30px;">
          <el-card shadow="never" class="cardBg">
            <el-button class="button-new-tag" size="small" @click="goAddOneSentence">+ New Sentence</el-button>
            <div v-for="(item, index) in postForm.exam_sentences" :key="index">
              <el-row :gutter="10">
                <el-col :span="10">
                  <div class="grid-content bg-purple-light">
                    <p style="line-height: 18px; padding: 4px 0;">
                      {{ item.sentence }} / {{ item.sentenceTranslate }}
                    </p>
                  </div>
                </el-col>
                <el-col :span="11">
                  <div class="grid-content bg-purple-light">
                    <p style="line-height: 18px; padding: 4px 0;">
                      例句：{{ item.exampleSentence }}
                    </p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content bg-purple-light">
                    <aplayer
                      autoplay
                      mini
                      :music="{
                        title: item.sentence,
                        artist: '英文能力',
                        src: item.sentenceAudio,
                        pic: 'http://bkcdn.fecstec.com/FkXF_cUF6QlMYwgXg5H0Z90QeTv-'
                      }"
                    />
                  <!--<audio :src="item.sentenceAudio" controls="controls" style="padding: 10px">
                    您的浏览器不支持 audio 标签。
                  </audio>-->
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-form-item>

        <el-form-item prop="article_content" label-width="100px" label="额外测试:" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.exam_content" :height="400" />
        </el-form-item>

        <!-- <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>-->
      </div>
    </el-form>

    <!--添加单词 5个-->
    <el-dialog
      width="65%"
      title="添加考试单词"
      :visible.sync="showWordBox"
      append-to-body
      @close="showWordBox = false"
    >
      <div style="text-align: center">
        <el-transfer
          v-model="resultwordsKey"
          style="text-align: left; display: inline-block"
          filterable
          :left-default-checked="[2, 3]"
          :right-default-checked="[1]"
          :titles="['单词', '考试单词']"
          :button-texts="['还原', '添加到考试']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="exam_words"
          @change="handleChangeWords"
        >
          <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
          <!--<el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>-->
          <!--<el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>-->
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showWordBox = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加句子 2个-->
    <el-dialog
      width="70%"
      title="添加考试句子"
      :visible.sync="showSentenceBox"
      append-to-body
      @close="showSentenceBox = false"
    >
      <div style="text-align: center">
        <el-transfer
          v-model="resultSentencesKey"
          style="text-align: left; display: inline-block"
          filterable
          :left-default-checked="[2, 3]"
          :right-default-checked="[1]"
          :titles="['句子', '考试句子']"
          :button-texts="['还原', '添加到考试句子']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="exam_sentences"
          @change="handleChangeSentences"
        >
          <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
          <!--<el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>-->
          <!--<el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>-->
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showSentenceBox = false">确 定</el-button>
        <!--<el-button type="primary" size="small" @click="setOneSentence">设 置</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
// import SingleFile from '@/components/Upload/singleFile'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import Aplayer from 'vue-aplayer'
import loadmore from '@/directive/loadmore'
// import waves from '@/directive/waves' // Waves directive
// import { validURL } from '@/utils/validate'
// import { Loading } from 'element-ui'
// import { searchUser } from '@/api/remoteSearch'
// import Warning from './Warning'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { fetchExam, createExam, updateExam, wordsAndSentences } from '@/api/exam'
import { fetchAllList as fetchCategory } from '@/api/articleCate'
import { fetchCoursesByCatrgory } from '@/api/course'

const defaultForm = {
  status: 0, // 发布状态： 1已发布， 2：草稿
  exam_title: '', // 文章题目
  category: '',
  exam_author: '', // 作者
  memo: '', // 说明
  exam_content: '', // 额外考试内容
  // 文章解析
  exam_brief: '', // 摘要
  exam_words: [], // 测试单词
  exam_sentences: [], // 测试句子
  exam_audio: '', // 音频
  exam_pass_score: '', // 合格分数
  total_score: '', // 总分
  pass_person_num: '', // 通过人数
  exam_person_num: '', // 测试人数
  favour: '' // 赞
}

export default {
  name: 'ExamDetail',
  directives: { loadmore },
  // components: { Tinymce, MDinput, Sticky, SingleFile },
  components: { Tinymce, MDinput, Sticky, Aplayer },
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
      examParams: {
        courseId: ''
      },
      courseParams: {
        id: '', // 分类ID
        page: 1,
        limit: 8
      },
      cateCourseTotal: null,
      courselists: [],
      exam_words: [],
      exam_sentences: [],
      resultWords: [], // 选择的单词
      resultSentences: [], // 选择的句子
      resultwordsKey: [],
      resultSentencesKey: [],
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
      deployMessageData: '发布文章成功',
      updateMessageData: '更新文章成功',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        exam_title: [{ required: true, message: '请输入标题', trigger: 'blur' }, { min: 2, max: 20, message: '长度在 2 到 02 个字符', trigger: 'blur' }],
        exam_brief: [{ required: true, message: '请输入简介', trigger: 'blur' }, { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }],
        exam_author: [{ required: true, message: '请输入出题人', trigger: 'blur' }, { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        exam_words: [{ validator: validateRequire, trigger: 'blur' }],
        exam_sentences: [{ validator: validateRequire, trigger: 'blur' }]

      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.exam_brief.length
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
    async editFetchCategory(cate) {
      const response = await fetchCategory()
      this.categories = response.data
      if (cate) {
        this.getCourseOptions(cate)
      }
    /* fetchCategory().then(response => {
        this.categories = response.data
        if(cate){
          this.getCourseOptions(cate)
        }
      })*/
    },
    // 考试单词改变
    handleChangeWords(val) {
      const resultArr = this.exam_words.filter(item => {
        return val.includes(item.key)
      })
      console.log(resultArr)
      this.resultWords = resultArr
      this.postForm.exam_words = resultArr
    },
    // 考试句子改变
    handleChangeSentences(val) {
      const resultArr = this.exam_sentences.filter(item => {
        return val.includes(item.key)
      })
      console.log(resultArr)
      this.resultSentences = resultArr
      this.postForm.exam_sentences = resultArr
    },
    // 课程分类
    getCourseOptions(id) {
      this.courseParams.id = id
      this.loadmoreOption(1)
    },
    // 根据分类加载课程列表
    loadmoreOption(flag) {
      if (flag === 1) {
        this.courseParams.page = 1
        this.courseParams.limit = 8
        this.courselists = []
        this.postForm.course = ''
        fetchCoursesByCatrgory(this.courseParams).then(response => {
          if (response.data.docs.length) {
            this.courselists = this.courselists.concat(response.data.docs)
          }
          this.cateCourseTotal = response.data.total
        })
      } else {
        this.courseParams.page = this.courseParams.page + 1
        if (this.cateCourseTotal > this.courselists.length) {
          fetchCoursesByCatrgory(this.courseParams).then(response => {
            if (response.data.docs.length) {
              this.courselists = this.courselists.concat(response.data.docs)
            }
            this.cateCourseTotal = response.data.total
          })
        }
      }
    },
    getAllCourseWordsAndSentences(id) {
      this.examParams.courseId = id
      wordsAndSentences(this.examParams).then(response => {
        if (response.code === 200) {
          if (response.data.examWords.length) {
            this.exam_words = response.data.examWords.map((item, index) => {
              return {
                key: index,
                label: item.word,
                disabled: false,
                ...item
              }
            })
          }
          if (response.data.examSentences.length) {
            this.exam_sentences = response.data.examSentences.map((item, index) => {
              return {
                key: index,
                label: item.sentence,
                disabled: false,
                ...item
              }
            })
          }
        }
      })
    },
    fetchCategory() {
      fetchCategory().then(response => {
        this.categories = response.data
      })
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
    async fetchData(id) {
      debugger
      const response = await fetchExam(id)
      response.data.exam_words = response.data.exam_words.map((item, index) => {
        return {
          key: index,
          label: item.word,
          disabled: false,
          ...item
        }
      })
      response.data.exam_sentences = response.data.exam_sentences.map((item, index) => {
        return {
          key: index,
          label: item.sentence,
          disabled: false,
          ...item
        }
      })
      if (this.isEdit) {
        await this.editFetchCategory(response.data.category)
      }
      this.postForm = response.data
      console.log(this.postForm)
      this.setTagsViewTitle()

      /* fetchExam(id).then(response => {
        // 转换为对象进行渲染数据
        // response.data.article_analysis = JSON.parse(response.data.article_analysis)
        // 将exam_words和 exam_sentences 转换为可渲染的对象数组
        response.data.exam_words = response.data.exam_words.map((item, index) => {
          return {
            key: index,
            label: item.word,
            disabled: false,
            ...item
          }
        })
        response.data.exam_sentences = response.data.exam_sentences.map((item, index) => {
          return {
            key: index,
            label: item.sentence,
            disabled: false,
            ...item
          }
        })
        if(this.isEdit) {
          this.editFetchCategory(response.data.category)
        }
        this.postForm = response.data
        console.log(this.postForm)
        // this.analysisForm = JSON.parse(JSON.stringify(this.postForm.article_analysis));
        // this.postForm.article_analysis = JSON.stringify(this.analysisForm)
        this.setTagsViewTitle()

      }).catch(err => {
        console.log(err)
      })*/
    },
    // 设置tab页签数据
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑试题' : 'Edit Exam'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    deployArticle() {
      this.updateMessageData = '更新成功'
      this.deployMessageData = '发布成功'
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
            updateExam(this.postNow).then((res) => {
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
            createExam(this.postNow).then((res) => {
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
    top: 0;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
  .cardBg {
    background: #F8F9FC;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    height: 80px;
    font-size: 14px;
    padding: 0 10px;
    margin: 8px 0;
  }
}
</style>
