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
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="TimerId">
              <span>{{ props.row.timer_id }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="定时任务名称" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.timer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="控制器">
        <template slot-scope="{row}">
          <span>{{ row.timer_controller }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="参数">
        <template slot-scope="scope">
          <span>{{ scope.row.timer_param }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="CRONS">
        <template slot-scope="scope">
          <span>{{ scope.row.crons }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="任务状态">
        <template slot-scope="scope">
          <span>{{ scope.row.timer_status }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.set_time }}</span>
          <!--<span>{{ scope.row.deploy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="340px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button v-waves class="filter-item" icon="el-icon-edit" size="mini" circle @click="goEdit(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button v-waves type="danger" size="mini" icon="el-icon-delete" circle @click="deleteTimer(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="立即执行" placement="top-start">
            <el-button v-waves type="success" size="mini" icon="el-icon-bell" circle @click="runTimer(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="暂停" placement="top-start">
            <el-button v-waves size="mini" icon="el-icon-remove" circle @click="cancelTimer(scope)" />
          </el-tooltip>
          <el-button v-waves class="filter-item" size="mini" type="warning" @click="clearFilter">恢 复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--编辑定时任务-->
    <el-dialog width="80%" :fullscreen="fullForm" :title="deviceEditTitle" :visible.sync="editVisible">
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form ref="scheduleForm" :model="scheduleValue" :rules="rules" label-width="120px" size="small">
            <el-form-item label="定时任务名称：" prop="timer_name">
              <el-input v-model="scheduleValue.timer_name" placeholder="输入定时任务名称" />
            </el-form-item>

            <el-form-item label="控制器：" prop="timer_controller">
              <el-input v-model="scheduleValue.timer_controller" type="text" placeholder="输入定时器控制器" />
            </el-form-item>

            <el-form-item label="参数：" prop="timer_param">
              <el-input v-model="scheduleValue.timer_param" type="textarea" placeholder="输入参数" />
            </el-form-item>
            <el-form-item label="CRONS：" prop="crons">
              <el-input v-model="scheduleValue.crons" type="text" placeholder="输入crons表达式" />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="scheduleValue.remark" type="textarea" placeholder="输入备注" />
            </el-form-item>
            <el-form-item label="任务状态：" prop="timer_status">
              <el-radio-group v-model="scheduleValue.timer_status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
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
import { addTimer, fetchList, updateTimer, deleteTimer, runTimer, cancelTimer } from '@/api/system'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import { Loading } from 'element-ui'

export default {
  name: 'ArticleList',
  components: { Pagination },
  directives: { waves },
  filters: {
    // //0 默认新创建  1 预支付创建 2 已支付  3 申请退款中 4 退款完成
    statusFilter(status) {
      switch (status) {
        case 1 :
          return '预支付创建'
        case 0 :
          return '新创建'
        case 2 :
          return '已支付'
        case 3 :
          return '申请退款中'
        case 4 :
          return '退款完成'
        default:
          break
      }
    },
    gradeFilter(grade) {
      switch (grade) {
        case 0 :
          return '高中'
        case 1 :
          return 'CET-4'
        case 2 :
          return 'CET-6'
        case 3 :
          return '雅思'
        case 4 :
          return '托福'
        case 5 :
          return '专6'
        case 6 :
          return '专8'
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
      isEdit: false,
      deviceEditTitle: '添加定时任务',
      scheduleValue: {
        timer_name: '', // 定时任务名称
        timer_controller: '', // 定时方法名称
        timer_param: '', // timer_param
        crons: '', // cron表达式
        timer_status: '', // 1正常  0停止
        remark: '',
        timer_id: ''
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
    cancelTimer(item) {
      const loadingInstance9 = Loading.service(this.LoadingOptions)
      cancelTimer({ id: item.row._id }).then(() => {
        loadingInstance9.close()
        this.getList()
        this.$message({
          type: 'success',
          message: '任务暂停成功!'
        })
      })
    },
    runTimer(item) {
      const loadingInstance7 = Loading.service(this.LoadingOptions)
      runTimer({ id: item.row._id }).then(() => {
        loadingInstance7.close()
        this.getList()
        this.$message({
          type: 'success',
          message: '任务启动成功!'
        })
      })
    },
    deleteTimer(item) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const loadingInstance6 = Loading.service(this.LoadingOptions)
          deleteTimer({ id: item.row._id }).then(() => {
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
      this.isEdit = true
      this.scheduleValue = item.row
      this.editVisible = true
      this.deviceEditTitle = '编辑定时任务'
    },
    addSchedule() {
      this.isEdit = false
      this.scheduleValue = {
        timer_name: '', // 定时任务名称
        timer_controller: '', // 定时方法名称
        timer_param: '', // timer_param
        crons: '', // cron表达式
        timer_status: '', // 1正常  0停止
        remark: '',
        timer_id: ''
      }
      this.editVisible = true
    },
    handleFinishCommit() {
      this.$refs['scheduleForm'].validate((valid) => {
        if (valid) {
          const loadingInstance5 = Loading.service(this.LoadingOptions)
          console.log(this.scheduleValue)
          if (this.isEdit) {
            updateTimer(this.scheduleValue).then(() => {
              loadingInstance5.close()
              this.editVisible = false
              this.getList()
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            })
          } else {
            addTimer(this.scheduleValue).then(() => {
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
    handleDeleteOrder() {

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
