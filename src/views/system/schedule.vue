<template>
  <div class="app-container">
    <!--    <div class="filter-container">
      <el-input v-model="listQuery.article_name" :placeholder="$t('table.title')" style="width: 220px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
      <el-input v-model="listQuery.openid" placeholder="Openid" style="width: 200px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilterNow" />
      <el-select v-model="listQuery.status" placeholder="选择订单状态" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" size="small" @click="handleFilterNow">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item" size="small" plain @click="clearFilter">重 置</el-button>
      <el-button v-waves class="filter-item" type="primary" size="small" @click="clearFilter">新 增</el-button>
    </div>-->

    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" size="small" @click="addSchedule">新 增</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border :fit="fitWidth" size="small" stripe highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="延迟时间（ms）:">
              <span>{{ props.row.opts_delay }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="失败尝试次数:">
              <span>{{ props.row.opts_attempts }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="执行完是否删除日志:">
              <span>{{ props.row.opts_removeOnComplete }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="执行失败后是否删除日志:">
              <span>{{ props.row.opts_removeOnFail }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="执行开始日期:">
              <span>{{ props.row.opts_repeat_startDate }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="执行结束日期:">
              <span>{{ props.row.opts_repeat_endDate }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="redis保存prefix名称:">
              <span>{{ props.row.prefix }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="备注：">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="TimerId:">
              <span>{{ props.row.timer_id }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="队列名称" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.queue_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="队列服务名称" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.queue_host }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="定时任务名称" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.job_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="控制器">
        <template slot-scope="{row}">
          <span>{{ row.timer_controller }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="参数">
        <template slot-scope="scope">
          <span>{{ scope.row.params_data }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="重复队列CRONS">
        <template slot-scope="scope">
          <span>{{ scope.row.opts_repeat_cron }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="任务状态">
        <template slot-scope="scope">
          <span>{{ scope.row.timer_status === 0 ? '暂停' : '启动' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.meta.createAt }}</span>
          <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.meta.updateAt }}</span>
          <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="340px" fixed="right">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button v-waves class="filter-item" icon="el-icon-edit" size="mini" circle @click="goEdit(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="立即执行" placement="top-start">
            <el-button v-waves type="success" size="mini" icon="el-icon-bell" circle @click="runQueue(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="暂停" placement="top-start">
            <el-button v-waves type="warning" size="mini" icon="el-icon-remove" circle @click="pauseQueue(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="恢复" placement="top-start">
            <el-button v-waves type="success" size="mini" icon="el-icon-check" circle @click="resumeQueue(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button v-waves type="danger" size="mini" icon="el-icon-delete" circle @click="deleteQueue(scope)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--编辑定时任务-->
    <el-dialog width="80%" :fullscreen="fullForm" :title="deviceEditTitle" :visible.sync="editVisible">
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form ref="scheduleForm" :model="scheduleValue" :rules="rules" label-width="200px" size="small">
            <el-form-item label="队列名称：" prop="queue_name">
              <el-input v-model="scheduleValue.queue_name" placeholder="输入定时任务队列名称" />
            </el-form-item>
            <el-form-item label="队列服务名称：" prop="queue_host">
              <el-input v-model="scheduleValue.queue_host" placeholder="输入队列服务名称" />
            </el-form-item>
            <el-form-item label="定时任务名称：" prop="job_name">
              <el-input v-model="scheduleValue.job_name" placeholder="输入队列服务名称" />
            </el-form-item>
            <el-form-item label="参数：" prop="params_data">
              <el-input v-model="scheduleValue.params_data" placeholder="输入参数" />
            </el-form-item>
            <el-form-item label="延迟时间（ms）" prop="opts_delay">
              <el-input v-model="scheduleValue.opts_delay" placeholder="输入延迟时间（ms）" />
            </el-form-item>
            <el-form-item label="失败尝试次数" prop="opts_attempts">
              <el-input-number v-model="scheduleValue.opts_attempts" size="small" placeholder="输入失败尝试次数" />
            </el-form-item>
            <el-form-item label="执行完是否删除日志" prop="opts_removeOnComplete">
              <el-radio-group v-model="scheduleValue.opts_removeOnComplete">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="执行失败后是否删除日志" prop="opts_removeOnFail">
              <el-radio-group v-model="scheduleValue.opts_removeOnFail">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="控制器：" prop="timer_controller">
              <el-input v-model="scheduleValue.timer_controller" type="text" placeholder="输入定时器控制器" />
            </el-form-item>

            <el-form-item label="CRONS：" prop="opts_repeat_cron">
              <el-input v-model="scheduleValue.opts_repeat_cron" type="text" placeholder="输入crons表达式" />
            </el-form-item>
            <el-form-item label="任务起始日期" prop="opts_repeat_startDate">
              <el-date-picker
                v-model="scheduleValue.opts_repeat_startDate"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item label="任务起始日期" prop="opts_repeat_endDate">
              <el-date-picker
                v-model="scheduleValue.opts_repeat_endDate"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item label="prefix名称" prop="prefix">
              <el-input v-model="scheduleValue.prefix" type="text" placeholder="输入prefix" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="scheduleValue.remark" type="textarea" placeholder="输入备注" />
            </el-form-item>
            <!--<el-form-item label="任务状态：" prop="timer_status">
              <el-radio-group v-model="scheduleValue.timer_status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>-->
            <el-form-item style="text-align: center">
              <el-button type="primary" size="medium" @click="handleFinishCommit">提 交</el-button>
              <el-button size="medium" @click="editVisible=false">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-row class="">
            <el-col :span="8">
              0 15 10 * * ? *
            </el-col>
            <el-col :span="16">
              每天10点15分触发
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 25 0/1 * * ?</el-col>
            <el-col :span="16">每隔1小时执行一次从25分钟开始</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 0 1 * * ?</el-col>
            <el-col :span="16">每天凌晨1点执行一次</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 */1 * * * ?</el-col>
            <el-col :span="16">每隔1分钟执行一次</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 15 10 * * ? 2018</el-col>
            <el-col :span="16">2018年每天10点15分触发</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 * 14 * * ?</el-col>
            <el-col :span="16">每天下午的 2点到2点59分每分触发</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 0/5 14 * * ?</el-col>
            <el-col :span="16">每天下午的 2点到2点59分(整点开始，每隔5分触发)</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 0/5 14,18 * * ?</el-col>
            <el-col :span="16">每天下午的 2点到2点59分、18点到18点59分(整点开始，每隔5分触发)</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 0-5 14 * * ?</el-col>
            <el-col :span="16">每天下午的 2点到2点05分每分触发</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 15 10 ? * 6L</el-col>
            <el-col :span="16">每月最后一周的星期五的10点15分触发</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 15 10 ? * 6#3</el-col>
            <el-col :span="16">每月的第三周的星期五开始触发</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">0 0 0,13,18,21 * * ?</el-col>
            <el-col :span="16">每天的0点、13点、18点、21点都执行一次</el-col>
          </el-row>
        </el-col>
      </el-row>

    </el-dialog>

  </div>
</template>

<script>
import { addQueue, fetchList, updateQueue, deleteQueue, runQueue, pauseQueue, resumeQueue } from '@/api/queueJob'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import { Loading } from 'element-ui'

export default {
  name: 'ArticleList',
  components: { Pagination },
  directives: { waves },
  filters: {
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
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      isEdit: false,
      deviceEditTitle: '添加定时任务',
      scheduleValue: {
        queue_name: '',
        queue_host: '',
        job_name: '',
        params_data: '',
        opts_delay: 0,
        opts_attempts: 0,
        opts_removeOnComplete: '',
        opts_removeOnFail: '',
        opts_repeat_cron: '',
        opts_repeat_startDate: '',
        opts_repeat_endDate: '',
        prefix: '',
        remark: ''
      },
      rules: {
        timer_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 2, max: 120, message: '长度在 2 到 120 个字符', trigger: 'blur' }
        ],
        timer_controller: [{ required: true, message: '请输入广告内容', trigger: 'blur' },
          { max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
        timer_param: [{ max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }],
        crons: [{ required: true, message: '请输入CORON表达式', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }],
        timer_status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        remark: [{ max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }]
      },
      LoadingOptions: {
        lock: true,
        text: '正在加载...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      list: null,
      editVisible: false,
      fitWidth: false,
      fullForm: false,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
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
    pauseQueue(item) {
      const loadingInstance9 = Loading.service(this.LoadingOptions)
      const parmas = {
        id: item.row.id,
        queueName: item.row.queue_name,
        queueHost: item.row.queue_host
      }
      pauseQueue(parmas).then(() => {
        loadingInstance9.close()
        this.getList()
        this.$message({
          type: 'success',
          message: '任务暂停成功!'
        })
      })
    },
    deleteQueue(item) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const loadingInstance6 = Loading.service(this.LoadingOptions)
          const parmas = {
            id: item.row.id,
            queueName: item.row.queue_name,
            queueHost: item.row.queue_host
          }
          deleteQueue(parmas).then(() => {
            loadingInstance6.close()
            this.editVisible = false
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
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
    goEdit(item) {
      if (item.timer_status === 0) {
        this.isEdit = true
        this.scheduleValue = item.row
        this.editVisible = true
        this.deviceEditTitle = '编辑定时任务'
      } else {
        this.$message({
          type: 'warning',
          message: '任务暂停后才能编辑任务!'
        })
      }
    },
    addSchedule() {
      this.isEdit = false
      this.scheduleValue = {
        queue_name: '',
        queue_host: '',
        job_name: '',
        params_data: '',
        opts_delay: 0,
        opts_attempts: 0,
        opts_removeOnComplete: '',
        opts_removeOnFail: '',
        opts_repeat_cron: '',
        opts_repeat_startDate: '',
        opts_repeat_endDate: '',
        prefix: '',
        remark: ''
      }
      this.editVisible = true
    },
    // 提交数据
    handleFinishCommit() {
      this.$refs['scheduleForm'].validate((valid) => {
        if (valid) {
          const loadingInstance5 = Loading.service(this.LoadingOptions)
          console.log(this.scheduleValue)
          if (this.isEdit) {
            updateQueue(this.scheduleValue).then(() => {
              loadingInstance5.close()
              this.editVisible = false
              this.getList()
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            })
          } else {
            addQueue(this.scheduleValue).then(() => {
              loadingInstance5.close()
              this.editVisible = false
              this.getList()
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    runQueue(item) {
      const parmas = {
        id: item.row.id,
        queueName: item.row.queue_name,
        queueHost: item.row.queue_host,
        jobName: item.row.job_name,
        timerController: item.row.timer_controller
      }
      runQueue(parmas).then(response => {
        console.log(response)
        this.getList()
        this.$message({
          type: 'success',
          message: '启动成功!'
        })
      })
    },
    resumeQueue(item) {
      const parmas = {
        id: item.row.id,
        queueName: item.row.queue_name,
        queueHost: item.row.queue_host
      }
      resumeQueue(parmas).then(response => {
        console.log(response)
        this.getList()
        this.$message({
          type: 'success',
          message: '启动成功!'
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
      this.getList()
    },
    handleFilterNow() {
      this.listQuery = {
        page: 1,
        limit: 10,
        status: '',
        article_name: '',
        openid: ''
      }
      this.getList()
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
