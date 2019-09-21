<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-card class="operate-container" shadow="never">
          <el-col :span="4">
            <el-select v-model="deleteParams.days" :placeholder="$t('table.deleteRequestLogs')" class="filter-item" size="small" clearable>
              <el-option v-for="item in deleteOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button v-waves class="filter-item" type="primary" size="small" @click="deleteLogs">
              {{ $t('table.confirmDelete') }}
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-tooltip effect="dark" :content="$t('table.export')" placement="top">
              <el-button
                type="default"
                size="small"
                style="font-size: 16px"
                icon="el-icon-download"
                circle
                @click="handleDownload"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-button
                type="default"
                size="small"
                style="font-size: 16px"
                icon="el-icon-refresh"
                circle
                @click="getList"
              />
            </el-tooltip>
          </el-col>

        </el-card>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      :fit="fitWidth"
      size="small"
      stripe
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="name">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="stack">
              <span>{{ props.row.stack }}</span>
            </el-form-item>
            <el-form-item label="message">
              <span>{{ props.row.message }}</span>
            </el-form-item>
            <el-form-item label="body">
              <span>{{ props.row.body }}</span>
            </el-form-item>
            <el-form-item label="query">
              <span>{{ props.row.query }}</span>
            </el-form-item>
            <!--<el-form-item label="response">
              <span>{{ props.row.response }}</span>
            </el-form-item>-->
            <el-form-item label="userAgent">
              <span>{{ props.row.userAgent }}</span>
            </el-form-item>
            <el-form-item label="headers">
              <span>{{ props.row.headers }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="url">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="ip">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="method" width="80">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.method }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="260px" align="center" label="query">
        <template slot-scope="scope">
          <span>{{ scope.row.query }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="useTime">
        <template slot-scope="scope">
          <span>{{ scope.row.useTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Time">
        <template slot-scope="scope">
          <span>{{ scope.row.meta.createAt | parseUTCtime }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="Actions" width="100px">
        <template slot-scope="scope">
          <div>
            <el-button
              v-show="scope.row.status!==1"
              type="danger"
              size="small"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
            />
          </div>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchRequestLogList, deleteRequestLogs } from '@/api/common'
import { parseUTCtime } from '@/utils'
import { Loading } from 'element-ui'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

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
      const seconds = date2.getSeconds()
      return year + '-' + mon + '-' + day + ' ' + noon + ' ' + hour + ':' + min + ':' + seconds
    }
  },
  data() {
    return {
      list: null,
      fitWidth: false,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      LoadingOptions: {
        lock: true,
        text: '正在加载...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      deleteParams: {
        days: 1,
        type: 'request'
      },
      deleteOptions: [
        {
          label: '当天',
          value: 0
        },
        {
          label: '前1天',
          value: 1
        },
        {
          label: '前2天',
          value: 2
        },
        {
          label: '前5天',
          value: 5
        },
        {
          label: '前10天',
          value: 10
        },
        {
          label: '前30天',
          value: 30
        },
        {
          label: '前60天',
          value: 60
        },
        {
          label: '前180天',
          value: 180
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    deleteLogs() {
      this.$confirm('确定将选择的数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingInstance6 = Loading.service(this.LoadingOptions)
        deleteRequestLogs(this.deleteParams).then(response => {
          if (response.code === 200) {
            loadingInstance6.close()
            this.getList()
            this.$notify({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$notify({
              message: '删除失败',
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getList() {
      this.listLoading = true
      fetchRequestLogList(this.listQuery).then(response => {
        this.list = response.data.docs
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /* handleDelete() {

    },*/
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['name', 'message', 'stack', 'ip', 'url', 'method', 'query', 'body', 'response', 'status', 'useTime', 'contentType', 'userAgent', 'headers', 'protocol', 'timestamp']
          const filterVal = ['name', 'message', 'stack', 'ip', 'url', 'method', 'query', 'body', 'response', 'status', 'useTime', 'contentType', 'userAgent', 'headers', 'protocol', 'meta']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'ErrorLogs'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseUTCtime(v[j].createAt)
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>
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

  .demo-table-expand .el-form-item span {
    font-size: 10px;
  }
</style>
