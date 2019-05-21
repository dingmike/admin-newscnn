<template>
  <div class="app-container">
    <div class="filter-container" style="text-align: right">
      <el-tooltip effect="dark" :content="$t('table.export')" placement="top">
        <el-button
          type="default"
          size="small"
          style="font-size: 17px"
          icon="el-icon-download"
          circle
          @click="handleDownload"
        />
      </el-tooltip>
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button
          type="default"
          size="mini"
          style="font-size: 18px"
          icon="el-icon-refresh"
          circle
          @click="getList"
        />
      </el-tooltip>
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
            <el-form-item label="response">
              <span>{{ props.row.response }}</span>
            </el-form-item>
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
      <el-table-column align="center" label="Actions" width="100px">
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
      </el-table-column>
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
import { fetchRequestLogList } from '@/api/common'
import { parseUTCtime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchRequestLogList(this.listQuery).then(response => {
        this.list = response.data.docs
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDelete() {

    },
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
