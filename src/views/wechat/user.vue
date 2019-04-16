<template>
  <div>
    <el-row class="header navbar bg-white shadow">
      <div class="pull-right offscreen-right mt5">
        <el-button size="medium" @click="openUp">
          <i class="el-icon-download" />
          同步会员资料
        </el-button>
      </div>
    </el-row>
    <el-row class="el-table-container">
      <el-table
        :data="tableData"
        size="small"
        header-align="center"
        style="width: 100%"
        :default-sort="{prop: 'subscribeAt', order: 'descending'}"
        @sort-change="pageOrder"
      >

        <el-table-column label="会员openid" header-align="left" prop="openid" width="222" />

        <el-table-column
          label="昵称"
          header-align="left"
          prop="nickname"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <img v-if="scope.row.headimgurl!=''" :src="scope.row.headimgurl" width="30" height="30">
            <span>{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="性别"
          header-align="left"
          prop="sex"
          :show-overflow-tooltip="true"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.sex==1">男</span>
            <span v-if="scope.row.sex==2">女</span>
            <span v-if="scope.row.sex==0">未知</span>
          </template>
        </el-table-column>

        <el-table-column
          label="区域"
          header-align="left"
          prop="id"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.country }} - {{ scope.row.province }} - {{ scope.row.city }}
          </template>
        </el-table-column>

        <el-table-column
          label="是否关注"
          header-align="left"
          prop="subscribe"
          :show-overflow-tooltip="true"
          width="80"
        >
          <template slot-scope="scope">
            <i v-if="!scope.row.subscribe" class="fa fa-circle text-danger ml5" />
            <i v-if="scope.row.subscribe" class="fa fa-circle text-success ml5" />
          </template>
        </el-table-column>

        <el-table-column sortable label="关注时间" header-align="center" align="center" prop="subscribeAt">
          <template slot-scope="scope">
            {{ formatAt(scope.row.subscribeAt) }}
          </template>
        </el-table-column>

      </el-table>
    </el-row>
    <el-row class="el-pagination-container">
      <el-pagination
        :current-page="pageForm.pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageForm.totalCount"
        @size-change="pageSizeChange"
        @current-change="pageNumberChange"
      />
    </el-row>
    <el-dialog
      title="同步用户资料"
      :visible.sync="upDialogVisible"
      width="40%"
    >
      <el-row>
        <el-alert
          title="微信公众号后台配置好接入地址之后,只需做一次手动同步操作即可"
          type="success"
        />
      </el-row>
      <el-row style="padding-top:5px;text-align: center">
        <el-progress type="circle" :percentage="progressNum" :status="progressStatus" />
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUp">同 步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style scoped>

</style>
