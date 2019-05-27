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
      <el-button v-waves class="filter-item" size="small" type="danger" @click="clearFilter">暂 停</el-button>
      <el-button v-waves class="filter-item" size="small" type="warning" @click="clearFilter">恢 复</el-button>
      <el-button v-waves class="filter-item" size="small" type="success" @click="clearFilter">立即执行</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border :fit="fitWidth" size="small" stripe highlight-current-row style="width: 100%">

      <el-table-column align="center" label="定时任务名称" width="240px">
        <template slot-scope="scope">
          <span>{{ scope.row.timer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="控制器">
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
      <el-table-column width="120px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="任务状态">
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

      <el-table-column align="left" label="订单操作" width="100px">
        <template slot-scope="scope">
          <!--退款-->
          <el-tooltip class="item" effect="dark" content="退款" placement="top-start">
            <el-button v-show="scope.row.status === 2" type="success" icon="el-icon-check" size="small" circle @click="handleDeleteOrder(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--编辑定时任务-->
    <el-dialog width="60%" :fullscreen="fullForm" :title="deviceEditTitle" :visible.sync="editVisible">
      <el-form ref="scheduleForm" :model="scheduleValue" :rules="rules" label-width="120px" size="small">
        <el-form-item label="定时任务名称：" prop="timer_name">
          <el-input v-model="scheduleValue.timer_name" placeholder="输入定时任务名称" style="width: 600px" />
        </el-form-item>

        <el-form-item label="控制器：" prop="timer_controller">
          <el-input v-model="scheduleValue.timer_controller" type="textarea" placeholder="输入定时器控制器" style="width: 600px" />
        </el-form-item>

        <el-form-item label="参数：" prop="timer_param">
          <el-input v-model="scheduleValue.timer_param" type="textarea" placeholder="输入参数" style="width: 600px" />
        </el-form-item>
        <el-form-item label="CRONS：" prop="crons">
          <el-input v-model="scheduleValue.crons" type="text" placeholder="输入crons表达式" style="width: 600px" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="scheduleValue.remark" type="textarea" placeholder="输入备注" style="width: 600px" />
        </el-form-item>
        <el-form-item label="任务状态：" prop="timer_status">
          <el-radio-group v-model="scheduleValue.timer_status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="handleFinishCommit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { addTimer, fetchList } from '@/api/system'
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
      deviceEditTitle: '添加定时任务',
      scheduleValue: {
        timer_name: '', // 定时任务名称
        timer_controller: '', // 定时方法名称
        timer_param: '', // timer_param
        crons: '', // cron表达式
        timer_status: '', // 1正常  0停止
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
    addSchedule() {
      this.editVisible = true
    },
    handleFinishCommit() {
      this.$refs['scheduleForm'].validate((valid) => {
        if (valid) {
          const loadingInstance5 = Loading.service(this.LoadingOptions)
          console.log(this.scheduleValue)
          addTimer(this.scheduleValue).then(() => {
            loadingInstance5.close()
            this.editVisible = false
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
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
