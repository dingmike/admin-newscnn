<template>
  <div class="app-container">
    <!--<div class="filter-container">
        <el-input v-model="listQuery.title" :placeholder="$t('table.title')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            {{ $t('table.search') }}
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            {{ $t('table.add') }}
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
            {{ $t('table.export') }}
        </el-button>
        <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
            {{ $t('table.reviewer') }}
        </el-checkbox>
    </div>-->
    <el-card class="operate-container" shadow="never">
      <!--
       page: 1,
        limit: 20,
        article_author: '',
        chinese_title: '',
        article_grade: '',
        category: '',
        is_only: 0, // 1： 是课程文章，0单独文章
        status: 1 // 发布状态： 1已发布，0：未发布， 2：草稿-->
      <el-input v-model="listQuery.nickname" :placeholder="$t('table.wechat_nickname')" style="width: 220px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.user_name" :placeholder="$t('table.username')" style="width: 220px;" class="filter-item" size="small" clearable @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sex" :placeholder="$t('table.gender')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.subscribe_scene" :placeholder="$t('table.subscribe_scene')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option v-for="item in subscribeSceneOps" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.subscribe" :placeholder="$t('table.subscribe')" style="width: 130px" class="filter-item" size="small" clearable>
        <el-option v-for="item in subscribeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" size="small" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item" size="small" plain @click="clearFilter">重 置</el-button>
      <el-tooltip effect="dark" :content="$t('table.refresh')" placement="top">
        <el-button
          v-waves
          class="filter-item"
          type="default"
          size="small"
          icon="el-icon-refresh"
          plain
          @click="getList"
        />
      </el-tooltip>
      <el-tooltip effect="dark" :content="$t('table.export')" placement="top">
        <el-button
          v-waves
          type="default"
          size="small"
          icon="el-icon-download"
          plain
          @click="handleDownload"
        />
      </el-tooltip>
    </el-card>
    <div class="table-container">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        size="small"
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="微信头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl" width="50" height="50" style="border-radius: 50%" alt="">
          </template>
        </el-table-column>
        <el-table-column label="微信名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_name ? scope.row.user_name : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sex === 0 ? '未知' : scope.row.sex === 1 ? '男': '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="积分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.credits }}</span>
          </template>
        </el-table-column>
        <el-table-column label="阅读总时长" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.read_time }} 分钟</span>
          </template>
        </el-table-column>
        <el-table-column label="被赞次数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.favour }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否订阅" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.subscribe === 1 ? '订阅' : '未订阅' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="订阅来源" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.subscribe_scene | subscribeType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="语言" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.language }}</span>
          </template>
        </el-table-column>

        <el-table-column label="国家" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.country ? scope.row.country : '未知区域' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="省份" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.province ? scope.row.province : '未知区域' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="城市" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.city ? scope.row.city : '未知区域' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近关注时间" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.subscribe_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              {{ $t('table.edit') }}
            </el-button>
          </template>
        </el-table-column>
        <!--          <el-table-column :label="$t('table.title')" min-width="150px">
                      <template slot-scope="{row}">
                          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
                          <el-tag>{{ row.type | typeFilter }}</el-tag>
                      </template>
                  </el-table-column>
                  <el-table-column :label="$t('table.author')" width="110px" align="center">
                      <template slot-scope="scope">
                          <span>{{ scope.row.author }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column v-if="showReviewer" :label="$t('table.reviewer')" width="110px" align="center">
                      <template slot-scope="scope">
                          <span style="color:red;">{{ scope.row.reviewer }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column :label="$t('table.importance')" width="80px">
                      <template slot-scope="scope">
                          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>
                      </template>
                  </el-table-column>
                  <el-table-column :label="$t('table.readings')" align="center" width="95">
                      <template slot-scope="{row}">
                          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
                          <span v-else>0</span>
                      </template>
                  </el-table-column>
                  <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
                      <template slot-scope="{row}">
                          <el-tag :type="row.status | statusFilter">
                              {{ row.status }}
                          </el-tag>
                      </template>
                  </el-table-column>
                  <el-table-column :label="$t('table.actions')" align="center" width="230"
                                   class-name="small-padding fixed-width">
                      <template slot-scope="{row}">
                          <el-button type="primary" size="mini" @click="handleUpdate(row)">
                              {{ $t('table.edit') }}
                          </el-button>
                          <el-button v-if="row.status!='published'" size="mini" type="success"
                                     @click="handleModifyStatus(row,'published')">
                              {{ $t('table.publish') }}
                          </el-button>
                          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
                              {{ $t('table.draft') }}
                          </el-button>
                          <el-button v-if="row.status!='deleted'" size="mini" type="danger"
                                     @click="handleModifyStatus(row,'deleted')">
                              {{ $t('table.delete') }}
                          </el-button>
                      </template>
                  </el-table-column>-->
      </el-table>
    </div>

    <div class="pagination-container">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />

    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item label="用户名称" prop="user_name">
          <el-input v-model="temp.user_name" />
        </el-form-item>
        <el-form-item label="手机号" prop="user_phone">
          <el-input v-model.number="temp.user_phone" />
        </el-form-item>

        <!-- <el-form-item :label="$t('table.type')" prop="type">
             <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                 <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name"
                            :value="item.key"/>
             </el-select>
         </el-form-item>
         <el-form-item :label="$t('table.date')" prop="timestamp">
             <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"/>
         </el-form-item>
         <el-form-item :label="$t('table.title')" prop="title">
             <el-input v-model="temp.title"/>
         </el-form-item>
         <el-form-item :label="$t('table.status')">
             <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
                 <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
             </el-select>
         </el-form-item>
         <el-form-item :label="$t('table.importance')">
             <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3"
                      style="margin-top:8px;"/>
         </el-form-item>
         <el-form-item :label="$t('table.remark')">
             <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                       placeholder="Please input"/>
         </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateUser()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv, createArticle } from '@/api/article'
import { getUserList, updateUser, deleteUser } from '@/api/wechat'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    subscribeType(val) {
      switch (val) {
        case 'ADD_SCENE_SEARCH' :
          return '公众号搜索'
        case 'ADD_SCENE_ACCOUNT_MIGRATION' :
          return '公众号迁移'
        case 'ADD_SCENE_PROFILE_CARD' :
          return '名片分享'
        case 'ADD_SCENE_QR_CODE' :
          return '扫描二维码'
        case 'ADD_SCENEPROFILE_LINK' :
          return '图文页内名称点击'
        case 'ADD_SCENE_PROFILE_ITEM' :
          return '图文页右上角菜单'
        case 'ADD_SCENE_PAID' :
          return '支付后关注'
        case 'ADD_SCENE_OTHERS' :
          return '其他'
        default:
          break
      }
    },
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      subscribeOptions: [
        {
          label: '已订阅',
          value: 1
        },
        {
          label: '未订阅',
          value: 0
        }
      ],
      subscribeSceneOps: [
        {
          label: '公众号搜索',
          value: 'ADD_SCENE_SEARCH'
        },
        {
          label: '公众号迁移',
          value: 'ADD_SCENE_ACCOUNT_MIGRATION'
        },
        {
          label: '名片分享',
          value: 'ADD_SCENE_PROFILE_CARD'
        },
        {
          label: '扫描二维码',
          value: 'ADD_SCENE_QR_CODE'
        },
        {
          label: '图文页内名称点击',
          value: 'ADD_SCENEPROFILE_LINK'
        },
        {
          label: '图文页右上角菜单',
          value: 'ADD_SCENE_PROFILE_ITEM'
        },
        {
          label: '支付后关注',
          value: 'ADD_SCENE_PAID'
        },
        {
          label: '其他',
          value: 'ADD_SCENE_OTHERS'
        }
      ],
      sexOptions: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        },
        {
          label: '未知',
          value: 0
        }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        nickname: '',
        user_name: '',
        sex: '',
        subscribe: '',
        subscribe_scene: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        user_phone: [
          { required: false, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data.docs
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    clearFilter() {
      this.listQuery = {
        page: 1,
        limit: 20,
        nickname: '',
        user_name: '',
        sex: '',
        subscribe: '',
        subscribe_scene: ''
      }
      this.getList()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteUser(id) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser({ id: id }).then((res) => {
            if (res.data) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        })
        .then(() => {

        })
    },
    // 更新用户
    updateUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then((res) => {
            if (res.data) {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['nickname', 'openid', 'headimgurl', 'sex', 'credits', 'subscribe', 'user_phone', 'user_name', 'read_pages', 'read_time']
          const filterVal = ['nickname', 'openid', 'headimgurl', 'sex', 'credits', 'subscribe', 'user_phone', 'user_name', 'read_pages', 'read_time']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '用户列表'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}

</script>
