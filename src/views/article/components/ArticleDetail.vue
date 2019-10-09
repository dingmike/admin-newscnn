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
              <MDinput v-model="postForm.article_title" :maxlength="500" name="name" required>
                英文标题
              </MDinput>
              <span v-show="articleTitleShortLength" class="word-counter">{{ articleTitleShortLength }}字</span>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;" prop="chinese_title">
              <MDinput v-model="postForm.chinese_title" :maxlength="100" name="name" required>
                中文标题
              </MDinput>
              <span v-show="chineseTitleShortLength" class="word-counter">{{ chineseTitleShortLength }}字</span>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="84px" label="作者:" class="postInfo-container-item" prop="article_author">
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
                  <el-form-item label-width="90px" label="难度:" class="postInfo-container-item" prop="article_grade">
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
                  <el-form-item label-width="84px" label="价格:" class="postInfo-container-item" prop="pay_price">
                    <el-input-number v-model="postForm.pay_price" size="mini" :precision="2" :step="0.1" :max="1000" /> 元
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="80px" label="翻译价格:" class="postInfo-container-item" pro="translate_price">
                    <el-input-number v-model="postForm.translate_price" size="mini" :precision="2" :step="0.1" :max="1000" /> 元
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="90px" label="支付人数:" class="postInfo-container-item" prop="pay_person_num">
                    <el-input-number v-model="postForm.pay_person_num" size="mini" :step="1" :max="1000000" /> 人
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="84px" label="课程类型:" class="postInfo-container-item" prop="category">
                    <el-select v-model="postForm.category" filterable size="mini" placeholder="请选择课程分类" clearable>
                      <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :label="item.category_name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="80px" label="属性:" class="postInfo-container-item" prop="is_only">
                    <el-select v-model="postForm.is_only" filterable size="mini" placeholder="请选择属性">
                      <el-option
                        v-for="item in isOnlyOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="90px" label="是否付费:" class="postInfo-container-item" prop="is_only">
                    <el-select v-model="postForm.free_article" filterable size="mini" placeholder="请选择是否付费">
                      <el-option
                        v-for="item in freeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="84px" label="文章类型:" class="postInfo-container-item" prop="articleCate">
                    <el-select v-model="postForm.articleCate" filterable size="mini" placeholder="请选择文章分类">
                      <el-option
                        v-for="item in articleCategories"
                        :key="item.id"
                        :label="item.category_name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="90px" label="英文字数:" class="postInfo-container-item" prop="wordNum">
                    <el-input-number v-model="postForm.wordNum" size="mini" :step="1" :max="1000000" /> 个
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="90px" label="点赞数量:" class="postInfo-container-item" prop="favour">
                    <el-input-number v-model="postForm.favour" size="mini" :step="1" :max="1000000" /> 个
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="导读:" prop="article_brief">
          <el-input v-model="postForm.article_brief" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <el-form-item prop="article_content" label-width="80px" label="原文:" style="margin-bottom: 30px;">
          <!--<Tinymce ref="editor" v-model="postForm.article_content" :height="400" />-->
          <el-input v-model="postForm.article_content" :rows="8" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="articleCotentLength" class="word-counter">{{ articleCotentLength }}字</span>
        </el-form-item>

        <el-form-item prop="article_translate" label-width="80px" label="翻译:" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.article_translate" :height="400" />
        </el-form-item>

        <el-form-item v-if="postForm.is_only !== 1" prop="article_analysis" label-width="80px" label="解析:" style="margin-bottom: 30px;">

          <!-- 解析部分-->
          <el-button type="success" @click="goSetAnalysis">
            去创建课程详细的讲解内容
          </el-button>
          <!--<Tinymce v-else ref="editor" v-model="postForm.article_analysis" :height="400" />-->
        </el-form-item>

        <!-- <el-form-item label-width="100px" label="考试单词:" prop="exam_words">
          <el-input v-model="postForm.exam_words" :rows="2" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="wordsShortLength" class="word-counter">{{ wordsShortLength }}字</span>
        </el-form-item>-->

        <el-form-item label-width="100px" label="考试单词:" prop="exam_words">
          <el-card shadow="never" class="cardBg">
            <div>
              <el-button class="littleMarginLeft" @click="handleAddExamWord">增加</el-button>
            </div>
            <!--resultExamWords postForm.exam_words-->
            <el-table
              style="width: 100%; margin-top: 10px"
              :data="postForm.exam_words"
              border
              fit
              size="mini"
            >
              <el-table-column width="80" align="center" label="图片">
                <template slot-scope="scope">

                  <el-popover
                    placement="left"
                    width="320"
                    height="260"
                    trigger="hover"
                  >
                    <div style="width: 300px;">
                      <img :src="scope.row.img_url" style="width: 100%; height: 100%" alt="">
                    </div>
                    <img slot="reference" style="cursor: pointer" :src="scope.row.img_url" width="50" height="50" alt="">
                  </el-popover>

                  <!-- <el-popover
                    placement="top-start"
                    width="200"
                    trigger="click">
                    <div style="width: 360px; height: 240px">
                      <img :src="scope.row.img_url" style="width: 100%;">
                    </div>
                    <div style="width: 100px;" slot="reference">
                     &lt;!&ndash; <el-tooltip class="tooltip-item" effect="dark" :content="scope.row.word" placement="top-start">
                        <img :src="scope.row.img_url" style="width: 100%;" :alt="scope.row.word">
                      </el-tooltip>&ndash;&gt;
                      <img :src="scope.row.img_url" style="width: 100%;" :alt="scope.row.word">
                    </div>
                  </el-popover>-->

                </template>
              </el-table-column>
              <el-table-column
                label="单词"
                width="110"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.word }}
                </template>
              </el-table-column>
              <el-table-column
                label="音标"
                width="110"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.symbol }}
                </template>
              </el-table-column>
              <el-table-column
                label="解释"
                min-width="120"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.wordTranslate }}
                </template>
              </el-table-column>
              <el-table-column
                label="发音"
                width="140"
                align="center"
              >
                <template slot-scope="scope">
                  <audio :src="scope.row.wordAudio" controls="controls" style="padding: 10px;">
                    您的浏览器不支持 audio 标签。
                  </audio>
                </template>
              </el-table-column>
              <el-table-column
                label="例句"
                min-width="380"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.exampleSentence }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleEditExamWord(scope.$index, scope.row)"
                  >编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleRemoveExamWord(scope.$index, scope.row)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

        </el-form-item>

        <!-- <el-form-item style="margin-bottom: 100px;" label-width="100px" label="考试句子:" prop="exam_sentences">
          <el-input v-model="postForm.exam_sentences" :rows="4" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="sentenceShortLength" class="word-counter">{{ sentenceShortLength }}字</span>
        </el-form-item>-->

        <!-- <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>-->

        <el-form-item label-width="100px" label="考试句子:" prop="exam_sentences">
          <el-card shadow="never" class="cardBg">
            <div>
              <el-button class="littleMarginLeft" @click="handleAddExamSentence">增加</el-button>
            </div>
            <!--resultExamWords postForm.exam_words-->
            <el-table
              style="width: 100%; margin-top: 10px"
              :data="postForm.exam_sentences"
              border
              fit
              size="mini"
            >
              <el-table-column
                label="句子"
                width="110"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.sentence }}
                </template>
              </el-table-column>
              <el-table-column
                label="解释"
                min-width="170"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.sentenceTranslate }}
                </template>
              </el-table-column>
              <el-table-column
                label="发音"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <audio :src="scope.row.sentenceAudio" controls="controls" style="padding: 10px;">
                    您的浏览器不支持 audio 标签。
                  </audio>
                </template>
              </el-table-column>
              <el-table-column
                label="视频"
                min-width="200"
                align="center"
              >
                <template slot-scope="scope">
                  <video autoplay controls="controls" :src="scope.row.sentenceVideo" width="100%">
                    您的浏览器不支持 video 标签。
                  </video>
                </template>
              </el-table-column>
              <el-table-column
                label="例句"
                width="350"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.exampleSentence }}
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleEditExamSentence(scope.$index, scope.row)"
                  >编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleRemoveExamSentence(scope.$index, scope.row)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

        </el-form-item>
      </div>
    </el-form>

    <el-dialog title="讲解内容" :fullscreen="isFullScreen" :visible.sync="showSetAnalysis">
      <div>
        <el-form ref="postForm" :model="postForm.article_analysis" :rules="rules" size="small" class="">
          <!--文章段落结构等的讲解-->
          <el-form-item prop="words" label-width="80px" label="段落模块:" style="margin-bottom: 30px;">
            <div>
              <el-tag
                v-for="(item, index) in postForm.article_analysis.pages"
                :key="index"
                closable
                type="success"
                :disable-transitions="false"
                @click="editPage(item)"
                @close="deletePage(item)"
              >
                {{ item.pageTitle }}
              </el-tag>
              <el-button class="button-new-tag" size="small" @click="goAddOnePage">+ New Page</el-button>
            </div>
          </el-form-item>
          <!--单词讲解-->
          <el-form-item prop="words" label-width="80px" label="单词模块:" style="margin-bottom: 30px;">
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
          <!--句子讲解-->
          <el-form-item prop="sentence" label-width="80px" label="句子模块:" style="margin-bottom: 30px;">
            <div>
              <el-tag
                v-for="(item, index) in postForm.article_analysis.sentence"
                :key="index"
                class="own-hidden-words"
                closable
                type="success"
                :disable-transitions="false"
                @click="editSentence(item)"
                @close="deleteSentence(item)"
              >
                {{ item.title }}
              </el-tag>
              <el-button class="button-new-tag" size="small" @click="goAddOneSentence">+ New Sentence</el-button>
            </div>
          </el-form-item>

          <el-form-item prop="analysis_audio" label-width="80px" label="音频:" style="margin-bottom: 30px;">
            <el-input v-model="postForm.article_analysis.analysis_audio" type="text" placeholder="请输入文章相关音频链接" />
            <audio :src="postForm.article_analysis.analysis_audio" controls="controls" style="margin-top: 10px">
              您的浏览器不支持 audio 标签。
            </audio>
            <SingleFile v-model="postForm.article_analysis.analysis_audio" />
          </el-form-item>
          <el-form-item prop="analysis_video" label-width="80px" label="视频:" style="margin-bottom: 30px;">
            <el-input v-model="postForm.article_analysis.analysis_video" type="text" placeholder="请输入文章相关视频链接" />
            <div style="width: 320px; height: 240px; padding: 10px 0 0 0">
              <video autoplay controls="controls" :src="postForm.article_analysis.analysis_video" width="100%">
                您的浏览器不支持 video 标签。
              </video>
            </div>
            <SingleFile v-model="postForm.article_analysis.analysis_video" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showSetAnalysis = false">取 消</el-button>
        <el-button size="small" type="primary" @click="setAllAnalysis">确 定</el-button>
      </div>
      <!--添加段落讲解-->
      <el-dialog
        width="70%"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        title="添加段落讲解"
        :visible.sync="showPageBox"
        append-to-body
        lock-scroll
        @close="showPageBox = false"
      >
        <div>
          <el-form ref="postForm4" :model="analysisPage" :rules="rules" size="small" class="">
            <el-form-item prop="ename" label-width="80px" label="段落标题">
              <el-input v-model="analysisPage.pageTitle" type="text" maxlength="20" placeholder="请输入讲解内容标题" show-word-limit />
            </el-form-item>
            <el-form-item prop="ename" label-width="80px" label="段落">
              <!--<el-input v-model="analysisPage.paragraph" placeholder="请输入段落内容" />-->
              <Tinymce v-if="showPageBox" ref="editor2" v-model="analysisPage.paragraph" :height="320" />
            </el-form-item>
            <el-form-item prop="symbol" label-width="80px" label="讲解内容">
              <Tinymce v-if="showPageBox" ref="editor2" v-model="analysisPage.explain" :height="320" />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="showPageBox = false">关 闭</el-button>
          <el-button type="primary" size="small" @click="setOnePage">设 置</el-button>
        </div>
      </el-dialog>
      <!--添加单词 5个-->
      <el-dialog
        width="70%"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        title="添加重点单词"
        :visible.sync="showWordBox"
        append-to-body
        lock-scroll
        @close="showWordBox = false"
      >
        <div>
          <el-form ref="postForm2" :model="analysisWords" :rules="rules" size="small" class="">
            <el-form-item prop="ename" label-width="80px" label="英文单词">
              <el-input v-model="analysisWords.ename" type="text" placeholder="请输入英文单词" maxlength="40" show-word-limit />
            </el-form-item>
            <el-form-item prop="symbol" label-width="80px" label="单词音标">
              <el-input v-model="analysisWords.symbol" type="text" placeholder="请输入内容" maxlength="40" show-word-limit />
            </el-form-item>
            <el-form-item prop="cname" label-width="80px" label="单词中文">
              <el-input v-model="analysisWords.cname" type="text" placeholder="请输入内容" maxlength="60" show-word-limit />
            </el-form-item>
            <el-form-item prop="sentence" label-width="80px" label="单词讲解">
              <Tinymce v-if="showWordBox" ref="editor2" v-model="analysisWords.sentence" :height="320" />
            </el-form-item>
            <!--<el-form-item prop="sentence" label-width="80px" label="例句英文">
              <el-input v-model="analysisWords.sentence" placeholder="请输入内容" />
            </el-form-item>-->
            <!--  <el-form-item prop="csentence" label-width="80px" label="例句中文">
              <el-input v-model="analysisWords.csentence" placeholder="请输入内容" />
            </el-form-item>-->

            <!--<el-form-item prop="wordAudio" label-width="80px" label="单词发音">
              <el-input v-model="analysisWords.wordAudio" placeholder="请输入音频连接" />
              <audio :src="analysisWords.wordAudio" controls="controls" style="padding: 10px">
                您的浏览器不支持 audio 标签。
              </audio>
              <SingleFile v-model="analysisWords.wordAudio" />
            </el-form-item>
            <el-form-item prop="sentenceAudio" label-width="80px" label="例句发音">
              <el-input v-model="analysisWords.sentenceAudio" placeholder="请输入内容" />
              <audio :src="analysisWords.sentenceAudio" controls="controls" style="padding: 10px">
                您的浏览器不支持 audio 标签。
              </audio>
              <SingleFile v-model="analysisWords.sentenceAudio" />
            </el-form-item>-->
            <el-form-item prop="teacherAudio" label-width="80px" label="老师音频">
              <el-input v-model="analysisWords.teacherAudio" type="text" placeholder="请输入内容" maxlength="2000" show-word-limit />
              <audio :src="analysisWords.teacherAudio" controls="controls" style="padding: 10px">
                您的浏览器不支持 audio 标签。
              </audio>
              <SingleFile v-model="analysisWords.teacherAudio" />
            </el-form-item>
            <el-form-item prop="video" label-width="80px" label="单词视频">
              <el-input v-model="analysisWords.video" type="text" placeholder="请输入单词视频连接" maxlength="2000" show-word-limit />
              <div style="width: 320px; height: 240px; padding: 10px 0 0 0">
                <video autoplay controls="controls" :src="analysisWords.video" width="100%">
                  您的浏览器不支持 video 标签。
                </video>
              </div>
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
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        width="70%"
        title="添加重点句子"
        :visible.sync="showSentenceBox"
        append-to-body
        lock-scroll
        @close="showSentenceBox = false"
      >
        <div>
          <el-form ref="postForm3" :model="analysisSentence" :rules="rules" size="small" class="">

            <el-form-item prop="ename" label-width="80px" label="句子标题">
              <el-input v-model="analysisSentence.title" type="text" placeholder="请输入句子标题" maxlength="20" show-word-limit />
            </el-form-item>

            <el-form-item prop="ename" label-width="80px" label="句子英文">
              <el-input v-model="analysisSentence.ename" placeholder="请输入重点句子" />
              <!--<Tinymce v-if="showSentenceBox" ref="editor3" v-model="analysisSentence.ename" :height="300"/>-->
            </el-form-item>
            <el-form-item prop="cname" label-width="80px" label="句子讲解">
              <Tinymce v-if="showSentenceBox" ref="editor4" v-model="analysisSentence.cname" :height="300" />
            </el-form-item>
            <!-- <el-form-item prop="cname" label-width="80px" label="句子中文">
              <el-input v-model="analysisSentence.cname" placeholder="请输入内容" />
            </el-form-item>-->
            <el-form-item prop="sentenceAudio" label-width="80px" label="句子音频">
              <el-input v-model="analysisSentence.sentenceAudio" placeholder="请输入音频连接" />
              <audio :src="analysisSentence.sentenceAudio" controls="controls" style="padiding: 10px">
                您的浏览器不支持 audio 标签。
              </audio>
              <SingleFile v-model="analysisSentence.sentenceAudio" />
            </el-form-item>
            <el-form-item prop="teacherAudio" label-width="80px" label="老师音频">
              <el-input v-model="analysisSentence.teacherAudio" placeholder="请输入内容" />
              <audio :src="analysisSentence.teacherAudio" controls="controls" style="padiding: 10px">
                您的浏览器不支持 audio 标签。
              </audio>
              <SingleFile v-model="analysisSentence.teacherAudio" />
            </el-form-item>
            <el-form-item prop="video" label-width="80px" label="视频">
              <el-input v-model="analysisSentence.video" placeholder="请输入视频连接" />
              <div style="width: 320px; height: 240px; padding: 10px 0 0 0">
                <video autoplay controls="controls" :src="analysisSentence.video" width="100%">
                  您的浏览器不支持 video 标签。
                </video>
              </div>
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

    <!--添加考试单词-->
    <el-dialog
      v-el-drag-dialog
      width="50%"
      :title="addExamWordsTitle"
      :visible.sync="showExamWordBox"
    >
      <div>
        <el-form ref="postFormWord" :model="examWordsForm" :rules="examWordRules" size="small">

          <el-form-item prop="word" label-width="80px" label="单词英文">
            <el-input v-model="examWordsForm.word" placeholder="请输入内容" :disabled="isEditExamWord" />
          </el-form-item>
          <el-form-item prop="symbol" label-width="80px" label="单词音标">
            <el-input v-model="examWordsForm.symbol" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item prop="wordTranslate" label-width="80px" label="解释">
            <el-input
              v-model="examWordsForm.wordTranslate"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item prop="exampleSentence" label-width="80px" label="例句">
            <el-input
              v-model="examWordsForm.exampleSentence"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item prop="wordAudio" label-width="80px" label="发音">
            <el-input v-model="examWordsForm.wordAudio" placeholder="请输入音频链接" />
            <audio :src="examWordsForm.wordAudio" controls="controls" style="padiding: 10px">
              您的浏览器不支持 audio 标签。
            </audio>
            <SingleFile v-model="examWordsForm.wordAudio" />
          </el-form-item>
          <el-form-item prop="video" label-width="80px" label="图片">
            <el-input v-model="examWordsForm.img_url" placeholder="请输入图片链接" />
            <!--<SingleFile v-model="examWordsForm.pic" />-->
            <upload-corp
              v-model="examWordsForm"
              :cropper-option="cropperOption"
              :image-url="examWordsForm.img_url"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showExamWordBox = false">关 闭</el-button>
        <el-button type="primary" size="small" @click="setOneExamWord">提 交</el-button>
      </div>
    </el-dialog>

    <!--添加考试句子-->
    <el-dialog
      v-el-drag-dialog
      width="50%"
      :title="addExamSentenceTitle"
      :visible.sync="showExamSentenceBox"
    >
      <div>
        <el-form ref="postFormWord" :model="examSentenceForm" :rules="examSentenceRules" size="small">

          <el-form-item prop="sentence" label-width="80px" label="英文句子">
            <el-input v-model="examSentenceForm.sentence" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" :disabled="isEditExamSentence" />
          </el-form-item>
          <el-form-item prop="sentenceTranslate" label-width="80px" label="解释">
            <el-input
              v-model="examSentenceForm.sentenceTranslate"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item prop="exampleSentence" label-width="80px" label="例句">
            <el-input
              v-model="examSentenceForm.exampleSentence"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item prop="sentenceAudio" label-width="80px" label="发音">
            <el-input v-model="examSentenceForm.sentenceAudio" placeholder="请输入音频链接" />
            <audio :src="examSentenceForm.sentenceAudio" controls="controls" style="padiding: 10px">
              您的浏览器不支持 audio 标签。
            </audio>
            <SingleFile v-model="examSentenceForm.sentenceAudio" />
          </el-form-item>
          <el-form-item prop="video" label-width="80px" label="视频">
            <el-input v-model="examSentenceForm.sentenceVideo" placeholder="请输入内容" />
            <SingleFile v-model="examSentenceForm.sentenceVideo" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showExamSentenceBox = false">关 闭</el-button>
        <el-button type="primary" size="small" @click="setOneExamSentence">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import SingleFile from '@/components/Upload/singleFile'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import UploadCorp from '@/components/Upload/uploadCorp'
import { Loading } from 'element-ui'
// import waves from '@/directive/waves' // Waves directive
// import { validURL } from '@/utils/validate'
// import { Loading } from 'element-ui'
// import { searchUser } from '@/api/remoteSearch'
// import Warning from './Warning'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { fetchArticle, createArticle, updateArticle } from '@/api/article'
import { fetchAllList as fetchCategory } from '@/api/courseCate'
import { fetchAllList as fetchArticleCategory } from '@/api/articleCate'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
const defaultExamWordsForm = {
  word: '',
  symbol: '',
  wordTranslate: '',
  wordAudio: '',
  exampleSentence: '',
  img_url: ''
}
const defaultExamSentenceForm = {
  sentence: '',
  sentenceTranslate: '',
  sentenceAudio: '',
  exampleSentence: '',
  sentenceVideo: ''
}
const defaultForm = {
  status: 0, // 发布状态： 1已发布，0：未发布， 2：草稿
  article_title: '', // 文章题目
  chinese_title: '', // 文章中文题目
  category: '',
  articleCate: '', // 文章类型
  is_only: 0, // 单独的文章 1是 0不是（属于课程）
  free_article: 0, // 0 付费，1 免费
  article_author: '', // 文章作者
  article_grade: '', // 文章级别
  memo: '', // 文章说明
  article_content: '', // 文章内容
  article_translate: '', // 文章翻译
  article_analysis: {
    pages: [],
    words: [],
    sentence: [],
    analysis_audio: '',
    analysis_video: ''
  }, // 文章解析
  // article_analysis: '', // 文章解析
  exam_words: [], // 需要测试的单词 用* 隔开
  exam_sentences: [], // 需要测试的句子 用* 隔开
  article_brief: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  deploy_time: undefined, // 发布时间
  article_audio: '', // 音频
  translate_price: '', // 翻译价值
  pay_price: '', // 支付价格
  pay_person_num: '', // 购买人数
  wordNum: '', // 英文字数
  favour: '' // 点赞数
}
const defaultAnalysisForm = {
  pages: [
    {
      pageTitle: 'day1',
      paragraph: '',
      explain: ''
    }
  ],
  words: [
    {
      ename: '',
      symbol: '',
      cname: '',
      sentence: '',
      csentence: '',
      wordAudio: '',
      sentenceAudio: '',
      teacherAudio: '',
      video: ''
    }
  ],
  sentence: [
    {
      ename: '',
      cname: '',
      audio: '',
      video: ''
    }
  ],
  analysis_audio: '',
  analysis_video: ''
}

export default {
  name: 'ArticleDetail',
  directives: { elDragDialog },
  components: { Tinymce, MDinput, Sticky, SingleFile, UploadCorp },
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
      resultExamWords: [],
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
      analysisPage: {
        pageTitle: '',
        paragraph: '',
        explain: ''
      },
      isEditPage: false,
      isEditWord: false,
      isEditSentence: false,
      showExamWordBox: false,
      isEditExamWord: false,
      isEditExamSentence: false,
      addExamWordsTitle: '添加考试单词',
      addExamSentenceTitle: '添加考试句子',
      isEditSentenceWord: false,
      showExamSentenceBox: false,
      showPageBox: false,
      showWordBox: false,
      showSentenceBox: false,
      showSetAnalysis: false,
      isFullScreen: true,
      categories: [],
      articleCategories: [], // 文章类型
      isOnlyOptions: [
        {
          name: '属于课程',
          id: 0
        },
        {
          name: '阅读文章',
          id: 1
        }
      ],
      freeOptions: [
        {
          name: '免费',
          id: 1
        },
        {
          name: '付费',
          id: 0
        }
      ],
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
        },
        {
          label: '专8',
          value: 7
        }
      ],
      deployMessageData: '发布文章成功',
      updateMessageData: '更新文章成功',
      examWordsForm: Object.assign({}, defaultExamWordsForm),
      examSentenceForm: Object.assign({}, defaultExamSentenceForm),
      postForm: Object.assign({}, defaultForm),
      analysisForm: Object.assign({}, defaultAnalysisForm),
      loading: false,
      userListOptions: [],
      rules: {
        article_title: [{ required: true, message: '请输入标题', trigger: 'blur' }, { min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur' }],
        chinese_title: [{ required: true, message: '请输入中文标题', trigger: 'blur' }, { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }],
        pay_price: [{ required: true, message: '请输入文章价格', trigger: 'blur' }],
        category: [{ required: false, message: '请选择课程类型', trigger: 'blur' }],
        articleCate: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
        wordNum: [{ required: true, message: '请输入英文文章字数', trigger: 'blur' }],
        favour: [{ required: false, message: '请输入点赞数量', trigger: 'blur' }],
        article_grade: [{ required: true, message: '请选择文章难度等级', trigger: 'blur' }],
        article_brief: [{ required: true, message: '请输入简介', trigger: 'blur' }, { min: 2, max: 600, message: '长度在 2 到 600 个字符', trigger: 'blur' }],
        article_content: [{ required: false, message: '请输入文章内容', trigger: 'blur' }, { min: 2, max: 50000, message: '长度在 2 到 50000 个字符', trigger: 'blur' }],
        // article_translate: [{ required: false, message: '请输入翻译内容', trigger: 'blur' }, { min: 2, max: 100000, message: '长度在 2 到 50000 个字符', trigger: 'blur' }],
        article_author: [{ required: true, message: '请输入作者', trigger: 'blur' }, { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }],
        // exam_words: [{ required: true, message: '请输入考试单词用*隔开', trigger: 'blur' }, { min: 2, max: 1500, message: '长度在 2 到 1500 个字符', trigger: 'blur' }],
        // exam_sentences: [{ required: true, message: '请输入考试句子用*隔开', trigger: 'blur' }, { min: 2, max: 1500, message: '长度在 2 到 1500 个字符', trigger: 'blur' }],
        exam_words: [{ validator: validateRequire, trigger: 'blur' }],
        exam_sentences: [{ validator: validateRequire, trigger: 'blur' }]
      },
      examWordRules: {
        word: [{ required: true, message: '请输入考试单词', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        symbol: [{ required: true, message: '请输入考试单词音标', trigger: 'blur' }, { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }],
        wordTranslate: [{ required: true, message: '请输入单词解释', trigger: 'blur' }, { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }],
        wordAudio: [{ required: false, message: '请上传音频', trigger: 'blur' }, { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }],
        exampleSentence: [{ required: false, message: '请输入例句', trigger: 'blur' }, { min: 1, max: 300, message: '长度在 2 到 300 个字符', trigger: 'blur' }]
      },
      examSentenceRules: {
        sentence: [{ required: true, message: '请输入考试句子', trigger: 'blur' }, { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }],
        sentenceTranslate: [{ required: true, message: '请输入句子解释', trigger: 'blur' }, { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }],
        sentenceAudio: [{ required: false, message: '请上传音频', trigger: 'blur' }, { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }],
        exampleSentence: [{ required: false, message: '请输入例句', trigger: 'blur' }, { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.article_brief.length
    },
    articleCotentLength() {
      //
      return this.postForm.article_content.split(' ').length - 1
    },
    chineseTitleShortLength() {
      return this.postForm.chinese_title.length
    },
    articleTitleShortLength() {
      return this.postForm.article_title.length
    },
    wordsShortLength() {
      return this.postForm.exam_words.length
    },
    sentenceShortLength() {
      return this.postForm.exam_sentences.length
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
    this.fetchArticleCategory()
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    setOneExamSentence() {
      // this.postForm.exam_words.push(this.examWordsForm)
      // this.resultExamWords.push(this.examWordsForm)
      if (this.isEditExamSentence) {
        this.postForm.exam_sentences = this.postForm.exam_sentences.map(item => {
          item.sentence = item.sentence.trim()
          if (item.sentence === this.examSentenceForm.sentence) {
            item = this.examSentenceForm
            return item
          } else {
            return item
          }
        })
      } else {
        this.examSentenceForm.word = this.examSentenceForm.word.trim()
        const newExamSentence = JSON.parse(JSON.stringify(this.examSentenceForm))
        this.postForm.exam_sentences.push(newExamSentence)
      }
      this.showExamSentenceBox = false
    },
    setOneExamWord() {
      // this.postForm.exam_words.push(this.examWordsForm)
      // this.resultExamWords.push(this.examWordsForm)
      if (this.isEditExamWord) {
        this.postForm.exam_words = this.postForm.exam_words.map(item => {
          item.word = item.word.trim()
          if (item.word === this.examWordsForm.word) {
            item = this.examWordsForm
            return item
          } else {
            return item
          }
        })
      } else {
        this.examWordsForm.word = this.examWordsForm.word.trim()
        const newExamWord = JSON.parse(JSON.stringify(this.examWordsForm))
        this.postForm.exam_words.push(newExamWord)
      }
      this.showExamWordBox = false
    },
    handleRemoveExamSentence(index, row) {
      console.log(row)
      this.postForm.exam_sentences.splice(index, 1)
    },
    handleRemoveExamWord(index, row) {
      console.log(row)
      this.postForm.exam_words.splice(index, 1)
    },
    // 编辑考试单词
    handleEditExamWord(index, row) {
      this.addExamWordsTitle = '编辑考试单词：' + row.word
      this.isEditExamWord = true
      console.log(index)
      this.examWordsForm = row
      this.showExamWordBox = true
    },
    // 编辑考试句子
    handleEditExamSentence(index, row) {
      this.addExamSentenceTitle = '编辑考试句子：' + row.sentence
      this.isEditExamSentence = true
      console.log(index)
      this.examSentenceForm = row
      this.showExamSentenceBox = true
    },
    handleAddExamWord() {
      this.showExamWordBox = true
      this.isEditExamWord = false
    },
    handleAddExamSentence() {
      this.showExamSentenceBox = true
      this.isEditExamSentence = false
    },
    fetchCategory() {
      fetchCategory().then(response => {
        this.categories = response.data
      })
    },
    fetchArticleCategory() {
      fetchArticleCategory().then(response => {
        this.articleCategories = response.data
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
    editPage(item) {
      this.isEditPage = true
      this.analysisPage = item
      this.showPageBox = true
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
    deletePage(item) {
      // this.postForm.article_analysis.words.splice(this.postForm.article_analysis.words.indexOf(item), 1)
      this.postForm.article_analysis.pages.splice(this.postForm.article_analysis.pages.indexOf(item), 1)
    },
    setOneSentence() {
      if (!this.isEditSentence) {
        const newSentence = JSON.parse(JSON.stringify(this.analysisSentence))
        this.postForm.article_analysis.sentence.push(newSentence)
      }
      this.showSentenceBox = false
    },
    setOneWord() {
      if (!this.isEditWord) {
        const newWord = JSON.parse(JSON.stringify(this.analysisWords))
        this.postForm.article_analysis.words.push(newWord)
      }
      this.showWordBox = false
    },
    setOnePage() {
      if (!this.isEditPage) {
        const newPage = JSON.parse(JSON.stringify(this.analysisPage))
        this.postForm.article_analysis.pages.push(newPage)
      }
      this.showPageBox = false
    },
    goAddOneSentence() {
      this.analysisSentence = {
        ename: '',
        cname: '',
        sentenceAudio: '',
        teacherAudio: '',
        video: ''
      }
      this.showSentenceBox = true
      this.isEditSentence = false
    },
    goAddOneWord() {
      this.analysisWords = {
        ename: '',
        symbol: '',
        cname: '',
        sentence: '',
        csentence: '',
        wordAudio: '',
        sentenceAudio: '',
        teacherAudio: '',
        video: ''
      }
      this.showWordBox = true
      this.isEditWord = false
    },
    goAddOnePage() {
      this.analysisPage = {
        pageTitle: '',
        paragraph: '',
        explain: ''
      }
      this.showPageBox = true
      this.isEditPage = false
    },
    goSetAnalysis() {
      this.showSetAnalysis = true
    },
    fetchData(id) {
      const loadingInstance12 = Loading.service(this.LoadingOptions)
      fetchArticle(id).then(response => {
        // 转换为对象进行渲染数据
        response.data.article_analysis = JSON.parse(response.data.article_analysis)
        if (!response.data.article_analysis) {
          response.data.article_analysis =
            {
              pages: [],
              words: [],
              sentence: [],
              analysis_audio: '',
              analysis_video: ''
            }
        }
        // response.data.exam_words = response.data.exam_words.join('*')
        // response.data.exam_sentences = response.data.exam_sentences.join('*')

        // this.postForm = response.data
        response.data.article_analysis = Object.assign(defaultAnalysisForm, response.data.article_analysis)
        this.postForm = response.data
        // this.analysisForm = JSON.parse(JSON.stringify(this.postForm.article_analysis));
        // this.postForm.article_analysis = JSON.stringify(this.analysisForm)
        this.setTagsViewTitle()
        loadingInstance12.close()
      }).catch(err => {
        console.log(err)
        loadingInstance12.close()
      })
    },
    // 设置tab页签数据
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    deployArticle() {
      this.loading = true
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
          if (this.isEdit) {
            updateArticle(this.postNow).then((res) => {
              // loadingInstance.close();
              if (res.code === 200) {
                this.$notify({
                  title: '成功',
                  message: this.updateMessageData,
                  type: 'success'
                })
              } else {
                this.$notify.error({
                  title: '失败',
                  message: '更新文章失败'
                })
                this.loading = false
              }
              this.loading = false
            })
          } else {
            createArticle(this.postNow).then((res) => {
              // loadingInstance.close();
              if (res.code === 200) {
                this.$notify({
                  title: '创建新文章成功',
                  message: this.deployMessageData,
                  type: 'success'
                })
                this.$router.push({ path: '/article/list' })
              } else {
                this.$notify.error({
                  title: '失败',
                  message: '创建文章失败'
                })
                this.loading = false
              }
              this.loading = false
            })
          }
        } else {
          this.loading = false
          console.log('System error submit!!')
          return false
        }
      })
    },
    draftForm() {
      this.loading = true
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
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
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
    right: -46px;
    top: 0;
  }
  .el-tag + .el-tag {
    margin: 0 8px;
  }
  .button-new-tag {
    margin-left: 0px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    margin-top: 6px;
    padding-bottom: 0;
  }
  .cardBg {
    background: #F8F9FC;
  }
  .video-box{
    width: 200px;
    height: 160px;
  }
  .exam-pic{
    width: 320px;
    height: 240px;
  }
  .tooltip-item{
    margin: 4px;
  }
}
</style>
